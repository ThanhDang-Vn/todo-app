'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useActionState, useState } from 'react';
import { Eye, EyeOff, Check, AlertCircle, ChevronLeft } from 'lucide-react';
import SubmitButton from '@/app/components/ui/submitButton';
import { resetPasswordForm } from '@/lib/auth';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [state, action] = useActionState(resetPasswordForm, undefined);

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  if (!token) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-50 p-4'>
        <div className='max-w-sm w-full bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex flex-col items-center text-center gap-3'>
          <div className='w-10 h-10 bg-red-50 rounded-full flex items-center justify-center'>
            <AlertCircle className='w-5 h-5 text-red-500' />
          </div>
          <p className='text-slate-900 font-medium'>Invalid or expired link.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className='text-sm text-slate-500 hover:text-slate-900 underline underline-offset-4'
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 p-4'>
      <div className='w-full max-w-[540px] bg-white border border-slate-200 rounded-2xl shadow-sm p-8'>
        <div className='mb-8 text-center'>
          <div className='flex justify-center items-center gap-1 mb-6'>
            <div className='p-2 rounded-xl'>
              <img src='/logo.ico' alt='Todo Deluxe Logo' width={40} height={40} className='block' />
            </div>
            <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>Reset Password</h1>
          </div>

          <p className='text-sm text-slate-500 mt-2'>Create a strong password to protect your account.</p>
        </div>

        <form action={action} className='space-y-5'>
          <input type='hidden' name='token' value={token} />

          <div className='space-y-1.5'>
            <label className='text-sm font-semibold text-slate-700 block' htmlFor='password'>
              New Password
            </label>
            <div className='relative group'>
              <input
                id='password'
                name='password'
                type={showPass ? 'text' : 'password'}
                placeholder='••••••••'
                className='w-full h-11 pl-4 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all outline-none placeholder:text-slate-400 font-medium'
              />
              <button
                type='button'
                onClick={() => setShowPass(!showPass)}
                className='absolute right-0 top-0 h-full px-4 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors'
                tabIndex={-1}
              >
                {showPass ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </button>
            </div>
            {state?.error?.password && (
              <p className='flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1.5 animate-pulse'>
                <AlertCircle className='w-3.5 h-3.5' />
                {state.error.password}
              </p>
            )}
          </div>

          <div className='space-y-1.5'>
            <label className='text-sm font-semibold text-slate-700 block' htmlFor='confirmPassword'>
              Confirm Password
            </label>
            <div className='relative group'>
              <input
                id='confirmPassword'
                name='confirmPassword'
                type={showConfirmPass ? 'text' : 'password'}
                placeholder='••••••••'
                className='w-full h-11 pl-4 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all outline-none placeholder:text-slate-400 font-medium'
              />
              <button
                type='button'
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className='absolute right-0 top-0 h-full px-4 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors'
                tabIndex={-1}
              >
                {showConfirmPass ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </button>
            </div>
            {state?.error?.confirmPassword && (
              <p className='flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1.5 animate-pulse'>
                <AlertCircle className='w-3.5 h-3.5' />
                {state.error.confirmPassword}
              </p>
            )}
          </div>

          {state?.message && (
            <div className='p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm'>
              <AlertCircle className='w-5 h-5 shrink-0' />
              <span className='font-medium'>{state.message}</span>
            </div>
          )}

          <SubmitButton className='w-full h-11 rounded-xl text-base font-medium bg-slate-900 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 mt-2'>
            Reset Password
          </SubmitButton>

          <div className='text-center pt-2'>
            <button
              type='button'
              onClick={() => router.push('/auth/login')}
              className='inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium group'
            >
              <ChevronLeft className='w-4 h-4 transition-transform group-hover:-translate-x-1' />
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
