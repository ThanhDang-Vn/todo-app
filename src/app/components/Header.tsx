import { LayoutDashboard, CircleUserRound, FileBox, Github } from 'lucide-react';
import { NavButton } from '@/app/components/NavButton';
import Link from 'next/link';
import { ModeToggle } from '@/app/components/ModeToggle';

export function Header() {
  return (
    <header className='bg-background h-12 p-2 border-b sticky top-0 z-20'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <NavButton href='/home' label='Home' icon={LayoutDashboard} variant='ghost' />

          <Link href={'/home'} className='flex justify-center items-center gap-2 ml-0' title='home'>
            <h1 className='text-sm font-semibold'>Home</h1>
          </Link>

          <Link href={'/customer'} className='flex justify-center items-center gap-2 ml-0' title='customer'>
            <h1 className='test-sm font-semibold'>Customer</h1>
          </Link>
        </div>

        <div className='flex items-center'>
          <NavButton href='https://github.com/ThanhDang-Vn/todo-app' label='Github' icon={Github} variant='ghost' />
          <ModeToggle />
          <NavButton href='/profile' label='Profile' icon={CircleUserRound} variant='ghost' />
        </div>
      </div>
    </header>
  );
}
