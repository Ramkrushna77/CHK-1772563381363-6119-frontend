import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const buildError = (error, fallbackMessage) => {
    if (error.response) {
        const details = error.response.data?.detail;
        const message = typeof details === 'string' ? details : fallbackMessage;
        return new Error(message || fallbackMessage);
    }
    if (error.request) {
        return new Error('Unable to reach backend server. Please check that FastAPI is running on http://localhost:8000.');
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
