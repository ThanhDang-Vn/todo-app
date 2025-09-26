'use client';
import React from 'react';
import { Input } from '@/app/components/ui/input';
import SubmitButton from '@/app/components/ui/submitButton';
import { loginForm } from '@/lib/auth';

const Login = () => {
  const [state, action] = React.useActionState(loginForm, undefined);
  return (
    <form action={action}>
      <div className='grid grid-cols-1 gap-8'>
        <div className='flex items-center gap-2'>
          <img src='/logo.ico' width={35} height={35} />
          <h3 className='text-sans text-2xl font-extrabold'>Todo Deluxe</h3>
        </div>

        <h3 className='flex text-zinc-950  text-2xl font-medium'>Login to your account</h3>

        <div className='space-y-4'>
          <div className='space-y-1'>
            <div className='grid grid-cols-1 gap-2'>
              <h1> Email </h1>
              <Input type='name' name='email' className='w-100' />
            </div>

            <div className='h-5'>
              {state?.error?.email && <p className='text-sm text-red-500'>{state.error.email}</p>}
            </div>
          </div>

          <div className='space-y-1'>
            <div className='grid grid-cols-1 gap-2'>
              <h1> Password </h1>
              <Input type='password' name='password' className='w-100' />
            </div>

            <div className='h-5'>
              {state?.message && <p className='text-sm text-red-500'>{state.message}</p>}
              {state?.error?.password && <p className='text-sm text-red-500'>{state.error.password}</p>}
            </div>
          </div>
        </div>

        <SubmitButton>Login</SubmitButton>

        <div className='flex flex-1 justify-end'>
          <a href='#' className='underline text-base'>
            <strong className='font-semibold'>Forgot password</strong>
          </a>
        </div>

        <div className='flex flex-1 items-center gap-1'>
          <h1>Don&#39;t have an account?</h1>
          <a href='/auth/signup' className='underline'>
            <strong className='font-bold'>Sign up</strong>
          </a>
        </div>
      </div>
    </form>
  );
};

export default Login;
