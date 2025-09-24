'use client';

import React from 'react';
import SubmitButton from '@/app/components/ui/submitButton';
import { Input } from '@/app/components/ui/input';
import { SignUpForm } from '@/lib/auth';

const Signup = () => {
  const [state, action] = React.useActionState(SignUpForm, undefined);
  return (
    <form action={action}>
      <div className='grid grid-cols-1 gap-8'>
        <div className='flex items-center gap-2'>
          <img width={35} height={35} src='/logo.ico' />
          <h1 className='text-sans text-2xl font-extrabold'> Todo deluxe</h1>
        </div>

        <h3 className='flex text-zinc-950  text-2xl font-medium'>Create your account</h3>

        {state?.message && <p className='text-red-500 text-sm'>{state.message}</p>}

        <div className='flex flex-1 items-center justify-between gap-5'>
          <div className='space-y-2'>
            <div className='grid grid-cols-1 gap-2'>
              <h1> First Name</h1>
              <Input type='name' name='firstName' className='w-60' />
            </div>

            {state?.error?.firstName && <p className='text-sm text-red-500'> {state.error.firstName}</p>}
          </div>

          <div className='space-y-2'>
            <div className='grid grid-cols-1 gap-2'>
              <h1> Last Name</h1>
              <Input type='name' name='lastName' className='w-60' />
            </div>

            {state?.error?.lastName && <p className='text-sm text-red-500'> {state.error.lastName}</p>}
          </div>
        </div>

        <div className='space-y-2'>
          <div className='grid grid-cols-1 gap-2'>
            <h1> Email </h1>
            <Input type='email' name='email' className='w-120' />
          </div>

          {state?.error?.email && <p className='text-sm text-red-500'> {state.error.email}</p>}
        </div>

        <div className='space-y-2'>
          <div className='grid grid-1 gap-2'>
            <h1> Password </h1>
            <Input type='password' name='password' className='w-120' />
          </div>

          {state?.error?.password && (
            <div>
              <ul>
                {state.error.password.map((error) => (
                  <li className='text-sm text-red-500' key={error}>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className='grid grid-1 gap-2'>
          <h1> Confirm Password </h1>
          <Input type='password' name='password' className='w-120' />
        </div>

        <SubmitButton>Login</SubmitButton>

        <div className='flex items-center gap-1'>
          <h1>Already signed up?</h1>
          <a href='/auth/login' className='underline '>
            <strong> Go to login </strong>
          </a>
        </div>
      </div>
    </form>
  );
};

export default Signup;
