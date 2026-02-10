'use client';

import React from 'react';
import { Input } from '@/app/components/ui/input';
import SubmitButton from '@/app/components/ui/submitButton';

import Link from 'next/link';
import { forgotPasswordForm } from '@/lib/auth';

const ForgotPassword = () => {
  const [state, action] = React.useActionState(forgotPasswordForm, undefined);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl'>
        <div className='text-center'>
          <div className='flex justify-center items-center gap-3 mb-2'>
            <img src='/logo.ico' alt='Logo' width={40} height={40} />
            <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight'>Todo Deluxe</h1>
          </div>
          <h3 className='text-gray-900 text-xl font-bold mt-4'>Forgot Password?</h3>
          <p className='text-gray-500 text-sm mt-2'>
            Enter your email address and we will send you a 6-digit code to reset your password.
          </p>
        </div>

        {state?.message && (
          <div className={`border px-4 py-3 rounded-lg text-sm text-center ${'bg-red-50 border-red-200 text-red-600'}`}>
            {state.message}
          </div>
        )}

        <form action={action} className='space-y-6'>
          <div className='space-y-1'>
            <label htmlFor='email' className='block text-sm font-semibold text-gray-700'>
              Email Address
            </label>
            <Input
              id='email'
              type='email'
              name='email'
              placeholder='john@example.com'
              required
              className='w-full outline-0 ring-0 focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:border-slate-400'
            />
            {state?.error?.email && <p className='text-xs text-red-500 mt-1'>{state.error.email}</p>}
          </div>

          <SubmitButton className='w-full py-2.5 shadow-md hover:shadow-lg transition-all'>
            Send Reset Code
          </SubmitButton>
        </form>

        <div className='text-center text-sm text-gray-600 mt-6'>
          Remember your password?{' '}
          <Link
            href='/auth/login'
            className='font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors'
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
