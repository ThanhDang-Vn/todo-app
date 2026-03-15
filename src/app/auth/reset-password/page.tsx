import ResetPasswordForm from '@/app/components/auth/reset-password-form';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
