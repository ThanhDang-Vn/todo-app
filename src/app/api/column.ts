import { BACKEND_URL } from '@/lib/constant';
import axios from 'axios';

export const createColumn = async ({ title, token }: { title: string; token: string }) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/columns`,
      { title },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.data;
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getAllColumns = async (token: string | undefined) => {
  try {
    console.log(localStorage.getItem('session-action'));
    if (!token) return;
    const res = await axios.get(`${BACKEND_URL}/columns`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.data;
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
