import { LoaderCircle } from 'lucide-react';
import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Đồng ý',
  cancelText = 'Hủy bỏ',
  variant = 'primary',
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4'>
      <div className='w-full max-w-md bg-white rounded-xl shadow-2xl transform transition-all scale-100' role='dialog'>
        <div className='border-b border-gray-300 px-6 py-4 flex justify-between items-center'>
          <h3 className={`text-lg font-bold ${variant === 'danger' ? 'text-slate-600' : 'text-gray-800'}`}>{title}</h3>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600 disabled:opacity-50'>
            ✕
          </button>
        </div>

        <div className='px-6 py-6 text-gray-600'>{children}</div>

        <div className='border-t border-gray-300 px-6 py-4 flex justify-end space-x-3 bg-gray-50 rounded-b-xl'>
          <button
            onClick={onClose}
            className='px-3 py-1 rounded-lg text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors'
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`px-3 py-1 rounded-lg text-sm text-white font-medium shadow-sm disabled:opacity-50 flex items-center gap-2 transition-colors ${
              variant === 'danger' ? 'bg-slate-500 hover:bg-slate-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
