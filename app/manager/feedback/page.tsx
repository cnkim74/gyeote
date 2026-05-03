'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Star, MessageSquare, TrendingUp, Award } from 'lucide-react';

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

const CATEGORIES = [
  { key: 'score_kindness',        label: '친절도' },
  { key: 'score_professionalism', label: '전문성' },
  { key: 'score_punctuality',     label: '시간 준수' },
  { key: 'score_communication',   label: '의사소통' },
  { key: 'score_overall',         label: '전반 만족도' },
];

function avg(arr: number[]) {
  const valid = arr.filter(v => v > 0);
  return valid.length ? valid.reduce((s, v) => s + v, 0) / valid.length : null;
}

function StarBar({ score }: { score: number | null }) {
  const pct = score ? (score / 5) * 100 : 0;
  return (
    <div className="flex items-center gap-3 flex-1">
      <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-[#E8A318] transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-[12px] w-8 text-right shrink-0 ${score ? 'text-[#B5820A] font-medium' : 'text-mute/40'}`}>
        {score ? score.toFixed(1) : '—'}
      </span>
    </div>
  );
}

function StarDisplay({ score, size = 18 }: { score: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => {
        const fill = n <= Math.floor(score) ? 1 : n - 1 < score ? score - (n - 1) : 0;
        return (
          <svg key={n} width={size} height={size} viewBox="0 0 24 24" fill="none">
            <defs>
              <linearGradient id={`g${n}`}>
                <stop offset={`${fill * 100}%`} stopColor="#E8A318" />
                <stop offset={`${fill * 100}%`} stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"
              fill={fill === 1 ? '#E8A318' : fill === 0 ? 'none' : `url(#g${n})`}
              stroke="#E8A318" strokeWidth="1.2" strokeLinejoin="round"
              opacity={fill === 0 ? 0.25 : 1}
            />
          </svg>
        );
      })}
    </div>
  );
}

export default function ManagerFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [awardNote, setAwardNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const [{ data: feedData }, { data: prof }] = await Promise.all([
        supabase.from('manager_feedback').select('*').eq('manager_id', user.id).order('created_at', { ascending: false }),
        supabase.from('profiles').select('is_featured_manager, award_note').eq('id', user.id).single(),
      ]);

      setFeedbacks(feedData ?? []);
      setIsFeatured(!!(prof as any)?.is_featured_manager);
      setAwardNote((prof as any)?.award_note ?? '');
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="p-10 text-[13px] text-mute">불러오는 중...</div>;

  const total = feedbacks.length;
  const catAvgs = CATEGORIES.map(c => ({ ...c, val: avg(feedbacks.map(f => f[c.key] ?? 0)) }));
  const overallAvg = avg(feedbacks.flatMap(f =>
    [f.score_kindness, f.score_professionalism, f.score_punctuality, f.score_communication, f.score_overall].filter(Boolean)
  ));

  const withComments = feedbacks.filter(f => f.comment);

  return (
    <div className="max-w-xl mx-auto px-6 md:px-10 py-10">
      <div className="mb-8">
        <p className="font-en text-[11px] tracking-[0.2em] uppercase text-mute mb-2">My Feedback</p>
        <h1 className="font-serif-ko font-black text-ink text-[26px]">받은 피드백</h1>
      </div>

      {/* Award badge */}
      {isFeatured && (
        <div className="flex items-center gap-3 bg-amber-50 px-5 py-4 mb-6"
          style={{ border: '0.5px solid rgba(181,137,0,0.4)' }}>
          <Award size={22} strokeWidth={1.4} className="text-amber-600 shrink-0" />
          <div>
            <p className="text-[13px] font-medium text-amber-800">우수 매니저로 선정되셨습니다</p>
            {awardNote && <p className="text-[12px] text-amber-700 mt-0.5">{awardNote}</p>}
          </div>
        </div>
      )}

      {total === 0 ? (
        <div className="bg-paper p-14 text-center" style={border}>
          <Star size={28} strokeWidth={1} className="mx-auto text-mute mb-3" />
          <p className="text-[14px] text-mute">아직 받은 피드백이 없습니다</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Overall score */}
          <div className="bg-paper p-6" style={border}>
            <div className="flex items-end gap-4 mb-5">
              <div>
                <p className="text-[10.5px] tracking-[0.15em] uppercase text-mute mb-1">종합 점수</p>
                <p className="text-[48px] font-black text-[#B5820A] leading-none">
                  {overallAvg ? overallAvg.toFixed(1) : '—'}
                </p>
                <p className="text-[12px] text-mute mt-1">/ 5.0  ·  {total}개 평가</p>
              </div>
              {overallAvg && (
                <div className="mb-2">
                  <StarDisplay score={overallAvg} size={24} />
                </div>
              )}
            </div>

            {/* Category bars */}
            <div className="flex flex-col gap-3 pt-4" style={{ borderTop: '0.5px solid rgba(42,40,35,0.10)' }}>
              {catAvgs.map(c => (
                <div key={c.key} className="flex items-center gap-3">
                  <span className="text-[12.5px] text-ink w-[76px] shrink-0">{c.label}</span>
                  <StarBar score={c.val} />
                </div>
              ))}
            </div>
          </div>

          {/* Trend hint */}
          {total >= 3 && (
            <div className="flex items-center gap-2 px-4 py-3 bg-primary/[0.04]"
              style={{ border: '0.5px solid rgba(44,95,93,0.18)' }}>
              <TrendingUp size={14} strokeWidth={1.4} className="text-primary shrink-0" />
              <p className="text-[12.5px] text-primary/80">
                {overallAvg && overallAvg >= 4.0
                  ? '훌륭한 점수를 유지하고 있습니다. 우수 매니저 선정 대상입니다.'
                  : '꾸준한 피드백 개선으로 우수 매니저에 도전해 보세요.'}
              </p>
            </div>
          )}

          {/* Comments */}
          {withComments.length > 0 && (
            <div className="bg-paper p-5" style={border}>
              <p className="text-[10.5px] tracking-[0.15em] uppercase text-mute mb-4 flex items-center gap-1.5">
                <MessageSquare size={11} strokeWidth={1.4} />
                메시지 ({withComments.length}개)
              </p>
              <div className="flex flex-col gap-4">
                {withComments.slice(0, 10).map((f, i) => (
                  <div key={f.id} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-mute">
                        {f.is_anonymous ? '익명' : (
                          f.reviewer_role === 'paying' ? '보호자' : '어르신'
                        )} · {f.created_at?.slice(0, 10).replace(/-/g, '.')}
                      </p>
                      {f.score_overall > 0 && (
                        <StarDisplay score={f.score_overall} size={12} />
                      )}
                    </div>
                    <p className="text-[13.5px] text-ink/80 leading-[1.7]">{f.comment}</p>
                    {i < withComments.slice(0, 10).length - 1 && (
                      <div className="mt-2" style={{ borderBottom: '0.5px solid rgba(42,40,35,0.08)' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
