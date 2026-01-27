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
    try {
      const response = await api.post('/auth/login', { email, password });
      // Laravel style: access_token, user
      this.token = response.data.access_token;
      this.user = response.data.user;
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
    } catch (error) {
      // Handle Laravel validation errors (422) or Auth errors (401)
      if (error.response && error.response.data) {
          const data = error.response.data;
          if (data.message) {
             // If there are field-specific errors, maybe join them or just show the main message
             if (data.errors) {
                 // For simplicity, returning the main message, or the first error of the first field
                 const firstField = Object.keys(data.errors)[0];
                 throw new Error(data.errors[firstField][0]);
             }
             throw new Error(data.message);
          }
      }
      throw error;
    }
  },

  async register(email, password) {
    try {
      const response = await api.post('/auth/register', { email, password });
      this.token = response.data.access_token;
      this.user = response.data.user;
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
    } catch (error) {
      if (error.response && error.response.data) {
          const data = error.response.data;
          if (data.message) {
             if (data.errors) {
                 const firstField = Object.keys(data.errors)[0];
                 throw new Error(data.errors[firstField][0]);
             }
             throw new Error(data.message);
          }
      }
      throw error;
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
