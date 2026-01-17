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

import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle } from '@/app/components/ui/dialog';

import { Checkbox } from '@/app/components/ui/checkbox';
import { DatePicker } from '@/app/components/ui/date-picker';
import { Textarea } from '@/app/components/ui/textarea';
import { Combobox } from '@/app/components/ui/combobox';

import { useEffect, useState } from 'react';

import {
  Pencil,
  Copy,
  Archive,
  Trash2,
  Ellipsis,
  AlignVerticalSpaceAround,
  Inbox,
  ChevronDown,
  PackagePlus,
  CalendarArrowUp,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { CreateColumn } from '@/app/components/column/createColumn';
import { createColumn, getAllColumns } from '../api/column';
import { Card, ColumnTask } from '@/lib/types';
import { useRefresh } from '../context/refresh.context';
import { CreateCard } from './card/createCard';
import { formatDate } from '@/lib/utils';

const checkboxColor = (priority: string) => {
  switch (priority) {
    case '1':
      return 'outline-red-400 bg-red-100';
    case '2':
      return 'outline-orange-400 bg-orange-100';
    case '3':
      return 'outline-blue-400 bg-blue-100';
    default:
      return 'outline-gray-400 bg-gray-100';
  }
};

const hoverTaskColor = (priority: string) => {
  switch (priority) {
    case '1':
      return 'hover:bg-red-200';
    case '2':
      return 'hover:bg-orange-200';
    case '3':
      return 'hover:bg-blue-200';
    default:
      return 'hover:bg-gray-200';
  }
};

export default function InboxClient({ token }: { token: string }) {
  const [text, setText] = useState('');
  const [columns, setColumns] = useState<ColumnTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [creatingCardColId, setCreatingCardColId] = useState<string | null>(null);

  const { refreshKey } = useRefresh();

  useEffect(() => {
    const fetchAllColumns = async () => {
      try {
        const cols = await getAllColumns(token);
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
  }, [token, refreshKey]);

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
      const newCol = await createColumn({ title, token });
      setColumns((prev) => prev.map((col) => (col.columnId === tempId ? newCol : col)));
    } catch (err) {
      console.error(err);
      setColumns(prevCols);
    }
  };

  const columnOptions = columns.map((col) => ({
    id: col.columnId.toString(),
    title: col.title,
  }));

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className='flex flex-col pt-2 pl-10 max-h-full'>
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

                        <DropdownMenuItem>
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
                      <Dialog key={c.cardId}>
                        <form>
                          <DialogTrigger asChild>
                            <div
                              className={
                                'group relative w-full bg-white border border-gray-200 rounded-xl p-3.5 ' +
                                'transition-all duration-200 ease-in-out ' +
                                'hover:border-gray-300 hover:shadow-sm '
                              }
                            >
                              <div className='flex items-start gap-3.5'>
                                <div className='mt-0.5 shrink-0'>
                                  <Checkbox className={checkboxColor(c.priority)} />
                                </div>

                                <div className='flex flex-col flex-1 min-w-0 gap-1.5'>
                                  <div className='space-y-0.5'>
                                    <h3 className='text-sm font-medium text-gray-900 leading-tight truncate'>
                                      {c.title}
                                    </h3>
                                    {c.description && (
                                      <p className='text-xs text-gray-500 line-clamp-2 font-normal leading-relaxed'>
                                        {c.description}
                                      </p>
                                    )}
                                  </div>

                                  <div className='flex items-center gap-2 mt-1'>
                                    <div
                                      className={
                                        'flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-md transition-colors ' +
                                        'bg-gray-50 text-gray-500 group-hover:bg-gray-100'
                                      }
                                    >
                                      <CalendarArrowUp size={13} className='opacity-70' />
                                      <span>{formatDate(c.created_at)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent className='min-w-200'>
                            <DialogHeader>
                              <DialogTitle>
                                <div className='px-6'>Inbox</div>
                              </DialogTitle>
                            </DialogHeader>
                            <div className='flex flex-row items-start border-t border-gray-300 min-h-120'>
                              <div className='flex flex-col min-w-130 pl-6 pt-4'>
                                <div className='flex items-center gap-3'>
                                  <Checkbox className={checkboxColor(c.priority)} />
                                  <h2 className='text-xl font-semibold'>{c.title}</h2>
                                </div>

                                <div className='flex flex-col'>
                                  <Textarea value={text} label='Description' onChange={setText} />
                                </div>
                              </div>

                              <div className='flex flex-col min-w-80 bg-gray-100 pl-5 pt-4 h-full'>
                                <div className='space-y-2'>
                                  <div className='text-sm font-sans font-semibold text-gray-500 '>Project</div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button className='min-w-60 border-1 border-gray-200 hover:bg-gray-200'>
                                        <div className=' flex flex-1 items-center justify-between '>
                                          <div className='flex flex-1 items-center font-sans text-gray-600 gap-3'>
                                            <Inbox />
                                            <div className='text-base '>Inbox</div>
                                          </div>

                                          <ChevronDown />
                                        </div>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className='w-60 bg-white border-gray-300' align='center'>
                                      <DropdownMenuGroup>
                                        <DropdownMenuItem className='gap-4'>
                                          <AlignVerticalSpaceAround />
                                          Section 1
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className='gap-4'>
                                          <AlignVerticalSpaceAround />
                                          Section 2
                                        </DropdownMenuItem>

                                        <DropdownMenuItem className='gap-4'>
                                          <AlignVerticalSpaceAround />
                                          Section 3
                                        </DropdownMenuItem>
                                      </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                <div className='space-y-2 pt-2'>
                                  <div className='text-sm font-sans font-semibold text-gray-500 '>Date</div>
                                  <DatePicker className='w-60 bg-gray-100' />
                                </div>

                                <div className='space-y-2 pt-2'>
                                  <div className='text-sm font-sans font-semibold text-gray-500 '>Priority</div>
                                  <Combobox />
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </form>
                      </Dialog>
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
          token={token}
        />
      )}
    </div>
  );
}
