import { apiRequest, queryString, downloadCsv } from './apiClient';
export const orderModel = {
  submitOrder: body => apiRequest('/orders', { method:'POST', body }),
  getOrders: (filters = {},token = '',signal) => apiRequest('/admin/orders' + queryString(filters), { token,signal }),
  exportCsv: (filters,token) => downloadCsv('/admin/orders/export-csv' + queryString(filters),token,'Rekap_Pesanan.csv'),
  exportKasbonCsv: (filters,token) => downloadCsv('/admin/kasbon/export-csv' + queryString(filters),token,'Rekap_Kasbon.csv')
};
