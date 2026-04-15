import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Emergency API
export const emergencyAPI = {
  list: (params = {}) => api.get('/emergencies', { params }),
  create: (data) => api.post('/emergencies', data),
  get: (id) => api.get(`/emergencies/${id}`),
  update: (id, data) => api.put(`/emergencies/${id}`, data),
  delete: (id) => api.delete(`/emergencies/${id}`),
};

// Ambulance API
export const ambulanceAPI = {
  list: (params = {}) => api.get('/ambulances', { params }),
  available: () => api.get('/ambulances/available'),
  create: (data) => api.post('/ambulances', data),
  get: (id) => api.get(`/ambulances/${id}`),
  update: (id, data) => api.put(`/ambulances/${id}`, data),
};

// Dispatch API
export const dispatchAPI = {
  optimize: (data) => api.post('/dispatch/optimize', data),
  create: (data) => api.post('/dispatch', data),
  get: (id) => api.get(`/dispatch/${id}`),
  updateStatus: (id, status) => api.put(`/dispatch/${id}/status`, { status }),
};

// Transcription API
export const transcriptionAPI = {
  process: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/transcription/process', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Auth API
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
};

export default api;
