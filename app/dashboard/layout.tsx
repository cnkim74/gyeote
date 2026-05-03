import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Wordmark } from '@/components/Wordmark';
import { LogoutButton } from '@/components/LogoutButton';
import type { Profile } from '@/types';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'paying') redirect('/');

  const p = profile as Profile;

  return (
    <div className="min-h-screen bg-surface">
      <header
        className="fixed top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-sm h-16 flex items-center px-6 md:px-10 justify-between"
        style={{ borderBottom: '0.5px solid rgba(42,40,35,0.18)' }}
      >
        <Link href="/dashboard">
          <Wordmark size={24} />
        </Link>
        <div className="flex items-center gap-5">
          <span className="text-[13px] text-ink/70">{p.name ?? p.email}님</span>
          <LogoutButton />
        </div>
      </header>
      <div className="pt-16">{children}</div>
    </div>
  );
}
