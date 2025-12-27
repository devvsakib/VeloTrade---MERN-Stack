import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (data) => api.post('/auth/register', data),
};

// Products API
export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
};

// Categories API
export const categoriesAPI = {
    getAll: () => api.get('/categories'),
    getTree: () => api.get('/categories/tree'),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.patch(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

// Orders API
export const ordersAPI = {
    preview: (data) => api.post('/orders/preview', data),
    create: (data) => api.post('/orders', data),
    getMy: () => api.get('/orders/my'),
    getById: (id) => api.get(`/orders/${id}`),
    requestRefund: (data) => api.post('/orders/refund', data),
    getMyRefunds: () => api.get('/orders/my/refunds'),
    downloadInvoice: (id) => api.get(`/orders/invoice/${id}`, { responseType: 'blob' }),
};

// Wishlist API
export const wishlistAPI = {
    get: () => api.get('/wishlist'),
    add: (productId) => api.post('/wishlist/add', { productId }),
    remove: (productId) => api.post('/wishlist/remove', { productId }),
};

// Reviews API
export const reviewsAPI = {
    getByProduct: (productId) => api.get(`/reviews/${productId}`),
    add: (productId, data) => api.post(`/reviews/${productId}`, data),
};

// Coupons API
export const couponsAPI = {
    getAll: () => api.get('/coupons'),
    apply: (code) => api.post(`/coupons/apply/${code}`),
    create: (data) => api.post('/coupons', data),
    createVendor: (data) => api.post('/coupons/vendor', data),
};

// Vendor API
export const vendorAPI = {
    apply: (data) => api.post('/vendor/apply', data),
    getProfile: () => api.get('/vendor/me'),
    getDashboard: () => api.get('/vendor/dashboard'),
};

// Admin API
export const adminAPI = {
    // User Management
    getUsers: () => api.get('/admin/users'),
    getUserById: (id) => api.get(`/admin/user/${id}`),
    updateUserRole: (id, role) => api.patch(`/admin/user/role/${id}`, { role }),
    toggleUserActive: (id) => api.patch(`/admin/user/toggle/${id}`),
    deleteUser: (id) => api.delete(`/admin/user/${id}`),

    // Vendor Management
    getVendors: () => api.get('/admin/vendors'),
    getVendorById: (id) => api.get(`/admin/vendor/${id}`),
    updateVendorStatus: (id, status) => api.patch(`/admin/vendor/status/${id}`, { status }),
    updateVendorCommission: (id, rate) => api.patch(`/admin/vendor/commission/${id}`, { commissionRate: rate }),
    approvePayout: (id, amount) => api.post(`/admin/vendor/payout/${id}`, { amount }),

    // Order & Dispute
    getOrders: () => api.get('/admin/orders'),
    getOrderById: (id) => api.get(`/admin/order/${id}`),
    updateOrderStatus: (id, data) => api.patch(`/admin/order/${id}`, data),
    getDisputes: (params) => api.get('/admin/disputes', { params }),
    getDisputeById: (id) => api.get(`/admin/dispute/${id}`),
    resolveDispute: (id, data) => api.patch(`/admin/dispute/${id}`, data),
    downloadInvoice: (id) => api.get(`/admin/order/invoice/${id}`, { responseType: 'blob' }),
};

// Payment API
export const paymentAPI = {
    initSSL: (orderId) => api.post(`/payment/ssl/init/${orderId}`),
    initBkash: (orderId) => api.post(`/payment/bkash/init/${orderId}`),
    initNagad: (orderId) => api.post(`/payment/nagad/init/${orderId}`),
};

export default api;
