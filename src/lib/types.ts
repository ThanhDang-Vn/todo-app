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
  columnId?: number | null;
  column?: Column | null;
}

export interface CreateCardForm {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  columnId: string;
}
