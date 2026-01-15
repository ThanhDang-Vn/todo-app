import { getSession } from '@/lib/session';
import { SidebarClient } from './sidebarClient';

export async function AppSidebar() {
  const session = await getSession();
  const userData = {
    name: session?.user.name,
    email: session?.user.email,
    avatar: '/avatars/shadcn.jpg',
    token: session?.accessToken,
  };

  return <SidebarClient user={userData} />;
}
