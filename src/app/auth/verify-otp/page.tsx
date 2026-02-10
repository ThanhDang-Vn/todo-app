'use client';

import { useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useRef, useState, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react';
import SubmitButton from '@/app/components/ui/submitButton';
import { verifyOtpForm } from '@/lib/auth';

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [state, action] = useActionState(verifyOtpForm, undefined);
  const [otpValues, setOtpValues] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const combinedOtp = otpValues.join('');

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    if (isNaN(Number(value))) return;

    const newValues = [...otpValues];
    newValues[index] = value.substring(value.length - 1);
    setOtpValues(newValues);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        const newValues = [...otpValues];
        newValues[index - 1] = '';
        setOtpValues(newValues);
        inputRefs.current[index - 1]?.focus(); 
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim().slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.split('');
    const newValues = new Array(6).fill('');
    digits.forEach((digit, i) => {
      if (i < 6) newValues[i] = digit;
    });

    setOtpValues(newValues);
    const focusIndex = Math.min(digits.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  if (!email)
    return (
      <div className='flex items-center justify-center min-h-[60vh] text-slate-500'>
        <p>Không tìm thấy email. Vui lòng thử lại.</p>
      </div>
    );

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 p-4'>
      <div className='w-full max-w-[420px] bg-white border border-slate-200 rounded-2xl shadow-sm p-8'>
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>Xác thực mã OTP</h1>
          <p className='text-sm text-slate-500 mt-2'>
            Nhập mã 6 chữ số chúng tôi vừa gửi đến <br />
            <span className='font-medium text-slate-700'>{email}</span>
          </p>
        </div>

        <form action={action}>
          <input type='hidden' name='email' value={email} />
          <input type='hidden' name='otp' value={combinedOtp} />

          <div className='mb-6'>
            <div className='flex justify-between gap-2 items-center'>
              {otpValues.map((value, index) => (
                <input
                  key={index}
                  ref={(el) => {

                    if (el) inputRefs.current[index] = el;
                  }}
                  type='text'
                  inputMode='numeric'
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className='w-12 h-14 text-center text-2xl font-semibold border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-slate-900 focus:outline-none transition-all shadow-sm'
                  autoComplete='off'
                />
              ))}
            </div>

            {state?.error?.otp && (
              <p className='text-sm text-red-600 text-center mt-3 font-medium animate-pulse'>{state.error.otp}</p>
            )}
          </div>

          {state?.message && (
            <div className='mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600 text-center'>
              {state.message}
            </div>
          )}

          <SubmitButton className='w-full h-11 rounded-xl text-base font-medium bg-slate-900 hover:bg-slate-800 transition-colors'>
            Xác nhận
          </SubmitButton>

          <div className='text-center mt-6 text-sm text-slate-500'>
            <p>Bạn không nhận được mã?</p>
            <button type='button' className='text-blue-600 font-semibold hover:underline mt-1'>
              Gửi lại mã mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
