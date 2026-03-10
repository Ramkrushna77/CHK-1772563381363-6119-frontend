import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

const buildError = (error, fallbackMessage) => {
    if (error.response) {
        const data = error.response.data;
        // Express backend uses { message: '...' }, FastAPI uses { detail: '...' }
        const message = data?.message || (typeof data?.detail === 'string' ? data.detail : null);
        return new Error(message || fallbackMessage);
    }
    if (error.request) {
        return new Error('Unable to reach backend server. Please check that the server is running on http://localhost:8000.');
    }
    return new Error(error.message || fallbackMessage);
};

export const sendMessage = async (query) => {
    try {
        const response = await apiClient.post('/chat', { query });
        return response.data;
    } catch (error) {
        throw buildError(error, 'Failed to send chat message.');
    }
};

export const detectEmotion = async (imageBlob) => {
    try {
        const formData = new FormData();
        formData.append('file', imageBlob, 'capture.jpg');

        const response = await apiClient.post('/emotion', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data;
    } catch (error) {
        throw buildError(error, 'Failed to detect facial emotion.');
    }
};

export const analyzeSpeech = async (audioBlob) => {
    try {
        const formData = new FormData();
        formData.append('file', audioBlob, 'speech.webm');

        const response = await apiClient.post('/speech', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data;
    } catch (error) {
        throw buildError(error, 'Failed to analyze speech emotion.');
    }
};

export const login = async (email, password) => {
    try {
        const response = await apiClient.post('/api/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw buildError(error, 'Login failed. Please check your credentials.');
    }
};

export const signup = async (userData) => {
    try {
        // Backend doesn't have a signup route yet, I should probably add it or note it
        // For now, I'll add the call to the anticipated endpoint
        const response = await apiClient.post('/api/auth/signup', userData);
        return response.data;
    } catch (error) {
        throw buildError(error, 'Signup failed. Please try again.');
    }
};

export const generateReport = async ({ face_emotion, speech_emotion, sentiment }) => {
    try {
        const response = await apiClient.post('/report', {
            face_emotion,
            speech_emotion,
            sentiment,
        });
        return response.data;
    } catch (error) {
        throw buildError(error, 'Failed to generate report.');
    }
};

export default apiClient;
