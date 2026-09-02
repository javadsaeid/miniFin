const TOKEN_KEY = "minifin_token";
const ROLES_KEY = "minifin_roles";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRoles(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ROLES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAuthData(token: string, roles: string[]): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export function hasRole(role: string): boolean {
  return getRoles().includes(role);
}

export function isAdmin(): boolean {
  return hasRole("ADMIN");
}

export function isAuditor(): boolean {
  return hasRole("AUDITOR");
}

export function isCustomer(): boolean {
  return hasRole("CUSTOMER");
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLES_KEY);
}
