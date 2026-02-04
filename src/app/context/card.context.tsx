'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getAllCompletedCard } from '../api/card';
import { useHandlerContext } from './handler.context';
import { Card } from '@/lib/types';

interface CardContextType {
  cards: { time: string; cards: Card[] }[];
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<{ time: string; cards: Card[] }[]>([]);
  const { columns } = useHandlerContext();

  const fetchCards = async () => {
    try {
      const data = await getAllCompletedCard();
      setCards(data);
    } catch (err) {
      console.error('Failed to fetch complete card');
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    fetchCards();
  }, [columns]);

  return (
    <CardContext.Provider
      value={{
        cards,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useHandlerContext must be used within a CardProvider');
  }
  return context;
};
