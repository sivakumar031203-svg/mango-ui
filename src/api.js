import axios from 'axios';

// ── Authenticated client (admin only) ────────────────────────────────────────
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('adminToken');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

API.interceptors.response.use(r => r, err => {
  if (
    err.response?.status === 401 &&
    window.location.pathname.startsWith('/admin') &&
    window.location.pathname !== '/admin/login'
  ) {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  }
  return Promise.reject(err);
});

// ── Public client (NO auth token — for customer-facing endpoints) ─────────────
// This prevents an expired/invalid admin token from causing 403s on public routes.
const PUBLIC = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// ── Mangoes ───────────────────────────────────────────────────────────────────
export const mangoAPI = {
  getAll: (p) => PUBLIC.get('/mangoes', { params: p }),
  getOne: (id) => PUBLIC.get(`/mangoes/${id}`),
  getCategories: () => PUBLIC.get('/mangoes/categories'),
  // Admin mutations — need auth
  create: (d) => API.post('/mangoes', d),
  update: (id, d) => API.put(`/mangoes/${id}`, d),
  delete: (id) => API.delete(`/mangoes/${id}`),
  toggle: (id) => API.patch(`/mangoes/${id}/toggle`),
};

// ── Orders ────────────────────────────────────────────────────────────────────
export const orderAPI = {
  place: (d) => PUBLIC.post('/orders', d),          // customer
  track: (n) => PUBLIC.get(`/orders/track/${n}`),   // customer
  updatePayment: (n, d) => PUBLIC.patch(`/orders/${n}/payment`, d), // customer
  // Admin
  getAll: (p) => API.get('/orders', { params: p }),
  getOne: (id) => API.get(`/orders/${id}`),
  updateStatus: (id, d) => API.patch(`/orders/${id}/status`, d),
  markDelivered: (id) => API.patch(`/orders/${id}/deliver`),
  getStats: () => API.get('/orders/stats/summary'),
};

// ── Payments (always public — Razorpay flow) ──────────────────────────────────
export const paymentAPI = {
  createOrder: (orderNumber) => PUBLIC.post('/payments/create-order', { orderNumber }),
  verify: (d) => PUBLIC.post('/payments/verify', d),
};

// ── Reviews ───────────────────────────────────────────────────────────────────
export const reviewAPI = {
  getForMango: (id) => PUBLIC.get(`/reviews/mango/${id}`),
  submit: (d) => PUBLIC.post('/reviews', d),
  // Admin
  getPending: () => API.get('/reviews/pending'),
  getAll: () => API.get('/reviews'),
  approve: (id) => API.patch(`/reviews/${id}/approve`),
  delete: (id) => API.delete(`/reviews/${id}`),
};

// ── Coupons ───────────────────────────────────────────────────────────────────
export const couponAPI = {
  validate: (d) => PUBLIC.post('/coupons/validate', d),
  // Admin
  getAll: () => API.get('/coupons'),
  create: (d) => API.post('/coupons', d),
  toggle: (id) => API.patch(`/coupons/${id}/toggle`),
  delete: (id) => API.delete(`/coupons/${id}`),
};

// ── Settings ──────────────────────────────────────────────────────────────────
export const settingsAPI = {
  getPublic: () => PUBLIC.get('/settings/public'),
  // Admin
  getAll: () => API.get('/settings'),
  save: (d) => API.post('/settings', d),
};

// ── Notifications (admin only) ────────────────────────────────────────────────
export const notificationAPI = {
  getUnreadCount: () => API.get('/notifications/unread-count'),
  markRead: () => API.post('/notifications/mark-read'),
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (d) => PUBLIC.post('/auth/login', d),
  verify: () => API.get('/auth/verify'),
};

export default API;