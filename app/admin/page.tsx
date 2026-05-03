import { createClient } from '@/lib/supabase/server';
import { ROLE_LABELS, type UserRole } from '@/types';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = createClient();

  const [{ data: profiles }, { data: images }] = await Promise.all([
    supabase.from('profiles').select('role'),
    supabase.from('hero_images').select('id, is_active'),
  ]);

  const roleCounts = (Object.keys(ROLE_LABELS) as UserRole[]).map(role => ({
    role,
    label: ROLE_LABELS[role],
    count: profiles?.filter(p => p.role === role).length ?? 0,
  }));

  const totalImages = images?.length ?? 0;
  const activeImages = images?.filter(i => i.is_active).length ?? 0;

  return (
    <div className="p-8 md:p-10 max-w-3xl">
      <h1 className="font-serif-ko font-black text-ink text-[28px] mb-10">대시보드</h1>

      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[11px] tracking-[0.22em] uppercase text-mute">회원 현황</h2>
          <Link href="/admin/users" className="text-[12px] text-primary hover:text-primary-deep ulink">
            전체 보기
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {roleCounts.map(({ role, label, count }) => (
            <Link
              key={role}
              href={`/admin/users?role=${role}`}
              className="bg-paper p-5 hover:bg-surface transition-colors"
              style={{ border: '0.5px solid rgba(42,40,35,0.18)' }}
            >
              <p className="text-[10.5px] tracking-[0.18em] uppercase text-mute mb-2">{label}</p>
              <p className="font-serif-ko font-black text-ink text-[32px]">{count}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[11px] tracking-[0.22em] uppercase text-mute">히어로 이미지</h2>
          <Link href="/admin/images" className="text-[12px] text-primary hover:text-primary-deep ulink">
            관리
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 max-w-[280px]">
          <div className="bg-paper p-5" style={{ border: '0.5px solid rgba(42,40,35,0.18)' }}>
            <p className="text-[10.5px] tracking-[0.18em] uppercase text-mute mb-2">전체</p>
            <p className="font-serif-ko font-black text-ink text-[32px]">{totalImages}</p>
          </div>
          <div className="bg-paper p-5" style={{ border: '0.5px solid rgba(42,40,35,0.18)' }}>
            <p className="text-[10.5px] tracking-[0.18em] uppercase text-mute mb-2">활성</p>
            <p className="font-serif-ko font-black text-primary text-[32px]">{activeImages}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
