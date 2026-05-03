'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Wordmark } from '@/components/Wordmark';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  }

  const inputClass =
    'w-full bg-paper px-4 py-3 text-[14px] text-ink focus:outline-none focus:border-primary transition-colors';
  const inputStyle = { border: '0.5px solid rgba(42,40,35,0.28)' };
  const labelClass = 'block text-[11px] tracking-[0.2em] uppercase text-mute mb-2';

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex justify-center">
          <Link href="/">
            <Wordmark size={28} />
          </Link>
        </div>

        <h1 className="font-serif-ko font-black text-ink text-[26px] mb-8">회원가입</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>이름</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelClass}>이메일</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelClass}>전화번호</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelClass}>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {error && <p className="text-[13px] text-accent">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-primary text-surface py-3.5 text-[14px] tracking-tight hover:bg-primary-deep transition-colors disabled:opacity-50"
          >
            {loading ? '처리 중...' : '가입하기'}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-mute">
          이미 계정이 있으신가요?{' '}
          <Link href="/auth/login" className="text-primary hover:text-primary-deep ulink">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
