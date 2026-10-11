// -------------------------------------------------------------
// Ogi Resto - Menu Model (API & Data Operations)
// -------------------------------------------------------------

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const menuModel = {
  // Ambil menu untuk hari tertentu (Customer View)
  async getMenuForDay(day) {
    const url = day ? `${API_URL}/menu?day=${day}` : `${API_URL}/menu`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  },

  // Ambil seluruh master menu (Admin View)
  async getAllMenus(token) {
    const res = await fetch(`${API_URL}/admin/menus`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  },

  // Ambil data jadwal ketersediaan menu per hari (Admin View)
  async getSchedules() {
    const res = await fetch(`${API_URL}/admin/schedules`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  },

  // Simpan perubahan jadwal mingguan (Admin View)
  async saveSchedules(schedules, token) {
    const res = await fetch(`${API_URL}/admin/schedules`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ schedules })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  },

  // Tambah menu baru
  async createMenu(menuPayload, token) {
    const res = await fetch(`${API_URL}/admin/menus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(menuPayload)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  },

  // Update data menu yang sudah ada
  async updateMenu(id, menuPayload, token) {
    const res = await fetch(`${API_URL}/admin/menus/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(menuPayload)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  },

  // Hapus menu dari database
  async deleteMenu(id, token) {
    const res = await fetch(`${API_URL}/admin/menus/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  }
};
