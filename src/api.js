import axios from 'axios';

// const API = axios.create({ baseURL: '/api' });

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const mangoAPI = {
  getAll: (params) => API.get('/mangoes', { params }),
  getOne: (id) => API.get(`/mangoes/${id}`),
  getCategories: () => API.get('/mangoes/categories'),
  create: (data) => API.post('/mangoes', data),
  update: (id, data) => API.put(`/mangoes/${id}`, data),
  delete: (id) => API.delete(`/mangoes/${id}`),
  toggle: (id) => API.patch(`/mangoes/${id}/toggle`),
};

export const orderAPI = {
  place: (data) => API.post('/orders', data),
  track: (orderNumber) => API.get(`/orders/track/${orderNumber}`),
  updatePayment: (orderNumber, data) => API.patch(`/orders/${orderNumber}/payment`, data),
  getAll: (params) => API.get('/orders', { params }),
  getOne: (id) => API.get(`/orders/${id}`),
  updateStatus: (id, data) => API.patch(`/orders/${id}/status`, data),
  markDelivered: (id) => API.patch(`/orders/${id}/deliver`),
  getStats: () => API.get('/orders/stats/summary'),
};

export const notificationAPI = {
  getUnreadCount: () => API.get('/notifications/unread-count'),
  markRead: () => API.post('/notifications/mark-read'),
};

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  verify: () => API.get('/auth/verify'),
};

export default API;