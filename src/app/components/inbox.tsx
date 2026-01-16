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

import { Pencil, Copy, Archive, Trash2, Ellipsis, AlignVerticalSpaceAround, Inbox, ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { CreateColumn } from '@/app/components/column/createColumn';
import { createColumn, getAllColumns } from '../api/column';
import { Card, ColumnTask } from '@/lib/types';

const menuItems = [
  { label: 'Edit', icon: Pencil },
  { label: 'Duplicate', icon: Copy },
];

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

  useEffect(() => {
    const fetchAllColumns = async () => {
      try {
        const cols = await getAllColumns(token);
        console.log(cols);
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
  }, [token]);

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

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className='flex flex-col pt-2 pl-10 h-full'>
      <div className='flex items-center gap-5'>
        <h5 className='text-2xl font-semibold'>Inbox</h5>
        <CreateColumn onCreate={handleCreateColumn} />
      </div>

      <div className='h-full overflow-x-auto'>
        <div className='flex gap-5 px-1 py-4'>
          <div className='px-1 flex justify-start gap-5'>
            {columns.map((col: ColumnTask) => (
              <div key={`col-${col.columnId}`} className='flex flex-col gap-4 w-[18rem] flex-shrink-0'>
                <div className='flex items-center justify-between '>
                  <h1 className='text-base font-medium'>{col.title}</h1>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-56 border-0 bg-white' align='center'>
                      <DropdownMenuLabel></DropdownMenuLabel>
                      <DropdownMenuGroup className=''>
                        {menuItems.map((item) => (
                          <DropdownMenuItem key={item.label}>
                            <div className='px-1 flex items-center gap-3 mb-1'>
                              <item.icon size={17} />
                              <div className='text-sm font-sans'>{item.label}</div>
                            </div>
                          </DropdownMenuItem>
                        ))}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem>
                          <div className='px-1 flex items-center gap-3 mb-1'>
                            <Archive size={17} />
                            <div className='text-sm font-sans'>Archive</div>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <div className='px-1 flex items-center gap-3 mb-1'>
                            <Trash2 size={17} color='red' />
                            <div className='text-sm font-sans text-red-500'>Delete</div>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className='grid grid-flow-row gap-4'>
                  {col?.card &&
                    col?.card.map((c: Card) => (
                      <Dialog key={c.cardId}>
                        <form>
                          <DialogTrigger asChild>
                            <div
                              className={
                                'border-gray-300 border-1 px-4 py-1 rounded-lg h-18 space-y-0.5 transition delay-150 duration-300 ease-in-out focus-within::-translate-y-1 focus-within::scale-105 hover:-translate-y-1 hover:scale-105 ' +
                                hoverTaskColor(c.priority)
                              }
                            >
                              <div className='flex justify-start gap-3'>
                                <div className='py-0.5'>
                                  <Checkbox className={checkboxColor(c.priority)} />
                                </div>
                                <div>
                                  <h1 className='text-base'>{c.title}</h1>
                                  <h1 className='text-xs line-clamp-1 wrap-break-word'>{c.description}</h1>
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
    </div>
  );
}
