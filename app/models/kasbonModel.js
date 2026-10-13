import { apiRequest, queryString } from './apiClient';
export const kasbonModel = {
  getReport: (filters,token,signal) => apiRequest('/admin/kasbon' + queryString(filters), { token,signal }),
  setPayment: (body,token) => apiRequest('/admin/kasbon/payments', { method:'PUT',token,body })
};
export {buildKasbonMatrix} from './kasbonReportModel';
