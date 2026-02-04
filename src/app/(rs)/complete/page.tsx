import CompleteClient from '@/app/components/complete';
import { useCardContext } from '@/app/context/card.context';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function CompletePage() {
  const session = await getSession();
  if (!session || !session.user) {
    redirect('/auth/login');
  }

  return <CompleteClient />;
}
