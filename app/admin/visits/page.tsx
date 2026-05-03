import { createAdminClient } from '@/lib/supabase/admin';
import { VisitCalendar } from '@/components/VisitCalendar';
import { VisitStickers } from '@/components/VisitStickers';
import type { CalendarVisit } from '@/components/VisitCalendar';
import type { VisitStickerItem } from '@/components/VisitStickers';

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

export default async function AdminVisitsPage() {
  const admin = createAdminClient();

  const { data: reportsRaw } = await admin
    .from('visit_reports')
    .select('*, manager:manager_id(id, name), beneficiary:beneficiary_id(id, name)')
    .order('visit_date', { ascending: false });

  const reports = (reportsRaw ?? []) as any[];

  const calendarVisits: CalendarVisit[] = reports.map(r => ({
    id: r.id,
    visit_date: r.visit_date,
    mood: r.mood as 'good' | 'fair' | 'concern',
    status: r.status as 'pending' | 'approved' | 'rejected',
    summary: r.summary,
    manager_name: r.manager?.name ?? null,
    beneficiary_name: r.beneficiary?.name ?? null,
  }));

  // Group stickers per beneficiary
  const beneficiaryMap: Record<string, { name: string; visits: VisitStickerItem[] }> = {};
  reports.forEach(r => {
    const bid = r.beneficiary?.id;
    if (!bid) return;
    if (!beneficiaryMap[bid]) {
      beneficiaryMap[bid] = { name: r.beneficiary?.name ?? '이름 없음', visits: [] };
    }
    beneficiaryMap[bid].visits.push({
      id: r.id,
      visit_date: r.visit_date,
      mood: r.mood as 'good' | 'fair' | 'concern',
      status: r.status as 'pending' | 'approved' | 'rejected',
    });
  });

  const beneficiaries = Object.entries(beneficiaryMap);

  // Summary stats
  const totalApproved = reports.filter(r => r.status === 'approved').length;
  const totalPending  = reports.filter(r => r.status === 'pending').length;
  const thisMonth = new Date().getMonth();
  const thisMonthCount = reports.filter(r => new Date(r.visit_date).getMonth() === thisMonth).length;

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
      {/* Title */}
      <div className="mb-8">
        <p className="font-en text-[11px] tracking-[0.2em] uppercase text-mute mb-2">Admin</p>
        <h1 className="font-serif-ko font-black text-ink text-[28px] md:text-[32px]">방문 현황</h1>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: '이번 달 방문', value: thisMonthCount, unit: '회' },
          { label: '승인 완료', value: totalApproved, unit: '건' },
          { label: '승인 대기', value: totalPending, unit: '건' },
        ].map(s => (
          <div key={s.label} className="bg-paper p-5" style={border}>
            <p className="text-[10.5px] tracking-[0.15em] uppercase text-mute mb-3">{s.label}</p>
            <p className="font-serif-ko font-black text-[32px] text-ink leading-none">
              {s.value}
              <span className="text-[12px] font-normal text-mute ml-1">{s.unit}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Calendar (all visits) */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] tracking-[0.15em] uppercase text-mute mb-3">전체 방문 캘린더</p>
          {calendarVisits.length === 0 ? (
            <div className="bg-paper p-12 text-center" style={border}>
              <p className="text-[13px] text-mute">등록된 방문 기록이 없습니다</p>
            </div>
          ) : (
            <div className="bg-paper p-6" style={border}>
              <VisitCalendar visits={calendarVisits} showManagerName showBeneficiaryName />
            </div>
          )}
        </div>

        {/* Per-beneficiary stickers */}
        <div className="lg:w-72 shrink-0 w-full">
          <p className="text-[11px] tracking-[0.15em] uppercase text-mute mb-3">어르신별 누적 방문</p>
          {beneficiaries.length === 0 ? (
            <div className="bg-paper p-8 text-center" style={border}>
              <p className="text-[13px] text-mute">등록된 어르신이 없습니다</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {beneficiaries.map(([bid, data]) => (
                <div key={bid} className="bg-paper p-5" style={border}>
                  <p className="font-serif-ko text-[15px] text-ink mb-4">{data.name}</p>
                  <VisitStickers visits={data.visits} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
