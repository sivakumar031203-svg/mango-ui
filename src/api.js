import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('adminToken');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});


API.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401 && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  }
  return Promise.reject(err);
});

export const mangoAPI = {
  getAll: (p) => API.get('/mangoes', { params: p }),
  getOne: (id) => API.get(`/mangoes/${id}`),
  getCategories: () => API.get('/mangoes/categories'),
  create: (d) => API.post('/mangoes', d),
  update: (id, d) => API.put(`/mangoes/${id}`, d),
  delete: (id) => API.delete(`/mangoes/${id}`),
  toggle: (id) => API.patch(`/mangoes/${id}/toggle`),
};


export const orderAPI = {
  place: (d) => API.post('/orders', d),
  track: (n) => API.get(`/orders/track/${n}`),
  updatePayment: (n, d) => API.patch(`/orders/${n}/payment`, d),
  getAll: (p) => API.get('/orders', { params: p }),
  getOne: (id) => API.get(`/orders/${id}`),
  updateStatus: (id, d) => API.patch(`/orders/${id}/status`, d),
  markDelivered: (id) => API.patch(`/orders/${id}/deliver`),
  getStats: () => API.get('/orders/stats/summary'),
};


export const paymentAPI = {
  createOrder: (orderNumber) => API.post('/payments/create-order', { orderNumber }),
  verify: (d) => API.post('/payments/verify', d),
};


export const reviewAPI = {
  getForMango: (id) => API.get(`/reviews/mango/${id}`),
  submit: (d) => API.post('/reviews', d),
  getPending: () => API.get('/reviews/pending'),
  getAll: () => API.get('/reviews'),
  approve: (id) => API.patch(`/reviews/${id}/approve`),
  delete: (id) => API.delete(`/reviews/${id}`),
};


export const couponAPI = {
  validate: (d) => API.post('/coupons/validate', d),
  getAll: () => API.get('/coupons'),
  create: (d) => API.post('/coupons', d),
  toggle: (id) => API.patch(`/coupons/${id}/toggle`),
  delete: (id) => API.delete(`/coupons/${id}`),
};


export const settingsAPI = {
  getPublic: () => API.get('/settings/public'),
  getAll: () => API.get('/settings'),
  save: (d) => API.post('/settings', d),
};


export const notificationAPI = {
  getUnreadCount: () => API.get('/notifications/unread-count'),
  markRead: () => API.post('/notifications/mark-read'),
};


export const authAPI = {
  login: (d) => API.post('/auth/login', d),
  verify: () => API.get('/auth/verify'),
};


export default API;