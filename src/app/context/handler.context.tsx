/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, Column } from '@/lib/types';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createColumn, deleteColumn, duplicateColumn, getAllColumns } from '../api/column';
import { toast } from 'sonner';
import { createCard, deleteCard, updateCard } from '../api/card';

interface HandlerContextType {
  columns: Column[];
  isLoading: boolean;
  fetchColumns: () => Promise<void>;
  addColumn: (title: string) => Promise<void>;
  duplicateColumnContext: (column: Column, columnId: number, order: number) => Promise<void>;
  updateCardContext: (cardId: number, data: Partial<Card>) => Promise<void>;
  addCardContext: (
    title: string,
    description: string,
    priority: string,
    columnId: number,
    due_to: string,
  ) => Promise<void>;
  deleteCardContext: (cardId: number) => Promise<void>;
  deleteColumnContext: (ColumnId: number) => Promise<void>;
}

const HandlerContext = createContext<HandlerContextType | undefined>(undefined);

export const HandlerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchColumns = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllColumns();
      const sortedData = Array.isArray(data) ? data.sort((a: any, b: any) => a.order - b.order) : [];
      setColumns(sortedData);
    } catch (error) {
      console.error('Failed to fetch columns:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchColumns();
  }, [fetchColumns]);

  const addColumn = async (title: string) => {
    if (!title.trim()) return;

    const tempId = Date.now() + Math.random();

    const optimisticColumn: Column = {
      id: tempId,
      title: title,
      cards: [],
      order:
        columns.length > 0 && columns[columns.length - 1]?.order
          ? (columns[columns.length - 1]?.order ?? 0) + 10000
          : 10000,
      createdAt: new Date(),
    };

    const previousColumns = [...columns];

    setColumns((prev) => [...prev, optimisticColumn]);

    try {
      const newColumn = await createColumn({ title });

      setColumns((prev) => prev.map((col) => (col.id === tempId ? newColumn : col)));
      toast.success('Create column successfully');
    } catch (err) {
      console.error(err);
      setColumns(previousColumns);
      toast.error('Failed to create new column');
    }
  };

  const duplicateColumnContext = async (column: Column, columnId: number, order: number) => {
    const prev = [...columns];

    const columnCopy = {
      ...column,
      id: Math.random() + Date.now(),
      order: order,
    };

    setColumns([...columns, columnCopy].sort((a, b) => a.order! - b.order!));

    try {
      const newColumn = await duplicateColumn(columnId);
      setColumns((prevCols) => prevCols.map((col) => (col.id === columnId ? newColumn : col)));
      toast.success('Duplication sucessfully');
    } catch (err) {
      setColumns(prev);
      console.error(err);
      toast.error('Failed to duplicate column');
      throw err;
    }
  };

  const deleteColumnContext = async (columnId: number) => {
    const previousColumns = [...columns];

    setColumns((prev) => prev.filter((col) => col.id !== columnId));

    try {
      await deleteColumn(columnId);
      toast.success('Delete column successfully');
    } catch (err) {
      setColumns(previousColumns);
      console.error(err);
      toast.error('Failed to delete this column');
    }
  };

  const addCardContext = async (
    title: string,
    description: string,
    priority: string,
    columnId: number,
    due_to: string,
  ) => {
    const prev = [...columns];

    const tempId = Date.now() + Math.random();

    const targetColumn = columns.find((c) => c.id === columnId);
    const newOrder =
      targetColumn && targetColumn.cards && targetColumn.cards.length > 0
        ? targetColumn.cards[targetColumn.cards.length - 1].order + 10000
        : 10000;

    const optimisticCard: Card = {
      id: tempId,
      title: title,
      description: description,
      order: newOrder,
      dueTo: due_to,
      priority,
      columnId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setColumns((prevCols) => {
      return prevCols.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            cards: [...(col.cards || []), optimisticCard],
          };
        }
        return col;
      });
    });

    try {
      const newRealCard = await createCard({
        title,
        description,
        priority,
        columnId,
        due_to: new Date(due_to).toISOString(),
      });
      setColumns((prevCols) => {
        return prevCols.map((col) => {
          if (col.id === columnId) {
            return {
              ...col,
              cards: col.cards?.map((c) => (c.id === tempId ? newRealCard : c)),
            };
          }
          return col;
        });
      });
    } catch (error) {
      console.error(error);

      setColumns((prevCols) => {
        return prevCols.map((col) => {
          if (col.id === columnId) {
            return {
              ...col,
              cards: col.cards?.filter((c) => c.id !== tempId),
            };
          }
          return col;
        });
      });
    }
  };

  const updateCardContext = async (cardId: number, data: Partial<Card>) => {
    const previousColumns = [...columns];

    setColumns((prevCols) => {
      const newColumnId = data.columnId;

      if (!newColumnId) {
        return prevCols.map((column) => ({
          ...column,
          cards: column.cards?.map((c) => (c.id === cardId ? { ...c, ...data } : c)) || [],
        }));
      }

      let cardToMove: Card | undefined;
      for (const col of prevCols) {
        const found = col.cards?.find((c) => c.id === cardId);
        if (found) {
          cardToMove = { ...found, ...data };
          break;
        }
      }

      if (!cardToMove) return prevCols;

      return prevCols.map((col) => {
        if (col.id === newColumnId) {
          const exists = col.cards?.some((c) => c.id === cardId);
          if (exists) {
            // Đã có rồi thì update
            return {
              ...col,
              cards: col.cards?.map((c) => (c.id === cardId ? { ...c, ...data } : c)),
            };
          }
          // Chưa có thì thêm vào
          return {
            ...col,
            cards: [...(col.cards || []), cardToMove!],
          };
        }

        const isSourceColumn = col.cards?.some((c) => c.id === cardId);
        if (isSourceColumn && col.id !== newColumnId) {
          return {
            ...col,
            cards: col.cards?.filter((c) => c.id !== cardId),
          };
        }
        return col;
      });
    });

    try {
      await updateCard(cardId, data);
    } catch (err) {
      console.error(err);
      setColumns(previousColumns);
      toast.error('Failed to update card');
    }
  };

  const deleteCardContext = async (cardId: number) => {
    const previousColumns = [...columns];

    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards?.filter((c) => c.id !== cardId) || [],
      })),
    );

    try {
      await deleteCard(cardId);
    } catch (err) {
      console.error(err);
      setColumns(previousColumns);
      toast.error('Failed to delete card');
    }
  };

  return (
    <HandlerContext.Provider
      value={{
        columns,
        isLoading,
        fetchColumns,
        addColumn,
        duplicateColumnContext,
        updateCardContext,
        addCardContext,
        deleteCardContext,
        deleteColumnContext,
      }}
    >
      {children}
    </HandlerContext.Provider>
  );
};

export const useHandlerContext = () => {
  const context = useContext(HandlerContext);
  if (!context) {
    throw new Error('useHandlerContext must be used within a HandlerProvider');
  }
  return context;
};
