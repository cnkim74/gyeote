import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Wordmark } from '@/components/Wordmark';
import { LogoutButton } from '@/components/LogoutButton';
import { Avatar } from '@/components/Avatar';
import type { Profile } from '@/types';

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'manager') redirect('/');

  const p = profile as Profile;

  return (
    <div className="min-h-screen bg-surface">
      <header
        className="print:hidden fixed top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-sm h-16 flex items-center px-6 md:px-10 justify-between"
        style={{ borderBottom: '0.5px solid rgba(42,40,35,0.18)' }}
      >
        <div className="flex items-center gap-6">
          <Link href="/manager">
            <Wordmark size={24} />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/manager" className="text-[13px] text-ink/70 hover:text-ink transition-colors">대시보드</Link>
            <Link href="/manager/members" className="text-[13px] text-ink/70 hover:text-ink transition-colors">어르신 등록</Link>
            <Link href="/manager/report/new" className="text-[13px] text-ink/70 hover:text-ink transition-colors">보고서 작성</Link>
            <Link href="/manager/reports" className="text-[13px] text-ink/70 hover:text-ink transition-colors">보고서 내역</Link>
            <Link href="/manager/feedback" className="text-[13px] text-ink/70 hover:text-ink transition-colors">내 피드백</Link>
            <Link href="/manager/settings" className="text-[13px] text-ink/70 hover:text-ink transition-colors">프로필 설정</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/manager/settings" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Avatar src={(p as any).avatar_url} name={p.name} size={32} />
            {!((p as any).avatar_url) && (
              <span className="text-[11px] text-amber-600 hidden md:inline">사진 등록 필요</span>
            )}
          </Link>
          <LogoutButton />
        </div>
      </header>
      <div className="pt-16">{children}</div>
    </div>
  );
}
