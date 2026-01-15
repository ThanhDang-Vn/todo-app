import { BACKEND_URL } from '@/lib/constant';
import axios from 'axios';

export const createCard = async (data: {
  title: string;
  priority?: string;
  due_to: string;
  description?: string;
  columnId: number;
  token: string | undefined;
}) => {
  try {
    console.log(data.token);
    console.log(localStorage.getItem('accessToken'));
    const res = await axios.post(`${BACKEND_URL}/cards`, data, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
