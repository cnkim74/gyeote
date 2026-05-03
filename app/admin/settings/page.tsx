'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Save, CheckCircle, Upload, X } from 'lucide-react';

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

export default function AdminSettingsPage() {
  const [userId, setUserId] = useState('');
  const [form, setForm] = useState({ name: '', phone: '' });
  const [stampUrl, setStampUrl] = useState<string | null>(null);
  const [stampPreview, setStampPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stampUploading, setStampUploading] = useState(false);
  const [stampError, setStampError] = useState('');
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      setUserId(user.id);
      const { data } = await supabase
        .from('profiles')
        .select('name, phone, stamp_url')
        .eq('id', user.id)
        .single();
      if (data) {
        setForm({ name: data.name ?? '', phone: data.phone ?? '' });
        setStampUrl(data.stamp_url ?? null);
        setStampPreview(data.stamp_url ?? null);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleStampUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    if (!file.type.includes('png') && !file.type.includes('webp')) {
      setStampError('PNG 또는 WebP 파일만 업로드 가능합니다 (투명 배경 권장)');
      return;
    }
    setStampError('');
    setStampUploading(true);

    const preview = URL.createObjectURL(file);
    setStampPreview(preview);

    const supabase = createClient();
    const ext = file.name.split('.').pop() ?? 'png';
    const path = `${userId}/stamp.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type });

    if (upErr) {
      setStampError('업로드 실패: ' + upErr.message);
      setStampUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
    const cacheBusted = publicUrl + '?t=' + Date.now();

    await supabase.from('profiles').update({ stamp_url: cacheBusted }).eq('id', userId);
    setStampUrl(cacheBusted);
    setStampUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function removeStamp() {
    const supabase = createClient();
    await supabase.from('profiles').update({ stamp_url: null }).eq('id', userId);
    setStampUrl(null);
    setStampPreview(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    await supabase.from('profiles').update({ name: form.name, phone: form.phone }).eq('id', userId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return <div className="p-10 text-[13px] text-mute">불러오는 중...</div>;

  return (
    <div className="max-w-md mx-auto px-6 md:px-10 py-10">
      <div className="mb-8">
        <p className="font-en text-[11px] tracking-[0.2em] uppercase text-mute mb-2">Settings</p>
        <h1 className="font-serif-ko font-black text-ink text-[26px]">관리자 설정</h1>
      </div>

      {/* Stamp upload */}
      <div className="bg-paper p-6 mb-6" style={border}>
        <p className="text-[10.5px] tracking-[0.15em] uppercase text-mute mb-1">승인 도장 이미지</p>
        <p className="text-[12px] text-mute mb-5 leading-[1.7]">
          투명 배경 PNG를 업로드하면 승인된 보고서에 실제 도장 이미지가 표시됩니다.
          업로드하지 않으면 기본 SVG 도장이 사용됩니다.
        </p>

        {/* Preview on checkered background */}
        <div
          className="relative flex items-center justify-center mb-4"
          style={{
            width: 140, height: 140,
            backgroundImage: 'linear-gradient(45deg,#e8e4de 25%,transparent 25%),linear-gradient(-45deg,#e8e4de 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e8e4de 75%),linear-gradient(-45deg,transparent 75%,#e8e4de 75%)',
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0,0 8px,8px -8px,-8px 0',
            backgroundColor: '#f5f3ef',
            border: '0.5px solid rgba(42,40,35,0.18)',
          }}
        >
          {stampPreview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={stampPreview}
                alt="도장 미리보기"
                style={{ width: 110, height: 110, objectFit: 'contain' }}
              />
              <button
                type="button"
                onClick={removeStamp}
                className="absolute top-1.5 right-1.5 w-5 h-5 bg-ink/60 text-white flex items-center justify-center rounded-full hover:bg-ink"
              >
                <X size={11} />
              </button>
            </>
          ) : (
            <p className="text-[11px] text-mute text-center px-4">
              도장<br />미등록
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={stampUploading}
          className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-ink hover:bg-surface transition-colors disabled:opacity-50"
          style={border}
        >
          <Upload size={14} strokeWidth={1.4} />
          {stampUploading ? '업로드 중...' : stampUrl ? '도장 교체' : '도장 업로드'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".png,.webp,image/png,image/webp"
          className="hidden"
          onChange={handleStampUpload}
        />
        {stampError && <p className="text-[12px] text-accent mt-2">{stampError}</p>}
        {stampUrl && !stampUploading && (
          <p className="text-[11px] text-[#2D6A4F] mt-2">✓ 도장이 등록되어 있습니다</p>
        )}
      </div>

      {/* Profile form */}
      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <div>
          <label className="block text-[11px] tracking-[0.18em] uppercase text-mute mb-2">이름</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-paper px-4 py-3 text-[14px] text-ink focus:outline-none"
            style={border}
          />
        </div>
        <div>
          <label className="block text-[11px] tracking-[0.18em] uppercase text-mute mb-2">연락처</label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="010-0000-0000"
            className="w-full bg-paper px-4 py-3 text-[14px] text-ink focus:outline-none"
            style={border}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-primary text-surface py-3.5 text-[14px] hover:bg-primary-deep transition-colors disabled:opacity-50"
        >
          {saved
            ? <><CheckCircle size={15} strokeWidth={1.4} /> 저장됨</>
            : <><Save size={15} strokeWidth={1.4} /> {saving ? '저장 중...' : '저장하기'}</>
          }
        </button>
      </form>
    </div>
  );
}
