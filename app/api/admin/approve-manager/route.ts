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

  const { applicationId, action, rejectionReason } = await request.json();
  const admin = createAdminClient();

  const { data: app } = await admin
    .from('manager_applications').select('*').eq('id', applicationId).single();
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (action === 'reject') {
    await admin.from('manager_applications').update({
      status: 'rejected',
      rejection_reason: rejectionReason ?? null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    }).eq('id', applicationId);
    return NextResponse.json({ success: true });
  }

  // Approve: create auth user with the applicant's own email
  const tempPassword = Math.random().toString(36).slice(-8) + 'Aa1!';

  const { data: authData, error: authErr } = await admin.auth.admin.createUser({
    email: app.email,
    password: tempPassword,
    email_confirm: true,
  });

  if (authErr || !authData.user) {
    return NextResponse.json({ error: authErr?.message ?? 'auth failed' }, { status: 500 });
  }

  await admin.from('profiles').insert({
    id: authData.user.id,
    email: app.email,
    name: app.name,
    phone: app.mobile ?? app.phone ?? null,
    address: app.address ?? null,
    address_detail: app.address_detail ?? null,
    avatar_url: app.photo_url ?? null,
    role: 'manager',
  });

  await admin.from('manager_applications').update({
    status: 'approved',
    reviewed_by: user.id,
    reviewed_at: new Date().toISOString(),
    created_profile_id: authData.user.id,
  }).eq('id', applicationId);

  return NextResponse.json({ success: true, profileId: authData.user.id });
}
