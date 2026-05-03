'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AvatarUpload } from '@/components/AvatarUpload';
import { Save, CheckCircle } from 'lucide-react';

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

export default function ManagerSettingsPage() {
  const [userId, setUserId] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', avatar_url: '' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      setUserId(user.id);
      const { data } = await supabase
        .from('profiles')
        .select('name, phone, avatar_url')
        .eq('id', user.id)
        .single();
      if (data) setForm({
        name: data.name ?? '',
        phone: data.phone ?? '',
        avatar_url: data.avatar_url ?? '',
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from('profiles')
      .update({ name: form.name, phone: form.phone })
      .eq('id', userId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return <div className="p-10 text-[13px] text-mute">불러오는 중...</div>;

  const hasAvatar = !!form.avatar_url;

  return (
    <div className="max-w-md mx-auto px-6 md:px-10 py-10">
      <div className="mb-8">
        <p className="font-en text-[11px] tracking-[0.2em] uppercase text-mute mb-2">Settings</p>
        <h1 className="font-serif-ko font-black text-ink text-[26px]">프로필 설정</h1>
      </div>

      {/* Required avatar banner */}
      {!hasAvatar && (
        <div
          className="bg-amber-50 px-4 py-3 mb-6 flex items-start gap-3"
          style={{ border: '0.5px solid rgba(181,137,0,0.4)' }}
        >
          <span className="text-amber-600 text-[18px] leading-none mt-0.5">!</span>
          <p className="text-[13px] text-amber-800 leading-[1.7]" style={{ wordBreak: 'keep-all' }}>
            매니저 프로필 사진은 <strong>필수</strong>입니다. 어르신과 보호자에게 신뢰를 드리기 위해
            실제 사진을 등록해 주세요.
          </p>
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-6">

        {/* Avatar */}
        <div className="bg-paper p-6 flex flex-col items-center gap-2" style={border}>
          <p className="text-[10.5px] tracking-[0.15em] uppercase text-mute mb-3 self-start">
            프로필 사진 <span className="text-accent ml-1">필수</span>
          </p>
          {userId && (
            <AvatarUpload
              userId={userId}
              currentUrl={form.avatar_url || null}
              name={form.name || null}
              size={96}
              onUpload={url => setForm(f => ({ ...f, avatar_url: url }))}
            />
          )}
          {hasAvatar && (
            <p className="text-[11px] text-[#2D6A4F] mt-1">✓ 사진이 등록되어 있습니다</p>
          )}
        </div>

        {/* Name */}
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

        {/* Phone */}
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
