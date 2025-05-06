
import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';

const BASE_URL = import.meta.env.DEV ? 'http://localhost:5000' : '';

export const apiRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

apiRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const queryClient = new QueryClient();
