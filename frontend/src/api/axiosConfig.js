import axios from 'axios';
import { getToken } from '../utils/authUtils'; // Ensure this import exists

// 1. Connection to Auth Service (Port 8081)
export const authApi = axios.create({
    baseURL: 'http://localhost:8081/api/auth',
    headers: { 'Content-Type': 'application/json' }
});

// 2. Connection to Catalog Service (Port 8082)
export const catalogApi = axios.create({
    baseURL: 'http://localhost:8082/api',
});

// 3. Connection to Booking Service (Port 8083)
export const bookingApi = axios.create({
    baseURL: 'http://localhost:8083/api',
});

// 4. NEW: Connection to Feedback Service (Port 8084)
export const feedbackApi = axios.create({
    baseURL: 'http://localhost:8084/api/reviews', // Note the base URL includes /reviews
});

// --- HELPER: Function to attach Token ---
const attachToken = (config) => {
    // Try to get token from Utils first, fallback to direct localStorage if needed
    const token = getToken() || localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
};

// --- APPLY INTERCEPTORS ---
catalogApi.interceptors.request.use(attachToken, (error) => Promise.reject(error));
bookingApi.interceptors.request.use(attachToken, (error) => Promise.reject(error));
// Add interceptor for Feedback Service too!
feedbackApi.interceptors.request.use(attachToken, (error) => Promise.reject(error));