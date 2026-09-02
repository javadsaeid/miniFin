import {
  getToken,
  getRoles,
  saveAuthData,
  isAuthenticated,
  hasRole,
  isAdmin,
  isAuditor,
  isCustomer,
  logout,
} from "@/lib/auth";

describe("auth lib", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("getToken returns null when no token stored", () => {
    expect(getToken()).toBeNull();
  });

  it("getRoles returns empty array when no roles stored", () => {
    expect(getRoles()).toEqual([]);
  });

  it("saveAuthData stores token and roles", () => {
    saveAuthData("abc123", ["ADMIN"]);
    expect(getToken()).toBe("abc123");
    expect(getRoles()).toEqual(["ADMIN"]);
  });

  it("isAuthenticated returns true when token exists", () => {
    saveAuthData("abc123", ["CUSTOMER"]);
    expect(isAuthenticated()).toBe(true);
  });

  it("isAuthenticated returns false when no token", () => {
    expect(isAuthenticated()).toBe(false);
  });

  it("hasRole returns true for assigned role", () => {
    saveAuthData("t", ["ADMIN", "AUDITOR"]);
    expect(hasRole("ADMIN")).toBe(true);
    expect(hasRole("CUSTOMER")).toBe(false);
  });

  it("isAdmin / isAuditor / isCustomer check correctly", () => {
    saveAuthData("t", ["CUSTOMER"]);
    expect(isCustomer()).toBe(true);
    expect(isAdmin()).toBe(false);
    expect(isAuditor()).toBe(false);
  });

  it("getRoles returns empty array for invalid JSON", () => {
    localStorage.setItem("minifin_roles", "not-json");
    expect(getRoles()).toEqual([]);
  });

  it("logout clears all stored data", () => {
    saveAuthData("t", ["ADMIN"]);
    logout();
    expect(getToken()).toBeNull();
    expect(getRoles()).toEqual([]);
    expect(isAuthenticated()).toBe(false);
  });
});
