export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  EDITOR = 'EDITOR',
}

export interface User {
  id: string;
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
  id: string;
  title: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string | null;
  user?: User | null;
  cards?: Card[];
}

export interface Card {
  id: string;
  title: string;
  description: string;
  priority: string;
  order: number;
  dueTo: string;
  createdAt: string;
  updatedAt: string;
  completeAt?: string;
  columnId?: string | null;
  column?: Column | null;
  reminders?: Reminder[];
}

export interface Reminder {
  id?: string;
  remindAt: Date;
  isSent?: boolean;
  cardId?: string;
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
