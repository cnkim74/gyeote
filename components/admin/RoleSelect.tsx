'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ROLE_LABELS, type UserRole } from '@/types';

const ROLES = Object.keys(ROLE_LABELS) as UserRole[];

export function RoleSelect({ userId, currentRole }: { userId: string; currentRole: UserRole }) {
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const supabase = createClient();
    await supabase.from('profiles').update({ role: e.target.value }).eq('id', userId);
    router.refresh();
  }

  return (
    <select
      defaultValue={currentRole}
      onChange={handleChange}
      className="bg-transparent text-[12.5px] text-ink py-1 px-2 focus:outline-none focus:border-primary transition-colors cursor-pointer"
      style={{ border: '0.5px solid rgba(42,40,35,0.28)' }}
    >
      {ROLES.map(r => (
        <option key={r} value={r}>
          {ROLE_LABELS[r]}
        </option>
      ))}
    </select>
  );
}
