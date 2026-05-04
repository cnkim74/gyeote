import { createAdminClient } from '@/lib/supabase/admin';
import { CalendarDays, Phone, User, MessageSquare, Gift } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

const OPTION_LABELS: Record<string, string> = {
  flowers: '생화 꽃다발',
  cake: '생일 케이크',
  grocery: '장보기 대행',
  local: '지역 특산품',
  photo: '기념 사진 촬영',
};

const STATUS_KO: Record<string, string> = {
  pending: '접수 대기',
  confirmed: '확정',
  done: '완료',
  cancelled: '취소',
};

export default async function SpecialRequestsPage() {
  const supabase = createAdminClient();
  const { data: requests } = await supabase
    .from('special_requests')
    .select('*')
    .order('created_at', { ascending: false });

  const counts = {
    total: requests?.length ?? 0,
    pending: requests?.filter(r => r.status === 'pending').length ?? 0,
    confirmed: requests?.filter(r => r.status === 'confirmed').length ?? 0,
    done: requests?.filter(r => r.status === 'done').length ?? 0,
  };

  return (
    <div className="p-8 md:p-10 max-w-4xl">
      <h1 className="font-serif-ko font-black text-ink text-[28px] mb-2">특별 방문 신청</h1>
      <p className="text-[13px] text-mute mb-8">특별한 날 1회 서비스 신청 내역</p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-10">
        {[
          { label: '전체', value: counts.total, color: 'text-ink' },
          { label: '접수 대기', value: counts.pending, color: 'text-accent' },
          { label: '확정', value: counts.confirmed, color: 'text-primary' },
          { label: '완료', value: counts.done, color: 'text-mute' },
        ].map(s => (
          <div key={s.label} className="bg-paper p-5" style={{ border: '0.5px solid rgba(42,40,35,0.18)' }}>
            <p className="text-[10.5px] tracking-[0.18em] uppercase text-mute mb-2">{s.label}</p>
            <p className={`font-serif-ko font-black text-[32px] ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {!requests?.length ? (
        <p className="text-[14px] text-mute py-16 text-center">아직 신청 내역이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map(r => (
            <div
              key={r.id}
              className="bg-paper p-6"
              style={{ border: '0.5px solid rgba(42,40,35,0.18)' }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-[13px] text-ink font-medium">
                      <User size={13} strokeWidth={1.4} className="text-mute" />
                      {r.name}
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] text-mute">
                      <Phone size={13} strokeWidth={1.4} />
                      {r.phone}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] text-mute">
                    <CalendarDays size={13} strokeWidth={1.4} />
                    방문 희망일: <span className="text-ink">{r.visit_date}</span>
                    <span className="text-[11px] text-mute ml-2">
                      신청: {new Date(r.created_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
                <StatusBadge requestId={r.id} currentStatus={r.status} />
              </div>

              {r.options?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {r.options.map((opt: string) => (
                    <span
                      key={opt}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-accent bg-accent/8 border border-accent/20"
                    >
                      <Gift size={10} strokeWidth={1.4} />
                      {OPTION_LABELS[opt] ?? opt}
                    </span>
                  ))}
                </div>
              )}

              {r.message && (
                <div className="flex items-start gap-2 bg-surface px-3 py-2.5 mt-2">
                  <MessageSquare size={12} strokeWidth={1.4} className="text-mute mt-0.5 shrink-0" />
                  <p className="text-[12.5px] text-ink/80 leading-[1.65]">{r.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
