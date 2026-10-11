// -------------------------------------------------------------
// Ogi Resto - Order Model (Transactions & Reporting)
// -------------------------------------------------------------

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const orderModel = {
  // Kirim pesanan pelanggan baru
  async submitOrder(orderPayload) {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP error ${res.status}`);
    }
    return await res.json();
  },

  // Ambil daftar riwayat pesanan (Admin View)
  async getOrders(filters = {}, token = '') {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.company && filters.company !== 'Semua') params.append('company', filters.company);
    if (filters.division && filters.division !== 'Semua') params.append('division', filters.division);
    if (filters.location && filters.location !== 'Semua') params.append('location', filters.location);
    if (filters.date) params.append('date', filters.date);
    if (filters.day && filters.day !== 'Semua') params.append('day', filters.day);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.month && filters.month !== 'Semua') params.append('month', filters.month);
    if (filters.year && filters.year !== 'Semua') params.append('year', filters.year);

    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_URL}/admin/orders${qs}`, { headers });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  },

  // Unduh CSV dari server
  getExportCsvUrl(filters = {}, token = '') {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.company && filters.company !== 'Semua') params.append('company', filters.company);
    if (filters.division && filters.division !== 'Semua') params.append('division', filters.division);
    if (filters.location && filters.location !== 'Semua') params.append('location', filters.location);
    if (filters.date) params.append('date', filters.date);
    if (filters.day && filters.day !== 'Semua') params.append('day', filters.day);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.month && filters.month !== 'Semua') params.append('month', filters.month);
    if (filters.year && filters.year !== 'Semua') params.append('year', filters.year);
    if (token) params.append('token', token);

    const qs = params.toString() ? `?${params.toString()}` : '';
    return `${API_URL}/admin/orders/export-csv${qs}`;
  },

  // Unduh CSV Rekap Kasbon Bulanan
  getExportKasbonCsvUrl(filters = {}, token = '') {
    const params = new URLSearchParams();
    if (filters.month) params.append('month', filters.month);
    if (filters.year) params.append('year', filters.year);
    if (filters.company && filters.company !== 'Semua') params.append('company', filters.company);
    if (filters.division && filters.division !== 'Semua') params.append('division', filters.division);
    if (token) params.append('token', token);

    const qs = params.toString() ? `?${params.toString()}` : '';
    return `${API_URL}/admin/kasbon/export-csv${qs}`;
  }
};
