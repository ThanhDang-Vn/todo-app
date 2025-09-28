'use client';
import React, { PropsWithChildren } from 'react';
import { Button } from './button';
import { useFormStatus } from 'react-dom';
import { Loader } from 'lucide-react';

const SubmitButton = ({ children }: PropsWithChildren) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      aria-disabled={pending}
      disabled={pending}
      className='flex items-center bg-black border text-white font-semibold transition-transform duration-150 ease-in-out 
  active:scale-95 w-100'
    >
      {pending && <Loader className='h-4 w-4 animate-spin' />}
      {pending ? 'Submitting...' : children}
    </Button>
  );
};

export default SubmitButton;
