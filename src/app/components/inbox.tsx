/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';

import { useEffect, useState } from 'react';

import { Copy, Archive, Trash2, Ellipsis, PackagePlus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { CreateColumn } from '@/app/components/column/createColumn';
import { createColumn, deleteColumn, getAllColumns } from '../api/column';
import { Card, ColumnTask } from '@/lib/types';
import { useRefresh } from '../context/refresh.context';
import { CreateCard } from './card/createCard';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { CardItem } from './card/cardDetail';
import { deleteCard, updateCard } from '../api/card';
import { getSession } from '@/lib/session';
import ConfirmModal from './modal/confirm';

export default function InboxClient() {
  const [modalDeleteColumn, setModalDeleteColumn] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<number | null>(null);
  const [columns, setColumns] = useState<ColumnTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [creatingCardColId, setCreatingCardColId] = useState<string | null>(null);

  const { refreshKey } = useRefresh();

  useEffect(() => {
    const fetchAllColumns = async () => {
      try {
        const cols = await getAllColumns();
        const session = await getSession();
        console.log(session?.accessToken);
        if (cols.length > 0) setColumns(cols);
        return;
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    fetchAllColumns();
  }, [refreshKey]);

  const handleCreateColumn = async (title: string) => {
    if (!title.trim) return;

    const tempId = 1 + Math.random() * 30000;

    const optimisitcColumn: ColumnTask = {
      columnId: tempId,
      title: title,
      card: [],
      created_at: new Date(Date.now()),
    };

    const prevCols = [...columns];

    setColumns([...prevCols, optimisitcColumn]);

    try {
      const newCol = await createColumn({ title });
      setColumns((prev) => prev.map((col) => (col.columnId === tempId ? newCol : col)));
      toast.success('Create column successfully');
    } catch (err) {
      console.error(err);
      setColumns(prevCols);
    }
  };

  const handleUpdateCard = async (cardId: number, data: Partial<Card>) => {
    const prev = [...columns];
    setColumns((prevCols) => {
      const newColumnId = data.columnColumnId;
      let cardToMove: any = null;

      if (!data.columnColumnId) {
        return prevCols.map((column) => {
          return {
            ...column,

            card: column.card!.map((c) => (c.cardId === cardId ? { ...c, ...data } : c)),
          };
        });
      }

      prevCols.forEach((col) => {
        const found = col.card!.find((c) => c.cardId === cardId);

        if (found) {
          cardToMove = { ...found, ...data };
        }
      });

      if (!cardToMove) {
        return prevCols;
      }

      return prevCols.map((col) => {
        if (col.columnId === newColumnId) {
          const exists = col.card!.find((c) => c.cardId === cardId);
          if (exists) {
            return {
              ...col,
              card: col.card!.map((c) => (c.cardId === cardId ? { ...c, ...data } : c)),
            };
          }
          return {
            ...col,
            card: [...col.card!, cardToMove],
          };
        }

        const isSourceColumn = col.card!.some((c) => c.cardId === cardId);
        if (isSourceColumn && col.columnId !== newColumnId) {
          return {
            ...col,
            card: col.card!.filter((c) => c.cardId !== cardId),
          };
        }
        return col;
      });
    });

    try {
      await updateCard(cardId, data);
    } catch (err) {
      console.error(err);
      setColumns(prev);
      toast.error('Failed to update card');
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    const prev = [...columns];
    setColumns((prevCols) =>
      prevCols.map((col) => ({
        ...col,
        card: col?.card!.filter((c) => c.cardId !== cardId),
      })),
    );

    try {
      await deleteCard(cardId);
    } catch (err) {
      console.error(err);
      setColumns(prev);
      toast.error('Failed to delete card');
    }
  };

  const handleDeleteColumn = async () => {
    if (!columnToDelete) {
      return;
    }
    const prev = [...columns];
    setColumns((prevCols) => {
      return prevCols.filter((col) => col.columnId !== columnToDelete);
    });
    setModalDeleteColumn(false);
    try {
      await deleteColumn(columnToDelete);
      toast.success('Delete column successfully');
    } catch (err) {
      setColumns(prev);
      console.error(err);
      toast.error('Failed to delete this column');
    }
  };

  const OpenModalDelete = (columnId: number) => {
    setColumnToDelete(columnId);
    setModalDeleteColumn(true);
  };

  const columnOptions = columns.map((col) => ({
    id: col.columnId.toString(),
    title: col.title,
  }));

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className='flex flex-col pt-2 pl-10 h-full'>
      <div className='flex items-center gap-5'>
        <h5 className='text-2xl font-semibold'>Inbox</h5>
        <CreateColumn onCreate={handleCreateColumn} />
      </div>

      <div className='h-full overflow-x-auto custom-scrollbar'>
        <div className='flex gap-5 px-1 py-4'>
          <div className='px-1 flex justify-start gap-5'>
            {columns.map((col: ColumnTask) => (
              <div key={`col-${col.columnId}`} className='flex flex-col flex-shrink-0 gap-4 w-[18rem] max-h-full'>
                <div className='flex items-center justify-between '>
                  <h1 className='text-base font-medium'>{col.title}</h1>
                  <DropdownMenu>
                    <DropdownMenuTrigger className='focus:outline-0'>
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-40 border-0 bg-white' align='center'>
                      <DropdownMenuLabel></DropdownMenuLabel>
                      <DropdownMenuGroup className=''>
                        <DropdownMenuItem onSelect={() => setCreatingCardColId(String(col.columnId))}>
                          <div className='px-2 py-1 flex items-center gap-3 mb-1 rounded-md text-gray-600 cursor-pointer transition-all duration-200 ease-out hover:bg-blue-50 hover:text-blue-600 active:scale-[0.98] pr-10'>
                            <PackagePlus size={17} />
                            <div className='text-sm font-sans'>Add Card</div>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <div className='px-2 py-1 flex items-center gap-3 mb-1 rounded-md text-gray-600 cursor-pointer transition-all duration-200 ease-out hover:bg-blue-50 hover:text-blue-600 active:scale-[0.98] pr-10'>
                            <Copy size={17} />
                            <div className='text-sm font-sans'>Duplicate</div>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <div className='px-2 py-1 flex items-center gap-3 mb-1 rounded-md text-gray-600 cursor-pointer transition-all duration-200 ease-out hover:bg-blue-50 hover:text-blue-600 active:scale-[0.98] pr-10'>
                            <Archive size={17} />
                            <div className='text-sm font-sans'>Archive</div>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={() => OpenModalDelete(col.columnId)}>
                          <div className='px-2 py-1 flex items-center gap-3 mb-1 rounded-md text-gray-600 cursor-pointer transition-all duration-200 ease-out hover:bg-red-50 hover:text-red-600 active:scale-[0.98] pr-10'>
                            <Trash2 size={17} />
                            <div className='text-sm font-sans '>Delete</div>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className='flex-1 overflow-y-auto max-h-150 pr-3 space-y-3 pb-2 custom-scrollbar'>
                  {col?.card &&
                    col?.card.map((c: Card) => (
                      <CardItem
                        key={c.cardId}
                        card={c}
                        column={col}
                        allColumns={columnOptions}
                        onUpdate={handleUpdateCard}
                        onDelete={handleDeleteCard}
                      />
                    ))}
                </div>
              </div>
            ))}

            <div className='flex flex-col gap-4 w-[18rem]' />
          </div>
        </div>
      </div>

      {creatingCardColId && (
        <CreateCard
          open={true}
          onClose={() => setCreatingCardColId(null)}
          currentColumnId={creatingCardColId}
          allColumns={columnOptions}
        />
      )}

      <ConfirmModal
        isOpen={modalDeleteColumn}
        onClose={() => setModalDeleteColumn(false)}
        onConfirm={handleDeleteColumn}
        title='Delete column?'
        confirmText='Delete'
        variant='danger'
      >
        <div className='space-y-3'>
          <p className='text-gray-700 font-medium'>Are you sure you want to delete this column?</p>
          <p className='text-sm text-gray-500'>
            This action cannot be undone. All tasks inside this column will be{' '}
            <span className='font-semibold text-gray-700'>permanently deleted</span>.
          </p>
        </div>
      </ConfirmModal>
    </div>
  );
}
