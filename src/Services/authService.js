import { BASE_URL, ENDPOINTS } from "../Config/apiConfig.js";
import { apiFetch, errorMessage } from "./apiClient.js";

async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await errorMessage(res, "Request failed"));
  return res.status === 204 ? null : res.json();
}

/** → { accessToken, refreshToken, admin } */
export const loginToAdminPortal = (email, password) => post(ENDPOINTS.LOGIN, { email, password });

/** Current admin, re-read from the server (role or status may have changed). */
export async function getCurrentAdmin() {
  const res = await apiFetch(ENDPOINTS.ME);
  if (!res.ok) throw new Error(await errorMessage(res, "Session expired"));
  return (await res.json()).admin;
}

export async function logoutFromAdminPortal(refreshToken) {
  if (!refreshToken) return;
  try {
    await post(ENDPOINTS.LOGOUT, { refreshToken });
  } catch {
    // Signing out locally is what matters; the server session expires on its own.
  }
}

export const forgotPassword = (email) => post(ENDPOINTS.FORGETPASSWORD, { email });

export const resetPassword = (token, password) => post(ENDPOINTS.RESETPASSWORD, { token, password });
