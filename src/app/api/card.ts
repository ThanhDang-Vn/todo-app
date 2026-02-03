import api from '@/lib/axios';
import { BACKEND_URL } from '@/lib/constant';
import { Card, Reminder } from '@/lib/types';

export const createCard = async (data: {
  title: string;
  priority?: string;
  due_to: string;
  description?: string;
  columnId: number;
  reminders?: Reminder[]
}) => {
  try {
    const res = await api.post(`${BACKEND_URL}/cards`, data);

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const completeCard = async (cardId: number) => {
  try {
    const res = await api.put(`cards/${cardId}/complete`); 
    const data = res.data;

    return data; 
  } catch (err) {
    console.error(err); 
    throw err; 
  }
}

export const updateCard = async (cardId: number, data: Partial<Card>) => {
  try {
    const res = await api.put(`${BACKEND_URL}/cards/${cardId}`, data);

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteCard = async (cardId: number) => {
  try {
    const res = await api.delete(`${BACKEND_URL}/cards/${cardId}`);

    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
