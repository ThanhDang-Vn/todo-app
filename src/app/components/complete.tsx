/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMemo } from 'react';
import { Loader2, CheckCircle2, Clock } from 'lucide-react'; // Import thêm icon
import { Card } from '@/lib/types';
import { useCardContext } from '../context/card.context';
import { useHandlerContext } from '../context/handler.context';
import { format, parseISO } from 'date-fns';

export default function CompleteClient() {
  const { cards } = useCardContext();
  const { isLoading } = useHandlerContext();

  const formatDateTitle = (dateString: string) => {
    try {
      return format(parseISO(dateString), "'Week starting' dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString?: string | Date) => {
    if (!dateString) return '';
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;

      return format(date, 'yyyy-MM-dd HH:mm');
    } catch {
      return '';
    }
  };

  return (
    <div className='flex flex-col pt-6 px-4 md:px-10 h-full w-full'>
      <div className='flex items-center gap-4 mb-8 border-b pb-4 border-gray-200'>
        <div>
          <h5 className='text-2xl font-bold text-gray-800'>Completed Tasks</h5>
          <p className='text-sm text-gray-500'>History of all tasks you have finished</p>
        </div>
      </div>

      {isLoading ? (
        <div className='flex flex-1 min-h-[50vh] w-full items-center justify-center'>
          <Loader2 className='h-12 w-12 animate-spin text-blue-500' />
        </div>
      ) : (
        <div className='flex flex-col gap-10 pb-20'>
          {cards.length === 0 && (
            <div className='text-center text-gray-400 py-10 italic'>No tasks have been completed yet.</div>
          )}

          {cards.map((group: any) => (
            <div key={`group-${group.time}`} className='flex flex-col gap-4'>
              {/* Header Tuần */}
              <div className='flex items-center gap-3 sticky top-0 bg-gray-50/95 backdrop-blur py-3 z-10 border-b border-gray-200'>
                <div className='h-3 w-3 rounded-full bg-green-500 ring-4 ring-green-100'></div>
                <h2 className='text-lg font-semibold text-gray-700'>{formatDateTitle(group.time)}</h2>
                <span className='ml-auto text-xs font-medium px-2 py-1 bg-white border border-gray-200 rounded-full text-gray-600 shadow-sm'>
                  {group.cards?.length || 0} tasks
                </span>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2'>
                {group?.cards &&
                  group.cards.map((c: Card) => (
                    <div
                      key={c.id}
                      className='group flex flex-col justify-between w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200'
                    >
                      <div>
                        <div className='flex items-start justify-between gap-2 mb-2'>
                          <h4 className='font-medium text-gray-800 line-clamp-2 leading-snug'>{c.title}</h4>
                        </div>

                        {c.description && <p className='text-xs text-gray-500 line-clamp-2 mb-3'>{c.description}</p>}
                      </div>

                      <div className='mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs'>
                        <div className='flex items-center gap-1.5 text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md'>
                          <CheckCircle2 size={12} />
                          <span>Done</span>
                        </div>

                        <div className='flex items-center gap-1.5 text-gray-400 font-medium'>
                          <Clock size={12} />
                          <span>{formatTime(c.completeAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
