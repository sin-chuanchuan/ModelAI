import axios from 'axios';
import { message } from 'antd';

const envBaseURL = import.meta.env.VITE_API_BASE_URL;
const baseURL = envBaseURL && envBaseURL !== '/api' ? envBaseURL : 'http://localhost:8000';

console.log('[API Client] Initializing with baseURL:', baseURL);

const apiClient = axios.create({
    baseURL,
    timeout: 30000,
});

// Request Interceptor: Auto-inject token
apiClient.interceptors.request.use(
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

// Response Interceptor: Global error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if (!response) {
            // Network error
            message.error('网络连接异常，请检查网络');
        } else if (response.status === 401) {
            // Unauthorized - usually handled by AuthContext but can log here
            console.warn('Authentication expired or invalid');
            // Do not automatically logout here to avoid circular dependency or race conditions 
            // if AuthContext is still doing its thing.
        } else if (response.status >= 500) {
            message.error('系统服务器错误，请稍后再试');
        } else if (response.status === 403) {
            message.warning('权限不足，无法访问');
        }

        return Promise.reject(error);
    }
);

export const resolveImageUrl = (url: string | null | undefined): string => {
    if (!url) return 'https://api.dicebear.com/7.x/miniavs/svg?seed=placeholder';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
    }
    // Handle relative uploads path
    if (url.startsWith('/uploads')) {
        return `${baseURL}${url}`;
    }
    return url;
};

export default apiClient;
