import { RegisterLink, LoginLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { Button } from '@/app/components/ui/button';

export default function Login() {
  return (
    <main className='pt-2 pl-2'>
      <Button asChild>
        <LoginLink>Sign in</LoginLink>
      </Button>
    </main>
  );
}
