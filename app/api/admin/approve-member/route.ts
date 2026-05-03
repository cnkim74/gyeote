import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { requestId, action, rejectionReason } = await request.json();
  const admin = createAdminClient();

  const { data: req } = await admin
    .from('member_requests').select('*').eq('id', requestId).single();
  if (!req) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (action === 'reject') {
    await admin.from('member_requests').update({
      status: 'rejected',
      rejection_reason: rejectionReason ?? null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    }).eq('id', requestId);
    return NextResponse.json({ success: true });
  }

  // Approve: create auth user + profile
  const email = `member-${req.id.replace(/-/g, '').slice(0, 10)}@gyeote.care`;
  const password = Math.random().toString(36).slice(-8) + 'A1!';

  const { data: authData, error: authErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authErr || !authData.user) {
    return NextResponse.json({ error: authErr?.message ?? 'auth failed' }, { status: 500 });
  }

  await admin.from('profiles').insert({
    id: authData.user.id,
    email,
    name: req.name,
    phone: req.phone ?? null,
    address: req.address ?? null,
    address_detail: req.address_detail ?? null,
    avatar_url: req.avatar_url ?? null,
    role: 'general',
  });

  await admin.from('member_requests').update({
    status: 'approved',
    reviewed_by: user.id,
    reviewed_at: new Date().toISOString(),
    created_profile_id: authData.user.id,
  }).eq('id', requestId);

  return NextResponse.json({ success: true, profileId: authData.user.id });
}
