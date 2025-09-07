import { Header } from '@/app/components/Header';
import { SidebarProvider, SidebarTrigger } from '@/app/components/ui/sidebar';
import { AppSidebar } from '@/app/components/app-sidebar';

export default async function RSLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <div className='w-full'>
        <Header />
        {children}
      </div>
    </SidebarProvider>
  );
}
