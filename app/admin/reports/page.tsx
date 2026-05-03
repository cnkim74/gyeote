'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle, XCircle, Clock, User, Phone, MapPin, Calendar, FileText } from 'lucide-react';

type Status = 'pending' | 'approved' | 'rejected';

const MOOD = {
  good:    { bg: 'bg-[#E8F4EC]', text: 'text-[#2D6A4F]', label: '좋음' },
  fair:    { bg: 'bg-[#FFF8E1]', text: 'text-[#8A6914]', label: '보통' },
  concern: { bg: 'bg-[#FDE8E8]', text: 'text-[#842029]', label: '관심필요' },
} as const;

const STATUS_UI = {
  pending:  { bg: 'bg-amber-50',  text: 'text-amber-700',  label: '승인 대기' },
  approved: { bg: 'bg-[#E8F4EC]', text: 'text-[#2D6A4F]',  label: '승인됨' },
  rejected: { bg: 'bg-[#FDE8E8]', text: 'text-[#842029]',  label: '반려됨' },
} as const;

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

function formatDateTime(date: string, time: string | null) {
  const dt = new Date(date + 'T00:00:00');
  const days = ['일','월','화','수','목','금','토'];
  const d = `${dt.getMonth()+1}월 ${dt.getDate()}일 (${days[dt.getDay()]})`;
  if (!time) return d;
  const [h, m] = time.split(':');
  return `${d} ${h}:${m}`;
}

