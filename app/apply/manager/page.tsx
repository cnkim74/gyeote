'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2, Camera, CheckCircle, Send } from 'lucide-react';
import Link from 'next/link';
import { Wordmark } from '@/components/Wordmark';

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };
const inputCls = 'w-full bg-white px-4 py-3 text-[14px] text-ink focus:outline-none';

const DAYS = [
  { key: 'mon', label: '월요일' },
  { key: 'tue', label: '화요일' },
  { key: 'wed', label: '수요일' },
  { key: 'thu', label: '목요일' },
  { key: 'fri', label: '금요일' },
  { key: 'sat', label: '토요일' },
  { key: 'sun', label: '일요일' },
];

type Cert    = { name: string; issuer: string; issued_date: string };
type Career  = { company: string; role: string; start_date: string; end_date: string; is_current: boolean; description: string };
type DaySlot = { enabled: boolean; start: string; end: string };
type WeekSchedule = Record<string, DaySlot>;

function initSchedule(): WeekSchedule {
  return Object.fromEntries(DAYS.map(d => [d.key, { enabled: false, start: '09:00', end: '18:00' }]));
}

function Section({ num, title, required, children }: { num: string; title: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="bg-paper p-6" style={border}>
      <div className="flex items-baseline gap-2 mb-5 pb-3" style={{ borderBottom: '0.5px solid rgba(42,40,35,0.10)' }}>
        <span className="font-en text-[11px] tracking-[0.2em] text-mute">{num}</span>
        <p className="text-[13px] font-medium text-ink">{title}</p>
        {required && <span className="text-accent text-[11px] ml-0.5">필수</span>}
      </div>
      {children}
    </div>
  );
}

