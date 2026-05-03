'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, LayoutDashboard, LogOut } from 'lucide-react';
import { Wordmark } from './Wordmark';
import { createClient } from '@/lib/supabase/client';
import type { UserRole } from '@/types';

const links: [string, string][] = [
  ['서비스', '/#service'],
  ['리포트', '/#report'],
  ['요금', '/pricing'],
  ['매니저', '/managers'],
  ['자주 묻는 질문', '/#faq'],
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (data) setRole(data.role as UserRole);
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setRole(null);
    window.location.href = '/';
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ${
        scrolled
          ? 'bg-surface/[0.92] backdrop-blur-sm hairline-b'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-page mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Wordmark size={26} />
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-[13.5px] tracking-tight text-ink/80 hover:text-ink transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:054-000-0000"
            className="hidden md:inline-flex items-center gap-1.5 text-[13px] text-mute hover:text-ink"
          >
            <Phone size={14} strokeWidth={1.4} />
            054-000-0000
          </a>

          {role === 'admin' && (
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1.5 text-[13px] text-mute hover:text-ink transition-colors"
            >
              <LayoutDashboard size={14} strokeWidth={1.4} />
              관리자
            </Link>
          )}

          {role && role !== 'admin' && (
            <button
              onClick={handleLogout}
              className="hidden md:inline-flex items-center gap-1.5 text-[13px] text-mute hover:text-ink transition-colors"
            >
              <LogOut size={14} strokeWidth={1.4} />
              로그아웃
            </button>
          )}

          {!role && (
            <Link
              href="/auth/login"
              className="hidden md:inline-flex text-[13px] text-mute hover:text-ink transition-colors"
            >
              로그인
            </Link>
          )}

          <Link
            href="/#cta"
            className="inline-flex items-center gap-1.5 bg-primary text-surface px-4 py-2 text-[13.5px] tracking-tight hover:bg-primary-deep transition-colors"
          >
            상담 신청
            <ArrowRight size={14} strokeWidth={1.4} />
          </Link>
        </div>
      </div>
    </header>
  );
}
