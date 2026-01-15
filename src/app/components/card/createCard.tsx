'use client';

import { createCard } from '@/app/api/card';
import { CirclePlus } from 'lucide-react';
import { useState } from 'react';

interface TaskForm {
  title: string;
  description: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
}

interface CreateCardProps {
  columnId: number;
  token: string | undefined;
  onSuccess?: () => void;
}

export function CreateCard({ columnId, token, onSuccess }: CreateCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<TaskForm>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Low',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createCard({
        ...formData,
        columnId: columnId,
        token,
        due_to: new Date(formData.dueDate).toISOString(),
      });

      console.log('Form Submitted:', { ...formData, columnId });

      setFormData({ title: '', description: '', dueDate: '', priority: 'Low' });
      setIsOpen(false);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Lỗi khi tạo task:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)} className='flex items-center pl-1.4 gap-2'>
        <CirclePlus fill='red' color='oklch(93.657% 0.00183 249.169)' size={28} />
        <span className='text-sm font-medium'>Add Task</span>
      </div>

      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          {/* Backdrop (Lớp nền đen mờ) */}
          <div
            className='fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity'
            onClick={() => setIsOpen(false)} // Click ra ngoài thì đóng
          ></div>

          {/* Dialog Content */}
          <div className='relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 transform transition-all scale-100'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Create New Task</h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Title Input */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Title *</label>
                <input
                  type='text'
                  name='title'
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder='What needs to be done?'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                />
              </div>

              {/* Description Input */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                <textarea
                  name='description'
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder='Add details...'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                {/* Due Date Input */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Due Date</label>
                  <input
                    type='datetime-local'
                    name='dueDate'
                    value={formData.dueDate}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm'
                  />
                </div>

                {/* Priority Select */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Priority</label>
                  <select
                    name='priority'
                    value={formData.priority}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white'
                  >
                    <option value='Low'>Low</option>
                    <option value='Medium'>Medium</option>
                    <option value='High'>High</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100'>
                <button
                  type='button'
                  onClick={() => setIsOpen(false)}
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isLoading}
                  className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2'
                >
                  {isLoading ? 'Creating...' : 'Create Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
