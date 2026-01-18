import api from '@/lib/axios';
import { BACKEND_URL } from '@/lib/constant';

export const createCard = async (data: {
  title: string;
  priority?: string;
  due_to: string;
  description?: string;
  columnId: number;
}) => {
  try {
    const res = await api.post(`${BACKEND_URL}/cards`, data, );

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
