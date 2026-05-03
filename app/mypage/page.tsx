import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { CalendarDays, User, Heart } from 'lucide-react';
import type { Subscription, VisitReport, Profile } from '@/types';

const MOOD = {
  good: { bg: 'bg-[#E8F4EC]', text: 'text-[#2D6A4F]', label: '좋음' },
  fair: { bg: 'bg-[#FFF8E1]', text: 'text-[#8A6914]', label: '보통' },
  concern: { bg: 'bg-[#FDE8E8]', text: 'text-[#842029]', label: '관심필요' },
} as const;

function shortDate(d: string) {
  const dt = new Date(d + 'T00:00:00');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${dt.getMonth() + 1}월 ${dt.getDate()}일 (${days[dt.getDay()]})`;
}

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

export default async function MypagePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = createAdminClient();

  const { data: subRaw } = await admin
    .from('subscriptions')
    .select('*, manager:manager_id(id, name, phone)')
    .eq('beneficiary_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const sub = subRaw as (Subscription & { manager: Profile | null }) | null;

  let reports: VisitReport[] = [];
  if (user?.id) {
    const { data } = await admin
      .from('visit_reports')
      .select('*')
      .eq('beneficiary_id', user.id)
      .order('visit_date', { ascending: false })
      .limit(5);
    reports = (data ?? []) as any;
  }

  const latest = reports[0] ?? null;

  return (
    <div className="max-w-2xl mx-auto px-6 md:px-10 py-14">
      {/* Title */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 mb-5" style={{ ...border, borderRadius: '50%' }}>
          <Heart size={20} strokeWidth={1.2} className="text-primary" />
        </div>
        <p className="font-en text-[11px] tracking-[0.2em] uppercase text-mute mb-2">My Page</p>
        <h1 className="font-serif-ko font-black text-ink text-[28px]">안녕하세요</h1>
        <p className="text-[14px] text-mute mt-2">곁에 서비스를 이용해 주셔서 감사합니다.</p>
      </div>

      {/* Next Visit */}
      <div className="bg-paper p-8 mb-4 text-center" style={border}>
        <div className="flex items-center justify-center gap-2 mb-5">
          <CalendarDays size={15} strokeWidth={1.4} className="text-mute" />
          <p className="text-[11px] tracking-[0.15em] uppercase text-mute">다음 방문 예정일</p>
        </div>
        {sub?.next_visit_date ? (
          <>
            <p className="font-serif-ko font-black text-ink text-[32px] md:text-[38px] mb-2">
              {shortDate(sub.next_visit_date)}
            </p>
            {sub.manager && (
              <p className="text-[14px] text-mute">{sub.manager.name} 매니저가 방문할 예정이에요</p>
            )}
          </>
        ) : (
          <p className="font-serif-ko text-[18px] text-mute">방문 일정이 곧 확정됩니다</p>
        )}
      </div>

      {/* Manager */}
      {sub?.manager && (
        <div className="bg-paper p-6 mb-4" style={border}>
          <div className="flex items-center gap-2 mb-5">
            <User size={14} strokeWidth={1.4} className="text-mute" />
            <p className="text-[11px] tracking-[0.15em] uppercase text-mute">담당 매니저</p>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 bg-surface flex items-center justify-center shrink-0"
              style={border}
            >
              <User size={20} strokeWidth={1} className="text-mute" />
            </div>
            <div>
              <p className="font-serif-ko text-[18px] text-ink mb-0.5">{sub.manager.name}</p>
              {sub.manager.phone && (
                <p className="text-[13px] text-mute">{sub.manager.phone}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Latest report */}
      {latest && (
        <div className="bg-paper p-6" style={border}>
          <p className="text-[11px] tracking-[0.15em] uppercase text-mute mb-4">최근 방문 내용</p>
          <div className="flex items-center gap-3 mb-4">
            <p className="text-[13px] text-mute">{shortDate(latest.visit_date)}</p>
            {(() => {
              const m = MOOD[latest.mood as keyof typeof MOOD] ?? MOOD.good;
              return (
                <span className={`${m.bg} ${m.text} text-[11px] px-2.5 py-0.5`}>{m.label}</span>
              );
            })()}
          </div>
          <p className="text-[14px] text-ink leading-[1.9]" style={{ wordBreak: 'keep-all' }}>
            {latest.summary}
          </p>
        </div>
      )}

      {!sub && (
        <div className="bg-paper p-10 text-center" style={border}>
          <p className="text-[14px] text-mute leading-[1.9]" style={{ wordBreak: 'keep-all' }}>
            서비스 연결 준비 중입니다.<br />곧 담당 매니저가 배정될 예정이에요.
          </p>
        </div>
      )}
    </div>
  );
}
