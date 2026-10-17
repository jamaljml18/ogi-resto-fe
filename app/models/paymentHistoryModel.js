import { apiRequest, queryString } from './apiClient';

export const paymentHistoryModel = {
  list: (page, token, signal) => apiRequest('/admin/history-payments' + queryString({ page }), { token, signal }),
  create: (body, token) => apiRequest('/admin/history-payments', { method: 'POST', token, body }),
  update: (id, body, token) => apiRequest('/admin/history-payments/' + encodeURIComponent(id), { method: 'PUT', token, body }),
  remove: (id, token) => apiRequest('/admin/history-payments/' + encodeURIComponent(id), { method: 'DELETE', token })
};
