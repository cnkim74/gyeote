'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Camera, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AvatarUpload } from '@/components/AvatarUpload';

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

export default function NewMemberPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    address_detail: '',
    notes: '',
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [tempId] = useState(() => crypto.randomUUID()); // temp ID for avatar upload
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError('성함을 입력해 주세요.'); return; }
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: err } = await supabase.from('member_requests').insert({
      manager_id: userId,
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      address: form.address.trim() || null,
      address_detail: form.address_detail.trim() || null,
      notes: form.notes.trim() || null,
      avatar_url: avatarUrl,
    });

    if (err) { setError(err.message); setLoading(false); return; }
    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="text-[40px] mb-4">✓</div>
        <h2 className="font-serif-ko font-black text-ink text-[22px] mb-3">등록 요청 완료</h2>
        <p className="text-[14px] text-mute leading-[1.9] mb-8" style={{ wordBreak: 'keep-all' }}>
          관리자 승인 후 어르신 계정이 활성화됩니다.<br />
          승인 완료 시 대시보드에서 확인하실 수 있어요.
        </p>
        <Link
          href="/manager"
          className="inline-block bg-primary text-surface px-6 py-3 text-[14px] hover:bg-primary-deep transition-colors"
        >
          대시보드로
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 md:px-10 py-10">
      <Link href="/manager/members" className="inline-flex items-center gap-1.5 text-[13px] text-mute hover:text-ink mb-8 transition-colors">
        <ArrowLeft size={14} strokeWidth={1.4} />
        목록으로
      </Link>

      <div className="mb-8">
        <p className="font-en text-[11px] tracking-[0.2em] uppercase text-mute mb-2">New Member</p>
        <h1 className="font-serif-ko font-black text-ink text-[26px]">어르신 등록 신청</h1>
        <p className="text-[13px] text-mute mt-1.5">관리자 승인 후 계정이 활성화됩니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Avatar */}
        <div className="bg-paper p-6 flex flex-col items-center" style={border}>
          <p className="text-[10.5px] tracking-[0.15em] uppercase text-mute mb-4 self-start">프로필 사진 (선택)</p>
          {userId && (
            <AvatarUpload
              userId={`member-requests/${tempId}`}
              currentUrl={avatarUrl}
              name={form.name || null}
              size={80}
              onUpload={url => setAvatarUrl(url)}
            />
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-[11px] tracking-[0.18em] uppercase text-mute mb-2">
            성함 <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="홍길동"
            required
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

        {/* Address */}
        <div>
          <label className="block text-[11px] tracking-[0.18em] uppercase text-mute mb-2">주소</label>
          <input
            type="text"
            value={form.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
            placeholder="경북 안동시 배움길 77"
            className="w-full bg-paper px-4 py-3 text-[14px] text-ink focus:outline-none mb-2"
            style={border}
          />
          <input
            type="text"
            value={form.address_detail}
            onChange={e => setForm(f => ({ ...f, address_detail: e.target.value }))}
            placeholder="상세주소 (동·호수 등)"
            className="w-full bg-paper px-4 py-3 text-[14px] text-ink focus:outline-none"
            style={border}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[11px] tracking-[0.18em] uppercase text-mute mb-2">특이사항 / 메모</label>
          <textarea
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            rows={4}
            placeholder="건강 상태, 주의사항, 가족 연락처 등 참고 정보를 입력해 주세요."
            className="w-full bg-paper px-4 py-3 text-[14px] text-ink focus:outline-none resize-none leading-[1.8]"
            style={{ ...border, wordBreak: 'keep-all' }}
          />
        </div>

        {error && <p className="text-[13px] text-accent">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-primary text-surface py-4 text-[14px] hover:bg-primary-deep transition-colors disabled:opacity-50"
        >
          <Send size={14} strokeWidth={1.4} />
          {loading ? '제출 중...' : '등록 신청하기'}
        </button>
      </form>
    </div>
  );
}
