'use client';

import { Printer, ArrowLeft, CheckSquare, Square } from 'lucide-react';
import Link from 'next/link';
import { ApprovalStamp } from './ApprovalStamp';

interface ReportData {
  id: string;
  visit_date: string;
  visit_time: string | null;
  mood: 'good' | 'fair' | 'concern';
  condition_score: number | null;
  summary: string;
  photos: string[] | null;
  signature_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  approved_at: string | null;
  rejection_reason: string | null;
  manager: { id: string; name: string | null; phone: string | null } | null;
  beneficiary: {
    id: string;
    name: string | null;
    phone: string | null;
    address: string | null;
    address_detail: string | null;
  } | null;
}

interface ReportDocumentProps {
  report: ReportData;
  approverName?: string | null;
  approverStampUrl?: string | null;
  backHref?: string;
}

const MOOD_OPTIONS = [
  { value: 'good',    label: '좋음' },
  { value: 'fair',    label: '보통' },
  { value: 'concern', label: '관심 필요' },
] as const;

function korDateTime(date: string, time: string | null) {
  const dt = new Date(date + 'T00:00:00');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  let s = `${dt.getFullYear()}년 ${dt.getMonth() + 1}월 ${dt.getDate()}일 (${days[dt.getDay()]})`;
  if (time) {
    const [h, m] = time.split(':').map(Number);
    s += `  ${h < 12 ? '오전' : '오후'} ${h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')}`;
  }
  return s;
}

function reportNo(id: string) {
  return id.replace(/-/g, '').slice(0, 8).toUpperCase();
}

const line = { borderTop: '0.5px solid rgba(42,40,35,0.18)' };

