'use client';

import { createCard } from '@/app/api/card';
import { useHandlerContext } from '@/app/context/handler.context';
import { useRefresh } from '@/app/context/refresh.context';
import { CirclePlus, Flag, Calendar, Clock, MoreHorizontal, Inbox, ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

interface TaskForm {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  columnId: string;
}

interface ColumnOption {
  id: string;
  title: string;
}

interface CreateCardProps {
  currentColumnId: string;
  allColumns?: ColumnOption[];
  onSuccess?: () => void;
  open?: boolean;
  onClose: () => void;
  trigger?: ReactNode;
}

const PRIORITY_OPTIONS = [
  { value: '1', label: 'Priority 1', color: 'text-red-600', bg: 'hover:bg-red-50' },
  { value: '2', label: 'Priority 2', color: 'text-orange-500', bg: 'hover:bg-orange-50' },
  { value: '3', label: 'Priority 3', color: 'text-blue-500', bg: 'hover:bg-blue-50' },
  { value: '4', label: 'Priority 4', color: 'text-gray-500', bg: 'hover:bg-gray-50' },
];

export function CreateCard({ currentColumnId, allColumns = [], onSuccess, open, onClose, trigger }: CreateCardProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ? open : internalOpen;
  const [isLoading, setIsLoading] = useState(false);

  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);

  const { addCardContext } = useHandlerContext();

  const [mounted, setMounted] = useState(false);

  const priorityRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);

  const { triggerRefresh } = useRefresh();

  const [formData, setFormData] = useState<TaskForm>({
    title: '',
    description: '',
    dueDate: '',
    priority: '4',
    columnId: currentColumnId,
  });

  useEffect(() => {
    console.log(allColumns);
  }, [allColumns]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (priorityRef.current && !priorityRef.current.contains(event.target as Node)) {
        setShowPriorityDropdown(false);
      }
      if (columnRef.current && !columnRef.current.contains(event.target as Node)) {
        setShowColumnDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setIsLoading(true);
    handleCancel();
    try {
      await addCardContext(
        formData.title,
        formData.description,
        formData.priority,
        Number(formData.columnId),
        new Date(formData.dueDate).toISOString(),
      );

      triggerRefresh();
      setFormData({ title: '', description: '', dueDate: '', priority: '4', columnId: currentColumnId });
      toast.success('Create new task successfully');

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Something wrong...');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (open) onClose();
    else setInternalOpen(false);
    setFormData({ title: '', description: '', dueDate: '', priority: '4', columnId: currentColumnId });
  };

  const getPriorityIconColor = (val: string) => PRIORITY_OPTIONS.find((p) => p.value === val)?.color || 'text-gray-500';
  const getSelectedColumnName = () => allColumns.find((c) => c.id === formData.columnId)?.title || 'Inbox';

  const modalContent = (
    <div className='fixed inset-0 z-[9999] flex items-start justify-center pt-24 px-4'>
      <div
        className='fixed inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity'
        onClick={() => setInternalOpen(false)}
      ></div>

      <div className='relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
          <div className='space-y-1'>
            <input
              type='text'
              name='title'
              autoFocus
              required
              value={formData.title}
              onChange={handleChange}
              placeholder='Task name'
              className='w-full text-lg font-bold placeholder:text-gray-400 border-none focus:ring-0 focus:outline-0 p-0 bg-transparent text-gray-800'
            />
            <textarea
              name='description'
              rows={1}
              value={formData.description}
              onChange={handleChange}
              placeholder='Description'
              className='w-full text-sm text-gray-600 placeholder:text-gray-400 border-none focus:ring-0 focus:outline-0 p-0 bg-transparent resize-none min-h-[24px]'
              style={{ height: 'auto', minHeight: '24px' }}
              onInput={(e) => {
                e.currentTarget.style.height = 'auto';
                e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
              }}
            />
          </div>

          <div className='flex items-center gap-2 mt-2'>
            <div className='relative group'>
              <input
                type='date'
                name='dueDate'
                onChange={handleChange}
                className='absolute inset-0 opacity-0 cursor-pointer w-full'
              />

              <button
                type='button'
                className={`flex items-center gap-1.5 px-2 py-1 rounded border border-gray-300 text-xs font-medium transition-colors ${
                  formData.dueDate ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calendar size={14} />
                {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : 'Date'}
              </button>
            </div>

            <div className='relative' ref={priorityRef}>
              <button
                type='button'
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded border border-gray-300 text-xs font-medium hover:bg-gray-100 transition-colors ${
                  formData.priority !== '4' ? 'bg-gray-50' : ''
                }`}
              >
                <Flag
                  size={14}
                  className={getPriorityIconColor(formData.priority)}
                  fill={formData.priority !== '4' ? 'currentColor' : 'none'}
                />
                <span>Priority</span>
              </button>

              {showPriorityDropdown && (
                <div className='absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 flex flex-col'>
                  {PRIORITY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type='button'
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, priority: option.value }));
                        setShowPriorityDropdown(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2 text-sm w-full text-left transition-colors ${option.bg}`}
                    >
                      <Flag size={16} className={option.color} fill={option.value !== '4' ? 'currentColor' : 'none'} />
                      <span className='flex-1 text-gray-700'>{option.label}</span>
                      {formData.priority === option.value && <Check size={14} className='text-red-600' />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type='button'
              className='flex items-center gap-1.5 px-2 py-1 rounded border border-gray-300 text-gray-600 text-xs font-medium hover:bg-gray-100 transition-colors'
            >
              <Clock size={14} />
              <span>Reminders</span>
            </button>
          </div>

          <div className='flex items-center justify-between mt-4 pt-3 border-t border-gray-100'>
            <div className='relative' ref={columnRef}>
              <button
                type='button'
                onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                className='flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors'
              >
                <Inbox size={16} className='text-gray-500' />
                <span className='text-sm font-medium'>{getSelectedColumnName()}</span>
                <ChevronDown size={14} className='text-gray-400' />
              </button>

              {showColumnDropdown && !open && (
                <div className='absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 max-h-60 overflow-y-auto'>
                  <div className='px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    Select Project
                  </div>
                  {allColumns.map((col) => (
                    <button
                      key={col.id}
                      type='button'
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, columnId: col.id }));
                        setShowColumnDropdown(false);
                      }}
                      className='flex items-center gap-3 px-3 py-2 text-sm w-full text-left hover:bg-gray-50'
                    >
                      <span className='text-gray-400'>#</span>
                      <span
                        className={`flex-1 ${
                          formData.columnId === col.id ? 'font-medium text-gray-900' : 'text-gray-600'
                        }`}
                      >
                        {col.title}
                      </span>
                      {formData.columnId === col.id && <Check size={14} className='text-red-600' />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className='flex items-center gap-3'>
              <button
                type='button'
                onClick={() => handleCancel()}
                className='px-3 py-1.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isLoading || !formData.title.trim()}
                className='px-3 py-1.5 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600 disabled:opacity-50 transition-colors'
              >
                {isLoading ? 'Adding...' : 'Add task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {!open && (
        <div
          onClick={() => setInternalOpen(true)}
          className='flex items-center pl-2 gap-2 cursor-pointer hover:bg-gray-100 py-2 rounded-lg transition-all group'
        >
          <div className='group-hover:bg-red-100 rounded-full p-1 transition-colors'>
            <CirclePlus className='text-red-500' size={24} />
          </div>
          <span className='text-sm font-medium text-gray-600 group-hover:text-red-600'>Add Task</span>
        </div>
      )}

      {mounted && isOpen && createPortal(modalContent, document.body)}
    </>
  );
}
