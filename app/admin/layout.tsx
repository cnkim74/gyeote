import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import type { Profile } from '@/types';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login?redirect=/admin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') redirect('/');

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <AdminSidebar profile={profile as Profile} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
