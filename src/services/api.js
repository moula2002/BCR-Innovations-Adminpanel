import axios from 'axios';

const api = axios.create({
  baseURL: window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://bcr-innovations-server-1.onrender.com/api',
});

// Interceptor to add the token to every request and bypass corrupted browser cache
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Cache-busting for all GET requests to prevent ERR_CACHE_READ_FAILURE
  if (config.method === 'get') {
    config.params = { ...config.params, _t: Date.now() };
    config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
