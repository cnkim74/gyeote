import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { CalendarDays, User, CreditCard, Clock, Star } from 'lucide-react';
import Link from 'next/link';
import type { Subscription, VisitReport, Profile } from '@/types';
import { PLAN_LABELS, STATUS_LABELS } from '@/types';
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

const REPORT_STATUS = {
  pending:  { bg: 'bg-amber-50',  text: 'text-amber-700',  label: '승인 대기중' },
  approved: { bg: 'bg-[#E8F4EC]', text: 'text-[#2D6A4F]',  label: '승인됨' },
  rejected: { bg: 'bg-[#FDE8E8]', text: 'text-[#842029]',  label: '반려됨' },
} as const;

function korDate(d: string) {
  const dt = new Date(d + 'T00:00:00');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${dt.getFullYear()}년 ${dt.getMonth() + 1}월 ${dt.getDate()}일 (${days[dt.getDay()]})`;
}

function shortDate(d: string) {
  const dt = new Date(d + 'T00:00:00');
  return `${dt.getMonth() + 1}월 ${dt.getDate()}일`;
}

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = createAdminClient();

  const { data: subRaw } = await admin
    .from('subscriptions')
    .select('*, beneficiary:beneficiary_id(id, name, phone), manager:manager_id(id, name, phone)')
    .eq('payer_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const sub = subRaw as (Subscription & { beneficiary: Profile | null; manager: Profile | null }) | null;

  let reports: (VisitReport & { manager: { name: string | null } | null })[] = [];
  if (sub?.beneficiary_id) {
    const { data } = await admin
      .from('visit_reports')
      .select('*, manager:manager_id(id, name)')
      .eq('beneficiary_id', sub.beneficiary_id)
      .order('visit_date', { ascending: false });
    reports = (data ?? []) as any;
  }

  const latest = reports[0] ?? null;
  const prev = reports.slice(1, 10);

  const calendarVisits: CalendarVisit[] = reports.map(r => ({
    id: r.id,
    visit_date: r.visit_date,
    mood: r.mood as 'good' | 'fair' | 'concern',
    status: r.status as 'pending' | 'approved' | 'rejected',
    summary: r.summary,
    manager_name: (r.manager as any)?.name ?? null,
  }));

  const stickerVisits: VisitStickerItem[] = reports.map(r => ({
    id: r.id,
    visit_date: r.visit_date,
    mood: r.mood as 'good' | 'fair' | 'concern',
    status: r.status as 'pending' | 'approved' | 'rejected',
  }));

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
      {/* Title */}
      <div className="mb-10">
        <p className="font-en text-[14px] tracking-[0.22em] uppercase text-mute mb-2">Dashboard</p>
        <h1 className="font-serif-ko font-black text-ink text-[30px] md:text-[36px] leading-[1.15]">
          {sub?.beneficiary?.name ?? '부모님'} 어르신 안부
        </h1>
      </div>

      {!sub ? (
        <div className="bg-paper p-14 text-center" style={border}>
          <p className="font-serif-ko text-[20px] text-ink mb-3">아직 구독이 시작되지 않았습니다</p>
          <p className="text-[14px] text-mute leading-[1.8] mb-8" style={{ wordBreak: 'keep-all' }}>
            곁에 팀이 부모님과 매니저를 연결해드리면<br />여기서 방문 보고서를 확인하실 수 있어요.
          </p>
          <a
            href="/#cta"
            className="inline-block bg-primary text-surface px-7 py-3.5 text-[14px] hover:bg-primary-deep transition-colors"
          >
            서비스 신청하기
          </a>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Left: Reports + Calendar ── */}
          <div className="flex-1 min-w-0">

            {latest ? (
              <div className="bg-paper mb-5" style={border}>
                {/* Card header */}
                <div
                  className="px-6 py-4 flex items-start justify-between gap-4"
                  style={{ borderBottom: '0.5px solid rgba(42,40,35,0.12)' }}
                >
                  <div>
                    <p className="font-en text-[10px] tracking-[0.2em] uppercase text-mute mb-1.5">
                      Latest Visit Report
                    </p>
                    <p className="font-serif-ko text-[15px] text-ink">
                      {korDate(latest.visit_date)}
                      {latest.visit_time && (
                        <span className="text-mute text-[13px] ml-2">
                          {latest.visit_time.slice(0,5)}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                    {(() => {
                      const s = REPORT_STATUS[latest.status as keyof typeof REPORT_STATUS] ?? REPORT_STATUS.pending;
                      return <span className={`${s.bg} ${s.text} text-[11px] px-2.5 py-0.5`}>{s.label}</span>;
                    })()}
                    <span className="text-[12.5px] text-mute">{latest.manager?.name ?? ''} 매니저</span>
                    {(() => {
                      const m = MOOD[latest.mood as keyof typeof MOOD] ?? MOOD.good;
                      return (
                        <span className={`${m.bg} ${m.text} text-[11.5px] font-medium px-3 py-1`}>
                          {m.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                {/* Body */}
                <div className="px-6 py-7">
                  <p
                    className="text-[15px] text-ink leading-[2.0]"
                    style={{ wordBreak: 'keep-all' }}
                  >
                    {latest.summary}
                  </p>

                  {latest.photos?.length > 0 && (
                    <div className="mt-6 flex gap-2 flex-wrap">
                      {latest.photos.map((url, i) => (
                        <div
                          key={i}
                          className="relative w-28 h-28 overflow-hidden bg-surface"
                          style={border}
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-paper p-12 text-center mb-5" style={border}>
                <Clock size={32} strokeWidth={1} className="mx-auto text-mute mb-4" />
                <p className="font-serif-ko text-[17px] text-ink mb-2">아직 방문 보고서가 없습니다</p>
                <p className="text-[13px] text-mute">
                  {sub.next_visit_date
                    ? `${shortDate(sub.next_visit_date)}에 첫 방문이 예정되어 있어요.`
                    : '첫 방문 일정이 곧 확정됩니다.'}
                </p>
              </div>
            )}

            {/* Previous reports */}
            {prev.length > 0 && (
              <div className="mb-6">
                <p className="text-[11px] tracking-[0.15em] uppercase text-mute mb-3">이전 방문 기록</p>
                <div className="flex flex-col gap-2">
                  {prev.map(r => {
                    const m = MOOD[r.mood as keyof typeof MOOD] ?? MOOD.good;
                    return (
                      <div
                        key={r.id}
                        className="bg-paper px-5 py-4 flex items-center gap-4"
                        style={border}
                      >
                        <p className="font-en text-[12px] text-mute w-14 shrink-0">
                          {shortDate(r.visit_date)}
                        </p>
                        <p className="flex-1 text-[13px] text-ink line-clamp-1 leading-[1.7]">
                          {r.summary}
                        </p>
                        <span className={`shrink-0 ${m.bg} ${m.text} text-[11px] px-2.5 py-0.5`}>
                          {m.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Calendar */}
            <div className="bg-paper p-6" style={border}>
              <VisitCalendar visits={calendarVisits} showManagerName />
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="lg:w-60 flex flex-col gap-4 shrink-0 w-full">

            {/* Stickers */}
            {stickerVisits.length > 0 && (
              <div className="bg-paper p-5" style={border}>
                <VisitStickers visits={stickerVisits} />
              </div>
            )}

            {/* Subscription */}
            <div className="bg-paper p-5" style={border}>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={13} strokeWidth={1.4} className="text-mute" />
                <p className="text-[10.5px] tracking-[0.15em] uppercase text-mute">구독 현황</p>
              </div>
              <p className="font-serif-ko text-[18px] text-ink mb-2">
                {PLAN_LABELS[sub.plan] ?? sub.plan} 플랜
              </p>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className="text-[13px] text-mute">
                  {STATUS_LABELS[sub.status] ?? sub.status}
                </span>
              </div>
              {sub.next_billing_date && (
                <p className="text-[12px] text-mute pt-3" style={{ borderTop: '0.5px solid rgba(42,40,35,0.12)' }}>
                  다음 결제일 · {shortDate(sub.next_billing_date)}
                </p>
              )}
            </div>

            {/* Next visit */}
            <div className="bg-paper p-5" style={border}>
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays size={13} strokeWidth={1.4} className="text-mute" />
                <p className="text-[10.5px] tracking-[0.15em] uppercase text-mute">다음 방문 예정</p>
              </div>
              {sub.next_visit_date ? (
                <>
                  <p className="font-serif-ko text-[20px] text-ink mb-1">
                    {shortDate(sub.next_visit_date)}
                  </p>
                  {sub.manager && (
                    <p className="text-[13px] text-mute">{sub.manager.name} 매니저</p>
                  )}
                </>
              ) : (
                <p className="text-[13px] text-mute">일정 조율 중입니다</p>
              )}
            </div>

            {/* Parent info */}
            {sub.beneficiary && (
              <div className="bg-paper p-5" style={border}>
                <div className="flex items-center gap-2 mb-4">
                  <User size={13} strokeWidth={1.4} className="text-mute" />
                  <p className="text-[10.5px] tracking-[0.15em] uppercase text-mute">부모님 정보</p>
                </div>
                <p className="font-serif-ko text-[18px] text-ink mb-1">{sub.beneficiary.name}</p>
                {sub.beneficiary.phone && (
                  <p className="text-[13px] text-mute">{sub.beneficiary.phone}</p>
                )}
              </div>
            )}

            {/* Manager info + feedback */}
            {sub.manager && (
              <div className="bg-paper p-5" style={border}>
                <div className="flex items-center gap-2 mb-4">
                  <User size={13} strokeWidth={1.4} className="text-mute" />
                  <p className="text-[10.5px] tracking-[0.15em] uppercase text-mute">담당 매니저</p>
                </div>
                <p className="font-serif-ko text-[18px] text-ink mb-1">{sub.manager.name}</p>
                {sub.manager.phone && (
                  <p className="text-[13px] text-mute mb-4">{sub.manager.phone}</p>
                )}
                <Link
                  href={`/feedback/${sub.manager.id}`}
                  className="flex items-center gap-1.5 text-[12.5px] text-primary hover:text-primary-deep transition-colors"
                >
                  <Star size={12} strokeWidth={1.5} />
                  매니저 피드백 남기기
                </Link>
              </div>
            )}

            {/* Map */}
            {sub.beneficiary && (
              <KakaoMap
                name={sub.beneficiary.name}
                address={(sub.beneficiary as any).address ?? null}
                addressDetail={(sub.beneficiary as any).address_detail ?? null}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
