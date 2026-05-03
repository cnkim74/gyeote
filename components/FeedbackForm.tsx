'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Send, CheckCircle, EyeOff } from 'lucide-react';

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

const CATEGORIES = [
  { key: 'score_kindness',       label: '친절도',     desc: '따뜻함·배려' },
  { key: 'score_professionalism',label: '전문성',     desc: '케어 역량' },
  { key: 'score_punctuality',    label: '시간 준수',  desc: '약속 시간 엄수' },
  { key: 'score_communication',  label: '의사소통',   desc: '가족과 소통' },
  { key: 'score_overall',        label: '전반 만족도',desc: '종합 평가' },
] as const;

type ScoreKey = typeof CATEGORIES[number]['key'];
type Scores = Record<ScoreKey, number>;

function StarRow({ label, desc, value, onChange }: {
  label: string; desc: string; value: number; onChange: (n: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  return (
    <div className="flex items-center gap-4 py-2.5" style={{ borderBottom: '0.5px solid rgba(42,40,35,0.07)' }}>
      <div className="w-[90px] shrink-0">
        <p className="text-[13px] text-ink font-medium">{label}</p>
        <p className="text-[11px] text-mute">{desc}</p>
      </div>
      <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(value === n ? 0 : n)}
            onMouseEnter={() => setHovered(n)}
            className="transition-transform hover:scale-110"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"
                fill={n <= active ? '#E8A318' : 'none'}
                stroke={n <= active ? '#E8A318' : 'rgba(42,40,35,0.22)'}
                strokeWidth="1.5" strokeLinejoin="round"
              />
            </svg>
          </button>
        ))}
      </div>
      <span className={`text-[12px] w-[32px] shrink-0 ${value > 0 ? 'text-[#B5820A] font-medium' : 'text-mute/40'}`}>
        {value > 0 ? `${value}점` : '—'}
      </span>
    </div>
  );
}

interface FeedbackFormProps {
  managerId: string;
  managerName: string;
  reviewerId: string;
  reviewerRole: string;
  onDone: () => void;
}

export function FeedbackForm({ managerId, managerName, reviewerId, reviewerRole, onDone }: FeedbackFormProps) {
  const [scores, setScores] = useState<Scores>({
    score_kindness: 0,
    score_professionalism: 0,
    score_punctuality: 0,
    score_communication: 0,
    score_overall: 0,
  });
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const filled = Object.values(scores).filter(v => v > 0).length;
  const avg = filled > 0
    ? (Object.values(scores).reduce((s, v) => s + v, 0) / 5).toFixed(1)
    : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (filled < 3) { setError('최소 3개 항목에 별점을 입력해 주세요.'); return; }
    setSubmitting(true);
    setError('');

    const supabase = createClient();
    const { error: err } = await supabase.from('manager_feedback').insert({
      manager_id: managerId,
      reviewer_id: reviewerId,
      reviewer_role: reviewerRole,
      ...scores,
      comment: comment.trim() || null,
      is_anonymous: isAnonymous,
    });

    if (err) { setError('제출 중 오류가 발생했습니다.'); setSubmitting(false); return; }
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Score categories */}
      <div className="bg-paper p-5" style={border}>
        <p className="text-[10.5px] tracking-[0.15em] uppercase text-mute mb-1">
          {managerName} 매니저 평가
        </p>
        {avg && (
          <p className="text-[28px] font-black text-[#B5820A] mb-3">{avg} <span className="text-[14px] font-normal text-mute">/ 5.0</span></p>
        )}
        <div className="flex flex-col">
          {CATEGORIES.map(cat => (
            <StarRow
              key={cat.key}
              label={cat.label}
              desc={cat.desc}
              value={scores[cat.key]}
              onChange={v => setScores(s => ({ ...s, [cat.key]: v }))}
            />
          ))}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-[11px] tracking-[0.15em] uppercase text-mute mb-2">
          한 마디 (선택)
        </label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="매니저에 대한 소감이나 개선 사항을 자유롭게 작성해 주세요"
          className="w-full bg-paper px-4 py-3 text-[14px] text-ink focus:outline-none resize-none leading-[1.8]"
          style={border}
        />
        <p className="text-[11px] text-mute text-right mt-1">{comment.length} / 500</p>
      </div>

      {/* Anonymous toggle */}
      <label className="flex items-center gap-3 cursor-pointer self-start">
        <div
          onClick={() => setIsAnonymous(v => !v)}
          className={`relative w-10 h-5 rounded-full transition-colors ${isAnonymous ? 'bg-primary' : 'bg-mute/25'}`}
        >
          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isAnonymous ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
        <div className="flex items-center gap-1.5 text-[13px] text-mute">
          <EyeOff size={13} strokeWidth={1.4} />
          익명으로 제출
        </div>
      </label>

      {error && <p className="text-[13px] text-accent">{error}</p>}

      <button
        type="submit"
        disabled={submitting || filled < 3}
        className="flex items-center justify-center gap-2 bg-primary text-surface py-3.5 text-[14px] hover:bg-primary-deep transition-colors disabled:opacity-50"
      >
        <Send size={14} strokeWidth={1.4} />
        {submitting ? '제출 중...' : '피드백 제출'}
      </button>
    </form>
  );
}

export function FeedbackDone({ managerName }: { managerName: string }) {
  return (
    <div className="text-center py-10">
      <CheckCircle size={44} strokeWidth={1.2} className="text-primary mx-auto mb-4" />
      <p className="font-serif-ko text-[20px] text-ink mb-2">감사합니다</p>
      <p className="text-[13.5px] text-mute leading-[1.8]">
        {managerName} 매니저에 대한 피드백이 접수되었습니다.<br />
        소중한 의견이 서비스 개선에 활용됩니다.
      </p>
    </div>
  );
}
