// file: src/app/inbox/page.tsx
import InboxClient from '@/app/components/inbox';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function InboxPage() {
  const session = await getSession();
  if (!session || !session.user) {
    redirect('/auth/login');
  }

  return <InboxClient />;
}
