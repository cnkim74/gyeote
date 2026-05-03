import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single();
  if (me?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { reportId, reason } = await req.json();
  if (!reportId || !reason?.trim()) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  await admin.from('visit_reports').update({
    status: 'rejected',
    rejection_reason: reason.trim(),
  }).eq('id', reportId);

  return NextResponse.json({ ok: true });
}
