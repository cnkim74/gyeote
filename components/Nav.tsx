'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { Wordmark } from './Wordmark';

const links: [string, string][] = [
  ['서비스', '/#service'],
  ['리포트', '/#report'],
  ['요금', '/pricing'],
  ['매니저', '/managers'],
  ['자주 묻는 질문', '/#faq'],
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ${
        scrolled
          ? 'bg-surface/[0.92] backdrop-blur-sm hairline-b'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-page mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <Link href="/#top" className="flex items-center">
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
