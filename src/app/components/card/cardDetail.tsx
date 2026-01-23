// app/components/card/CardItem.tsx
'use client';

import { useState } from 'react';
import { Card, ColumnTask } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { CalendarArrowUp, Inbox, ChevronDown, AlignVerticalSpaceAround, Trash2, Save } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

// Helper function màu sắc (giữ nguyên từ code cũ của bạn)
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

interface CardItemProps {
  card: Card;
  columnTitle: string;
  allColumns: { id: string; title: string }[];
  onUpdate: (cardId: number, data: Partial<Card>) => Promise<void>;
  onDelete: (cardId: number) => Promise<void>;
}

export function CardItem({ card, columnTitle, allColumns, onUpdate, onDelete }: CardItemProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý lưu thay đổi (Title hoặc Description)
  const handleSave = async () => {
    if (title === card.title && description === card.description) return; // Không có gì thay đổi

    setIsLoading(true);
    try {
      await onUpdate(card.cardId, { title, description });
      toast.success('Updated card successfully');
      // setOpen(false); // Có thể đóng hoặc giữ nguyên tùy UX
    } catch (error) {
      toast.error('Failed to update card');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xóa card
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* --- TRIGGER: Phần hiển thị card nhỏ trên bảng --- */}
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

      {/* --- CONTENT: Modal chi tiết để sửa/xóa --- */}
      <DialogContent className='min-w-[800px] border-0 p-0 overflow-hidden gap-0'>
        <DialogHeader className='px-6 py-4 border-b border-gray-100'>
          <DialogTitle>Inbox</DialogTitle>
        </DialogHeader>

        <div className='flex flex-row items-stretch min-h-[500px]'>
          {/* Cột trái: Nội dung chính */}
          <div className='flex flex-col flex-1 p-6 gap-6'>
            <div className='flex items-center gap-3'>
              <Checkbox className={checkboxColor(card.priority)} />
              {/* Input Title cho phép sửa */}
              <input
                className='text-xl font-semibold w-full border-none focus:outline-none focus:ring-1 focus:ring-blue-200 rounded px-1 py-0.5'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-sm font-semibold text-gray-500'>Description</label>
              <textarea
                className='min-h-[200px] resize-none focus-visible:ring-1'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Add a description...'
              />
            </div>

            <div className='mt-auto flex justify-end gap-2'>
              <Button variant='destructive' size='sm' onClick={handleDelete} disabled={isLoading}>
                <Trash2 size={16} className='mr-2' /> Delete
              </Button>
              <Button onClick={handleSave} disabled={isLoading} size='sm'>
                <Save size={16} className='mr-2' /> Save Changes
              </Button>
            </div>
          </div>

          {/* Cột phải: Sidebar thông tin */}
          <div className='flex flex-col w-80 bg-gray-50 border-l border-gray-200 p-5 gap-6'>
            {/* Project / Column Selector */}
            <div className='space-y-2'>
              <div className='text-sm font-sans font-semibold text-gray-500'>Project / Column</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='w-full justify-between bg-white'>
                    <div className='flex items-center gap-2 text-gray-600'>
                      <Inbox size={16} />
                      <span className='truncate max-w-[140px]'>{columnTitle}</span>
                    </div>
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-60' align='end'>
                  <DropdownMenuGroup>
                    {allColumns.map((col) => (
                      <DropdownMenuItem
                        key={col.id}
                        className='gap-2 cursor-pointer'
                        // Logic chuyển cột sẽ thêm vào đây (onUpdate)
                        onSelect={() => console.log('Move to', col.id)}
                      >
                        <AlignVerticalSpaceAround size={16} />
                        {col.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Các thuộc tính khác (Date, Priority...) */}
            <div className='space-y-2'>
              <div className='text-sm font-sans font-semibold text-gray-500'>Created At</div>
              <div className='text-sm text-gray-700'>{formatDate(card.created_at)}</div>
            </div>

            {/* Priority - Bạn có thể thay Combobox bằng Select nếu muốn đơn giản */}
            <div className='space-y-2'>
              <div className='text-sm font-sans font-semibold text-gray-500'>Priority</div>
              {/* Placeholder cho component Priority Selector */}
              <div className={`px-3 py-1.5 rounded border text-sm inline-block ${checkboxColor(card.priority)}`}>
                Level {card.priority}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
