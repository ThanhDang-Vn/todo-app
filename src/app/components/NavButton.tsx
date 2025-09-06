import { LucideIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';

type Props = {
  icon: LucideIcon;
  label: string;
  href?: string;
  variant: 'ghost' | 'outline' | 'default';
};

export function NavButton({ icon: Icon, label, href, variant }: Props) {
  return (
    <Button variant={variant} size='icon' aria-label={label} title={label} asChild>
      {href ? (
        <Link href={href}>
          <Icon />
        </Link>
      ) : (
        <Icon />
      )}
    </Button>
  );
}
 