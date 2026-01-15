import { BACKEND_URL } from '@/lib/constant';
import axios from 'axios';

export const createColumn = async ({ title, token }: { title: string; token: string }) => {
  try {
    console.log(token);
    const res = await axios.post(
      `${BACKEND_URL}/columns`,
      { title },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = res.data;

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
