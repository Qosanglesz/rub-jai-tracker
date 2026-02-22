import { defineStore } from 'pinia';
import apiClient from '../api/client';
import { toast } from 'vue-sonner';

interface User {
  id: string;
  email: string;
  name: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    loading: false,
  }),
  actions: {
    async checkAuth() {
      this.loading = true;
      try {
        const response = await apiClient.get('/users/profile');
        this.user = response.data;
        this.isAuthenticated = true;
      } catch (error) {
        this.user = null;
        this.isAuthenticated = false;
      } finally {
        this.loading = false;
      }
    },
    async login(credentials: any) {
      try {
        const response = await apiClient.post('/auth/login', credentials);
        this.user = response.data.user;
        this.isAuthenticated = true;
        toast.success(response.data.message || 'Login successful');
        return true;
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Login failed');
        return false;
      }
    },
    async register(data: any) {
      try {
        const response = await apiClient.post('/auth/register', data);
        this.user = response.data.user;
        this.isAuthenticated = true;
        toast.success(response.data.message || 'Registration successful');
        return true;
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Registration failed');
        return false;
      }
    },
    async logout() {
      try {
        await apiClient.post('/auth/logout');
      } catch (error) {
        console.error('Logout error', error);
      } finally {
        // Clear state regardless to ensure frontend is logged out
        this.user = null;
        this.isAuthenticated = false;
        toast.info('Logged out');
      }
    }
  }
});
