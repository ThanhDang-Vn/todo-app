'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getUserByEmail } from '../api/user';
import { User } from '@/lib/types';

interface UserContextType {
  user: User | undefined;
  fetchUser: (email: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | undefined>();

  const fetchUser = async (email: string) => {
    try {
      const user = await getUserByEmail(email);
      setUser(user);
      return user;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };


  useEffect(() => {
    const loadFromSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (!res.ok) return;
        const session = await res.json();
        if (session?.user?.email) {
          await fetchUser(session.user.email);
        }
      } catch (err) {
        console.error('error while loading user context from session', err);
      }
    };

    loadFromSession();
  }, []);

  return <UserContext.Provider value={{ user, fetchUser }}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }

  return context;
};
