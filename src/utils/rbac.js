// Role values as the backend sends them. The backend enforces every permission;
// these are only used to decide what to show.
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  QR_GENERATE: "QR_GENERATE",
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.ADMIN]: "Admin",
  [ROLES.QR_GENERATE]: "QR Generate",
};

export const FULL_ACCESS = [ROLES.SUPER_ADMIN, ROLES.ADMIN];
export const ALL_ROLES = Object.values(ROLES);

export const roleLabel = (role) => ROLE_LABELS[role] || role || "Unknown";

/** Where each role lands after login. */
export const homePathFor = (role) => (role === ROLES.QR_GENERATE ? "/qr" : "/dashboard");

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export const getCurrentUserRole = () => readStoredUser()?.user?.role || "Guest";

export const getCurrentUser = () => readStoredUser()?.user ?? null;
