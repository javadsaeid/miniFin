import axios from "axios";
import { getToken } from "@/lib/auth";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Auth
  login: (body: { email: string; password: string }) =>
    api.post("/auth/login", body),

  register: (body: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) => api.post("/auth/register", body),

  forgotPassword: (body: { email: string }) =>
    api.post("/auth/forgot-password", body),

  resetPassword: (body: { email: string; code: string; newPassword: string }) =>
    api.post("/auth/reset-password", body),

  // Users
  getMyProfile: () => api.get("/users/me"),

  updatePassword: (body: { oldPass: string; newPass: string }) =>
    api.put("/users/update-password", body),

  uploadProfilePicture: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.put("/users/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Accounts
  getMyAccounts: () => api.get("/accounts/me"),

  closeAccount: (accountNumber: string) =>
    api.delete(`/accounts/close/${accountNumber}`),

  // Transactions
  getTransactions: (accountNumber: string, page = 0, size = 10) =>
    api.get(`/transactions/${accountNumber}?page=${page}&size=${size}`),

  createTransaction: (body: {
    transactionType: string;
    amount: number;
    accountNumber: string;
    destinationAccountNumber?: string;
    description?: string;
  }) => api.post("/transactions", body),

  // Audit
  getSystemTotals: () => api.get("/audit/totals"),

  findUserByEmail: (email: string) =>
    api.get(`/audit/users?email=${email}`),

  findAccountByNumber: (accountNumber: string) =>
    api.get(`/audit/accounts?accountNumber=${accountNumber}`),

  getTransactionsByAccountNumber: (accountNumber: string) =>
    api.get(`/audit/transactions/by-accountNumber?accountNumber=${accountNumber}`),

  getTransactionById: (id: number) =>
    api.get(`/audit/transactions/by-id?id=${id}`),

  // Admin - list all
  getAllUsers: (page = 0, size = 50) =>
    api.get(`/audit/all-users?page=${page}&size=${size}`),

  getAllAccounts: (page = 0, size = 50) =>
    api.get(`/audit/all-accounts?page=${page}&size=${size}`),

  getAllTransactions: (page = 0, size = 50) =>
    api.get(`/audit/all-transactions?page=${page}&size=${size}`),

  getAllRoles: () => api.get("/roles"),
};

export default api;
