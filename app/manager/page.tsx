import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { CalendarDays, Users, PenLine, CheckCircle } from 'lucide-react';
import type { Subscription, VisitReport, Profile } from '@/types';
import { KakaoMap } from '@/components/KakaoMap';
import { VisitCalendar } from '@/components/VisitCalendar';
import { VisitStickers } from '@/components/VisitStickers';
import type { CalendarVisit } from '@/components/VisitCalendar';
import type { VisitStickerItem } from '@/components/VisitStickers';

const MOOD = {
  good: { bg: 'bg-[#E8F4EC]', text: 'text-[#2D6A4F]', label: '좋음' },
  fair: { bg: 'bg-[#FFF8E1]', text: 'text-[#8A6914]', label: '보통' },
  concern: { bg: 'bg-[#FDE8E8]', text: 'text-[#842029]', label: '관심필요' },
} as const;

function shortDate(d: string) {
  const dt = new Date(d + 'T00:00:00');
  return `${dt.getMonth() + 1}월 ${dt.getDate()}일`;
}

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

export default async function ManagerPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = createAdminClient();

  const { data: subs } = await admin
    .from('subscriptions')
    .select('*, beneficiary:beneficiary_id(id, name, phone)')
    .eq('manager_id', user!.id)
    .eq('status', 'active');

  const clients = (subs ?? []) as (Subscription & { beneficiary: Profile | null })[];

  // All reports for this manager (no limit — for calendar and stickers)
  const { data: reportsRaw } = await admin
    .from('visit_reports')
    .select('*, beneficiary:beneficiary_id(id, name)')
    .eq('manager_id', user!.id)
    .order('visit_date', { ascending: false });

  const reports = (reportsRaw ?? []) as (VisitReport & { beneficiary: { name: string | null } | null })[];

  const thisMonth = new Date().getMonth();
  const monthlyCount = reports.filter(r => new Date(r.visit_date).getMonth() === thisMonth).length;

  const recentReports = reports.slice(0, 8);

  const calendarVisits: CalendarVisit[] = reports.map(r => ({
    id: r.id,
    visit_date: r.visit_date,
    mood: r.mood as 'good' | 'fair' | 'concern',
    status: r.status as 'pending' | 'approved' | 'rejected',
    summary: r.summary,
    beneficiary_name: (r.beneficiary as any)?.name ?? null,
  }));

  const stickerVisits: VisitStickerItem[] = reports.map(r => ({
    id: r.id,
    visit_date: r.visit_date,
    mood: r.mood as 'good' | 'fair' | 'concern',
    status: r.status as 'pending' | 'approved' | 'rejected',
  }));

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-10">
      {/* Title + Write button */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="font-en text-[11px] tracking-[0.2em] uppercase text-mute mb-2">Manager</p>
          <h1 className="font-serif-ko font-black text-ink text-[30px] md:text-[34px]">매니저 대시보드</h1>
        </div>
        <Link
          href="/manager/report/new"
          className="flex items-center gap-2 bg-primary text-surface px-5 py-2.5 text-[13.5px] hover:bg-primary-deep transition-colors mt-1"
        >
          <PenLine size={14} strokeWidth={1.4} />
          보고서 작성
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-paper p-5" style={border}>
          <div className="flex items-center gap-2 mb-3">
            <Users size={13} strokeWidth={1.4} className="text-mute" />
            <p className="text-[10.5px] tracking-[0.15em] uppercase text-mute">담당 어르신</p>
          </div>
          <p className="font-serif-ko font-black text-[36px] text-ink leading-none">
            {clients.length}
          </p>
          <p className="text-[12px] text-mute mt-1">명</p>
        </div>
        <div className="bg-paper p-5" style={border}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={13} strokeWidth={1.4} className="text-mute" />
            <p className="text-[10.5px] tracking-[0.15em] uppercase text-mute">이번 달 방문</p>
          </div>
          <p className="font-serif-ko font-black text-[36px] text-ink leading-none">
            {monthlyCount}
          </p>
          <p className="text-[12px] text-mute mt-1">회</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">

        {/* Client list */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] tracking-[0.15em] uppercase text-mute mb-3">담당 어르신 목록</p>
          {clients.length === 0 ? (
            <div className="bg-paper p-10 text-center" style={border}>
              <p className="text-[13px] text-mute">아직 배정된 어르신이 없습니다</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {clients.map(c => (
                <div key={c.id} className="flex flex-col gap-2">
                  <div className="bg-paper px-5 py-4 flex items-center gap-4" style={border}>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif-ko text-[15px] text-ink">{c.beneficiary?.name ?? '이름 없음'}</p>
                      {c.beneficiary?.phone && (
                        <p className="text-[12px] text-mute mt-0.5">{c.beneficiary.phone}</p>
                      )}
                    </div>
                    {c.next_visit_date && (
                      <div className="text-right shrink-0">
                        <p className="text-[10.5px] text-mute mb-0.5">다음 방문</p>
                        <div className="flex items-center gap-1.5">
                          <CalendarDays size={12} strokeWidth={1.4} className="text-mute" />
                          <p className="text-[13px] text-ink">{shortDate(c.next_visit_date)}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Per-client stickers */}
                  {(() => {
                    const clientVisits = stickerVisits.filter(v => {
                      const cr = reports.find(r => r.id === v.id);
                      return (cr?.beneficiary as any)?.name === c.beneficiary?.name;
                    });
                    return clientVisits.length > 0 ? (
                      <div className="bg-paper px-5 py-4" style={border}>
                        <VisitStickers visits={clientVisits} title={`${c.beneficiary?.name ?? ''} 누적 방문`} />
                      </div>
                    ) : null;
                  })()}

                  <KakaoMap
                    name={c.beneficiary?.name ?? null}
                    address={(c.beneficiary as any)?.address ?? null}
                    addressDetail={(c.beneficiary as any)?.address_detail ?? null}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent reports + Calendar */}
        <div className="md:w-64 shrink-0 w-full flex flex-col gap-5">
          <div>
            <p className="text-[11px] tracking-[0.15em] uppercase text-mute mb-3">최근 방문 기록</p>
            {recentReports.length === 0 ? (
              <div className="bg-paper p-8 text-center" style={border}>
                <p className="text-[13px] text-mute">작성한 보고서가 없습니다</p>
                <Link
                  href="/manager/report/new"
                  className="inline-block mt-3 text-[13px] text-primary ulink"
                >
                  첫 보고서 작성하기
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {recentReports.map(r => {
                  const m = MOOD[r.mood as keyof typeof MOOD] ?? MOOD.good;
                  return (
                    <div key={r.id} className="bg-paper px-4 py-3.5" style={border}>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[12px] text-mute">{shortDate(r.visit_date)}</p>
                        <span className={`${m.bg} ${m.text} text-[10.5px] px-2 py-0.5`}>{m.label}</span>
                      </div>
                      <p className="text-[12px] text-ink/80 mb-1">{(r.beneficiary as any)?.name}</p>
                      <p className="text-[12px] text-mute line-clamp-2 leading-[1.6]">{r.summary}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* My visit calendar */}
          <div className="bg-paper p-4" style={border}>
            <VisitCalendar visits={calendarVisits} showBeneficiaryName />
          </div>
        </div>
      </div>
    </div>
  );
}
