import api from '@/lib/axios';

export const searching = async (keyword: string) => {
  try {
    const res = await api.get(`search?q=${encodeURIComponent(keyword)}`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
