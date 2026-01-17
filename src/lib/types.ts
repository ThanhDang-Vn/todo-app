export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  EDITOR = 'EDITOR',
}

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  hashedRefreshToken?: string | null;
  avatarUrl?: string | null;
  created_at: Date;
  role: UserRole;

  column_task?: ColumnTask[];
}

export interface ColumnTask {
  columnId: number;
  title: string;
  created_at: Date;

  userUserId?: number | null;
  user?: User;

  card?: Card[];
}

export interface Card {
  cardId: number;
  title: string;
  description: string;
  priority: string;
  due_to: Date;
  created_at: Date;

  columnColumnId?: number | null;
  column_task?: ColumnTask;
}

export interface CreateCardForm {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  columnId: string;
}
