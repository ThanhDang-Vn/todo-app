/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/app/components/ui/dropdown-menu';

import { useMemo, useState } from 'react';

import { Copy, Archive, Trash2, Ellipsis, PackagePlus, Loader2 } from 'lucide-react';
import { CreateColumn } from '@/app/components/column/createColumn';
import { createColumn, deleteColumn, getAllColumns } from '../api/column';
import { Card, Column } from '@/lib/types';
import { useRefresh } from '../context/refresh.context';
import { CreateCard } from './card/createCard';
import { toast } from 'sonner';
import { CardItem } from './card/cardDetail';
import { deleteCard, updateCard } from '../api/card';
import { getSession } from '@/lib/session';
import ConfirmModal from './modal/confirm';
import { useHandlerContext } from '../context/handler.context';

export default function InboxClient() {
  const [modalDeleteColumn, setModalDeleteColumn] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<number | null>(null);
  const [creatingCardColId, setCreatingCardColId] = useState<string | null>(null);

  const {
    columns,
    isLoading,
    addColumn,
    duplicateColumnContext,
    updateCardContext,
    deleteCardContext,
    deleteColumnContext,
  } = useHandlerContext();

  const handleCreateColumn = async (title: string) => {
    await addColumn(title);
  };

  const handleDuplicateColumn = async (column: Column, columnId: number) => {
    if (!column) return;
    const nearColumn = columns.find((col) => col.order! > column.order!);
    const order = nearColumn ? (column.order! + nearColumn.order!) / 2 : column.order! + 10000;
    await duplicateColumnContext(column, columnId, order);
  };

  const handleUpdateCard = async (cardId: number, data: Partial<Card>) => {
    await updateCardContext(cardId, data);
  };

  const handleDeleteCard = async (cardId: number) => {
    await deleteCardContext(cardId);
  };

  const handleDeleteColumn = async () => {
    if (!columnToDelete) {
      return;
    }

    setModalDeleteColumn(false);
    await deleteColumnContext(columnToDelete);
  };

  const OpenModalDelete = (columnId: number) => {
    setColumnToDelete(columnId);
    setModalDeleteColumn(true);
  };

  const columnOptions = useMemo(
    () =>
      columns.map((col) => ({
        id: col.id.toString(),
        title: col.title,
      })),
    [columns],
  );

  return (
    <div className='flex flex-col pt-2 pl-10 h-full'>
      <div className='flex items-center gap-10'>
        <h5 className='text-2xl font-semibold'>Inbox</h5>
        <CreateColumn onCreate={handleCreateColumn} />
      </div>

      {isLoading && (
        <div className='flex flex-1 min-h-full w-full items-center justify-center bg-white/80 z-50'>
          <Loader2 className='h-12 w-12 animate-spin text-red-400' />
        </div>
      )}

      <div className='h-full overflow-x-auto custom-scrollbar'>
        <div className='flex gap-5 px-1 py-4'>
          <div className='px-1 flex justify-start gap-5'>
            {columns.map((col: Column) => (
              <div
                key={`col-${col.id}-${Date.now()}`}
                className='flex flex-col flex-shrink-0 gap-4 w-[18rem] max-h-full'
              >
                <div className='flex items-center justify-between '>
                  <h1 className='text-base font-medium'>{col.title}</h1>
                  <DropdownMenu>
                    <DropdownMenuTrigger className='focus:outline-0'>
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-40 border-0 bg-white' align='center'>
                      <DropdownMenuLabel></DropdownMenuLabel>
                      <DropdownMenuGroup className=''>
                        <DropdownMenuItem onSelect={() => setCreatingCardColId(String(col.id))}>
                          <div className='px-2 py-1 flex items-center gap-3 mb-1 rounded-md text-gray-600 cursor-pointer transition-all duration-200 ease-out hover:bg-blue-50 hover:text-blue-600 active:scale-[0.98] pr-10'>
                            <PackagePlus size={17} />
                            <div className='text-sm font-sans'>Add Card</div>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={() => handleDuplicateColumn(col, col.id)}>
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

                        <DropdownMenuItem onSelect={() => OpenModalDelete(col.id)}>
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
                  {col?.cards &&
                    col?.cards.map((c: Card) => (
                      <CardItem
                        key={c.id}
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
