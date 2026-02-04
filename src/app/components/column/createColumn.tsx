'use client';

import { Plus, X, Loader2, LayoutDashboard } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface CreateColumnProp {
  onCreate: (title: string) => void;
}

export function CreateColumn({ onCreate }: CreateColumnProp) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input khi mở modal
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);

    try {
      await onCreate(title); // Giả sử onCreate trả về Promise
      setIsOpen(false);
      setTitle('');
      toast.success('Column created successfully');
    } catch (error) {
      console.error('Error creating column:', error);
      toast.error('Failed to create column');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* --- Trigger Button --- */}
      <button
        onClick={() => setIsOpen(true)}
        className='
            group w-full h-[2.5rem] flex items-center justify-center gap-2 
            rounded-lg border border-gray-300
            bg-transparent hover:bg-gray-50 hover:border-gray-400
            transition-all duration-200 ease-in-out
            text-gray-400 hover:text-gray-700
        '
      >
        <Plus size={18} className='opacity-70 group-hover:opacity-100 transition-opacity' />
        <span className='text-sm font-medium'>Add Section</span>
      </button>

      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0'>
          <div
            className='absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity animate-in fade-in duration-200'
            onClick={() => setIsOpen(false)}
          />

          <div className='relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all animate-in zoom-in-95 slide-in-from-bottom-2 duration-200 border border-gray-100 overflow-hidden'>
            <div className='flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50'>
              <div className='flex items-center gap-3'>
                <div>
                  <h2 className='text-lg font-bold text-gray-900 leading-tight'>Add Column</h2>
                  <p className='text-xs text-gray-500 font-medium'>Create a new section for your tasks</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className='text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all'
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='px-6 py-4 space-y-6'>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700 ml-1'>Column Title</label>
                <div className='relative'>
                  <input
                    ref={inputRef}
                    type='text'
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Ex: Design, In Progress, Done...'
                    className='w-full px-4 py-3 bg-white border border-gray-200 rounded-md text-gray-800 placeholder:text-gray-400 focus:border-gray-500 ring-0 outline-0 ne transition-all duration-200 shadow-sm'
                  />
                </div>
              </div>

              <div className='flex items-center justify-end gap-3 pt-2'>
                <button
                  type='button'
                  onClick={() => setIsOpen(false)}
                  className='px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-800 transition-all active:scale-95'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isLoading || !title.trim()}
                  className='relative px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-900/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2'
                >
                  {isLoading && <Loader2 className='animate-spin' size={16} />}
                  {isLoading ? 'Creating...' : 'Create Column'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
