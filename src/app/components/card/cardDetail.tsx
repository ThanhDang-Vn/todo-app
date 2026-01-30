'use client';

import { useState } from 'react';
import { Card, ColumnTask } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  CalendarArrowUp,
  Inbox,
  ChevronDown,
  AlignVerticalSpaceAround,
  Trash2,
  Save,
  Aperture,
  CalendarFold,
  Flag,
  Check,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

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

const priorityOptions = [
  { value: '1', label: 'Priority 1', short: 'P1', color: 'text-red-600', fill: 'fill-red-600' },
  { value: '2', label: 'Priority 2', short: 'P2', color: 'text-orange-500', fill: 'fill-orange-500' },
  { value: '3', label: 'Priority 3', short: 'P3', color: 'text-blue-600', fill: 'fill-blue-600' },
  { value: '4', label: 'Priority 4', short: 'P4', color: 'text-gray-500', fill: 'fill-transparent' },
];

interface CardItemProps {
  card: Card;
  column: ColumnTask;
  allColumns: { id: string; title: string }[];
  onUpdate: (cardId: number, data: Partial<Card>) => Promise<void>;
  onDelete: (cardId: number) => Promise<void>;
}

export function CardItem({ card, column, allColumns, onUpdate, onDelete }: CardItemProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);

  const handleSave = async () => {
    if (title === card.title && description === card.description) return;

    setIsLoading(true);
    try {
      await onUpdate(card.cardId, { title, description });
      toast.success('Updated card successfully');
    } catch (error) {
      toast.error('Failed to update card');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this card?')) return;

    setIsLoading(true);
    try {
      await onDelete(card.cardId);
      toast.success('Card deleted');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to delete card');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    try {
      await onUpdate(card.cardId, { priority: newPriority });
      toast.success(`Changed to Priority ${newPriority}`);
    } catch (error) {
      toast.error('Failed to update priority');
    }
  };

  const handleColumnChange = async (columnId: number, title: string) => {
    try {
      setColumnTitle(title);
      await onUpdate(card.cardId, { columnColumnId: columnId });
    } catch (err) {
      toast.error('Failed to change column');
    }
  };

  const currentPriority = priorityOptions.find((p) => p.value === card.priority) || priorityOptions[3];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className='group relative w-full bg-white border border-gray-200 rounded-xl p-3.5 transition-all duration-200 ease-in-out hover:border-gray-300 hover:shadow-sm cursor-pointer text-left'>
          <div className='flex items-start gap-3.5'>
            <div className='mt-0.5 shrink-0'>
              <Checkbox className={checkboxColor(card.priority)} />
            </div>
            <div className='flex flex-col flex-1 min-w-0 gap-1.5'>
              <div className='space-y-0.5'>
                <h3 className='text-sm font-medium text-gray-900 leading-tight truncate'>{card.title}</h3>
                {card.description && (
                  <p className='text-xs text-gray-500 line-clamp-2 font-normal leading-relaxed'>{card.description}</p>
                )}
              </div>
              <div className='flex items-center gap-2 mt-1'>
                <div className='flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-md transition-colors bg-gray-50 text-gray-500 group-hover:bg-gray-100'>
                  <CalendarArrowUp size={13} className='opacity-70' />
                  <span>{formatDate(card.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className='min-w-[800px] border-0 p-0 overflow-hidden gap-0'>
        <DialogHeader className='px-6 py-4 border-b border-gray-100'>
          <DialogTitle>
            <div className='flex items-center gap-2 text-gray-600 text-sm font-medium'>
              <Inbox size={15} />
              <span className='text-gray-500'>Inbox / </span>
              <Aperture size={15} />
              <span className='text-gray-500'> {columnTitle}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className='flex flex-row items-stretch min-h-[500px]'>
          <div className='flex flex-col flex-1 px-4 py-2 gap-6'>
            <div className='flex items-center gap-3'>
              <Checkbox className={checkboxColor(card.priority)} />
              <input
                className='text-xl font-semibold text-gray-700 w-full border-none focus:outline-none focus:ring-1 focus:ring-gray-200 rounded px-1 py-0.5'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-2 ml-2'>
              <label className='text-sm font-medium text-gray-500'>Description</label>
              <textarea
                className='min-h-[200px] resize-none focus-visible:ring-1 text-sm font-medium text-gray-700 px-4 py-2'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Add a description...'
              />
            </div>

            <div className='mt-auto flex justify-end gap-2'>
              <Button onClick={handleDelete} disabled={isLoading} size='sm'>
                <Trash2 size={16} className='mr-2' /> Delete
              </Button>
              <Button onClick={handleSave} disabled={isLoading} size='sm'>
                <Save size={16} className='mr-2' /> Save Changes
              </Button>
            </div>
          </div>

          <div className='flex flex-col w-60 bg-gray-50 border-l border-gray-200 px-3 py-5 gap-3'>
            <div className='space-y-4'>
              <div className='text-xs font-sans font-semibold text-gray-500 ml-2'>Project</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className='w-full border-0 bg-gray-50 hover:bg-gray-200 py-1 px-2 rounded-md'>
                    <div className='flex items-center gap-2 text-gray-600 font-medium'>
                      <Inbox size={14} strokeWidth='1.5px' />
                      <span className='truncate max-w-[140px] text-gray-600 text-xs'>Inbox / {columnTitle}</span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className='w-55 bg-white focus:outline-0 border-1 border-gray-300 outline-0 ring-0 h-40 overflow-y-auto custom-scrollbar'
                  align='center'
                >
                  <DropdownMenuGroup>
                    {allColumns.map((col) => (
                      <DropdownMenuItem
                        key={col.id}
                        className='gap-2 cursor-pointer text-xs text-gray-500 h-8 hover:bg-gray-100'
                        onSelect={() => handleColumnChange(Number(col.id), col.title)}
                      >
                        <AlignVerticalSpaceAround size={12} />
                        {col.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className='border-t border-0.5 border-gray-200' />

            <div className='space-y-4 mt-1 ml-2'>
              <div className='text-xs font-sans font-semibold text-gray-500'>Date</div>
              <div className='flex items-center gap-2'>
                <CalendarFold size={15} strokeWidth='1.5px' color='red' />
                <div className='truncate max-w-[140px] text-gray-600 text-xs'>{formatDate(card.created_at)}</div>
              </div>
            </div>

            <div className='border-t border-0.5 border-gray-200' />

            <div className='space-y-4 mt-1'>
              <div className='text-xs font-sans font-semibold text-gray-500 ml-2'>Priority</div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className='w-full border-0 bg-gray-50 hover:bg-gray-200 py-1 px-2 rounded-md'>
                    <div className='flex items-center gap-2'>
                      <Flag size={14} className={`${currentPriority.color} ${currentPriority.fill}`} />
                      <span className='text-xs font-medium text-gray-700'>{currentPriority.short}</span>
                    </div>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className='w-[200px] border-1 border-gray-200' align='start'>
                  {priorityOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={() => handlePriorityChange(option.value)}
                      className='cursor-pointer flex items-center justify-between py-2 hover:bg-gray-100'
                    >
                      <div className='flex items-center gap-3'>
                        <Flag size={12} className={`${option.color} ${option.fill}`} />
                        <span className='text-xs text-gray-700'>{option.label}</span>
                      </div>

                      {card.priority === option.value && <Check size={16} className='text-gray-600' />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
