'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Avatar } from '@/components/Avatar';
import { CheckCircle, XCircle, Clock, MapPin, Phone, User } from 'lucide-react';

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

export default function AdminMembersPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('member_requests')
      .select('*, manager:manager_id(id, name)')
      .eq('status', tab)
      .order('created_at', { ascending: false });
    setRequests(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [tab]);

  async function approve(id: string) {
    setProcessing(true);
    await fetch('/api/admin/approve-member', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: id, action: 'approve' }),
    });
    setProcessing(false);
    load();
  }

  async function reject(id: string) {
    if (!rejectReason.trim()) return;
    setProcessing(true);
    await fetch('/api/admin/approve-member', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: id, action: 'reject', rejectionReason: rejectReason }),
    });
    setRejectId(null);
    setRejectReason('');
    setProcessing(false);
    load();
  }

  const TABS = [
    { key: 'pending' as const,  label: '승인 대기' },
    { key: 'approved' as const, label: '승인됨' },
    { key: 'rejected' as const, label: '반려됨' },
  ];

  return (
    <div className="p-8 md:p-10 max-w-2xl">
      <h1 className="font-serif-ko font-black text-ink text-[28px] mb-2">어르신 등록 관리</h1>
      <p className="text-[13px] text-mute mb-8">매니저가 신청한 어르신 계정 등록을 검토하세요.</p>

      <div className="flex gap-0 mb-6" style={{ borderBottom: '0.5px solid rgba(42,40,35,0.18)' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 text-[13px] transition-colors ${
              tab === t.key ? 'text-ink border-b-2 border-primary -mb-px font-medium' : 'text-mute hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[13px] text-mute">불러오는 중...</p>
      ) : requests.length === 0 ? (
        <div className="bg-paper p-12 text-center" style={border}>
          <Clock size={28} strokeWidth={1} className="mx-auto text-mute mb-3" />
          <p className="text-[14px] text-mute">
            {tab === 'pending' ? '대기 중인 요청이 없습니다' :
             tab === 'approved' ? '승인된 요청이 없습니다' : '반려된 요청이 없습니다'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map(r => (
            <div key={r.id} className="bg-paper" style={border}>
              {/* Header */}
              <div className="px-5 py-4 flex items-center gap-4" style={{ borderBottom: '0.5px solid rgba(42,40,35,0.10)' }}>
                <Avatar src={r.avatar_url} name={r.name} size={52} />
                <div className="flex-1 min-w-0">
                  <p className="font-serif-ko text-[17px] text-ink">{r.name}</p>
                  <div className="flex flex-wrap gap-3 mt-1">
                    {r.phone && (
                      <span className="flex items-center gap-1 text-[12px] text-mute">
                        <Phone size={11} strokeWidth={1.4} />
                        {r.phone}
                      </span>
                    )}
                    {r.address && (
                      <span className="flex items-center gap-1 text-[12px] text-mute">
                        <MapPin size={11} strokeWidth={1.4} />
                        {r.address}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-mute mb-0.5">신청 매니저</p>
                  <p className="text-[12px] text-ink">{r.manager?.name ?? '—'}</p>
                </div>
              </div>

              {/* Notes */}
              {r.notes && (
                <div className="px-5 py-3" style={{ borderBottom: '0.5px solid rgba(42,40,35,0.10)' }}>
                  <p className="text-[10px] tracking-[0.12em] uppercase text-mute mb-1">특이사항</p>
                  <p className="text-[13px] text-ink/80 leading-[1.8]">{r.notes}</p>
                </div>
              )}

              {/* Rejection reason */}
              {r.status === 'rejected' && r.rejection_reason && (
                <div className="px-5 py-3 bg-[#FDE8E8]">
                  <p className="text-[11px] text-[#842029] mb-1">반려 사유</p>
                  <p className="text-[13px] text-[#842029]">{r.rejection_reason}</p>
                </div>
              )}

              {/* Actions */}
              {r.status === 'pending' && (
                <div className="px-5 py-4">
                  {rejectId === r.id ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        placeholder="반려 사유를 입력해 주세요"
                        rows={2}
                        className="w-full bg-surface px-3 py-2 text-[13px] focus:outline-none resize-none"
                        style={border}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => reject(r.id)}
                          disabled={processing || !rejectReason.trim()}
                          className="flex-1 py-2 text-[13px] bg-accent text-white hover:opacity-90 disabled:opacity-50"
                        >
                          반려 확정
                        </button>
                        <button
                          onClick={() => { setRejectId(null); setRejectReason(''); }}
                          className="px-4 py-2 text-[13px] text-mute bg-paper hover:text-ink"
                          style={border}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approve(r.id)}
                        disabled={processing}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] bg-primary text-surface hover:bg-primary-deep disabled:opacity-50 transition-colors"
                      >
                        <CheckCircle size={14} strokeWidth={1.4} />
                        승인 (계정 생성)
                      </button>
                      <button
                        onClick={() => setRejectId(r.id)}
                        disabled={processing}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] text-mute bg-paper hover:text-ink disabled:opacity-50"
                        style={border}
                      >
                        <XCircle size={14} strokeWidth={1.4} />
                        반려
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
