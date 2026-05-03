'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { createAdminClient } from '@/lib/supabase/admin';
import { Award, Star, MessageSquare, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { Avatar } from '@/components/Avatar';

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

const CATEGORIES = [
  { key: 'score_kindness',        label: '친절도' },
  { key: 'score_professionalism', label: '전문성' },
  { key: 'score_punctuality',     label: '시간 준수' },
  { key: 'score_communication',   label: '의사소통' },
  { key: 'score_overall',         label: '전반 만족도' },
];

const PERIOD_OPTIONS = [
  { label: '전체 기간', value: 'all' },
  { label: '이번 달',   value: 'month' },
  { label: '3개월',     value: 'quarter' },
];

function avg(nums: number[]) {
  const v = nums.filter(n => n > 0);
  return v.length ? v.reduce((s, n) => s + n, 0) / v.length : 0;
}

function StarBar({ score, max = 5 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-1 bg-surface rounded-full overflow-hidden">
        <div className="h-full bg-[#E8A318]" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] text-[#B5820A] w-6 text-right shrink-0">
        {score > 0 ? score.toFixed(1) : '—'}
      </span>
    </div>
  );
}

function MedalIcon({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-[18px]">🥇</span>;
  if (rank === 2) return <span className="text-[18px]">🥈</span>;
  if (rank === 3) return <span className="text-[18px]">🥉</span>;
  return <span className="text-[13px] text-mute w-6 text-center">{rank}</span>;
}

interface ManagerRank {
  id: string;
  name: string | null;
  avatar_url: string | null;
  is_featured_manager: boolean;
  award_note: string | null;
  feedbacks: any[];
  avgScore: number;
  count: number;
}

export default function AdminRankingsPage() {
  const [rankings, setRankings] = useState<ManagerRank[]>([]);
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [awarding, setAwarding] = useState<string | null>(null);
  const [awardNoteInput, setAwardNoteInput] = useState('');

  async function load() {
    setLoading(true);
    const supabase = createClient();

    let since: string | null = null;
    if (period === 'month') since = new Date(new Date().setDate(1)).toISOString().split('T')[0];
    if (period === 'quarter') since = new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0];

    // Fetch all managers
    const { data: managers } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, is_featured_manager, award_note')
      .eq('role', 'manager')
      .order('name');

    // Fetch feedbacks
    let query = supabase.from('manager_feedback').select('*');
    if (since) query = query.gte('created_at', since);
    const { data: feedbacks } = await query;

    const fbMap: Record<string, any[]> = {};
    for (const fb of feedbacks ?? []) {
      if (!fbMap[fb.manager_id]) fbMap[fb.manager_id] = [];
      fbMap[fb.manager_id].push(fb);
    }

    const ranked: ManagerRank[] = (managers ?? []).map(m => {
      const fbs = fbMap[m.id] ?? [];
      const allScores = fbs.flatMap((f: any) =>
        [f.score_kindness, f.score_professionalism, f.score_punctuality, f.score_communication, f.score_overall].filter(Boolean)
      );
      return {
        ...m,
        is_featured_manager: !!(m as any).is_featured_manager,
        award_note: (m as any).award_note ?? null,
        feedbacks: fbs,
        avgScore: avg(allScores),
        count: fbs.length,
      };
    }).sort((a, b) => b.avgScore - a.avgScore);

    setRankings(ranked);
    setLoading(false);
  }

  useEffect(() => { load(); }, [period]);

  async function handleAward(managerId: string, note: string) {
    const supabase = createClient();
    await supabase.from('profiles').update({
      is_featured_manager: true,
      award_note: note || null,
    }).eq('id', managerId);
    setAwarding(null);
    setAwardNoteInput('');
    load();
  }

  async function removeAward(managerId: string) {
    const supabase = createClient();
    await supabase.from('profiles').update({
      is_featured_manager: false,
      award_note: null,
    }).eq('id', managerId);
    load();
  }

  const topAvg = rankings[0]?.avgScore ?? 0;

  return (
    <div className="p-8 md:p-10 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-serif-ko font-black text-ink text-[28px] mb-1">우수 매니저 포상</h1>
        <p className="text-[13px] text-mute">결재자·어르신 피드백 점수 기준 매니저 순위입니다.</p>
      </div>

      {/* Period filter */}
      <div className="flex gap-1 mb-6">
        {PERIOD_OPTIONS.map(opt => (
          <button key={opt.value} onClick={() => setPeriod(opt.value)}
            className={`px-4 py-2 text-[12.5px] transition-colors ${
              period === opt.value
                ? 'bg-primary text-surface'
                : 'bg-paper text-mute hover:text-ink'
            }`} style={border}>
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[13px] text-mute">불러오는 중...</p>
      ) : rankings.length === 0 ? (
        <div className="bg-paper p-14 text-center" style={border}>
          <Trophy size={28} strokeWidth={1} className="mx-auto text-mute mb-3" />
          <p className="text-[14px] text-mute">등록된 매니저가 없습니다</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rankings.map((m, idx) => {
            const rank = idx + 1;
            const catAvgs = CATEGORIES.map(c => ({
              label: c.label,
              val: avg(m.feedbacks.map((f: any) => f[c.key] ?? 0)),
            }));
            const isExpanded = expanded === m.id;
            const isAwarding = awarding === m.id;
            const comments = m.feedbacks.filter((f: any) => f.comment);

            return (
              <div key={m.id} className={`bg-paper ${m.is_featured_manager ? 'ring-1 ring-amber-300' : ''}`} style={border}>
                {/* Row */}
                <div className="px-5 py-4 flex items-center gap-4">
                  <div className="w-8 flex items-center justify-center shrink-0">
                    <MedalIcon rank={rank} />
                  </div>
                  <Avatar src={m.avatar_url} name={m.name} size={44} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[15px] font-medium text-ink">{m.name ?? '—'}</p>
                      {m.is_featured_manager && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5"
                          style={{ border: '0.5px solid rgba(181,137,0,0.35)' }}>
                          <Award size={9} /> 우수 매니저
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {m.avgScore > 0 ? (
                        <>
                          <span className="text-[14px] font-black text-[#B5820A]">{m.avgScore.toFixed(2)}</span>
                          <span className="text-[11px] text-mute">/ 5.0</span>
                        </>
                      ) : (
                        <span className="text-[12px] text-mute">평가 없음</span>
                      )}
                      <span className="text-[11px] text-mute flex items-center gap-1">
                        <MessageSquare size={10} strokeWidth={1.4} />
                        {m.count}개
                      </span>
                    </div>
                  </div>

                  {/* Score bar */}
                  {m.avgScore > 0 && (
                    <div className="w-[120px] shrink-0">
                      <div className="h-2 bg-surface rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#E8A318] rounded-full transition-all"
                          style={{ width: `${(m.avgScore / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setExpanded(isExpanded ? null : m.id)}
                    className="text-mute hover:text-ink transition-colors shrink-0"
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div style={{ borderTop: '0.5px solid rgba(42,40,35,0.10)' }}>
                    {/* Category breakdown */}
                    {m.count > 0 && (
                      <div className="px-5 py-4 grid grid-cols-1 gap-2"
                        style={{ borderBottom: '0.5px solid rgba(42,40,35,0.08)' }}>
                        {catAvgs.map(c => (
                          <div key={c.label} className="flex items-center gap-2">
                            <span className="text-[12px] text-mute w-[76px] shrink-0">{c.label}</span>
                            <StarBar score={c.val} />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Recent comments */}
                    {comments.length > 0 && (
                      <div className="px-5 py-4" style={{ borderBottom: '0.5px solid rgba(42,40,35,0.08)' }}>
                        <p className="text-[10px] tracking-[0.15em] uppercase text-mute mb-3">최근 코멘트</p>
                        <div className="flex flex-col gap-2.5">
                          {comments.slice(0, 3).map((f: any) => (
                            <div key={f.id}>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] text-mute">
                                  {f.is_anonymous ? '익명' : f.reviewer_role === 'paying' ? '보호자' : '어르신'}
                                </span>
                                <span className="text-[10px] text-mute">·</span>
                                <span className="text-[10px] text-mute">{f.created_at?.slice(0, 10)}</span>
                              </div>
                              <p className="text-[13px] text-ink/75 leading-[1.6]">{f.comment}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Award actions */}
                    <div className="px-5 py-4">
                      {isAwarding ? (
                        <div className="flex flex-col gap-2">
                          <input
                            value={awardNoteInput}
                            onChange={e => setAwardNoteInput(e.target.value)}
                            placeholder="포상 내용 (예: 2026년 5월 우수 매니저)"
                            className="w-full bg-surface px-3 py-2.5 text-[13px] focus:outline-none"
                            style={border}
                          />
                          <div className="flex gap-2">
                            <button onClick={() => handleAward(m.id, awardNoteInput)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] bg-amber-500 text-white hover:bg-amber-600 transition-colors">
                              <Award size={13} strokeWidth={1.4} /> 포상 확정
                            </button>
                            <button onClick={() => { setAwarding(null); setAwardNoteInput(''); }}
                              className="px-4 py-2 text-[13px] text-mute bg-paper hover:text-ink" style={border}>
                              취소
                            </button>
                          </div>
                        </div>
                      ) : m.is_featured_manager ? (
                        <div className="flex items-center gap-3">
                          <p className="text-[12.5px] text-amber-700 flex-1">
                            {m.award_note || '우수 매니저 선정됨'}
                          </p>
                          <button onClick={() => removeAward(m.id)}
                            className="text-[12px] text-mute hover:text-accent transition-colors underline">
                            포상 취소
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAwarding(m.id)}
                          className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
                          style={{ border: '0.5px solid rgba(181,137,0,0.3)' }}
                        >
                          <Award size={14} strokeWidth={1.4} />
                          우수 매니저 포상
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
