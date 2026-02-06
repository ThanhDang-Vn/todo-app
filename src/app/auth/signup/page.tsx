'use client';

import React from 'react';
import SubmitButton from '@/app/components/ui/submitButton';
import { Input } from '@/app/components/ui/input';
import { SignUpForm } from '@/lib/auth';
import Link from 'next/link';

const Signup = () => {
  const [state, action] = React.useActionState(SignUpForm, undefined);
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <form action={action} className='max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl'>
        <div className='text-center'>
          <div className='flex justify-center items-center gap-3 mb-2'>
            <img src='/logo.ico' alt='Logo' className='w-10 h-10' />
            <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight'>Todo Deluxe</h1>
          </div>
          <h3 className='text-gray-500 text-sm font-medium'>Create your account to get started</h3>
        </div>

        {state?.message && (
          <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center'>
            {state.message}
          </div>
        )}

        <div className='space-y-6'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <label htmlFor='firstName' className='block text-sm text-gray-600'>
                First Name
              </label>
              <Input
                id='firstName'
                type='text'
                name='firstName'
                placeholder='John'
                className='w-full outline-0 ring-0 focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:border-slate-400'
              />
              {state?.error?.firstName && <p className='text-xs text-red-500 mt-1'>{state.error.firstName}</p>}
            </div>

            <div className='space-y-1'>
              <label htmlFor='lastName' className='block text-sm text-gray-600'>
                Last Name
              </label>
              <Input
                id='lastName'
                type='text'
                name='lastName'
                placeholder='Doe'
                className='w-full outline-0 ring-0 focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:border-slate-400'
              />
              {state?.error?.lastName && <p className='text-xs text-red-500 mt-1'>{state.error.lastName}</p>}
            </div>
          </div>

          <div className='space-y-1'>
            <label htmlFor='email' className='block text-sm text-gray-600'>
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
            <label htmlFor='password' className='block text-sm text-gray-600'>
              Password
            </label>
            <Input
              id='password'
              type='password'
              name='password'
              placeholder='••••••••'
              className='w-full outline-0 ring-0 focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:border-slate-400'
            />
            {state?.error?.password && (
              <div className='mt-1'>
                <ul className='list-disc list-inside space-y-1'>
                  {state.error.password.map((error: string) => (
                    <li className='text-xs text-red-500' key={error}>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className='space-y-1'>
            <label htmlFor='confirmPassword' className='block text-sm text-gray-600'>
              Confirm Password
            </label>
            <Input
              id='confirmPassword'
              type='password'
              name='confirmPassword'
              placeholder='••••••••'
              className='w-full outline-0 ring-0 focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:border-slate-400'
            />
          </div>

          <div className='pt-2'>
            <SubmitButton>Sign Up</SubmitButton>
          </div>
        </div>

        <div className='text-center text-sm text-gray-600'>
          Already have an account?{' '}
          <Link
            href='/auth/login'
            className='font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors'
          >
            Log in here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
