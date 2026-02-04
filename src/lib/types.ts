export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  EDITOR = 'EDITOR',
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  hashedRefreshToken?: string | null;
  avatarUrl?: string | null;
  createdAt: Date;
  role: Role;
  columns?: Column[];
}

export interface Column {
  id: number;
  title: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number | null;
  user?: User | null;
  cards?: Card[];
}

export interface Card {
  id: number;
  title: string;
  description: string;
  priority: string;
  order: number;
  dueTo: string;
  createdAt: string;
  updatedAt: string;
  completeAt: string;
  columnId?: number | null;
  column?: Column | null;
  reminders?: Reminder[];
}

export interface Reminder {
  id?: number;
  remindAt: Date;
  cardId?: number;
  card?: Card | null;
}

export interface CreateCardForm {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  columnId: string;
}

export interface ReminderOptions {
  id: string;
  label: string;
  timeLabel: string;
  calculateDate: () => Date;
}
