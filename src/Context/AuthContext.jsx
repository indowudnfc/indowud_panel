import { createContext, useState, useContext, useEffect, useCallback } from "react";
import {
  loginToAdminPortal,
  getCurrentAdmin,
  logoutFromAdminPortal,
  forgotPassword,
  resetPassword,
} from "../Services/authService";
import { tokenStore, setSessionExpiredHandler } from "../Services/apiClient";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

/** The rest of the panel reads `userData.user` (uid, firstName, lastName, email, role). */
const toUserData = (admin) => ({
  user: {
    uid: admin.id,
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
    phone: admin.phone,
    role: admin.role,
  },
});

export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const applySession = useCallback((admin) => {
    const data = toUserData(admin);
    setUserData(data);
    setToken(tokenStore.access);
    localStorage.setItem("user", JSON.stringify(data));
  }, []);

  const clearSession = useCallback(() => {
    tokenStore.clear();
    setUserData(null);
    setToken(null);
  }, []);

  // A refresh that fails mid-session (expired, revoked, account deactivated) signs the user out.
  useEffect(() => {
    setSessionExpiredHandler(() => {
      clearSession();
      setError("Your session has expired. Please log in again.");
    });
  }, [clearSession]);

  // On load, confirm the stored session with the server rather than trusting localStorage.
  useEffect(() => {
    (async () => {
      if (tokenStore.refresh) {
        try {
          applySession(await getCurrentAdmin());
        } catch {
          clearSession();
        }
      }
      setIsInitialized(true);
    })();
  }, [applySession, clearSession]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const session = await loginToAdminPortal(email, password);
      tokenStore.set(session);
      applySession(session.admin);
      return toUserData(session.admin);
    } catch (e) {
      setError(e.message || "Login failed. Please check your credentials and try again.");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const refreshToken = tokenStore.refresh;
    clearSession();
    setError(null);
    await logoutFromAdminPortal(refreshToken);
  };

  const handleForgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      return await forgotPassword(email);
    } catch (e) {
      setError(e.message || "Failed to send password reset email.");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (resetToken, password) => {
    setLoading(true);
    setError(null);
    try {
      return await resetPassword(resetToken, password);
    } catch (e) {
      setError(e.message || "Failed to reset password.");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        role: userData?.user?.role ?? null,
        isAuthenticated: Boolean(userData),
        token,
        login,
        logout,
        handleForgotPassword,
        handleResetPassword,
        loading,
        error,
        setError,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
