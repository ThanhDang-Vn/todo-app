'use client';

import { Column } from '@/lib/types';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createColumn, getAllColumns } from '../api/column';
import { toast } from 'sonner';

interface ColumnContextType {
  columns: Column[];
  isLoading: boolean;
  fetchColumns: () => Promise<void>;
  addColumn: (title: string) => Promise<void>;
  updateColumn: (columnId: number, newColumn: Column) => void;
}

const ColumnContext = createContext<ColumnContextType | undefined>(undefined);

export const ColumnProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fetchColumns = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllColumns();
      setColumns(data);
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
    try {
      const column = await createColumn({ title });
      if (column) {
        setColumns((prevColumns) => [...prevColumns, column]);
        toast.success('Create column successfully');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create new column');
    }
  };

  const updateColumn = (columnId: number, newColumnData: Column) => {
    setColumns((prevColumns) => prevColumns.map((col) => (col.id === columnId ? { ...col, ...newColumnData } : col)));
  };

  return (
    <ColumnContext.Provider
      value={{
        columns,
        isLoading,
        fetchColumns,
        addColumn,
        updateColumn,
      }}
    >
      {children}
    </ColumnContext.Provider>
  );
};

export const useColumnContext = () => {
  const context = useContext(ColumnContext);
  if (!context) {
    throw new Error('useColumnContext must be used within a ColumnProvider');
  }
  return context;
};
