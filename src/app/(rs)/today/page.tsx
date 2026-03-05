import InboxClient from '@/app/components/inbox';
import TodayClient from '@/app/components/today';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function TodayPage() {
  const session = await getSession();
  if (!session || !session.user) {
    redirect('/auth/login');
  }
  return <TodayClient />;
}
