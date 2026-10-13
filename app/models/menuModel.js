import { apiRequest, queryString } from './apiClient';
export const menuModel = {
  getMenuForDay: (day, signal) => apiRequest('/menu' + queryString({ day }), { signal }),
  getAllMenus: (token, signal) => apiRequest('/admin/menus', { token, signal }),
  saveSchedules: (schedules, token) => apiRequest('/admin/schedules', { method:'PUT', token, body:{ schedules } }),
  createMenu: (body, token) => apiRequest('/admin/menus', { method:'POST', token, body }),
  updateMenu: (id, body, token) => apiRequest('/admin/menus/' + encodeURIComponent(id), { method:'PUT', token, body }),
  deleteMenu: (id, token) => apiRequest('/admin/menus/' + encodeURIComponent(id), { method:'DELETE', token })
};
