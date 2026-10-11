// -------------------------------------------------------------
// Ogi Resto - Auth Model (Admin Authentication & Session)
// -------------------------------------------------------------

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const authModel = {
  // Login admin ke backend
  async login(username, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Login gagal, periksa kredensial Anda');
    }
    return await res.json();
  },

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
