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

export const updateUserProfile = async (id: string, payload: Partial<{ firstName: string; lastName: string }>) => {
  try {
    const res = await api.patch(`user/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error('Unable to update user profile', err);
    throw err;
  }
};

export const uploadAvatar = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await api.post('user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err) {
    console.error('Upload avatar failed', err);
    throw err;
  }
};
