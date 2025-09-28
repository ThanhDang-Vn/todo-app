import { authFetch } from './authFetch';
import { BACKEND_URL } from './constant';

export const getToday = async () => {
  const response = await authFetch(`${BACKEND_URL}/auth/protected`);

  return await response.json();
};
