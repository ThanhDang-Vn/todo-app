'use client';

// Thêm useState vào import
import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/app/components/ui/sidebar';
import { Search, Inbox, Calendar, BookUp, CircleQuestionMark, ListCheck } from 'lucide-react';
import { NavUser } from './nav-user';
import { CreateCard } from './card/createCard';
import { useUserContext } from '../context/user.context';
import { useBoardContext } from '../context/board.context';

import { SearchCommand } from './searching';

const navItems = [
  {
    title: 'Search',
    url: '#',
    icon: Search,
  },
  {
    title: 'Inbox',
    url: '/inbox',
    icon: Inbox,
  },
  {
    title: 'Today',
    url: '/today',
    icon: Calendar,
  },
  {
    title: 'Upcoming',
    url: '/upcoming',
    icon: BookUp,
  },
  {
    title: 'Completed',
    url: '/complete',
    icon: ListCheck,
  },
];

export function SidebarClient() {
  const pathName = usePathname();
  const { columns } = useBoardContext();
  const { user } = useUserContext();

  const [openSearch, setOpenSearch] = useState(false);

  const columnOptions = useMemo(
    () =>
      columns.map((col) => ({
        id: col.id.toString(),
        title: col.title,
      })),
    [columns],
  );

  return (
    <>
      <Sidebar className='bg-sidebar'>
        <SidebarHeader>
          <NavUser user={user} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className='group-data-[collapsible=icon]:hidden' />
          <SidebarMenu>
            <SidebarMenuItem className='ml-3 pb-3'>
              <CreateCard
                currentColumnId={columnOptions[0]?.id}
                allColumns={columnOptions}
                onSuccess={() => console.log('Reload data here')}
                onClose={() => console.log('Reload data here')}
              />
            </SidebarMenuItem>
            {navItems.map((item) => {
              const isActive = item.url === pathName;

              if (item.title === 'Search') {
                return (
                  <SidebarMenuItem key={item.title} className='ml-4 pb-2'>
                    <button
                      onClick={() => setOpenSearch(true)}
                      className='flex w-full items-center gap-2 mr-5 rounded-lg px-2 py-1 transition hover:bg-red-100 text-left'
                    >
                      <item.icon size={18} />
                      <span className='text-sm flex-1'>{item.title}</span>
                    </button>
                  </SidebarMenuItem>
                );
              }

              return (
                <SidebarMenuItem key={item.title} className='ml-4 pb-2'>
                  <Link
                    href={item.url}
                    className={`
                      flex items-center gap-2 mr-5 rounded-lg px-2 py-1 transition
                      ${isActive ? 'bg-red-200 font-semibold text-red-700' : 'hover:bg-red-100'}
                    `}
                  >
                    <item.icon size={18} />
                    <span className='text-sm'>{item.title}</span>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter>
          <div className='flex items-center pl-1.4 gap-4 cursor-pointer hover:bg-black/5 p-2 rounded-md transition-colors'>
            <CircleQuestionMark size={22} />
            <span className='text-sm font-medium'>Resources & Help</span>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SearchCommand open={openSearch} setOpen={setOpenSearch} />
    </>
  );
}
