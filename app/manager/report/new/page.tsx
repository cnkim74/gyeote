'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Send } from 'lucide-react';

const MOOD_OPTIONS = [
  { value: 'good', label: '좋음', desc: '안색·건강 상태가 좋아 보이셨습니다', color: 'bg-[#E8F4EC] text-[#2D6A4F] border-[#2D6A4F]/30' },
  { value: 'fair', label: '보통', desc: '큰 이상은 없으나 평이한 상태입니다', color: 'bg-[#FFF8E1] text-[#8A6914] border-[#8A6914]/30' },
  { value: 'concern', label: '관심필요', desc: '건강 또는 심리적으로 주의가 필요합니다', color: 'bg-[#FDE8E8] text-[#842029] border-[#842029]/30' },
] as const;

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

export default function NewReportPage() {
  const router = useRouter();
  const [clients, setClients] = useState<{ id: string; name: string | null }[]>([]);
  const [managerId, setManagerId] = useState('');
  const [form, setForm] = useState({
    beneficiary_id: '',
    visit_date: new Date().toISOString().split('T')[0],
    mood: 'good' as 'good' | 'fair' | 'concern',
    summary: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setManagerId(user.id);

      const { data } = await supabase
        .from('subscriptions')
        .select('beneficiary_id, beneficiary:beneficiary_id(id, name)')
        .eq('manager_id', user.id)
        .eq('status', 'active');

      const list = (data ?? [])
        .map((s: any) => s.beneficiary)
        .filter(Boolean) as { id: string; name: string | null }[];
      setClients(list);
      if (list.length === 1) setForm(f => ({ ...f, beneficiary_id: list[0].id }));
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.beneficiary_id) { setError('어르신을 선택해 주세요.'); return; }
    if (!form.summary.trim()) { setError('방문 내용을 작성해 주세요.'); return; }

    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: err } = await supabase.from('visit_reports').insert({
      manager_id: managerId,
      beneficiary_id: form.beneficiary_id,
      visit_date: form.visit_date,
      mood: form.mood,
      summary: form.summary.trim(),
      photos: [],
    });

    if (err) { setError(err.message); setLoading(false); return; }
    router.push('/manager');
  }

  return (
    <div className="max-w-xl mx-auto px-6 md:px-10 py-10">
      {/* Back */}
      <Link
        href="/manager"
        className="inline-flex items-center gap-1.5 text-[13px] text-mute hover:text-ink mb-8 transition-colors"
      >
        <ArrowLeft size={14} strokeWidth={1.4} />
        대시보드로
      </Link>

      <div className="mb-8">
        <p className="font-en text-[11px] tracking-[0.2em] uppercase text-mute mb-2">New Report</p>
        <h1 className="font-serif-ko font-black text-ink text-[28px]">방문 보고서 작성</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Client */}
        <div>
          <label className="block text-[11px] tracking-[0.18em] uppercase text-mute mb-2">
            방문 어르신
          </label>
          {clients.length === 0 ? (
            <p className="text-[13px] text-mute py-3">배정된 어르신이 없습니다</p>
          ) : clients.length === 1 ? (
            <p className="text-[15px] text-ink py-2 font-serif-ko">{clients[0].name}</p>
          ) : (
            <select
              value={form.beneficiary_id}
              onChange={e => setForm(f => ({ ...f, beneficiary_id: e.target.value }))}
              className="w-full bg-paper px-4 py-3 text-[14px] text-ink focus:outline-none appearance-none"
              style={border}
            >
              <option value="">어르신 선택</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-[11px] tracking-[0.18em] uppercase text-mute mb-2">
            방문 일자
          </label>
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

        {/* Mood */}
        <div>
          <label className="block text-[11px] tracking-[0.18em] uppercase text-mute mb-3">
            안부 상태
          </label>
          <div className="flex flex-col gap-2">
            {MOOD_OPTIONS.map(opt => (
              <label
                key={opt.value}
                className={`flex items-start gap-3 p-4 cursor-pointer transition-all ${
                  form.mood === opt.value
                    ? opt.color + ' border'
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
                  className="mt-0.5 accent-current"
                />
                <div>
                  <p className="text-[14px] font-medium">{opt.label}</p>
                  <p className="text-[12px] opacity-75 mt-0.5">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-[11px] tracking-[0.18em] uppercase text-mute mb-2">
            방문 내용
          </label>
          <textarea
            value={form.summary}
            onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
            rows={7}
            placeholder="오늘 방문 내용을 자세히 적어주세요. 어르신 상태, 함께 한 활동, 특이사항 등을 포함해 주세요."
            className="w-full bg-paper px-4 py-3 text-[14px] text-ink focus:outline-none resize-none leading-[1.9]"
            style={{ ...border, wordBreak: 'keep-all' }}
            required
            maxLength={2000}
          />
          <p className="text-[11px] text-mute text-right mt-1">{form.summary.length} / 2000</p>
        </div>

        {error && <p className="text-[13px] text-accent">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-primary text-surface py-3.5 text-[14px] hover:bg-primary-deep transition-colors disabled:opacity-50"
        >
          <Send size={14} strokeWidth={1.4} />
          {loading ? '제출 중...' : '보고서 제출'}
        </button>
      </form>
    </div>
  );
}
