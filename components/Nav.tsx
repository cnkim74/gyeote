'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
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
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Close menu on route change (click)
  function closeMenu() { setMenuOpen(false); }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setRole(null);
    setMenuOpen(false);
    window.location.href = '/';
  }

  const dashboardHref =
    role === 'admin'   ? '/admin' :
    role === 'paying'  ? '/dashboard' :
    role === 'manager' ? '/manager' :
    role === 'general' ? '/mypage' : null;

  const dashboardLabel =
    role === 'admin'   ? '관리자' :
    role === 'paying'  ? '내 대시보드' :
    role === 'manager' ? '매니저 페이지' :
    role === 'general' ? '내 페이지' : null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ${
        scrolled || menuOpen
          ? 'bg-surface/[0.97] backdrop-blur-sm hairline-b'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-page mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center" onClick={closeMenu}>
          <Wordmark size={26} />
        </Link>

        {/* Desktop nav */}
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

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:054-000-0000"
            className="inline-flex items-center gap-1.5 text-[13px] text-mute hover:text-ink"
          >
            <Phone size={14} strokeWidth={1.4} />
            054-000-0000
          </a>

          {dashboardHref && (
            <Link
              href={dashboardHref}
              className="inline-flex items-center gap-1.5 text-[13px] text-mute hover:text-ink transition-colors"
            >
              <LayoutDashboard size={14} strokeWidth={1.4} />
              {dashboardLabel}
            </Link>
          )}

          {role && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-[13px] text-mute hover:text-ink transition-colors"
            >
              <LogOut size={14} strokeWidth={1.4} />
              로그아웃
            </button>
          )}

          {!role && (
            <Link
              href="/auth/login"
              className="text-[13px] text-mute hover:text-ink transition-colors"
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

        {/* Mobile right */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/#cta"
            className="inline-flex items-center gap-1 bg-primary text-surface px-3.5 py-2 text-[13px] tracking-tight hover:bg-primary-deep transition-colors"
            onClick={closeMenu}
          >
            상담 신청
          </Link>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="p-2 text-ink/70 hover:text-ink transition-colors"
            aria-label="메뉴 열기"
          >
            {menuOpen ? <X size={20} strokeWidth={1.4} /> : <Menu size={20} strokeWidth={1.4} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="md:hidden bg-surface/97 backdrop-blur-sm px-6 py-5 flex flex-col gap-1"
          style={{ borderTop: '0.5px solid rgba(42,40,35,0.12)' }}
        >
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              className="py-3 text-[15px] text-ink/80 hover:text-ink transition-colors"
              style={{ borderBottom: '0.5px solid rgba(42,40,35,0.08)' }}
            >
              {label}
            </Link>
          ))}

          <div className="mt-3 flex flex-col gap-3">
            {dashboardHref && (
              <Link
                href={dashboardHref}
                onClick={closeMenu}
                className="flex items-center gap-2 text-[14px] text-primary"
              >
                <LayoutDashboard size={15} strokeWidth={1.4} />
                {dashboardLabel}
              </Link>
            )}
            {role ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-[14px] text-mute hover:text-ink transition-colors"
              >
                <LogOut size={15} strokeWidth={1.4} />
                로그아웃
              </button>
            ) : (
              <Link
                href="/auth/login"
                onClick={closeMenu}
                className="flex items-center gap-2 text-[14px] text-mute hover:text-ink transition-colors"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
