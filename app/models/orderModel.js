import { apiRequest, queryString, downloadCsv } from './apiClient';
export const orderModel = {
  getOrderForEditing: (number,token,signal) => apiRequest('/admin/orders/' + encodeURIComponent(number) + '/edit',{token,signal,cache:'no-store'}),
  editOrderItems: (number,body,token) => apiRequest('/admin/orders/' + encodeURIComponent(number) + '/items',{method:'PUT',token,body}),
  paymentStatus: (orderNumber, token, signal) => apiRequest('/orders/payment-status', {
    method: 'POST', body: { orderNumber, token }, signal, cache: 'no-store'
  }),
  submitOrder: body => apiRequest('/orders', { method:'POST', body }),
  getOrders: (filters = {},token = '',signal) => apiRequest('/admin/orders' + queryString(filters), { token,signal }),
  exportCsv: (filters,token) => downloadCsv('/admin/orders/export-csv' + queryString(filters),token,'Rekap_Pesanan.csv'),
  exportKasbonCsv: (filters,token) => downloadCsv('/admin/kasbon/export-csv' + queryString(filters),token,'Rekap_Kasbon.csv')
};
