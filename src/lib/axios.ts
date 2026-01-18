import axios from 'axios';
import { getSession, updateSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { BACKEND_URL } from './constant';

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const session = await getSession();
        if (!session?.refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${BACKEND_URL}/auth/refresh`, {
          refreshToken: session.refreshToken,
        });

        await updateSession({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        await deleteSession();
        redirect('auth/login');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
