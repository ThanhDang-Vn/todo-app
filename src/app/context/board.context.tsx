/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, Column, Reminder, Section } from '@/lib/types';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createColumn, deleteColumn, duplicateColumn, getAllColumns, updateColumn } from '../api/column';
import { toast } from 'sonner';
import {
  completeCard,
  createCard,
  deleteCard,
  getAllInboxCard,
  getAllTodayCard,
  getAllUpcomingCard,
  updateCard,
} from '../api/card';
import { CheckCircle2, Undo2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface BoardContextType {
  columns: Column[];
  sections: Section[];
  isLoading: boolean;
  fetchColumns: () => Promise<void>;
  addColumn: (title: string) => Promise<void>;
  duplicateColumnContext: (column: Column, columnId: string, order: number) => Promise<void>;
  updateColumnContext: (columnId: string, data: { title?: string; order?: number }) => Promise<void>;
  updateCardContext: (cardId: string, data: Partial<Card>) => Promise<void>;
  reorderCardContext: (cardId: string, sourceColumnId: string, destColumnId: string, destIndex: number) => Promise<void>;
  addCardContext: (
    title: string,
    description: string,
    priority: string,
    columnId: string,
    due_to: string,
    reminder: Reminder | undefined,
  ) => Promise<void>;
  completeCardContext: (cardId: string) => Promise<void>;
  deleteCardContext: (cardId: string) => Promise<void>;
  deleteColumnContext: (ColumnId: string) => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

interface BoardProviderProps {
  children: React.ReactNode;
}

export const BoardProvider: React.FC<BoardProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const [columns, setColumns] = useState<Column[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSections = async () => {
    try {
      const data = await getAllColumns();
      setSections(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchColumns = useCallback(async () => {
    try {
      setIsLoading(true);
      let data;
      if (pathname.includes('/inbox')) {
        data = await getAllInboxCard();
      } else if (pathname.includes('/today')) {
        data = await getAllTodayCard();
      } else if (pathname.includes('/upcoming')) {
        data = await getAllUpcomingCard();
      } else {
        return;
      }
      const sortedData = Array.isArray(data) ? data.sort((a: any, b: any) => a.order - b.order) : [];
      setColumns(sortedData);
    } catch (error) {
      console.error('Failed to fetch columns:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pathname]);

  useEffect(() => {
    fetchColumns();
  }, [fetchColumns]);

  useEffect(() => {
    fetchSections();
  }, []);

  const addColumn = async (title: string) => {
    if (!title.trim()) return;
    const prev = [...columns];
    const prevSections = [...sections];

    const tempId = (Date.now() + Math.random()).toString();

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

    setColumns((prev) => [...prev, optimisticColumn]);
    setSections((prev) => [...prev, { id: optimisticColumn.id, title: optimisticColumn.title }]);

    try {
      const newColumn = await createColumn({ title });

      setColumns((prev) => prev.map((col) => (col.id === tempId ? newColumn : col)));
      setSections((prev) =>
        prev.map((col) => (col.id === newColumn.id ? { id: newColumn.id, title: newColumn.title } : col)),
      );
      toast.success('Create column successfully');
    } catch (err) {
      console.error(err);
      setColumns(prev);
      setSections(prevSections);
      toast.error('Failed to create new column');
    }
  };

  const completeCardContext = async (cardId: string) => {
    return new Promise<void>((resolve) => {
      const prev = [...columns];

      setColumns((prevCols) =>
        prevCols.map((col) => {
          return {
            ...col,
            cards: col.cards!.filter((card) => card.id !== cardId),
          };
        }),
      );

      let undone = false;

      toast.custom(
        (t) => (
          <div className='flex items-center justify-between w-full max-w-md p-4 bg-white border border-gray-100 rounded-xl shadow-lg shadow-gray-200/50  gap-4'>
            <div className='flex items-center gap-3'>
              <div className='flex items-center justify-center w-8 h-8 bg-green-100 rounded-full shrink-0'>
                <CheckCircle2 size={20} className='text-green-600' />
              </div>

              <div className='flex flex-col'>
                <span className='text-sm font-semibold text-gray-800 '>Đã hoàn thành</span>
                <span className='text-xs text-gray-500 dark:text-gray-400 line-clamp-1'>
                  Task đã được chuyển sang Done
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                undone = true;
                setColumns(prev);
                toast.dismiss(t);
              }}
              className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-900 transition-colors '
            >
              <Undo2 size={14} />
              Undo
            </button>
          </div>
        ),
        {
          duration: 4000,
        },
      );

      setTimeout(async () => {
        if (undone) return;

        try {
          await completeCard(cardId);
          resolve();
        } catch (err) {
          console.error(err);
          setColumns(prev);
          toast.error('Failed to complete task');
          resolve();
        }
      }, 3000);
    });
  };

  const duplicateColumnContext = async (column: Column, columnId: string, order: number) => {
    const prev = [...columns];
    const prevSections = [...sections];

    const columnCopy = {
      ...column,
      id: (Math.random() + Date.now()).toString(),
      order: order,
    };

    setColumns([...columns, columnCopy].sort((a, b) => a.order! - b.order!));
    setSections((prev) => [...prev, { id: columnCopy.id, title: columnCopy.title }]);

    try {
      const newColumn = await duplicateColumn(columnId);
      setColumns((prevCols) => prevCols.map((col) => (col.id === columnId ? newColumn : col)));
      setSections((prev) =>
        prev.map((col) => (col.id === columnId ? { id: columnCopy.id, title: columnCopy.title } : col)),
      );
      toast.success('Duplication sucessfully');
    } catch (err) {
      setColumns(prev);
      setSections(prevSections);
      console.error(err);
      toast.error('Failed to duplicate column');
      throw err;
    }
  };

  const deleteColumnContext = async (columnId: string) => {
    const prev = [...columns];
    const prevSections = [...sections];

    setColumns((prev) => prev.filter((col) => col.id !== columnId));
    setSections((prev) => prev.filter((section) => section.id !== columnId));

    try {
      await deleteColumn(columnId);
      toast.success('Delete column successfully');
    } catch (err) {
      setColumns(prev);
      setSections(prevSections);
      console.error(err);
      toast.error('Failed to delete this column');
    }
  };

  const updateColumnContext = async (columnId: string, data: { title?: string; order?: number }) => {
    const prev = [...columns];
    const prevSections = [...sections];

    const normalizedData = {
      ...data,
      order: data.order ? Number(data.order) : undefined,
    };

    setColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, ...normalizedData } : col)));
    setSections((prev) => prev.map((sec) => (sec.id === columnId ? { ...sec, ...data } : sec)));

    try {
      await updateColumn(columnId, data);
      toast.success('Update column successfully');
    } catch (err) {
      setColumns(prev);
      setSections(prevSections);
      console.error(err);
      toast.error('Failed to update this column');
    }
  };

  const addCardContext = async (
    title: string,
    description: string,
    priority: string,
    columnId: string,
    due_to: string,
    reminder: Reminder | undefined,
  ) => {
    const pathname = window.location.pathname;

    let columnTarget = columnId;

    const dueDate = new Date(due_to);
    const today = new Date();

    const isToday =
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear();

    if (pathname === '/today') {
      if (isToday) {
        columnTarget = '2';
      } else {
        columnTarget = '';
      }
    } else if (pathname === '/upcoming') {
      columnTarget = dueDate.toISOString().split('T')[0];
    }

    const tempId = (Date.now() + Math.random()).toString();

    const targetColumn = columns.find((c) => c.id === columnTarget);
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
        if (col.id === columnTarget) {
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
        dateDue: new Date(due_to).toISOString(),
        reminders: reminder ? [reminder] : undefined,
      });
      setColumns((prevCols) => {
        return prevCols.map((col) => {
          if (col.id === columnTarget) {
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
          if (col.id === columnTarget) {
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

  const updateCardContext = async (cardId: string, data: Partial<Card>) => {
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
            return {
              ...col,
              cards: col.cards?.map((c) => (c.id === cardId ? { ...c, ...data } : c)),
            };
          }
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
      toast.success('Updated column successfully');
    } catch (err) {
      console.error(err);
      setColumns(previousColumns);
      toast.error('Failed to update card');
    }
  };

  const reorderCardContext = async (
    cardId: string,
    sourceColumnId: string,
    destColumnId: string,
    destIndex: number,
  ) => {
    const previousColumns = [...columns];

    let newOrder = 10000;

    setColumns((prevCols) => {
      const destCol = prevCols.find((c) => c.id === destColumnId);
      const destCards = (destCol?.cards || []).filter((c) => c.id !== cardId);

      if (destCards.length === 0) {
        newOrder = 10000;
      } else if (destIndex <= 0) {
        newOrder = Math.floor(destCards[0].order / 2) || 5000;
      } else if (destIndex >= destCards.length) {
        newOrder = destCards[destCards.length - 1].order + 10000;
      } else {
        newOrder = Math.floor((destCards[destIndex - 1].order + destCards[destIndex].order) / 2);
      }

      const isSameColumn = sourceColumnId === destColumnId;

      let cardToMove: Card | undefined;
      for (const col of prevCols) {
        const found = col.cards?.find((c) => c.id === cardId);
        if (found) {
          cardToMove = { ...found, order: newOrder, columnId: destColumnId };
          break;
        }
      }
      if (!cardToMove) return prevCols;

      return prevCols.map((col) => {
        if (isSameColumn && col.id === sourceColumnId) {
          const without = (col.cards || []).filter((c) => c.id !== cardId);
          const inserted = [...without.slice(0, destIndex), cardToMove!, ...without.slice(destIndex)];
          return { ...col, cards: inserted };
        }
        if (!isSameColumn) {
          if (col.id === sourceColumnId) {
            return { ...col, cards: (col.cards || []).filter((c) => c.id !== cardId) };
          }
          if (col.id === destColumnId) {
            const without = (col.cards || []).filter((c) => c.id !== cardId);
            const inserted = [...without.slice(0, destIndex), cardToMove!, ...without.slice(destIndex)];
            return { ...col, cards: inserted };
          }
        }
        return col;
      });
    });

    try {
      const updateData: Partial<Card> = { order: newOrder };
      if (sourceColumnId !== destColumnId) {
        updateData.columnId = destColumnId;
      }
      await updateCard(cardId, updateData);
    } catch (err) {
      console.error(err);
      setColumns(previousColumns);
      toast.error('Failed to move card');
    }
  };

  const deleteCardContext = async (cardId: string) => {
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
    <BoardContext.Provider
      value={{
        columns,
        sections,
        isLoading,
        fetchColumns,
        addColumn,
        duplicateColumnContext,
        updateColumnContext,
        updateCardContext,
        reorderCardContext,
        addCardContext,
        completeCardContext,
        deleteCardContext,
        deleteColumnContext,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardContext must be used within a BoardProvider');
  }
  return context;
};
