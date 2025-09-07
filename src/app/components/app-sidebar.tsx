import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from '@/app/components/ui/sidebar';
import { Bell } from 'lucide-react';
import { NavButton } from '@/app/components/NavButton';
import Link from 'next/link';

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-center'></div>

          <div className='flex items-center justify-center'>
            <NavButton href='' label='notify' icon={Bell} variant='ghost' />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
