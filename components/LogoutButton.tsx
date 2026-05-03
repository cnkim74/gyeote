'use client';

import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function LogoutButton({ redirectTo = '/', className }: { redirectTo?: string; className?: string }) {
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = redirectTo;
  }

  return (
    <button
      onClick={handleLogout}
      className={className ?? 'flex items-center gap-1.5 text-[13px] text-mute hover:text-ink transition-colors'}
    >
      <LogOut size={14} strokeWidth={1.4} />
      로그아웃
    </button>
  );
}
