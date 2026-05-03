'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, ImageIcon, LogOut, ClipboardCheck } from 'lucide-react';
import { Wordmark } from '@/components/Wordmark';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types';

const NAV = [
  {
    label: null,
    items: [{ href: '/admin', label: '대시보드', icon: LayoutDashboard, exact: true }],
  },
  {
    label: '회원 관리',
    items: [
      { href: '/admin/users', label: '전체 회원', icon: Users, exact: true },
      { href: '/admin/users?role=general', label: '일반회원', icon: null },
      { href: '/admin/users?role=paying', label: '결제회원', icon: null },
      { href: '/admin/users?role=manager', label: '매니저', icon: null },
      { href: '/admin/users?role=admin', label: '관리자', icon: null },
    ],
  },
  {
    label: '방문 관리',
    items: [
      { href: '/admin/reports', label: '방문 보고서 승인', icon: ClipboardCheck, exact: false },
    ],
  },
  {
    label: '콘텐츠',
    items: [{ href: '/admin/images', label: '히어로 이미지', icon: ImageIcon, exact: false }],
  },
];

export function AdminSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  function isActive(href: string, exact?: boolean) {
    const path = href.split('?')[0];
    return exact ? pathname === path : pathname.startsWith(path);
  }

  return (
    <aside
      className="w-[260px] h-full bg-paper flex flex-col shrink-0"
      style={{ borderRight: '0.5px solid rgba(42,40,35,0.18)' }}
    >
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '0.5px solid rgba(42,40,35,0.18)' }}>
        <Link href="/" className="inline-flex items-center">
          <Wordmark size={22} />
        </Link>
        <p className="text-[10px] tracking-[0.22em] uppercase text-mute mt-1.5">관리자 콘솔</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((section, si) => (
          <div key={si} className={si > 0 ? 'mt-5' : ''}>
            {section.label && (
              <p className="px-2.5 mb-1 text-[10px] tracking-[0.2em] uppercase text-mute font-medium">
                {section.label}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map(item => {
                const active = isActive(item.href, item.exact);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded text-[13px] transition-colors ${
                      active
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-ink/65 hover:bg-ink/[0.04] hover:text-ink'
                    } ${!Icon ? 'pl-8' : ''}`}
                  >
                    {Icon && <Icon size={15} strokeWidth={1.4} className="shrink-0" />}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div
        className="px-4 py-4"
        style={{ borderTop: '0.5px solid rgba(42,40,35,0.18)' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-surface text-[12px] font-bold shrink-0">
            {(profile.name ?? profile.email)?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] text-ink font-medium truncate">{profile.name ?? '관리자'}</p>
            <p className="text-[11px] text-mute truncate">{profile.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-2.5 py-1.5 text-[13px] text-mute hover:text-ink transition-colors rounded hover:bg-ink/[0.04]"
        >
          <LogOut size={14} strokeWidth={1.4} />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