export function ReportDocument({ report, approverName, approverStampUrl, backHref = '/manager' }: ReportDocumentProps) {
  const isApproved = report.status === 'approved';
  const stampDate = report.approved_at
    ? report.approved_at.slice(0, 10)
    : report.visit_date;

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-page {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          body { background: white !important; }
          @page { size: A4; margin: 18mm 18mm 18mm 18mm; }
        }
      `}</style>

      {/* Toolbar — hidden on print */}
      <div className="no-print max-w-3xl mx-auto px-6 md:px-10 pt-6 pb-4 flex items-center justify-between">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-[13px] text-mute hover:text-ink transition-colors"
        >
          <ArrowLeft size={14} strokeWidth={1.4} />
          돌아가기
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-primary text-surface px-5 py-2.5 text-[13px] hover:bg-primary-deep transition-colors"
        >
          <Printer size={14} strokeWidth={1.4} />
          PDF 저장 / 인쇄
        </button>
      </div>

      {/* Document */}
      <div
        className="print-page max-w-3xl mx-auto px-6 md:px-10 pb-16"
        style={{ fontFamily: 'inherit' }}
      >
        <div
          className="bg-white"
          style={{ border: '0.5px solid rgba(42,40,35,0.18)', padding: '40px 44px' }}
        >

          {/* ── Letterhead ── */}
          <div className="flex items-start justify-between mb-1">
            <div>
              {/* Logo mark */}
              <div className="flex items-center gap-2 mb-2">
                <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="7" width="11" height="26" rx="2.5" fill="#2C5F5D"/>
                  <rect x="21" y="16" width="13" height="17" rx="2.5" fill="#2C5F5D" opacity="0.55"/>
                </svg>
                <span style={{ fontFamily: 'serif', fontSize: 18, fontWeight: 900, color: '#2A2823', letterSpacing: '-0.02em' }}>
                  곁에
                </span>
                <span style={{ fontSize: 11, color: '#9B9488', letterSpacing: '0.15em', marginLeft: 4 }}>
                  GYEOTE
                </span>
              </div>
              <p style={{ fontSize: 11, color: '#9B9488', letterSpacing: '0.08em' }}>
                경북 안동시 곁에케어 &nbsp;|&nbsp; 054-000-0000
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 20, fontWeight: 900, color: '#2A2823', letterSpacing: '-0.02em', fontFamily: 'serif' }}>
                방문 보고서
              </p>
              <p style={{ fontSize: 11, color: '#9B9488', marginTop: 4, letterSpacing: '0.05em' }}>
                NO. {reportNo(report.id)}
              </p>
            </div>
          </div>

          <div style={{ ...line, marginTop: 20, marginBottom: 20 }} />

          {/* ── Visit meta ── */}
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse', marginBottom: 20 }}>
            <tbody>
              <tr>
                <td style={{ width: 80, color: '#9B9488', paddingBottom: 8, whiteSpace: 'nowrap' }}>방문 일시</td>
                <td style={{ paddingBottom: 8, color: '#2A2823', fontWeight: 500 }}>
                  {korDateTime(report.visit_date, report.visit_time)}
                </td>
              </tr>
              {report.beneficiary?.address && (
                <tr>
                  <td style={{ color: '#9B9488', paddingBottom: 4, whiteSpace: 'nowrap' }}>방문 장소</td>
                  <td style={{ color: '#2A2823' }}>
                    {report.beneficiary.address}
                    {report.beneficiary.address_detail && ` ${report.beneficiary.address_detail}`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={line} />

          {/* ── Two columns: beneficiary + manager ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, margin: '20px 0' }}>
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.18em', color: '#9B9488', marginBottom: 10, textTransform: 'uppercase' }}>
                대상자 정보
              </p>
              <table style={{ fontSize: 13, borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ color: '#9B9488', paddingRight: 16, paddingBottom: 6, whiteSpace: 'nowrap' }}>성명</td>
                    <td style={{ color: '#2A2823', fontWeight: 600, fontFamily: 'serif', fontSize: 15 }}>
                      {report.beneficiary?.name ?? '—'}
                    </td>
                  </tr>
                  {report.beneficiary?.phone && (
                    <tr>
                      <td style={{ color: '#9B9488', paddingRight: 16, paddingBottom: 6 }}>연락처</td>
                      <td style={{ color: '#2A2823' }}>{report.beneficiary.phone}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.18em', color: '#9B9488', marginBottom: 10, textTransform: 'uppercase' }}>
                담당 매니저
              </p>
              <table style={{ fontSize: 13, borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ color: '#9B9488', paddingRight: 16, paddingBottom: 6, whiteSpace: 'nowrap' }}>성명</td>
                    <td style={{ color: '#2A2823', fontWeight: 600, fontFamily: 'serif', fontSize: 15 }}>
                      {report.manager?.name ?? '—'}
                    </td>
                  </tr>
                  {report.manager?.phone && (
                    <tr>
                      <td style={{ color: '#9B9488', paddingRight: 16, paddingBottom: 6 }}>연락처</td>
                      <td style={{ color: '#2A2823' }}>{report.manager.phone}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={line} />

          {/* ── Mood status ── */}
          <div style={{ margin: '20px 0' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.18em', color: '#9B9488', marginBottom: 12, textTransform: 'uppercase' }}>
              안부 상태
            </p>
            <div style={{ display: 'flex', gap: 32 }}>
              {MOOD_OPTIONS.map(opt => {
                const checked = report.mood === opt.value;
                return (
                  <div key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {checked
                      ? <CheckSquare size={16} strokeWidth={1.5} color="#2C5F5D" />
                      : <Square size={16} strokeWidth={1.5} color="#C7C0B4" />
                    }
                    <span style={{
                      fontSize: 14,
                      fontWeight: checked ? 700 : 400,
                      color: checked ? '#2C5F5D' : '#9B9488',
                    }}>
                      {opt.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Condition score ── */}
          {report.condition_score != null && report.condition_score > 0 && (
            <>
              <div style={line} />
              <div style={{ margin: '20px 0' }}>
                <p style={{ fontSize: 10, letterSpacing: '0.18em', color: '#9B9488', marginBottom: 12, textTransform: 'uppercase' }}>
                  건강 상태 점수
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: 10 }, (_, i) => {
                      const filled = i + 1 <= report.condition_score!;
                      return (
                        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"
                            fill={filled ? '#E8A318' : 'none'}
                            stroke={filled ? '#E8A318' : 'rgba(42,40,35,0.2)'}
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                        </svg>
                      );
                    })}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#B5820A' }}>
                    {report.condition_score} / 10
                  </span>
                </div>
              </div>
            </>
          )}

          <div style={line} />

          {/* ── Summary ── */}
          <div style={{ margin: '20px 0' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.18em', color: '#9B9488', marginBottom: 12, textTransform: 'uppercase' }}>
              방문 일지
            </p>
            <p style={{
              fontSize: 14,
              color: '#2A2823',
              lineHeight: 2.1,
              whiteSpace: 'pre-wrap',
              wordBreak: 'keep-all',
              minHeight: 120,
            }}>
              {report.summary}
            </p>
          </div>

          {/* ── Photos ── */}
          {report.photos && report.photos.length > 0 && (
            <>
              <div style={line} />
              <div style={{ margin: '20px 0' }}>
                <p style={{ fontSize: 10, letterSpacing: '0.18em', color: '#9B9488', marginBottom: 12, textTransform: 'uppercase' }}>
                  사진 기록
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {report.photos.map((url, i) => (
                    <div
                      key={i}
                      style={{
                        width: 120, height: 120,
                        overflow: 'hidden',
                        border: '0.5px solid rgba(42,40,35,0.18)',
                        flexShrink: 0,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div style={{ ...line, marginTop: 8 }} />

          {/* ── Signature + Stamp ── */}
          <div style={{ marginTop: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>

            {/* Left: manager signature */}
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.18em', color: '#9B9488', marginBottom: 14, textTransform: 'uppercase' }}>
                매니저 서명
              </p>
              {report.signature_url ? (
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={report.signature_url}
                    alt="서명"
                    style={{
                      height: 70,
                      maxWidth: 220,
                      objectFit: 'contain',
                      display: 'block',
                      borderBottom: '1px solid rgba(42,40,35,0.2)',
                      paddingBottom: 4,
                    }}
                  />
                  <p style={{ fontSize: 11, color: '#9B9488', marginTop: 8 }}>
                    {report.manager?.name ?? ''} · {report.visit_date.replace(/-/g, '.')}
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 16, fontFamily: 'serif', fontWeight: 700, color: '#2A2823' }}>
                      {report.manager?.name ?? ''}
                    </span>
                    <div style={{ width: 120, borderBottom: '1px solid #2A2823' }} />
                  </div>
                  <p style={{ fontSize: 11, color: '#9B9488', marginTop: 8 }}>
                    작성일 · {report.visit_date.replace(/-/g, '.')}
                  </p>
                </div>
              )}
            </div>

            {/* Right: approval stamp or pending */}
            <div style={{ textAlign: 'center' }}>
              {isApproved ? (
                <div>
                  {approverStampUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={approverStampUrl}
                      alt="승인 도장"
                      style={{ width: 110, height: 110, objectFit: 'contain', display: 'block' }}
                    />
                  ) : (
                    <ApprovalStamp date={stampDate} size={110} />
                  )}
                  {approverName && (
                    <p style={{ fontSize: 11, color: '#B91C1C', marginTop: 4 }}>
                      승인자 · {approverName}
                    </p>
                  )}
                </div>
              ) : (
                <div style={{
                  width: 110, height: 110,
                  border: '2px dashed #C7C0B4',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <p style={{ fontSize: 11, color: '#C7C0B4', textAlign: 'center', lineHeight: 1.7 }}>
                    승인<br />대기 중
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer note */}
          <div style={{ ...line, marginTop: 32, paddingTop: 16 }}>
            <p style={{ fontSize: 10.5, color: '#C7C0B4', textAlign: 'center', letterSpacing: '0.06em' }}>
              본 보고서는 곁에 케어 서비스의 공식 방문 기록입니다. &nbsp;|&nbsp; 곁에 &nbsp;©&nbsp;{new Date().getFullYear()}
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
