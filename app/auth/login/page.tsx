'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Wordmark } from '@/components/Wordmark';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError || !user) {
      setError(authError?.message ?? '로그인 실패');
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // 전체 페이지 리로드로 쿠키 동기화 보장
    window.location.href = profile?.role === 'admin' ? '/admin' : '/';
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex justify-center">
          <Link href="/">
            <Wordmark size={28} />
          </Link>
        </div>

        <h1 className="font-serif-ko font-black text-ink text-[26px] mb-8">로그인</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[11px] tracking-[0.2em] uppercase text-mute mb-2">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-paper px-4 py-3 text-[14px] text-ink focus:outline-none focus:border-primary transition-colors"
              style={{ border: '0.5px solid rgba(42,40,35,0.28)' }}
            />
          </div>

          <div>
            <label className="block text-[11px] tracking-[0.2em] uppercase text-mute mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-paper px-4 py-3 text-[14px] text-ink focus:outline-none focus:border-primary transition-colors"
              style={{ border: '0.5px solid rgba(42,40,35,0.28)' }}
            />
          </div>

          {error && <p className="text-[13px] text-accent">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-primary text-surface py-3.5 text-[14px] tracking-tight hover:bg-primary-deep transition-colors disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-mute">
          계정이 없으신가요?{' '}
          <Link href="/auth/signup" className="text-primary hover:text-primary-deep ulink">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
