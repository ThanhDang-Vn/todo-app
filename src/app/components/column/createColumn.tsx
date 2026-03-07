'use client';

import { Plus, X, Loader2 } from 'lucide-react';
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

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onCreate(title);
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

  if (isOpen) {
    return (
      <form
        onSubmit={handleSubmit}
        className='w-full min-w-[280px] bg-gray-50/80 p-2 rounded-xl border border-gray-200 shadow-sm animate-in fade-in zoom-in-95 duration-200'
      >
        <input
          ref={inputRef}
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Enter section title...'
          disabled={isLoading}
          className='w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-gray-400 outline-none transition-all disabled:opacity-50'
        />
        <div className='flex items-center justify-between mt-2'>
          <button
            type='button'
            onClick={() => {
              setIsOpen(false);
              setTitle('');
            }}
            className='p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors'
          >
            <X size={18} />
          </button>
          <button
            type='submit'
            disabled={isLoading || !title.trim()}
            className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm'
          >
            {isLoading ? <Loader2 className='animate-spin' size={14} /> : 'Save'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsOpen(true)}
      className='group w-full h-[2rem] flex items-center justify-center gap-2 rounded-lg border-0 transition-all duration-200 ease-in-out text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200'
    >
      <Plus size={18} className='opacity-70 group-hover:opacity-100 transition-opacity' />
      <span className='text-sm font-medium'>Add Section</span>
    </button>
  );
}
