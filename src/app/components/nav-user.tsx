'use client';

import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from 'lucide-react';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/app/components/ui/sidebar';
import { DropdownMenuPortal } from '@radix-ui/react-dropdown-menu';

export function NavUser({
  user,
}: {
  user: {
    name: string | undefined;
    email: string | undefined;
    avatar: string | undefined;
  };
}) {
  const { isMobile } = useSidebar();
  console.log('user: ', user);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all duration-200 border-0 ring-0 outline-0'
            >
              <Avatar className='h-8 w-8 rounded-lg ring-1 ring-slate-200'>
                <AvatarImage src={user.avatar || undefined} alt={user.name} className='object-cover' />
                <AvatarFallback className='rounded-lg bg-slate-100 font-medium text-slate-600'>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold text-slate-800'>{user.name}</span>
                <span className='truncate text-xs text-slate-500'>{user.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4 text-slate-400' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuPortal>
            <DropdownMenuContent
              className='w-[--radix-dropdown-menu-trigger-width] min-w-60 rounded-xl bg-white/95 p-1.5 shadow-xl shadow-black/5  ring-slate-200 backdrop-blur-sm border-gray-300'
              side='bottom'
              align='end'
              sideOffset={4}
            >
              <div className='px-2 py-1.5 mb-1'>
                <p className='text-xs font-medium text-slate-500 uppercase tracking-wider'>Account</p>
              </div>

              <DropdownMenuGroup>
                <DropdownMenuItem className='group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-700 focus:bg-slate-100 focus:text-slate-900 outline-none cursor-pointer transition-colors'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white shadow-sm group-focus:border-violet-200 '>
                    <Sparkles className='size-4 text-amber-500' />
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <span>Upgrade to Pro</span>
                    <span className='text-[10px] text-slate-400  font-normal'>Get unlimited access</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className='my-1.5 h-px bg-slate-100' />

              <DropdownMenuGroup>
                <DropdownMenuItem className='group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-slate-600 outline-none focus:bg-slate-100 focus:text-slate-900 cursor-pointer transition-colors'>
                  <BadgeCheck className='size-4 text-slate-500 group-focus:text-slate-800' />
                  <span>Account</span>
                </DropdownMenuItem>

                <DropdownMenuItem className='group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-slate-600 outline-none focus:bg-slate-100 focus:text-slate-900 cursor-pointer transition-colors'>
                  <CreditCard className='size-4 text-slate-500 group-focus:text-slate-800' />
                  <span>Billing</span>
                </DropdownMenuItem>

                <DropdownMenuItem className='group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-slate-600 outline-none focus:bg-slate-100 focus:text-slate-900 cursor-pointer transition-colors'>
                  <Bell className='size-4 text-slate-500 group-focus:text-slate-800' />
                  <span>Notifications</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className='my-1.5 h-px bg-slate-100' />

              <DropdownMenuItem asChild>
                <a
                  href='/api/auth/logout'
                  className='group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-red-600 outline-none hover:bg-red-50 focus:bg-red-50 cursor-pointer transition-colors'
                >
                  <LogOut className='size-4 text-red-500' />
                  <span>Log out</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
