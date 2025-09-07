import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/users/login/', credentials),
  register: (userData) => api.post('/users/register/', userData),
  logout: (refreshToken) => api.post('/users/logout/', { refresh_token: refreshToken }),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.patch('/users/profile/', data),
  changePassword: (data) => api.post('/users/change_password/', data),
  getToken: (credentials) => api.post('/token/', credentials),
  refreshToken: (refresh) => api.post('/token/refresh/', { refresh }),
  verifyToken: (token) => api.post('/token/verify/', { token }),
};

// Documents API
export const documentsAPI = {
  getDocuments: (params = {}) => api.get('/documents/', { params }),
  getMyDocuments: (params = {}) => api.get('/documents/my_documents/', { params }),
  getDocument: (id) => api.get(`/documents/${id}/`),
  uploadDocument: (formData) => api.post('/documents/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateDocument: (id, data) => api.patch(`/documents/${id}/`, data),
  deleteDocument: (id) => api.delete(`/documents/${id}/`),
  searchDocuments: (params) => api.get('/documents/search/', { params }),
  verifyDocument: (id, data) => api.post(`/documents/${id}/verify/`, data),
  bulkVerifyDocuments: (data) => api.post('/documents/bulk_verify/', data),
  getDocumentStats: () => api.get('/document-stats/'),
  getExpiringDocuments: () => api.get('/expiring-documents/'),
};

// Verification Requests API
export const verificationAPI = {
  getVerificationRequests: (params = {}) => api.get('/verification-requests/', { params }),
  getVerificationRequest: (id) => api.get(`/verification-requests/${id}/`),
  createVerificationRequest: (data) => api.post('/verification-requests/', data),
  updateVerificationRequest: (id, data) => api.patch(`/verification-requests/${id}/`, data),
  deleteVerificationRequest: (id) => api.delete(`/verification-requests/${id}/`),
  processVerificationRequest: (id, data) => api.post(`/verification-requests/${id}/process/`, data),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admins/dashboard/'),
  getAdmins: (params = {}) => api.get('/admins/', { params }),
  getAdmin: (id) => api.get(`/admins/${id}/`),
  createAdmin: (data) => api.post('/admins/', data),
  updateAdmin: (id, data) => api.patch(`/admins/${id}/`, data),
  deleteAdmin: (id) => api.delete(`/admins/${id}/`),
};

// Document Types API
export const documentTypesAPI = {
  getDocumentTypes: (params = {}) => api.get('/document-types/', { params }),
  getDocumentType: (id) => api.get(`/document-types/${id}/`),
  createDocumentType: (data) => api.post('/document-types/', data),
  updateDocumentType: (id, data) => api.patch(`/document-types/${id}/`, data),
  deleteDocumentType: (id) => api.delete(`/document-types/${id}/`),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (params = {}) => api.get('/notifications/', { params }),
  getNotification: (id) => api.get(`/notifications/${id}/`),
  markAsRead: (id) => api.post(`/notifications/${id}/mark_read/`),
  markAllAsRead: () => api.post('/notifications/mark_all_read/'),
  getUnreadCount: () => api.get('/notifications/unread_count/'),
};

export default api;
