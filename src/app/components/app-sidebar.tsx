import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/app/components/ui/sidebar';
import { Bell, Search, Inbox, Calendar, BookUp, CirclePlus, CircleQuestionMark } from 'lucide-react';
import { NavUser } from './nav-user';
import { getSession } from '@/lib/session';

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
    title: 'Upcomming',
    url: '/upcoming',
    icon: BookUp,
  },
];

export async function AppSidebar() {
  const session = await getSession();
  const userData = {
    name: session?.user.name,
    email: session?.user.email,
    avatar: '/avatars/shadcn.jpg',
  };
  return (
    <Sidebar className='bg-sidebar'>
      <SidebarHeader>
        <NavUser user={userData} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className='group-data-[collapsible=icon]:hidden' />
        <SidebarMenu>
          <SidebarMenuItem className='ml-3 pb-3'>
            <div className='flex items-center pl-1.4 gap-2'>
              <CirclePlus fill='red' color='oklch(93.657% 0.00183 249.169)' size={28} />
              <span className='text-sm font-medium'>Add Task</span>
            </div>
          </SidebarMenuItem>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title} className='ml-4 pb-2'>
              <a href={item.url} className='flex items-center pl-1.4 gap-2'>
                <item.icon size={18} />
                <span className='text-sm font-medium'>{item.title}</span>
              </a>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <div className='flex items-center pl-1.4 gap-4'>
          <CircleQuestionMark size={22} />
          <span className='text-sm font-medium'>Resources & Help</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
