jest.mock("axios", () => {
  const mockInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  };
  return {
    __esModule: true,
    default: { create: () => mockInstance },
    create: () => mockInstance,
  };
});

import { apiService } from "@/services/api";
import api from "@/services/api";

const mockInstance = (api as unknown) as {
  get: jest.Mock;
  post: jest.Mock;
  put: jest.Mock;
  delete: jest.Mock;
};

describe("apiService", () => {
  beforeEach(() => {
    mockInstance.get.mockReset();
    mockInstance.post.mockReset();
    mockInstance.put.mockReset();
    mockInstance.delete.mockReset();
  });

  it("login posts to /auth/login", async () => {
    mockInstance.post.mockResolvedValue({ data: { token: "abc" } });
    const res = await apiService.login({ email: "a@b.com", password: "p" });
    expect(mockInstance.post).toHaveBeenCalledWith("/auth/login", { email: "a@b.com", password: "p" });
    expect(res.data.token).toBe("abc");
  });

  it("register posts to /auth/register", async () => {
    mockInstance.post.mockResolvedValue({ data: {} });
    const body = { firstName: "F", lastName: "L", email: "a@b.com", phoneNumber: "1", password: "p" };
    await apiService.register(body);
    expect(mockInstance.post).toHaveBeenCalledWith("/auth/register", body);
  });

  it("forgotPassword posts to /auth/forgot-password", async () => {
    mockInstance.post.mockResolvedValue({ data: {} });
    await apiService.forgotPassword({ email: "a@b.com" });
    expect(mockInstance.post).toHaveBeenCalledWith("/auth/forgot-password", { email: "a@b.com" });
  });

  it("resetPassword posts to /auth/reset-password", async () => {
    mockInstance.post.mockResolvedValue({ data: {} });
    await apiService.resetPassword({ email: "a@b.com", code: "x", newPassword: "p" });
    expect(mockInstance.post).toHaveBeenCalledWith("/auth/reset-password", { email: "a@b.com", code: "x", newPassword: "p" });
  });

  it("getMyAccounts gets /accounts/me", async () => {
    mockInstance.get.mockResolvedValue({ data: [] });
    await apiService.getMyAccounts();
    expect(mockInstance.get).toHaveBeenCalledWith("/accounts/me");
  });

  it("closeAccount deletes /accounts/close/:number", async () => {
    mockInstance.delete.mockResolvedValue({ data: {} });
    await apiService.closeAccount("123");
    expect(mockInstance.delete).toHaveBeenCalledWith("/accounts/close/123");
  });

  it("getTransactions uses default page and size", async () => {
    mockInstance.get.mockResolvedValue({ data: [] });
    await apiService.getTransactions("abc");
    expect(mockInstance.get).toHaveBeenCalledWith("/transactions/abc?page=0&size=10");
  });

  it("getTransactions accepts custom page and size", async () => {
    mockInstance.get.mockResolvedValue({ data: [] });
    await apiService.getTransactions("abc", 2, 20);
    expect(mockInstance.get).toHaveBeenCalledWith("/transactions/abc?page=2&size=20");
  });

  it("createTransaction posts to /transactions", async () => {
    mockInstance.post.mockResolvedValue({ data: {} });
    const body = { transactionType: "DEPOSIT", amount: 100, accountNumber: "123" };
    await apiService.createTransaction(body);
    expect(mockInstance.post).toHaveBeenCalledWith("/transactions", body);
  });

  it("getAllRoles gets /roles", async () => {
    mockInstance.get.mockResolvedValue({ data: [] });
    await apiService.getAllRoles();
    expect(mockInstance.get).toHaveBeenCalledWith("/roles");
  });

  it("createRole posts to /roles", async () => {
    mockInstance.post.mockResolvedValue({ data: {} });
    await apiService.createRole({ name: "TEST" });
    expect(mockInstance.post).toHaveBeenCalledWith("/roles", { name: "TEST" });
  });

  it("updateRole puts to /roles", async () => {
    mockInstance.put.mockResolvedValue({ data: {} });
    await apiService.updateRole({ id: 5, name: "X" });
    expect(mockInstance.put).toHaveBeenCalledWith("/roles", { id: 5, name: "X" });
  });

  it("deleteRole deletes /roles/:id", async () => {
    mockInstance.delete.mockResolvedValue({ data: {} });
    await apiService.deleteRole(5);
    expect(mockInstance.delete).toHaveBeenCalledWith("/roles/5");
  });
});
