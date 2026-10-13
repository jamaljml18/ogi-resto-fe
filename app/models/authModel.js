import { apiRequest } from './apiClient';
export const authModel = {
  login: (username,password) => apiRequest('/auth/login', { method:'POST', body:{ username,password } }),
  validateSession: (token,signal) => apiRequest('/admin/session', { token,signal }),
  // Token management
  getToken() {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('ogi_admin_token') || '';
  },

  setToken(token) {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem('ogi_admin_token', token);
    } else {
      localStorage.removeItem('ogi_admin_token');
    }
  },

  clearToken() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('ogi_admin_token');
  }
};
