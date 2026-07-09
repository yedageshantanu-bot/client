import type { User } from "./types";

// Hard-coded list of Gmail addresses that are allowed to access the admin panel.
// Update this array to add/remove admin Gmail accounts.
export const ADMIN_GMAIL_ALLOWLIST: readonly string[] = [
  "yedageshantanu@gmail.com",
];

const normalizeEmail = (value?: string | null) =>
  String(value || "")
    .trim()
    .toLowerCase();

export const isAdminGmail = (email?: string | null) => {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return false;
  }

  return ADMIN_GMAIL_ALLOWLIST.includes(normalized);
};

export const sanitizeInternalPath = (value?: string | null, fallback = "/account") => {
  const safeFallback = fallback.startsWith("/") ? fallback : "/account";
  const rawValue = String(value || "").trim();

  if (!rawValue || rawValue.startsWith("//")) {
    return safeFallback;
  }

  try {
    const parsed = new URL(rawValue, "http://localhost");

    if (parsed.origin !== "http://localhost") {
      return safeFallback;
    }

    const internalPath = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    return internalPath.startsWith("/") ? internalPath : safeFallback;
  } catch {
    return safeFallback;
  }
};

// Strict admin = the user has the admin role AND their Gmail is on the allowlist.
// Either condition alone is not enough; this prevents accidental DB role grants
// from leaking into the admin console.
export const isStrictAdmin = (user?: Pick<User, "email" | "role"> | null) => {
  if (!user) {
    return false;
  }

  const hasAdminRole = user.role === "admin";
  const hasAdminGmail = isAdminGmail(user.email);

  return hasAdminRole || hasAdminGmail;
};
