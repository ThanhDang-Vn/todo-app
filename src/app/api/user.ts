import api from '@/lib/axios';

export const getUserByEmail = async (email: string) => {
  try {
    const data = { email };
    const res = await api.post(`user`, data);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
