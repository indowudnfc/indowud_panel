import { BASE_URL, ENDPOINTS } from "../Config/apiConfig.js";

/**
 * One place for talking to the backend:
 *  - prefixes BASE_URL and attaches the admin's access token,
 *  - on a 401, refreshes the session once (shared by concurrent requests) and retries,
 *  - signs the user out when the session can't be refreshed.
 *
 * `apiFetch` returns a normal fetch Response, so existing service functions keep their behaviour.
 */

const KEYS = { access: "authToken", refresh: "refreshToken", user: "user" };

export const tokenStore = {
  get access() {
    return localStorage.getItem(KEYS.access);
  },
  get refresh() {
    return localStorage.getItem(KEYS.refresh);
  },
  set({ accessToken, refreshToken }) {
    if (accessToken) localStorage.setItem(KEYS.access, accessToken);
    if (refreshToken) localStorage.setItem(KEYS.refresh, refreshToken);
  },
  clear() {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};

// AuthContext registers this so a failed refresh can reset the UI and go to /login.
let onSessionExpired = () => {};
export function setSessionExpiredHandler(handler) {
  onSessionExpired = handler;
}

let refreshInFlight = null;

/** Exchanges the refresh token for a new pair. Concurrent callers share one request (tokens are single-use). */
export function refreshSession() {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshToken = tokenStore.refresh;
      if (!refreshToken) return false;
      try {
        const res = await fetch(`${BASE_URL}${ENDPOINTS.REFRESH}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok) return false;
        const data = await res.json();
        tokenStore.set(data);
        return data;
      } catch {
        return false;
      }
    })().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

function withAuth(options = {}) {
  const headers = new Headers(options.headers || {});
  const token = tokenStore.access;
  if (token) headers.set("Authorization", `Bearer ${token}`);
  else headers.delete("Authorization");
  // The browser must set multipart boundaries itself; a hand-written Content-Type breaks uploads.
  if (options.body instanceof FormData) headers.delete("Content-Type");
  return { ...options, headers };
}

export async function apiFetch(url, options = {}) {
  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
  let res = await fetch(fullUrl, withAuth(options));
  if (res.status !== 401 || !tokenStore.refresh) return res;

  const refreshed = await refreshSession();
  if (!refreshed) {
    tokenStore.clear();
    onSessionExpired();
    return res;
  }
  res = await fetch(fullUrl, withAuth(options));
  return res;
}

/** Reads the backend's error message from a failed response, for toasts. */
export async function errorMessage(res, fallback = "Something went wrong") {
  try {
    const body = await res.clone().json();
    return body?.error?.message || body?.message || fallback;
  } catch {
    return fallback;
  }
}
