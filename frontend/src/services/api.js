import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile')
};

// Jobs API
export const jobsAPI = {
  getAll: (filters) => api.get('/jobs', { params: filters }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (jobData) => api.post('/jobs', jobData),
  update: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  delete: (id) => api.delete(`/jobs/${id}`)
};

// Applications API
export const applicationsAPI = {
  submit: (applicationData) => api.post('/applications', applicationData),
  getAll: () => api.get('/applications'),
  getById: (id) => api.get(`/applications/${id}`),
  accept: (id) => api.put(`/applications/${id}/accept`),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
  submitCompletion: (id, userType) => api.put(`/applications/${id}/completion`, { userType }),
  completeApplication: (id) => api.put(`/applications/${id}/complete`)
};

// Payments API
export const paymentsAPI = {
  release: (id, paypalEmail) => api.post(`/payments/${id}/release`, { freelancerPaypalEmail: paypalEmail }),
  refund: (id) => api.post(`/payments/${id}/refund`)
};

// Messages API
export const messagesAPI = {
  sendMessage: (applicationId, content, messageType = 'text') => 
    api.post(`/messages/${applicationId}/messages`, { content, messageType }),
  getMessages: (applicationId) => api.get(`/messages/${applicationId}/messages`),
  submitWorkForReview: (applicationId) => api.post(`/messages/${applicationId}/submit-work`),
  submitClientReview: (applicationId, reviewStatus, feedback) => 
    api.post(`/messages/${applicationId}/client-review`, { reviewStatus, feedback })
};

export default api;
