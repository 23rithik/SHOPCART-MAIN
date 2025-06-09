import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Your server's base URL
});

// Request Interceptor to add the JWT token to the request headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle expired or invalid tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle token expiration or unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';  // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
