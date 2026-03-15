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

export const duplicateColumn = async (columnId: string) => {
  try {
    const res = await api.post(`columns/${columnId}/duplicate`);

    const data = await res.data;
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateColumn = async (columnId: string, data: { title?: string; order?: number }) => {
  try {
    const res = await api.put(`columns/${columnId}`, data);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteColumn = async (columnId: string) => {
  try {
    const res = await api.delete(`columns/${columnId}`);
    const data = await res.data;
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
