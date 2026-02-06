'use client';

import React from 'react';
import { Input } from '@/app/components/ui/input';
import SubmitButton from '@/app/components/ui/submitButton';
import { loginForm } from '@/lib/auth';
import { GoogleLoginButton } from '@/app/components/ui/googleLoginButton';
import Link from 'next/link';

const Login = () => {
  const [state, action] = React.useActionState(loginForm, undefined);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl'>
        <div className='text-center'>
          <div className='flex justify-center items-center gap-3 mb-2'>
            <img src='/logo.ico' alt='Logo' width={40} height={40} />
            <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight'>Todo Deluxe</h1>
          </div>
          <h3 className='text-gray-500 text-sm font-medium'>Welcome back! Please login to your account.</h3>
        </div>

        {state?.message && (
          <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center'>
            {state.message}
          </div>
        )}

        <form action={action} className='space-y-6'>
          {/* Email Field */}
          <div className='space-y-1'>
            <label htmlFor='email' className='block text-sm font-semibold text-gray-700'>
              Email Address
            </label>
            <Input
              id='email'
              type='email'
              name='email'
              placeholder='john@example.com'
              className='w-full outline-0 ring-0 focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:border-slate-400'
            />
            {state?.error?.email && <p className='text-xs text-red-500 mt-1'>{state.error.email}</p>}
          </div>

          <div className='space-y-1'>
            <div className='flex items-center justify-between'>
              <label htmlFor='password' className='block text-sm font-semibold text-gray-700'>
                Password
              </label>
              <Link
                href='/auth/forgot-password'
                className='text-sm text-blue-600 hover:text-blue-500 font-medium hover:underline'
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id='password'
              type='password'
              name='password'
              placeholder='••••••••'
              className='w-full outline-0 ring-0 focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:border-slate-400'
            />
            {state?.error?.password && <p className='text-xs text-red-500 mt-1'>{state.error.password}</p>}
          </div>

          <SubmitButton className='w-full py-2.5 shadow-md hover:shadow-lg transition-all'>Login</SubmitButton>
        </form>

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t border-gray-300' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='bg-white px-2 text-gray-500'>Or continue with</span>
          </div>
        </div>

        <div className='mt-4'>
          <div className='w-full'>
            <GoogleLoginButton>Continue With Google</GoogleLoginButton>
          </div>
        </div>

        <div className='text-center text-sm text-gray-600 mt-4'>
          Don&#39;t have an account?{' '}
          <Link
            href='/auth/signup'
            className='font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors'
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
