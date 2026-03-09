import UpcomingClient from '@/app/components/feature/upcoming';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function TodayPage() {
  const session = await getSession();
  if (!session || !session.user) {
    redirect('/auth/login');
  }
  return <UpcomingClient />;
}
