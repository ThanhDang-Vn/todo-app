import { HomeIcon, UserRound, FileBox } from 'lucide-react';
import { NavButton } from '@/app/components/NavButton';
import Link from 'next/link';

export function Header() {
  return (
    <header className='bg-background h-12 p-2 border-b sticky top-0 z-20 flex items-center justify-between w-full bg-red-500'>
      <div className='flex items-center gap-2'>
        <NavButton href='/home' label='Home' icon={HomeIcon} variant='ghost' />

        <Link href={'/home'} className='flex justify-center items-center gap-2 ml-0' title='home'>
          <h1 className='text-sm font-semibold '>Basic link to home</h1>
        </Link>
      </div>

      <div className='flex items-center'>
        <h1> Right </h1>
      </div>
    </header>
  );
}
