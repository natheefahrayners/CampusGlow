import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth services
export const authService = {
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    async register(userData) {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getToken() {
        return localStorage.getItem('token');
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    saveUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }
};

// Product services
export const productService = {
    async getAllProducts() {
        const response = await api.get('/products');
        return response.data;
    },

    async getProductById(id) {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    async getProductsByCategory(categoryId) {
        const response = await api.get(`/products?category=${categoryId}`);
        return response.data;
    }
    ,
    async updateProduct(id, data) {
        const response = await api.patch(`/products/${id}`, data);
        return response.data;
    },

    async deleteProduct(id) {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    }
};

// Test API connection
export const testConnection = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/test');
        return response.data;
    } catch (error) {
        console.error('API connection test failed:', error);
        throw error;
    }
};

export default api;
