import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  const body = await req.json();
  const { name, phone, visitDate, options, message } = body;

  if (!name?.trim() || !phone?.trim() || !visitDate) {
    return NextResponse.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('special_requests').insert({
    name: name.trim(),
    phone: phone.trim(),
    visit_date: visitDate,
    options: options ?? [],
    message: message?.trim() || null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
