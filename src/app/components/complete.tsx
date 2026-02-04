/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMemo, useState } from 'react';
import { Loader2, CalendarClock } from 'lucide-react';
import { Card } from '@/lib/types';
import { CreateCard } from './card/createCard';
import { CardItem } from './card/cardDetail';
import { useHandlerContext } from '../context/handler.context';
import { useCardContext } from '../context/card.context';
import ConfirmModal from './modal/confirm';
import { format, parseISO } from 'date-fns';

export default function CompleteClient() {
  const [modalDeleteColumn, setModalDeleteColumn] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<number | null>(null);
  const [creatingCardColId, setCreatingCardColId] = useState<string | null>(null);

  const { cards } = useCardContext();

  const { columns, isLoading, updateCardContext, deleteCardContext, deleteColumnContext } = useHandlerContext();

  const handleUpdateCard = async (cardId: number, data: Partial<Card>) => {
    await updateCardContext(cardId, data);
  };

  const handleDeleteCard = async (cardId: number) => {
    await deleteCardContext(cardId);
  };

  const handleDeleteColumn = async () => {
    if (!columnToDelete) return;
    setModalDeleteColumn(false);
    await deleteColumnContext(columnToDelete);
  };

  const columnOptions = useMemo(
    () =>
      columns.map((col) => ({
        id: col.id.toString(),
        title: col.title,
      })),
    [columns],
  );

  const formatDateTitle = (dateString: string) => {
    try {
      return format(parseISO(dateString), "'Week' dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className='flex flex-col pt-6 px-4 md:px-10 h-full w-full'>
      <div className='flex items-center gap-4 mb-8 border-b pb-4 border-gray-300'>
        <div>
          <h5 className='text-2xl font-bold text-gray-800'>Completed Task</h5>
          <p className='text-sm text-gray-500'>Display all the task you completed in all week</p>
        </div>
      </div>

      {isLoading && (
        <div className='flex flex-1 min-h-[50vh] w-full items-center justify-center'>
          <Loader2 className='h-12 w-12 animate-spin text-blue-500' />
        </div>
      )}

      <div className='flex flex-col gap-10 pb-20'>
        {cards.length === 0 && !isLoading && (
          <div className='text-center text-gray-400 py-10'>No task have been completed yet</div>
        )}

        {cards.map((group: any) => (
          <div key={`group-${group.time}`} className='flex flex-col gap-4'>
            <div className='flex items-center gap-3 sticky top-0 bg-gray-50/95 backdrop-blur py-3 z-10 border-b border-gray-200'>
              <div className='h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-100'></div>
              <h2 className='text-lg font-semibold text-gray-700'>{formatDateTitle(group.time)}</h2>
              <span className='ml-auto text-xs font-medium px-2 py-1 bg-gray-200 rounded-full text-gray-600'>
                {group.cards?.length || 0} tasks
              </span>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2'>
              {group?.cards &&
                group.cards.map((c: Card) => (
                  <div key={c.id} className='w-full'>
                    <CardItem
                      card={c}
                      column={c.column!}
                      allColumns={columnOptions}
                      onUpdate={handleUpdateCard}
                      onDelete={handleDeleteCard}
                    />
                  </div>
                ))}
            </div>
          </div>
        ))}
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
          <p className='text-gray-700 font-medium'>Are you sure?</p>
        </div>
      </ConfirmModal>
    </div>
  );
}
