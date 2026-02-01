import { Header } from '@/app/components/Header';
import { AppSidebar } from '@/app/components/app-sidebar';
import { Separator } from '@/app/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/app/components/ui/sidebar';
import { RefreshProvider } from '../context/refresh.context';
import { ColumnProvider } from '../context/column.context';

export default async function RSLayout({ children }: { children: React.ReactNode }) {
  return (
    <RefreshProvider>
      <ColumnProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className='flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
              <div className='flex items-center gap-2 px-10 pt-0'>
                <SidebarTrigger className='-ml-1 mt-0 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-gray-300' />
                <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
              </div>
            </header>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </ColumnProvider>
    </RefreshProvider>
  );
}
