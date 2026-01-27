import { reactive } from 'vue';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add interceptor to attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const store = reactive({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  transactions: [],
  dashboardData: {
    overall: { income: 0, expenses: 0, profit: 0 },
    monthly: { income: 0, expenses: 0, profit: 0 },
  },
  authLoading: false,
  authErrors: {},

  async fetchUser() {
      if (!this.token) return;
      try {
          const response = await api.get('/auth/user');
          this.user = response.data;
          localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
          console.error('Failed to fetch user:', error);
          if (error.response && error.response.status === 401) {
              this.logout();
          }
      }
  },

  async login(email, password) {
    this.authLoading = true;
    this.authErrors = {};
    try {
      const response = await api.post('/auth/login', { email, password });
      this.token = response.data.access_token;
      this.user = response.data.user;
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        this.authErrors = error.response.data.errors;
      } else if (error.response && error.response.data && error.response.data.message) {
         // Fallback for general message not attached to a field, maybe attach to 'email' or general
         this.authErrors = { general: [error.response.data.message] };
      }
      throw error;
    } finally {
      this.authLoading = false;
    }
  },

  async register(data) {
    this.authLoading = true;
    this.authErrors = {};
    try {
      const response = await api.post('/auth/register', data);
      this.token = response.data.access_token;
      this.user = response.data.user;
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        this.authErrors = error.response.data.errors;
      }
      throw error;
    } finally {
      this.authLoading = false;
    }
  },

  async logout() {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        console.error('Logout error', error);
    } finally {
        this.token = null;
        this.user = null;
        this.transactions = [];
        this.dashboardData = { overall: {}, monthly: {} };
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
  },

  async updateProfile(data) {
      this.authLoading = true;
      this.authErrors = {};
      try {
          const response = await api.put('/auth/user', data);
          this.user = response.data;
          localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
          if (error.response && error.response.data && error.response.data.errors) {
              this.authErrors = error.response.data.errors;
          }
           throw error;
      } finally {
          this.authLoading = false;
      }
  },

  async deleteAccount() {
      try {
          await api.delete('/auth/user');
          this.logout();
      } catch (error) {
           console.error('Delete account error', error);
           throw error;
      }
  },

  async fetchTransactions() {
    try {
      const response = await api.get('/transactions');
      this.transactions = response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  },

  async addTransaction(transaction) {
    try {
      const response = await api.post('/transactions', transaction);
      this.transactions.unshift(response.data);
    } catch (error) {
       throw error.response?.data?.error ? new Error(error.response.data.error) : error;
    }
  },

  async fetchDashboardData() {
    try {
      const response = await api.get('/reports/dashboard');
      this.dashboardData = response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  },
});
