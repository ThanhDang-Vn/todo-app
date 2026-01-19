'use client';

import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CreateColumnProp {
  onCreate: (title: string) => void;
}

export function CreateColumn({ onCreate }: CreateColumnProp) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      setIsOpen(false);
      onCreate(title);
      setTitle('');
    } catch (error) {
      console.error('Lỗi khi tạo task:', error);
      toast.error('Something wrong...');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100/50 hover:bg-gray-200 rounded-lg transition-all w-40 h-fit border-2 border-dashed border-gray-300 hover:border-gray-400'
      >
        <CirclePlus className='text-blue-500' size={20} />
        <span className='text-sm font-semibold'>Add column</span>
      </button>

      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          <div
            className='fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity'
            onClick={() => setIsOpen(false)}
          ></div>

          <div className='relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 transform transition-all scale-100'>
            <h2 className='text-lg font-bold text-gray-800 mb-4'>Add New Column</h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Column Name</label>
                <input
                  type='text'
                  required
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='e.g. To Do, Done, Pending...'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                />
              </div>

              <div className='flex justify-end gap-3 mt-6 pt-2'>
                <button
                  type='button'
                  onClick={() => setIsOpen(false)}
                  className='px-4 py-2 text-sm font-medium text-gray-700 border border-gray-400 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isLoading || !title.trim()}
                  className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoading ? 'Adding...' : 'Add Column'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
