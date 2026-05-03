import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, Calendar, Clock } from 'lucide-react';

type Status = 'all' | 'pending' | 'approved' | 'rejected';

const MOOD = {
  good:    { bg: 'bg-[#E8F4EC]', text: 'text-[#2D6A4F]', label: '좋음' },
  fair:    { bg: 'bg-[#FFF8E1]', text: 'text-[#8A6914]', label: '보통' },
  concern: { bg: 'bg-[#FDE8E8]', text: 'text-[#842029]', label: '관심필요' },
} as const;

const STATUS_UI = {
  pending:  { bg: 'bg-amber-50',  text: 'text-amber-700',  label: '대기' },
  approved: { bg: 'bg-[#E8F4EC]', text: 'text-[#2D6A4F]',  label: '승인' },
  rejected: { bg: 'bg-[#FDE8E8]', text: 'text-[#842029]',  label: '반려' },
} as const;

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

function formatDate(d: string) {
  const dt = new Date(d + 'T00:00:00');
  const days = ['일','월','화','수','목','금','토'];
  return `${dt.getMonth()+1}월 ${dt.getDate()}일 (${days[dt.getDay()]})`;
}

const TABS: { key: Status; label: string }[] = [
  { key: 'all',      label: '전체' },
  { key: 'pending',  label: '승인 대기' },
  { key: 'approved', label: '승인 완료' },
  { key: 'rejected', label: '반려됨' },
];

export default async function ManagerReportsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const tab = (searchParams.status ?? 'all') as Status;
  const admin = createAdminClient();

  let query = admin
    .from('visit_reports')
    .select('*, beneficiary:beneficiary_id(id, name)')
    .eq('manager_id', user.id)
    .order('visit_date', { ascending: false });

  if (tab !== 'all') query = query.eq('status', tab);

  const { data: reports } = await query;
  const list = reports ?? [];

  const counts = {
    all: list.length,
  };

  return (
    <div className="max-w-2xl mx-auto px-6 md:px-10 py-10">
      <Link href="/manager" className="inline-flex items-center gap-1.5 text-[13px] text-mute hover:text-ink mb-8 transition-colors">
        <ArrowLeft size={14} strokeWidth={1.4} />
        대시보드로
      </Link>

      <div className="mb-8">
        <p className="font-en text-[11px] tracking-[0.2em] uppercase text-mute mb-2">Reports</p>
        <h1 className="font-serif-ko font-black text-ink text-[28px]">방문 보고서 내역</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-6" style={{ borderBottom: '0.5px solid rgba(42,40,35,0.18)' }}>
        {TABS.map(t => (
          <Link
            key={t.key}
            href={`/manager/reports${t.key === 'all' ? '' : `?status=${t.key}`}`}
            className={`px-5 py-2.5 text-[13px] transition-colors ${
              tab === t.key
                ? 'text-ink border-b-2 border-primary -mb-px font-medium'
                : 'text-mute hover:text-ink'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="bg-paper p-12 text-center" style={border}>
          <Clock size={28} strokeWidth={1} className="mx-auto text-mute mb-3" />
          <p className="text-[14px] text-mute">보고서가 없습니다</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((r: any) => {
            const mood = MOOD[r.mood as keyof typeof MOOD] ?? MOOD.good;
            const st = STATUS_UI[r.status as keyof typeof STATUS_UI] ?? STATUS_UI.pending;
            const photoCount = r.photos?.length ?? 0;
            return (
              <Link
                key={r.id}
                href={`/manager/report/${r.id}`}
                className="bg-paper px-5 py-4 hover:bg-primary/5 transition-colors block"
                style={border}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-2">
                      <span className={`${st.bg} ${st.text} text-[11px] font-medium px-2.5 py-0.5`}>
                        {st.label}
                      </span>
                      <span className={`${mood.bg} ${mood.text} text-[11px] px-2.5 py-0.5`}>
                        {mood.label}
                      </span>
                      {photoCount > 0 && (
                        <span className="bg-surface text-mute text-[11px] px-2.5 py-0.5" style={border}>
                          사진 {photoCount}장
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] text-ink mb-1.5">
                      <Calendar size={12} strokeWidth={1.4} className="text-mute" />
                      {formatDate(r.visit_date)}
                    </div>
                    <p className="text-[12px] text-ink/70 font-medium">{r.beneficiary?.name}</p>
                    <p className="text-[12px] text-mute mt-1 line-clamp-2 leading-[1.6]">{r.summary}</p>
                  </div>
                  <FileText size={15} strokeWidth={1.3} className="text-mute shrink-0 mt-1" />
                </div>
                {r.status === 'rejected' && r.rejection_reason && (
                  <div className="mt-3 px-3 py-2 bg-[#FDE8E8]">
                    <p className="text-[11px] text-[#842029]">반려 사유: {r.rejection_reason}</p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
