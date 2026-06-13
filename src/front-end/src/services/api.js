import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
    baseUrl: API_BASE_URL,
    headers: {
        'Content-type': 'application/json',
    }
});

// add toke to request if available

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('user_token'); // Or use your state manager

        if (token) {
            // Direct assignment handles undefined headers safety checks safely
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const apiService = {

    saveAuthData: (token, roles) => {
        localStorage.setItem('token', token);
        localStorage.setItem('roles', roles);
    },

    logout: () => {
        localStorage.removeItem('token'),
        localStorage.removeItem('roles')
    }, 

    hasRole: (role) => {
        const roles = localStorage.getItem('roles');
        return roles ? JSON.parse(roles).includes(role) : false
    },

    isAuthenticated: () => {
        return localStorage.getItem('token') !== null;
    },

    isAdmin: () => {
        return this.hasRole("ADMIN")
    },

    isCustomer: () => {
        return this.hasRole("CUSTOMER")
    },

    isAuditor: () => {
        return this.hasRole('AUDITOR')
    },

    login: (body) => {
        return api.post("/auth/login", body)
    },

    register: (body) => {
        return api.post("/auth/register", body)
    },

    forgetPassword: (body) => {
        return api.post("/auth/forgot-password", body)
    },

    resetPassword: (body) => {
        return api.post("/auth/reset-password", body)
    },

    getMyProfile: () => {
        return api.get("/users/me")
    },

    updatePassword: (oldPass, newPass) => {
        return api.put("/users/update-password", {oldPass, newPass})
    },

    uploadProfilePicture: (file) => {
        const formData = new FormData();
        formData.append('file', file);

        return api.put('/users/profile-picture', formData, {
            headers: {
                'Content-type': "multipart/form-data"
            }
        });
    },

    // account
    getMyAccounts: () => {
        return api.get("/accounts/me")
    },

    makeTransfer: (transferData) => {
        return api.post("/transactions", transferData)
    },

    makeDeposit: (depositData) => {
        return api.post("/transactions", depositData)
    },

    getTransactions: (accountNumber, page = 0, size = 10) => {
        return api.get(`/transactions/${accountNumber}?page=${page}&size=${size}`)
    },

    // auditor
    getSystemTotal: () => {
        return api.get("/audit/totals");
    },

    findUserByEmail: (email) => {
        return api.get(`/audit/users?email=${email}`);
    },

    findAccountByAccountNumber: (accountNumber) => {
        return api.get(`/audit/accounts?accountNumber=${accountNumber}`)
    },

    getTransactionsByAccountNumber: (accountNumber) => {
        return api.get(`/audit/transactions/by-account?accountNumber=${accountNumber}`);
    },

    getTransactionById: (id) => {
        return api.get(`/audit/transactions/by-id?id=${id}`);
    }

}

export default api;

