import { ReminderOptions } from './types';

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export const REMINDERS_OPTIONS: ReminderOptions[] = [
  {
    id: 'later',
    label: 'Later',
    timeLabel: '13:00',
    calculateDate: () => {
      const now = new Date();

      const hours = [13, 15, 17, 19, 21, 23];

      for (const h of hours) {
        const candidate = new Date(now);
        candidate.setHours(h, 0, 0, 0);

        if (candidate > now) {
          return candidate;
        }
      }

      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(13, 0, 0, 0);

      return tomorrow;
    },
  },
  {
    id: 'tomorrow',
    label: 'Tomorrow',
    timeLabel: '09:00',
    calculateDate: () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      date.setHours(9, 0, 0, 0);
      return date;
    },
  },
  {
    id: 'next-week',
    label: 'Next week',
    timeLabel: 'Mon 09:00',
    calculateDate: () => {
      const now = new Date();
      const day = now.getDay();

      const date = new Date(now);

      if (day === 0) {
        date.setDate(date.getDate() + 7);
      } else {
        date.setDate(date.getDate() + (7 - day));
      }

      date.setHours(9, 0, 0, 0);
      return date;
    },
  },
];
