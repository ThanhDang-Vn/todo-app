'use client';

import { useState, useEffect, useRef } from 'react';
import { X, User as UserIcon, Mail, Save, Loader2, Upload, AlertCircle, Check } from 'lucide-react';
import { User } from '@/lib/types';
import { updateUserProfile, uploadAvatar } from '@/app/api/user';
import { useUserContext } from '@/app/context/user.context';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export default function ProfileModal({ isOpen, onClose, currentUser }: ProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');

  const [isVisible, setIsVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fetchUser } = useUserContext();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName);
      setAvatarUrl(currentUser.avatarUrl || '');
      setError(null);
      setSuccess(false);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentUser]);

  if (!isVisible && !isOpen) return null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setError('Only JPEG, PNG, and JPG files are allowed');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadAvatar(file);
      setAvatarUrl(result.avatarUrl || result.secure_url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError('Failed to upload avatar. Please try again.');
      console.error('Avatar upload error:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    if (!firstName.trim()) {
      setError('First name is required');
      setIsLoading(false);
      return;
    }

    if (!lastName.trim()) {
      setError('Last name is required');
      setIsLoading(false);
      return;
    }

    try {
      await updateUserProfile(currentUser.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      await fetchUser(currentUser.email);

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Update profile error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
      aria-modal='true'
      role='dialog'
    >
      <div
        className={`relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-8 shadow-2xl transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h2 className='text-2xl font-bold text-slate-900'>Account</h2>
            <p className='text-sm text-slate-500 mt-1'>Update your personal details and avatar.</p>
          </div>
          <button
            onClick={onClose}
            className='rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <form onSubmit={handleSave} className='space-y-8'>
          {error && (
            <div className='flex items-center gap-3 p-4 rounded-sm bg-red-50 border border-red-200'>
              <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0' />
              <p className='text-sm font-medium text-red-800'>{error}</p>
            </div>
          )}

          {success && (
            <div className='flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200'>
              <div className='flex items-center justify-center w-6 h-6 rounded-full bg-green-600'>
                <Check className='w-4 h-4 text-white' strokeWidth={3} />
              </div>
              <p className='text-sm font-medium text-green-800'>Changes saved successfully!</p>
            </div>
          )}

          <div className='space-y-4'>
            <div className='flex items-center gap-6'>
              <div className='relative group'>
                <div className='w-24 h-24 rounded-full border-2 border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center'>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt='Profile' className='w-full h-full object-cover' />
                  ) : (
                    <UserIcon className='w-12 h-12 text-slate-400' />
                  )}
                </div>

                <button
                  type='button'
                  onClick={handleAvatarClick}
                  disabled={isUploading}
                  className='absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center disabled:opacity-50'
                >
                  {isUploading ? (
                    <Loader2 className='w-6 h-6 text-white animate-spin' />
                  ) : (
                    <Upload className='w-6 h-6 text-white' />
                  )}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type='file'
                accept='image/jpeg,image/png,image/jpg'
                onChange={handleAvatarChange}
                className='hidden'
              />

              <div className='flex-1'>
                <button
                  type='button'
                  onClick={handleAvatarClick}
                  disabled={isUploading}
                  className='px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isUploading ? 'Uploading...' : 'Change Picture'}
                </button>
                <p className='text-xs text-slate-500 mt-2'>JPG, PNG up to 5MB</p>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='text-xs text-slate-700 flex items-center gap-2'>
                <UserIcon className='w-4 h-4 text-slate-400' />
                First Name
              </label>
              <input
                type='text'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder='Enter your first name'
                className='w-full h-8 px-4 rounded-sm border border-slate-200 bg-slate-50 focus:bg-white focus:border-gray-400  outline-none transition-all text-sm font-medium placeholder:text-slate-400'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-xs text-slate-700 flex items-center gap-2'>
                <UserIcon className='w-4 h-4 text-slate-400' />
                Last Name
              </label>
              <input
                type='text'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder='Enter your last name'
                className='w-full h-8 px-4 rounded-sm border border-slate-200 bg-slate-50 focus:bg-white focus:border-gray-400  outline-none transition-all text-sm font-medium placeholder:text-slate-400'
              />
            </div>
          </div>

          <div className='space-y-2 mb-5'>
            <label className='text-xs text-slate-700 flex items-center gap-2'>
              <Mail className='w-4 h-4 text-slate-400' />
              Email
            </label>
            <input
              type='email'
              value={currentUser.email}
              disabled
              className='w-full h-8 px-4 rounded-sm border border-slate-100 bg-slate-50 text-slate-500 cursor-not-allowed outline-none text-sm font-medium'
            />
            <p className='text-xs text-slate-400 pl-1'>Email address cannot be changed.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
