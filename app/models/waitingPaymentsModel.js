import { apiRequest, queryString } from './apiClient';
export const waitingPaymentsModel = {
  list: (page, token, signal) => apiRequest('/admin/waiting-payments' + queryString({ page }), { token, signal }),
  pay: (number, token) => apiRequest('/admin/waiting-payments/' + encodeURIComponent(number) + '/pay', { method: 'POST', token }),
  remove: (number, token) => apiRequest('/admin/waiting-payments/' + encodeURIComponent(number), { method: 'DELETE', token })
};
