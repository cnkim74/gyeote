'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Camera, X, Send, User, Phone, Clock, MapPin, Sparkles, Loader2 } from 'lucide-react';
import { SignaturePad } from '@/components/SignaturePad';
import { StarRating } from '@/components/StarRating';

const MOOD_OPTIONS = [
  { value: 'good',    label: '좋음',    desc: '안색·건강 상태가 좋아 보이셨습니다',      ring: 'ring-[#2D6A4F]', bg: 'bg-[#E8F4EC]', text: 'text-[#2D6A4F]' },
  { value: 'fair',    label: '보통',    desc: '큰 이상은 없으나 평이한 상태입니다',        ring: 'ring-[#8A6914]', bg: 'bg-[#FFF8E1]', text: 'text-[#8A6914]' },
  { value: 'concern', label: '관심필요', desc: '건강 또는 심리적으로 주의가 필요합니다',   ring: 'ring-[#842029]', bg: 'bg-[#FDE8E8]', text: 'text-[#842029]' },
] as const;

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };
const MAX_PHOTOS = 8;

interface Client {
  id: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  address_detail: string | null;
}

export default function NewReportPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [managerId, setManagerId] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [managerAvatar, setManagerAvatar] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const now = new Date();
  const nowStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  const [form, setForm] = useState({
    beneficiary_id: '',
    visit_date: now.toISOString().split('T')[0],
    visit_start_time: nowStr,
    visit_end_time: '',
    mood: 'good' as 'good' | 'fair' | 'concern',
    condition_score: 0,
    stress_score: 0,
    summary: '',
    use_default_location: true,
    visit_location: '',
  });
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiKeywords, setAiKeywords] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  function calcDuration(start: string, end: string) {
    if (!start || !end) return null;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const mins = (eh * 60 + em) - (sh * 60 + sm);
    if (mins <= 0) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}시간 ${m > 0 ? m + '분' : ''}`.trim() : `${m}분`;
  }

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setManagerId(user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('name, phone, avatar_url')
        .eq('id', user.id)
        .single();
      setManagerName(profile?.name ?? '');
      setManagerPhone(profile?.phone ?? '');
      setManagerAvatar((profile as any)?.avatar_url ?? null);

      const { data } = await supabase
        .from('subscriptions')
        .select('beneficiary:beneficiary_id(id, name, phone, address, address_detail)')
        .eq('manager_id', user.id)
        .eq('status', 'active');

      const list = ((data ?? []) as any[])
        .map((s) => s.beneficiary)
        .filter(Boolean) as Client[];
      setClients(list);
      if (list.length === 1) {
        setSelectedClient(list[0]);
        setForm(f => ({ ...f, beneficiary_id: list[0].id }));
      }
    });
  }, []);

  function handleClientChange(id: string) {
    const c = clients.find(c => c.id === id) ?? null;
    setSelectedClient(c);
    setForm(f => ({ ...f, beneficiary_id: id }));
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const remaining = MAX_PHOTOS - photoFiles.length;
    const toAdd = files.slice(0, remaining);
    setPhotoFiles(prev => [...prev, ...toAdd]);
    toAdd.forEach(f => {
      const url = URL.createObjectURL(f);
      setPreviews(prev => [...prev, url]);
    });
    if (fileRef.current) fileRef.current.value = '';
  }

  function removePhoto(idx: number) {
    URL.revokeObjectURL(previews[idx]);
    setPhotoFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleAiDraft() {
    if (!aiKeywords.trim()) return;
    setAiLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai/draft-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: aiKeywords,
          mood: form.mood,
          conditionScore: form.condition_score || null,
          stressScore: form.stress_score || null,
          beneficiaryName: selectedClient?.name ?? null,
        }),
      });
      const data = await res.json();
      if (data.draft) {
        setForm(f => ({ ...f, summary: data.draft }));
      } else {
        setError(`AI 오류: ${data.error ?? '알 수 없는 오류'}`);
      }
    } catch (e: any) {
      setError(`AI 연결 실패: ${e?.message ?? '네트워크 오류'}`);
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.beneficiary_id) { setError('어르신을 선택해 주세요.'); return; }
    if (!form.summary.trim()) { setError('방문 일지를 작성해 주세요.'); return; }
    setLoading(true);
    setError('');

    const supabase = createClient();

    // Upload photos
    const photoUrls: string[] = [];
    for (const file of photoFiles) {
      const path = `${managerId}/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const { error: upErr } = await supabase.storage.from('visit-photos').upload(path, file);
      if (!upErr) {
        const { data: { publicUrl } } = supabase.storage.from('visit-photos').getPublicUrl(path);
        photoUrls.push(publicUrl);
      }
    }

    // Upload signature
    let signatureUrl: string | null = null;
    if (signatureDataUrl) {
      const blob = await (await fetch(signatureDataUrl)).blob();
      const sigPath = `signatures/${managerId}/${Date.now()}.png`;
      const { error: sigErr } = await supabase.storage
        .from('visit-photos')
        .upload(sigPath, blob, { contentType: 'image/png' });
      if (!sigErr) {
        const { data: { publicUrl } } = supabase.storage
          .from('visit-photos')
          .getPublicUrl(sigPath);
        signatureUrl = publicUrl;
      }
    }

    const { error: err } = await supabase.from('visit_reports').insert({
      manager_id: managerId,
      beneficiary_id: form.beneficiary_id,
      visit_date: form.visit_date,
      visit_time: form.visit_start_time || null,
      visit_end_time: form.visit_end_time || null,
      mood: form.mood,
      summary: form.summary.trim(),
      photos: photoUrls,
      signature_url: signatureUrl,
      condition_score: form.condition_score > 0 ? form.condition_score : null,
      stress_score: form.stress_score > 0 ? form.stress_score : null,
      visit_location: form.use_default_location ? null : (form.visit_location.trim() || null),
      status: 'pending',
    });

    if (err) { setError(err.message); setLoading(false); return; }
    router.push('/manager');
  }

  return (
    <div className="max-w-2xl mx-auto px-6 md:px-10 py-10">
      <Link href="/manager" className="inline-flex items-center gap-1.5 text-[13px] text-mute hover:text-ink mb-8 transition-colors">
        <ArrowLeft size={14} strokeWidth={1.4} />
        대시보드로
      </Link>

      <div className="mb-8">
        <p className="font-en text-[11px] tracking-[0.2em] uppercase text-mute mb-2">Visit Report</p>
        <h1 className="font-serif-ko font-black text-ink text-[28px]">방문 완료 보고서</h1>
        <p className="text-[13px] text-mute mt-2">제출 후 관리자 승인 시 정산이 처리됩니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-7">

        {/* 매니저 정보 (읽기 전용) */}
        <div className="bg-paper p-5" style={border}>
          <p className="text-[10.5px] tracking-[0.15em] uppercase text-mute mb-3">방문 매니저</p>
          <div className="flex items-center gap-4">
            {/* 프로필 사진 — 라운드 사각형 */}
            {managerAvatar ? (
              <div
                className="overflow-hidden shrink-0"
                style={{ width: 52, height: 52, borderRadius: 10, border: '0.5px solid rgba(42,40,35,0.15)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={managerAvatar} alt={managerName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div
                className="flex items-center justify-center shrink-0 font-bold text-white text-[18px]"
                style={{
                  width: 52, height: 52, borderRadius: 10,
                  background: '#2C5F5D',
                }}
              >
                {managerName ? managerName.slice(0, 1) : <User size={20} />}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <User size={12} className="text-mute" strokeWidth={1.4} />
                <span className="text-[14px] text-ink font-medium">{managerName || '—'}</span>
              </div>
              {managerPhone && (
                <div className="flex items-center gap-2">
                  <Phone size={12} className="text-mute" strokeWidth={1.4} />
                  <span className="text-[13px] text-mute">{managerPhone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 어르신 선택 */}
        <div>
          <label className="block text-[11px] tracking-[0.18em] uppercase text-mute mb-2">방문 어르신 *</label>
          {clients.length === 0 ? (
            <p className="text-[13px] text-mute py-2">배정된 어르신이 없습니다</p>
          ) : clients.length === 1 ? (
            <div className="bg-paper p-4" style={border}>
              <div className="flex flex-wrap gap-5">
                <div className="flex items-center gap-2">
                  <User size={13} className="text-mute" strokeWidth={1.4} />
                  <span className="font-serif-ko text-[15px] text-ink">{clients[0].name}</span>
                </div>
                {clients[0].phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-mute" strokeWidth={1.4} />
                    <span className="text-[14px] text-ink">{clients[0].phone}</span>
                  </div>
                )}
                {clients[0].address && (
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-mute" strokeWidth={1.4} />
                    <span className="text-[13px] text-mute">{clients[0].address}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <select
                value={form.beneficiary_id}
                onChange={e => handleClientChange(e.target.value)}
                className="w-full bg-paper px-4 py-3 text-[14px] text-ink focus:outline-none appearance-none mb-3"
                style={border}
              >
                <option value="">어르신 선택</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {selectedClient && (
                <div className="bg-paper p-4" style={border}>
                  <div className="flex flex-wrap gap-5">
                    {selectedClient.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={13} className="text-mute" strokeWidth={1.4} />
                        <span className="text-[14px] text-ink">{selectedClient.phone}</span>
                      </div>
                    )}
                    {selectedClient.address && (
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-mute" strokeWidth={1.4} />
                        <span className="text-[13px] text-mute">{selectedClient.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 날짜 + 시간 */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-[11px] tracking-[0.18em] uppercase text-mute mb-2">방문 일자 *</label>
            <input
              type="date"
              value={form.visit_date}
              onChange={e => setForm(f => ({ ...f, visit_date: e.target.value }))}
              max={new Date().toISOString().split('T')[0]}
              className="w-full bg-paper px-4 py-3 text-[14px] text-ink focus:outline-none"
              style={border}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] tracking-[0.18em] uppercase text-mute mb-2 flex items-center gap-1.5">
                <Clock size={11} strokeWidth={1.4} />
                시작 시간
              </label>
              <input
                type="time"
                value={form.visit_start_time}
                onChange={e => setForm(f => ({ ...f, visit_start_time: e.target.value }))}
                className="w-full bg-paper px-4 py-3 text-[14px] text-ink focus:outline-none"
                style={border}
              />
            </div>
            <div>
              <label className="block text-[11px] tracking-[0.18em] uppercase text-mute mb-2 flex items-center gap-1.5">
                <Clock size={11} strokeWidth={1.4} />
                종료 시간
              </label>
              <input
                type="time"
                value={form.visit_end_time}
                onChange={e => setForm(f => ({ ...f, visit_end_time: e.target.value }))}
                className="w-full bg-paper px-4 py-3 text-[14px] text-ink focus:outline-none"
                style={border}
              />
            </div>
          </div>
          {calcDuration(form.visit_start_time, form.visit_end_time) && (
            <div className="bg-primary/5 px-4 py-2.5 flex items-center gap-2" style={{ border: '0.5px solid rgba(44,95,93,0.2)' }}>
              <Clock size={12} strokeWidth={1.4} className="text-primary" />
              <span className="text-[13px] text-primary font-medium">
                총 방문 시간 · {calcDuration(form.visit_start_time, form.visit_end_time)}
              </span>
            </div>
          )}
        </div>

        {/* 방문 장소 */}
        <div>
          <label className="block text-[11px] tracking-[0.18em] uppercase text-mute mb-3">방문 장소</label>
          <div className="bg-paper p-4 flex flex-col gap-3" style={border}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, use_default_location: true, visit_location: '' }))}
                className={`flex-1 py-2.5 text-[13px] transition-colors ${form.use_default_location ? 'bg-primary text-surface' : 'bg-surface text-mute hover:text-ink'}`}
                style={{ border: '0.5px solid rgba(42,40,35,0.18)' }}
              >
                기본 주소
              </button>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, use_default_location: false }))}
                className={`flex-1 py-2.5 text-[13px] transition-colors ${!form.use_default_location ? 'bg-primary text-surface' : 'bg-surface text-mute hover:text-ink'}`}
                style={{ border: '0.5px solid rgba(42,40,35,0.18)' }}
              >
                다른 장소
              </button>
            </div>
            {form.use_default_location ? (
              <div className="flex items-start gap-2">
                <MapPin size={12} strokeWidth={1.4} className="text-mute shrink-0 mt-0.5" />
                <div>
                  {(() => {
                    const c = clients.find(c => c.id === form.beneficiary_id) ?? clients[0];
                    if (c?.address) {
                      return (
                        <>
                          <p className="text-[13px] text-ink">{c.address}</p>
                          {c.address_detail && <p className="text-[12px] text-mute mt-0.5">{c.address_detail}</p>}
                        </>
                      );
                    }
                    return <p className="text-[13px] text-mute">등록된 주소가 없습니다</p>;
                  })()}
                </div>
              </div>
            ) : (
              <input
                type="text"
                value={form.visit_location}
                onChange={e => setForm(f => ({ ...f, visit_location: e.target.value }))}
                placeholder="방문 장소를 직접 입력해 주세요"
                className="w-full bg-surface px-3 py-2.5 text-[13px] text-ink focus:outline-none"
                style={{ border: '0.5px solid rgba(42,40,35,0.18)' }}
              />
            )}
          </div>
        </div>

        {/* 안부 상태 */}
        <div>
          <label className="block text-[11px] tracking-[0.18em] uppercase text-mute mb-3">안부 상태 *</label>
          <div className="flex flex-col gap-2">
            {MOOD_OPTIONS.map(opt => (
              <label
                key={opt.value}
                className={`flex items-start gap-3 p-4 cursor-pointer transition-all ${
                  form.mood === opt.value
                    ? `${opt.bg} ring-1 ${opt.ring}`
                    : 'bg-paper hover:bg-paper/80'
                }`}
                style={form.mood !== opt.value ? border : undefined}
              >
                <input
                  type="radio"
                  name="mood"
                  value={opt.value}
                  checked={form.mood === opt.value}
                  onChange={() => setForm(f => ({ ...f, mood: opt.value }))}
                  className="mt-0.5"
                />
                <div>
                  <p className={`text-[14px] font-medium ${form.mood === opt.value ? opt.text : 'text-ink'}`}>
                    {opt.label}
                  </p>
                  <p className="text-[12px] text-mute mt-0.5">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 건강 상태 점수 */}
        <div>
          <label className="block text-[11px] tracking-[0.18em] uppercase text-mute mb-3">건강 상태 점수</label>
          <div className="bg-paper p-4" style={border}>
            <StarRating
              value={form.condition_score}
              onChange={v => setForm(f => ({ ...f, condition_score: v }))}
            />
          </div>
        </div>

        {/* 스트레스 지수 */}
        <div>
          <label className="block text-[11px] tracking-[0.18em] uppercase text-mute mb-3">스트레스 지수</label>
          <div className="bg-paper p-4" style={border}>
            <StarRating
              value={form.stress_score}
              onChange={v => setForm(f => ({ ...f, stress_score: v }))}
            />
          </div>
        </div>

        {/* 방문 일지 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] tracking-[0.18em] uppercase text-mute">방문 일지 *</label>
          </div>

          {/* AI 초안 도우미 */}
          <div className="bg-paper p-4 mb-2" style={{ ...border, borderBottom: 'none' }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={12} strokeWidth={1.4} className="text-primary" />
              <p className="text-[11px] tracking-[0.12em] uppercase text-primary font-medium">AI 초안 작성</p>
              <span className="text-[10px] text-mute ml-1">키워드나 메모를 입력하면 AI가 일지를 작성해 드려요</span>
            </div>
            <div className="flex gap-2">
              <textarea
                value={aiKeywords}
                onChange={e => setAiKeywords(e.target.value)}
                rows={2}
                placeholder="예) 식사 잘 하심, 무릎 통증 호소, 자녀 방문 얘기, 산책 30분"
                className="flex-1 bg-surface px-3 py-2 text-[13px] text-ink focus:outline-none resize-none leading-[1.7]"
                style={{ border: '0.5px solid rgba(42,40,35,0.15)' }}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAiDraft(); }}
              />
              <button
                type="button"
                onClick={handleAiDraft}
                disabled={aiLoading || !aiKeywords.trim()}
                className="shrink-0 flex items-center gap-1.5 bg-primary text-surface px-4 py-2 text-[12.5px] hover:bg-primary-deep transition-colors disabled:opacity-40 self-end"
              >
                {aiLoading
                  ? <><Loader2 size={13} strokeWidth={1.4} className="animate-spin" />생성 중</>
                  : <><Sparkles size={13} strokeWidth={1.4} />초안 작성</>
                }
              </button>
            </div>
          </div>

          <textarea
            value={form.summary}
            onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
            rows={8}
            placeholder="오늘 방문 내용을 자세히 기록해 주세요.&#10;&#10;예) 어르신 상태, 함께 한 활동, 식사 여부, 건강 관련 특이사항 등"
            className="w-full bg-paper px-4 py-3 text-[14px] text-ink focus:outline-none resize-none leading-[1.9]"
            style={{ ...border, wordBreak: 'keep-all' }}
            required
            maxLength={3000}
          />
          <p className="text-[11px] text-mute text-right mt-1">{form.summary.length} / 3000</p>
        </div>

        {/* 사진 첨부 */}
        <div>
          <label className="block text-[11px] tracking-[0.18em] uppercase text-mute mb-3">
            사진 첨부 (최대 {MAX_PHOTOS}장)
          </label>

          {/* Preview grid */}
          {previews.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mb-3">
              {previews.map((url, i) => (
                <div key={i} className="relative aspect-square overflow-hidden bg-surface" style={border}>
                  <Image src={url} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-ink/70 text-white flex items-center justify-center rounded-full hover:bg-ink"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {photoFiles.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-4 text-[13px] text-mute hover:text-ink transition-colors bg-paper hover:bg-paper/80"
              style={border}
            >
              <Camera size={16} strokeWidth={1.4} />
              사진 추가 ({photoFiles.length}/{MAX_PHOTOS})
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handlePhotoSelect}
          />
        </div>

        {/* 매니저 서명 */}
        <div>
          <label className="block text-[11px] tracking-[0.18em] uppercase text-mute mb-3">
            매니저 서명
          </label>
          <SignaturePad
            onSave={url => setSignatureDataUrl(url)}
            onClear={() => setSignatureDataUrl(null)}
          />
          {signatureDataUrl && (
            <p className="text-[11px] text-[#2D6A4F] mt-2">✓ 서명이 저장되었습니다. 제출 시 함께 업로드됩니다.</p>
          )}
        </div>

        {error && <p className="text-[13px] text-accent">{error}</p>}

        {/* 안내 */}
        <div className="bg-paper p-4 text-[12.5px] text-mute leading-[1.8]" style={border}>
          제출된 보고서는 관리자 검토 후 <strong className="text-ink">승인</strong> 처리됩니다.
          승인 완료 시 해당 방문에 대한 정산이 진행됩니다.
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-primary text-surface py-4 text-[14px] tracking-tight hover:bg-primary-deep transition-colors disabled:opacity-50"
        >
          <Send size={14} strokeWidth={1.4} />
          {loading ? '제출 중...' : '보고서 제출 (승인 요청)'}
        </button>
      </form>
    </div>
  );
}
