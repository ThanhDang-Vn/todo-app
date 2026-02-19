'use client';

import { useState, useEffect, useRef } from 'react';
import { X, User as UserIcon, Mail, Save, Loader2, Upload, AlertCircle } from 'lucide-react';
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

      // Refresh user context to reflect changes
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
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
      aria-modal='true'
      role='dialog'
    >
      <div
        className={`relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h2 className='text-2xl font-bold text-slate-900'>Edit Profile</h2>
            <p className='text-sm text-slate-500 mt-1'>Update your personal details and avatar.</p>
          </div>
          <button
            onClick={onClose}
            className='rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className='space-y-8'>
          {/* Alert Messages */}
          {error && (
            <div className='flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200'>
              <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0' />
              <p className='text-sm font-medium text-red-800'>{error}</p>
            </div>
          )}

          {success && (
            <div className='flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200'>
              <div className='w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white'>
                <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <p className='text-sm font-medium text-green-800'>Changes saved successfully!</p>
            </div>
          )}

          {/* Avatar Section */}
          <div className='space-y-4'>
            <label className='text-sm font-semibold text-slate-700'>Profile Picture</label>
            <div className='flex items-center gap-6'>
              {/* Avatar Display */}
              <div className='relative group'>
                <div className='w-24 h-24 rounded-full border-2 border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center'>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt='Profile' className='w-full h-full object-cover' />
                  ) : (
                    <UserIcon className='w-12 h-12 text-slate-400' />
                  )}
                </div>
                {/* Overlay Button */}
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

              {/* Upload Input */}
              <input
                ref={fileInputRef}
                type='file'
                accept='image/jpeg,image/png,image/jpg'
                onChange={handleAvatarChange}
                className='hidden'
              />

              {/* Info */}
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

          {/* Name Inputs */}
          <div className='grid grid-cols-2 gap-6'>
            {/* First Name */}
            <div className='space-y-2'>
              <label className='text-sm font-semibold text-slate-700 flex items-center gap-2'>
                <UserIcon className='w-4 h-4 text-slate-400' />
                First Name
              </label>
              <input
                type='text'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder='Enter your first name'
                className='w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium placeholder:text-slate-400'
              />
            </div>

            {/* Last Name */}
            <div className='space-y-2'>
              <label className='text-sm font-semibold text-slate-700 flex items-center gap-2'>
                <UserIcon className='w-4 h-4 text-slate-400' />
                Last Name
              </label>
              <input
                type='text'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder='Enter your last name'
                className='w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium placeholder:text-slate-400'
              />
            </div>
          </div>

          {/* Email (Read-only) */}
          <div className='space-y-2'>
            <label className='text-sm font-semibold text-slate-700 flex items-center gap-2'>
              <Mail className='w-4 h-4 text-slate-400' />
              Email Address
            </label>
            <input
              type='email'
              value={currentUser.email}
              disabled
              className='w-full h-11 px-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 cursor-not-allowed outline-none text-sm font-medium'
            />
            <p className='text-xs text-slate-400 pl-1'>Email address cannot be changed.</p>
          </div>

          {/* Footer Actions */}
          <div className='pt-6 flex items-center gap-3 border-t border-slate-200'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 h-11 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-sm'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isLoading || isUploading}
              className='flex-1 h-11 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' /> Saving...
                </>
              ) : (
                <>
                  <Save className='w-4 h-4' /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