export default function ManagerApplyPage() {
  const photoRef = useRef<HTMLInputElement>(null);

  const [basic, setBasic] = useState({
    name: '', email: '', phone: '', mobile: '',
    address: '', address_detail: '',
    bank_name: '', account_number: '', account_holder: '',
  });
  const [photoFile, setPhotoFile]     = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [certs, setCerts]     = useState<Cert[]>([{ name: '', issuer: '', issued_date: '' }]);
  const [careers, setCareers] = useState<Career[]>([{ company: '', role: '', start_date: '', end_date: '', is_current: false, description: '' }]);
  const [schedule, setSchedule] = useState<WeekSchedule>(initSchedule());

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  function setB(key: keyof typeof basic, val: string) {
    setBasic(f => ({ ...f, [key]: val }));
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    if (photoRef.current) photoRef.current.value = '';
  }

  // Cert helpers
  const addCert = () => setCerts(c => [...c, { name: '', issuer: '', issued_date: '' }]);
  const removeCert = (i: number) => setCerts(c => c.filter((_, j) => j !== i));
  const setCert = (i: number, k: keyof Cert, v: string) =>
    setCerts(c => c.map((item, j) => j === i ? { ...item, [k]: v } : item));

  // Career helpers
  const addCareer = () => setCareers(c => [...c, { company: '', role: '', start_date: '', end_date: '', is_current: false, description: '' }]);
  const removeCareer = (i: number) => setCareers(c => c.filter((_, j) => j !== i));
  const setCareer = (i: number, k: keyof Career, v: string | boolean) =>
    setCareers(c => c.map((item, j) => j === i ? { ...item, [k]: v } : item));

  // Schedule helpers
  const toggleDay = (key: string) =>
    setSchedule(s => ({ ...s, [key]: { ...s[key], enabled: !s[key].enabled } }));
  const setSlot = (key: string, field: 'start' | 'end', val: string) =>
    setSchedule(s => ({ ...s, [key]: { ...s[key], [field]: val } }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const missing = !basic.name || !basic.email || !basic.phone || !basic.mobile || !basic.address;
    if (missing) { setError('기본 정보 (이름·이메일·전화번호·휴대폰·주소)를 모두 입력해 주세요.'); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (!photoFile) { setError('프로필 사진은 필수입니다.'); return; }

    setSubmitting(true);
    setError('');
    const supabase = createClient();

    // Upload photo
    let photoUrl: string | null = null;
    const ext = photoFile.name.split('.').pop() ?? 'jpg';
    const path = `applications/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, photoFile, { upsert: false });
    if (!upErr) {
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      photoUrl = publicUrl;
    }

    const { error: err } = await supabase.from('manager_applications').insert({
      name: basic.name,
      email: basic.email,
      phone: basic.phone,
      mobile: basic.mobile,
      address: basic.address,
      address_detail: basic.address_detail || null,
      bank_name: basic.bank_name || null,
      account_number: basic.account_number || null,
      account_holder: basic.account_holder || null,
      photo_url: photoUrl,
      certifications: certs.filter(c => c.name.trim()),
      careers: careers.filter(c => c.company.trim()),
      available_hours: schedule,
    });

    if (err) { setError('제출 중 오류가 발생했습니다: ' + err.message); setSubmitting(false); return; }
    setDone(true);
    setSubmitting(false);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <CheckCircle size={44} strokeWidth={1.2} className="text-primary mx-auto mb-5" />
          <h2 className="font-serif-ko font-black text-ink text-[24px] mb-3">신청이 완료되었습니다</h2>
          <p className="text-[13.5px] text-mute leading-[1.9]">
            관리자 검토 후 등록하신 이메일<br />
            <strong className="text-ink">{basic.email}</strong>로 결과를 안내드립니다.<br />
            영업일 기준 3일 이내 연락드립니다.
          </p>
          <Link href="/" className="inline-block mt-8 text-[13px] text-mute hover:text-ink underline underline-offset-2">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-paper px-6 py-4 sticky top-0 z-10" style={{ borderBottom: '0.5px solid rgba(42,40,35,0.18)' }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/"><Wordmark size={20} /></Link>
          <p className="text-[12px] text-mute tracking-[0.12em]">매니저 신청</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 py-10">
        <div className="mb-8">
          <p className="font-en text-[11px] tracking-[0.2em] uppercase text-mute mb-2">Manager Application</p>
          <h1 className="font-serif-ko font-black text-ink text-[28px] mb-2">매니저 신청서</h1>
          <p className="text-[13px] text-mute leading-[1.8]">
            곁에 케어 서비스의 매니저로 활동하고 싶으신 분은 아래 양식을 작성해 주세요.<br />
            제출 후 관리자 검토를 거쳐 이메일로 안내드립니다.
          </p>
        </div>

        {error && (
          <div className="px-4 py-3 mb-6 text-[13px] text-accent bg-red-50" style={{ border: '0.5px solid rgba(185,28,28,0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* ── 01 기본 정보 ── */}
          <Section num="01" title="기본 정보" required>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-mute mb-1.5">이름 *</label>
                  <input value={basic.name} onChange={e => setB('name', e.target.value)}
                    className={inputCls} style={border} placeholder="홍길동" required />
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-mute mb-1.5">이메일 *</label>
                  <input type="email" value={basic.email} onChange={e => setB('email', e.target.value)}
                    className={inputCls} style={border} placeholder="example@email.com" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-mute mb-1.5">전화번호 *</label>
                  <input type="tel" value={basic.phone} onChange={e => setB('phone', e.target.value)}
                    className={inputCls} style={border} placeholder="054-000-0000" required />
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-mute mb-1.5">휴대폰 *</label>
                  <input type="tel" value={basic.mobile} onChange={e => setB('mobile', e.target.value)}
                    className={inputCls} style={border} placeholder="010-0000-0000" required />
                </div>
              </div>
              <div>
                <label className="block text-[11px] tracking-[0.15em] uppercase text-mute mb-1.5">주소 *</label>
                <input value={basic.address} onChange={e => setB('address', e.target.value)}
                  className={inputCls} style={border} placeholder="도로명 주소" required />
              </div>
              <div>
                <label className="block text-[11px] tracking-[0.15em] uppercase text-mute mb-1.5">상세주소</label>
                <input value={basic.address_detail} onChange={e => setB('address_detail', e.target.value)}
                  className={inputCls} style={border} placeholder="동호수, 건물명 등" />
              </div>
            </div>
          </Section>

          {/* ── 02 통장 정보 ── */}
          <Section num="02" title="통장 정보 (선택)">
            <p className="text-[12px] text-mute mb-4 -mt-1 leading-[1.7]">
              정산 용도로만 사용됩니다. 나중에 제출하셔도 됩니다.
            </p>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-mute mb-1.5">은행명</label>
                  <input value={basic.bank_name} onChange={e => setB('bank_name', e.target.value)}
                    className={inputCls} style={border} placeholder="예) 국민은행" />
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.15em] uppercase text-mute mb-1.5">예금주</label>
                  <input value={basic.account_holder} onChange={e => setB('account_holder', e.target.value)}
                    className={inputCls} style={border} placeholder="예금주명" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] tracking-[0.15em] uppercase text-mute mb-1.5">계좌번호</label>
                <input value={basic.account_number} onChange={e => setB('account_number', e.target.value)}
                  className={inputCls} style={border} placeholder="숫자만 입력 (- 제외)" />
              </div>
            </div>
          </Section>

          {/* ── 03 프로필 사진 ── */}
          <Section num="03" title="프로필 사진" required>
            <p className="text-[12px] text-mute mb-4 -mt-1 leading-[1.7]">
              어르신·보호자에게 표시될 사진입니다. 실제 얼굴 사진을 업로드해 주세요.
            </p>
            <div className="flex items-center gap-5">
              <div className="relative w-[88px] h-[88px] bg-surface overflow-hidden shrink-0" style={border}>
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoPreview} alt="미리보기" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera size={22} strokeWidth={1.2} className="text-mute" />
                  </div>
                )}
              </div>
              <div>
                <button type="button" onClick={() => photoRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 text-[13px] bg-white hover:bg-surface transition-colors"
                  style={border}>
                  <Camera size={14} strokeWidth={1.4} />
                  {photoPreview ? '사진 변경' : '사진 선택'}
                </button>
                <p className="text-[11px] text-mute mt-2">JPG · PNG · WEBP, 최대 5MB</p>
              </div>
            </div>
            <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </Section>

          {/* ── 04 자격증 ── */}
          <Section num="04" title="자격증">
            <div className="flex flex-col gap-3">
              {/* Column headers */}
              <div className="grid gap-2 pr-7" style={{ gridTemplateColumns: '1fr 1fr 130px' }}>
                {['자격증명', '발급기관', '취득일'].map(h => (
                  <p key={h} className="text-[10px] tracking-[0.12em] uppercase text-mute">{h}</p>
                ))}
              </div>
              {certs.map((cert, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: '1fr 1fr 130px' }}>
                    <input value={cert.name} onChange={e => setCert(i, 'name', e.target.value)}
                      className={inputCls} style={border} placeholder="요양보호사 1급" />
                    <input value={cert.issuer} onChange={e => setCert(i, 'issuer', e.target.value)}
                      className={inputCls} style={border} placeholder="발급기관" />
                    <input type="date" value={cert.issued_date} onChange={e => setCert(i, 'issued_date', e.target.value)}
                      className={inputCls} style={border} />
                  </div>
                  {certs.length > 1 && (
                    <button type="button" onClick={() => removeCert(i)} className="text-mute hover:text-accent transition-colors shrink-0">
                      <Trash2 size={15} strokeWidth={1.4} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addCert}
                className="self-start flex items-center gap-1.5 text-[12.5px] text-mute hover:text-primary transition-colors mt-1">
                <Plus size={13} strokeWidth={1.5} /> 자격증 추가
              </button>
            </div>
          </Section>

          {/* ── 05 경력사항 ── */}
          <Section num="05" title="경력사항">
            <div className="flex flex-col gap-5">
              {careers.map((career, i) => (
                <div key={i}>
                  {i > 0 && <div className="mb-5" style={{ borderTop: '0.5px solid rgba(42,40,35,0.10)' }} />}
                  <div className="relative flex flex-col gap-2.5">
                    {careers.length > 1 && (
                      <button type="button" onClick={() => removeCareer(i)}
                        className="absolute top-0 right-0 text-mute hover:text-accent transition-colors">
                        <Trash2 size={15} strokeWidth={1.4} />
                      </button>
                    )}
                    <div className="grid grid-cols-2 gap-2 pr-6">
                      <div>
                        <label className="block text-[10.5px] tracking-[0.12em] uppercase text-mute mb-1">기관·회사명</label>
                        <input value={career.company} onChange={e => setCareer(i, 'company', e.target.value)}
                          className={inputCls} style={border} placeholder="OO요양원" />
                      </div>
                      <div>
                        <label className="block text-[10.5px] tracking-[0.12em] uppercase text-mute mb-1">담당 직무</label>
                        <input value={career.role} onChange={e => setCareer(i, 'role', e.target.value)}
                          className={inputCls} style={border} placeholder="요양보호사" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pr-6">
                      <div>
                        <label className="block text-[10.5px] tracking-[0.12em] uppercase text-mute mb-1">시작 연월</label>
                        <input type="month" value={career.start_date} onChange={e => setCareer(i, 'start_date', e.target.value)}
                          className={inputCls} style={border} />
                      </div>
                      <div>
                        <label className="block text-[10.5px] tracking-[0.12em] uppercase text-mute mb-1">종료 연월</label>
                        <div className="flex gap-2 items-center">
                          <input type="month" value={career.end_date} onChange={e => setCareer(i, 'end_date', e.target.value)}
                            className={`${inputCls} flex-1`} style={border} disabled={career.is_current}
                            placeholder={career.is_current ? '재직 중' : ''} />
                          <label className="flex items-center gap-1.5 text-[12px] text-mute cursor-pointer shrink-0 whitespace-nowrap">
                            <input type="checkbox" checked={career.is_current}
                              onChange={e => setCareer(i, 'is_current', e.target.checked)} className="accent-primary" />
                            현재
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="pr-6">
                      <label className="block text-[10.5px] tracking-[0.12em] uppercase text-mute mb-1">업무 내용</label>
                      <textarea value={career.description} onChange={e => setCareer(i, 'description', e.target.value)}
                        rows={3} placeholder="주요 담당 업무, 케어 대상, 특이사항 등을 간략히 작성해 주세요"
                        className="w-full bg-white px-4 py-3 text-[13px] text-ink focus:outline-none resize-none leading-[1.8]"
                        style={border} />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addCareer}
                className="self-start flex items-center gap-1.5 text-[12.5px] text-mute hover:text-primary transition-colors">
                <Plus size={13} strokeWidth={1.5} /> 경력 추가
              </button>
            </div>
          </Section>

          {/* ── 06 근무 가능 시간 ── */}
          <Section num="06" title="근무 가능 시간">
            <p className="text-[12px] text-mute mb-4 -mt-1 leading-[1.7]">
              근무 가능한 요일에 체크하고 시간대를 선택해 주세요.
            </p>
            <div className="flex flex-col gap-1.5">
              {DAYS.map(({ key, label }) => {
                const day = schedule[key];
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      day.enabled ? 'bg-primary/[0.04]' : 'bg-surface/60'
                    }`}
                    style={{ border: `0.5px solid ${day.enabled ? 'rgba(44,95,93,0.28)' : 'rgba(42,40,35,0.12)'}` }}
                  >
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={day.enabled} onChange={() => toggleDay(key)}
                        className="accent-primary w-3.5 h-3.5" />
                      <span className={`text-[13px] w-[52px] ${day.enabled ? 'text-ink font-medium' : 'text-mute'}`}>
                        {label}
                      </span>
                    </label>
                    {day.enabled ? (
                      <div className="flex items-center gap-2">
                        <input type="time" value={day.start} onChange={e => setSlot(key, 'start', e.target.value)}
                          className="bg-white px-3 py-1.5 text-[13px] text-ink focus:outline-none"
                          style={{ border: '0.5px solid rgba(42,40,35,0.2)' }} />
                        <span className="text-[12px] text-mute">~</span>
                        <input type="time" value={day.end} onChange={e => setSlot(key, 'end', e.target.value)}
                          className="bg-white px-3 py-1.5 text-[13px] text-ink focus:outline-none"
                          style={{ border: '0.5px solid rgba(42,40,35,0.2)' }} />
                      </div>
                    ) : (
                      <span className="text-[12px] text-mute/40">근무 불가</span>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Notice */}
          <div className="px-5 py-4 text-[12.5px] text-mute leading-[1.85]" style={border}>
            제출된 신청서는 관리자 검토 후 이메일로 결과를 안내드립니다. 허위 정보 기재 시 신청이 취소될 수 있습니다.
          </div>

          <button type="submit" disabled={submitting}
            className="flex items-center justify-center gap-2 bg-primary text-surface py-4 text-[14px] tracking-tight hover:bg-primary-deep transition-colors disabled:opacity-50">
            <Send size={14} strokeWidth={1.4} />
            {submitting ? '제출 중...' : '매니저 신청 제출'}
          </button>

        </form>
      </div>
    </div>
  );
}
