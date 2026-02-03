import axios from "axios";

// Simple, reliable API URL detection with detailed logging
const getApiUrl = () => {
  console.log('=== API URL Detection ===');
  console.log('Environment variables:', import.meta.env);
  
  // Check for environment variable first
  if (import.meta.env.VITE_API_URL) {
    console.log('✅ Using VITE_API_URL:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // Check hostname for deployment environments
  const hostname = window.location.hostname;
  console.log('Hostname:', hostname);
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    console.log('✅ Detected localhost environment');
    return 'http://localhost:5000';
  }
  
  if (hostname.includes('netlify.app')) {
    console.log('✅ Detected Netlify deployment');
    return 'https://houses-web.onrender.com';
  }
  
  // Default fallback
  console.log('⚠️ Using default URL (localhost)');
  return 'http://localhost:5000';
};

const apiUrl = getApiUrl();
console.log('🎯 Final API URL:', apiUrl);

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Enhanced request interceptor with detailed logging
api.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${fullUrl}`);
    console.log('Request config:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      withCredentials: config.withCredentials,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with detailed logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    // Provide user-friendly error messages
    if (!error.response) {
      console.error('🔌 Network error - Backend might not be running');
      console.error('Make sure the backend is running on:', apiUrl);
    } else if (error.response.status === 404) {
      console.error('🔍 404 Not Found - Check if the API endpoint exists');
    } else if (error.response.status === 403) {
      console.error('🔒 403 Forbidden - Check authentication');
    } else if (error.response.status === 401) {
      console.error('🚫 401 Unauthorized - Login required');
    }
    
    return Promise.reject(error);
  }
);

// Test connection on load
console.log('🔍 Testing API connection...');
api.get('/api/houses')
  .then(() => console.log('✅ API connection successful!'))
  .catch((error) => {
    console.error('❌ API connection failed!');
    console.error('Error details:', error.message);
    console.error('Is your backend running? Try: python app.py');
  });

export default api;