import api from '@/lib/axios';

export const createReminder = async (remindAt: string, cardId: string) => {
  try {
    const res = await api.post('reminder', {
      remindAt,
      cardId,
    });

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
