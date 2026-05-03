'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { FeedbackForm, FeedbackDone } from '@/components/FeedbackForm';
import Link from 'next/link';
import { Wordmark } from '@/components/Wordmark';
import { Avatar } from '@/components/Avatar';

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

export default function FeedbackPage() {
  const { managerId } = useParams() as { managerId: string };
  const [manager, setManager]   = useState<{ id: string; name: string | null; avatar_url: string | null } | null>(null);
  const [reviewer, setReviewer] = useState<{ id: string; role: string } | null>(null);
  const [loading, setLoading]   = useState(true);
  const [done, setDone]         = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const [{ data: prof }, { data: mgr }] = await Promise.all([
        supabase.from('profiles').select('role').eq('id', user.id).single(),
        supabase.from('profiles').select('id, name, avatar_url').eq('id', managerId).single(),
      ]);

      setManager(mgr as any ?? null);
      if (prof) setReviewer({ id: user.id, role: prof.role });

      // Check if already submitted today
      const { count } = await supabase
        .from('manager_feedback')
        .select('id', { count: 'exact', head: true })
        .eq('manager_id', managerId)
        .eq('reviewer_id', user.id)
        .gte('created_at', new Date(new Date().setDate(new Date().getDate() - 30)).toISOString());

      if ((count ?? 0) > 0) setAlreadyDone(true);
      setLoading(false);
    })();
  }, [managerId]);

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-paper px-6 py-4" style={{ borderBottom: '0.5px solid rgba(42,40,35,0.18)' }}>
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/"><Wordmark size={20} /></Link>
          <p className="text-[12px] text-mute tracking-[0.1em]">매니저 피드백</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-5 py-10">
        {loading ? (
          <p className="text-[13px] text-mute text-center py-20">불러오는 중...</p>
        ) : !reviewer ? (
          <div className="text-center py-16">
            <p className="text-[14px] text-ink mb-4">피드백을 남기려면 로그인이 필요합니다</p>
            <Link href="/auth/login" className="inline-block bg-primary text-surface px-6 py-3 text-[13px] hover:bg-primary-deep transition-colors">
              로그인하기
            </Link>
          </div>
        ) : !manager ? (
          <p className="text-[13px] text-mute text-center py-20">매니저 정보를 찾을 수 없습니다</p>
        ) : alreadyDone || done ? (
          <FeedbackDone managerName={manager.name ?? '매니저'} />
        ) : (
          <>
            {/* Manager profile */}
            <div className="flex items-center gap-4 mb-8 bg-paper px-5 py-4" style={border}>
              <Avatar src={manager.avatar_url} name={manager.name} size={56} />
              <div>
                <p className="font-serif-ko text-[18px] text-ink">{manager.name ?? '—'}</p>
                <p className="text-[12px] text-mute mt-0.5">곁에 케어 매니저</p>
              </div>
            </div>

            <div className="mb-6">
              <h1 className="font-serif-ko font-black text-ink text-[22px] mb-1">피드백 작성</h1>
              <p className="text-[13px] text-mute leading-[1.8]">
                매니저의 서비스 품질을 평가해 주세요.<br />
                소중한 의견이 우수 매니저 선정에 반영됩니다.
              </p>
            </div>

            <FeedbackForm
              managerId={managerId}
              managerName={manager.name ?? '매니저'}
              reviewerId={reviewer.id}
              reviewerRole={reviewer.role}
              onDone={() => setDone(true)}
            />
          </>
        )}
      </div>
    </div>
  );
}
