'use  client';
import { PropsWithChildren } from 'react';
import { BACKEND_URL } from '@/lib/constant';

export function GoogleLoginButton({ children }: PropsWithChildren) {
  return (
    <a
      className='flex items-center rounded-md justify-center border-1 border-gray-300 font-semibold hover:bg-gray-200 transition-transform duration-150 ease-in-out gap-2 
      active:scale-95 w-100 h-9 px-4 py-2'
      href={`${BACKEND_URL}/auth/google/login`}
    >
      <img src={'/google-icon.png'} width={20} height={20} />
      {children}
    </a>
  );
}
