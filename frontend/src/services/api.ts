import axios from 'axios';

const api = axios.create({
    // Use 127.0.0.1 to match the actual Uvicorn listener
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Helper to log errors for user
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.group("❌ API Error");
        console.log("URL:", error.config?.url);
        console.log("Status:", error.response?.status);
        console.log("Data:", error.response?.data);
        console.groupEnd();
        return Promise.reject(error);
    }
);

export default api;