export default function ReportsPage() {
  const [tab, setTab] = useState<Status>('pending');
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('visit_reports')
      .select(`
        *,
        manager:manager_id(id, name, phone),
        beneficiary:beneficiary_id(id, name, phone, address, address_detail)
      `)
      .eq('status', tab)
      .order('created_at', { ascending: false });
    setReports(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [tab]);

  async function approve(id: string, subscriptionId: string | null) {
    setProcessing(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('visit_reports').update({
      status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: user?.id,
    }).eq('id', id);

    // 정산 레코드 생성
    if (subscriptionId) {
      await supabase.from('payments').insert({
        subscription_id: subscriptionId,
        visit_report_id: id,
        amount: 0,
        status: 'pending',
      });
    }

    setProcessing(false);
    load();
  }

  async function reject(id: string) {
    if (!rejectReason.trim()) return;
    setProcessing(true);
    const supabase = createClient();
    await supabase.from('visit_reports').update({
      status: 'rejected',
      rejection_reason: rejectReason.trim(),
    }).eq('id', id);
    setRejectId(null);
    setRejectReason('');
    setProcessing(false);
    load();
  }

  const TABS: { key: Status; label: string; count?: number }[] = [
    { key: 'pending',  label: '승인 대기' },
    { key: 'approved', label: '승인됨' },
    { key: 'rejected', label: '반려됨' },
  ];

  return (
    <div className="p-8 md:p-10 max-w-3xl">
      <h1 className="font-serif-ko font-black text-ink text-[28px] mb-2">방문 보고서 관리</h1>
      <p className="text-[13px] text-mute mb-8">매니저가 제출한 방문 보고서를 검토하고 승인하세요.</p>

      {/* Tabs */}
      <div className="flex gap-0 mb-6" style={{ borderBottom: '0.5px solid rgba(42,40,35,0.18)' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 text-[13px] transition-colors ${
              tab === t.key
                ? 'text-ink border-b-2 border-primary -mb-px font-medium'
                : 'text-mute hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-mute text-[14px]">불러오는 중...</p>
      ) : reports.length === 0 ? (
        <div className="bg-paper p-12 text-center" style={border}>
          <Clock size={28} strokeWidth={1} className="mx-auto text-mute mb-3" />
          <p className="text-[14px] text-mute">
            {tab === 'pending' ? '승인 대기 중인 보고서가 없습니다' :
             tab === 'approved' ? '승인된 보고서가 없습니다' : '반려된 보고서가 없습니다'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map(r => {
            const mood = MOOD[r.mood as keyof typeof MOOD] ?? MOOD.good;
            const st = STATUS_UI[r.status as keyof typeof STATUS_UI] ?? STATUS_UI.pending;
            return (
              <div key={r.id} className="bg-paper" style={border}>
                {/* Header */}
                <div className="px-6 py-4 flex items-start justify-between gap-4"
                  style={{ borderBottom: '0.5px solid rgba(42,40,35,0.12)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`${st.bg} ${st.text} text-[11px] font-medium px-2.5 py-0.5`}>
                        {st.label}
                      </span>
                      <span className={`${mood.bg} ${mood.text} text-[11px] px-2.5 py-0.5`}>
                        {mood.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] text-ink">
                      <Calendar size={12} strokeWidth={1.4} className="text-mute" />
                      {formatDateTime(r.visit_date, r.visit_time)}
                    </div>
                  </div>
                  <p className="text-[12px] text-mute shrink-0">
                    {new Date(r.created_at).toLocaleDateString('ko-KR')} 제출
                  </p>
                </div>

                {/* Info row */}
                <div className="px-6 py-4 flex flex-wrap gap-6"
                  style={{ borderBottom: '0.5px solid rgba(42,40,35,0.12)' }}>
                  {/* Manager */}
                  <div>
                    <p className="text-[10px] tracking-[0.12em] uppercase text-mute mb-1.5">매니저</p>
                    <div className="flex items-center gap-1.5">
                      <User size={12} strokeWidth={1.4} className="text-mute" />
                      <span className="text-[13px] text-ink">{r.manager?.name}</span>
                    </div>
                    {r.manager?.phone && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Phone size={12} strokeWidth={1.4} className="text-mute" />
                        <span className="text-[12px] text-mute">{r.manager.phone}</span>
                      </div>
                    )}
                  </div>
                  {/* Beneficiary */}
                  <div>
                    <p className="text-[10px] tracking-[0.12em] uppercase text-mute mb-1.5">방문 어르신</p>
                    <div className="flex items-center gap-1.5">
                      <User size={12} strokeWidth={1.4} className="text-mute" />
                      <span className="text-[13px] text-ink">{r.beneficiary?.name}</span>
                    </div>
                    {r.beneficiary?.phone && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Phone size={12} strokeWidth={1.4} className="text-mute" />
                        <span className="text-[12px] text-mute">{r.beneficiary.phone}</span>
                      </div>
                    )}
                    {r.beneficiary?.address && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin size={12} strokeWidth={1.4} className="text-mute" />
                        <span className="text-[12px] text-mute">{r.beneficiary.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary */}
                <div className="px-6 py-5" style={r.photos?.length > 0 ? { borderBottom: '0.5px solid rgba(42,40,35,0.12)' } : {}}>
                  <p className="text-[10px] tracking-[0.12em] uppercase text-mute mb-2">방문 일지</p>
                  <p className="text-[14px] text-ink leading-[1.9] whitespace-pre-wrap" style={{ wordBreak: 'keep-all' }}>
                    {r.summary}
                  </p>
                </div>

                {/* Photos */}
                {r.photos?.length > 0 && (
                  <div className="px-6 py-4" style={{ borderBottom: '0.5px solid rgba(42,40,35,0.12)' }}>
                    <p className="text-[10px] tracking-[0.12em] uppercase text-mute mb-2">첨부 사진</p>
                    <div className="flex gap-2 flex-wrap">
                      {r.photos.map((url: string, i: number) => (
                        <a key={i} href={url} target="_blank" rel="noreferrer">
                          <div className="relative w-20 h-20 overflow-hidden bg-surface" style={border}>
                            <Image src={url} alt="" fill className="object-cover hover:opacity-80 transition-opacity" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rejection reason (if rejected) */}
                {r.status === 'rejected' && r.rejection_reason && (
                  <div className="px-6 py-4 bg-[#FDE8E8]">
                    <p className="text-[11px] tracking-[0.12em] uppercase text-[#842029] mb-1">반려 사유</p>
                    <p className="text-[13px] text-[#842029]">{r.rejection_reason}</p>
                  </div>
                )}

                {/* Action buttons (pending only) */}
                {r.status === 'pending' && (
                  <div className="px-6 py-4">
                    {rejectId === r.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                          placeholder="반려 사유를 입력해 주세요"
                          rows={2}
                          className="w-full bg-surface px-3 py-2 text-[13px] text-ink focus:outline-none resize-none"
                          style={border}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => reject(r.id)}
                            disabled={processing || !rejectReason.trim()}
                            className="flex-1 py-2 text-[13px] bg-accent text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                          >
                            반려 확정
                          </button>
                          <button
                            onClick={() => { setRejectId(null); setRejectReason(''); }}
                            className="px-4 py-2 text-[13px] text-mute bg-paper hover:text-ink transition-colors"
                            style={border}
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => approve(r.id, null)}
                          disabled={processing}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] bg-primary text-surface hover:bg-primary-deep disabled:opacity-50 transition-colors"
                        >
                          <CheckCircle size={14} strokeWidth={1.4} />
                          승인
                        </button>
                        <button
                          onClick={() => setRejectId(r.id)}
                          disabled={processing}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] text-mute bg-paper hover:text-ink disabled:opacity-50 transition-colors"
                          style={border}
                        >
                          <XCircle size={14} strokeWidth={1.4} />
                          반려
                        </button>
                        <Link
                          href={`/admin/report/${r.id}`}
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[13px] text-mute bg-paper hover:text-ink transition-colors"
                          style={border}
                        >
                          <FileText size={14} strokeWidth={1.4} />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
