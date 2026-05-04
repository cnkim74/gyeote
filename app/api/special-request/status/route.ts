import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const VALID = ['pending', 'confirmed', 'done', 'cancelled'];

export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  if (!id || !VALID.includes(status)) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('special_requests')
    .update({ status })
    .eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
