'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Phone, Mail, MapPin, Briefcase, Star, Calendar } from 'lucide-react';

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

const DAYS: Record<string, string> = {
  mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토', sun: '일',
};

function ScheduleView({ hours }: { hours: Record<string, { enabled: boolean; start: string; end: string }> }) {
  const active = Object.entries(hours).filter(([, v]) => v.enabled);
  if (!active.length) return <span className="text-mute text-[12px]">미설정</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {active.map(([key, slot]) => (
        <span key={key} className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] bg-primary/[0.06] text-primary"
          style={{ border: '0.5px solid rgba(44,95,93,0.2)' }}>
          {DAYS[key]} {slot.start}~{slot.end}
        </span>
      ))}
    </div>
  );
}

function ApplicationCard({ app, onApprove, onReject, processing }: {
  app: any;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  processing: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');

  const certs: any[] = app.certifications ?? [];
  const careers: any[] = app.careers ?? [];
  const hours = app.available_hours ?? {};

  return (
    <div className="bg-paper" style={border}>
      {/* Header — always visible */}
      <div className="px-5 py-4 flex items-center gap-4">
        <div
          className="w-14 h-14 rounded overflow-hidden shrink-0 bg-surface"
          style={{ border: '0.5px solid rgba(42,40,35,0.15)' }}
        >
          {app.photo_url
            ? // eslint-disable-next-line @next/next/no-img-element
              <img src={app.photo_url} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-[18px] font-serif text-mute">
                {app.name?.[0]}
              </div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-serif-ko text-[17px] text-ink">{app.name}</p>
          <div className="flex flex-wrap gap-3 mt-1">
            <span className="flex items-center gap-1 text-[12px] text-mute">
              <Mail size={10} strokeWidth={1.4} />{app.email}
            </span>
            <span className="flex items-center gap-1 text-[12px] text-mute">
              <Phone size={10} strokeWidth={1.4} />{app.mobile}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {app.status === 'approved' && (
            <span className="text-[11px] text-[#2D6A4F] bg-green-50 px-2 py-0.5" style={{ border: '0.5px solid rgba(45,106,79,0.3)' }}>
              승인됨
            </span>
          )}
          {app.status === 'rejected' && (
            <span className="text-[11px] text-accent bg-red-50 px-2 py-0.5" style={{ border: '0.5px solid rgba(185,28,28,0.2)' }}>
              반려됨
            </span>
          )}
          <button onClick={() => setExpanded(x => !x)}
            className="flex items-center gap-1 text-[12px] text-mute hover:text-ink transition-colors px-2 py-1">
            상세보기 {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ borderTop: '0.5px solid rgba(42,40,35,0.10)' }}>
          {/* Basic info */}
          <div className="px-5 py-4 grid grid-cols-2 gap-x-8 gap-y-3 text-[13px]"
            style={{ borderBottom: '0.5px solid rgba(42,40,35,0.08)' }}>
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-mute mb-1">전화번호</p>
              <p className="text-ink">{app.phone || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-mute mb-1">휴대폰</p>
              <p className="text-ink">{app.mobile || '—'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] tracking-[0.15em] uppercase text-mute mb-1">주소</p>
              <p className="text-ink">{app.address}{app.address_detail ? ` ${app.address_detail}` : ''}</p>
            </div>
          </div>

          {/* Bank info */}
          {(app.bank_name || app.account_number) && (
            <div className="px-5 py-4 bg-amber-50/40 grid grid-cols-3 gap-4 text-[13px]"
              style={{ borderBottom: '0.5px solid rgba(42,40,35,0.08)' }}>
              <div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-mute mb-1">은행명</p>
                <p className="text-ink">{app.bank_name || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-mute mb-1">예금주</p>
                <p className="text-ink">{app.account_holder || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-mute mb-1">계좌번호</p>
                <p className="text-ink">{app.account_number || '—'}</p>
              </div>
            </div>
          )}

          {/* Certifications */}
          {certs.length > 0 && (
            <div className="px-5 py-4" style={{ borderBottom: '0.5px solid rgba(42,40,35,0.08)' }}>
              <p className="text-[10px] tracking-[0.15em] uppercase text-mute mb-3 flex items-center gap-1.5">
                <Star size={10} strokeWidth={1.4} /> 자격증
              </p>
              <div className="flex flex-col gap-2">
                {certs.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 text-[13px]">
                    <span className="text-ink font-medium">{c.name}</span>
                    {c.issuer && <span className="text-mute">{c.issuer}</span>}
                    {c.issued_date && (
                      <span className="text-mute text-[12px]">{c.issued_date.slice(0, 7).replace('-', '.')}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Careers */}
          {careers.length > 0 && (
            <div className="px-5 py-4" style={{ borderBottom: '0.5px solid rgba(42,40,35,0.08)' }}>
              <p className="text-[10px] tracking-[0.15em] uppercase text-mute mb-3 flex items-center gap-1.5">
                <Briefcase size={10} strokeWidth={1.4} /> 경력사항
              </p>
              <div className="flex flex-col gap-4">
                {careers.map((c, i) => (
                  <div key={i}>
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-[14px] text-ink font-medium">{c.company}</span>
                      {c.role && <span className="text-[12px] text-mute">{c.role}</span>}
                    </div>
                    <p className="text-[12px] text-mute mb-1">
                      {c.start_date && c.start_date.slice(0, 7).replace('-', '.')}
                      {' ~ '}
                      {c.is_current ? '현재' : (c.end_date?.slice(0, 7).replace('-', '.') ?? '')}
                    </p>
                    {c.description && (
                      <p className="text-[13px] text-ink/70 leading-[1.7]">{c.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available hours */}
          <div className="px-5 py-4" style={{ borderBottom: '0.5px solid rgba(42,40,35,0.08)' }}>
            <p className="text-[10px] tracking-[0.15em] uppercase text-mute mb-3 flex items-center gap-1.5">
              <Calendar size={10} strokeWidth={1.4} /> 근무 가능 시간
            </p>
            <ScheduleView hours={hours} />
          </div>

          {/* Rejection reason */}
          {app.status === 'rejected' && app.rejection_reason && (
            <div className="px-5 py-3 bg-[#FDE8E8]">
              <p className="text-[11px] text-accent mb-1">반려 사유</p>
              <p className="text-[13px] text-accent/80">{app.rejection_reason}</p>
            </div>
          )}

          {/* Actions */}
          {app.status === 'pending' && (
            <div className="px-5 py-4">
              {rejecting ? (
                <div className="flex flex-col gap-2">
                  <textarea value={reason} onChange={e => setReason(e.target.value)}
                    placeholder="반려 사유를 입력해 주세요" rows={2}
                    className="w-full bg-surface px-3 py-2 text-[13px] focus:outline-none resize-none" style={border} />
                  <div className="flex gap-2">
                    <button onClick={() => { onReject(app.id, reason); setRejecting(false); setReason(''); }}
                      disabled={processing || !reason.trim()}
                      className="flex-1 py-2.5 text-[13px] bg-accent text-white hover:opacity-90 disabled:opacity-50 transition-opacity">
                      반려 확정
                    </button>
                    <button onClick={() => { setRejecting(false); setReason(''); }}
                      className="px-4 py-2 text-[13px] text-mute bg-paper hover:text-ink" style={border}>
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => onApprove(app.id)} disabled={processing}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] bg-primary text-surface hover:bg-primary-deep disabled:opacity-50 transition-colors">
                    <CheckCircle size={14} strokeWidth={1.4} />
                    승인 (매니저 계정 생성)
                  </button>
                  <button onClick={() => setRejecting(true)} disabled={processing}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] text-mute bg-paper hover:text-ink disabled:opacity-50" style={border}>
                    <XCircle size={14} strokeWidth={1.4} />
                    반려
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const TABS = [
    { key: 'pending' as const,  label: '승인 대기' },
    { key: 'approved' as const, label: '승인됨' },
    { key: 'rejected' as const, label: '반려됨' },
  ];

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('manager_applications')
      .select('*')
      .eq('status', tab)
      .order('created_at', { ascending: false });
    setApplications(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [tab]);

  async function handleApprove(id: string) {
    setProcessing(true);
    const res = await fetch('/api/admin/approve-manager', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: id, action: 'approve' }),
    });
    const json = await res.json();
    if (!res.ok) alert('승인 실패: ' + json.error);
    setProcessing(false);
    load();
  }

  async function handleReject(id: string, reason: string) {
    setProcessing(true);
    await fetch('/api/admin/approve-manager', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: id, action: 'reject', rejectionReason: reason }),
    });
    setProcessing(false);
    load();
  }

  return (
    <div className="p-8 md:p-10 max-w-3xl">
      <h1 className="font-serif-ko font-black text-ink text-[28px] mb-2">매니저 신청 관리</h1>
      <p className="text-[13px] text-mute mb-8">접수된 매니저 신청서를 검토하고 승인하세요.</p>

      <div className="flex gap-0 mb-6" style={{ borderBottom: '0.5px solid rgba(42,40,35,0.18)' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 text-[13px] transition-colors ${
              tab === t.key ? 'text-ink border-b-2 border-primary -mb-px font-medium' : 'text-mute hover:text-ink'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[13px] text-mute">불러오는 중...</p>
      ) : applications.length === 0 ? (
        <div className="bg-paper p-12 text-center" style={border}>
          <Clock size={28} strokeWidth={1} className="mx-auto text-mute mb-3" />
          <p className="text-[14px] text-mute">
            {tab === 'pending' ? '대기 중인 신청이 없습니다' :
             tab === 'approved' ? '승인된 신청이 없습니다' : '반려된 신청이 없습니다'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {applications.map(app => (
            <ApplicationCard
              key={app.id}
              app={app}
              onApprove={handleApprove}
              onReject={handleReject}
              processing={processing}
            />
          ))}
        </div>
      )}
    </div>
  );
}
