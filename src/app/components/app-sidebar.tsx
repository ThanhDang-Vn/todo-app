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

const userData = {
  name: 'ThDangVn',
  email: 'dn156162@gmail.com',
  avatar: '/avatars/shadcn.jpg',
};

const navItems = [
  {
    title: 'Search',
    url: '#',
    icon: Search,
  },
  {
    title: 'Inbox',
    url: '#',
    icon: Inbox,
  },
  {
    title: 'Today',
    url: '#',
    icon: Calendar,
  },
  {
    title: 'Upcomming',
    url: '#',
    icon: BookUp,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <NavUser user={userData} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className='group-data-[collapsible=icon]:hidden' />
        <SidebarMenu>
          <SidebarMenuItem className='ml-3 pb-3'>
            <div className='flex items-center pl-1.4 gap-2'>
              <CirclePlus fill='red' color='white' size={28} />
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
