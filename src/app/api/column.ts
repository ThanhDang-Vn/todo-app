import { BACKEND_URL } from '@/lib/constant';
import axios from 'axios';

export const createColumn = async ({ title, token }: { title: string; token: string }) => {
  try {
    console.log(token);
    const res = await fetch(`${BACKEND_URL}/columns`, {
      method: 'POST',
      headers: {
        Authentication: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
