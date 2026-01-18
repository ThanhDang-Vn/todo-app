import api from '@/lib/axios';

export const createColumn = async ({ title }: { title: string }) => {
  try {
    const res = await api.post(`columns`, { title });
    const data = await res.data;
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getAllColumns = async () => {
  try {
    const res = await api.get(`columns`);
    const data = await res.data;
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
