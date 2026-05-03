import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { data: me } = await admin.from('profiles').select('role, name').eq('id', user.id).single();
  if (me?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { reportId } = await req.json();
  if (!reportId) return NextResponse.json({ error: 'reportId required' }, { status: 400 });

  // Get report with related data
  const { data: report } = await admin
    .from('visit_reports')
    .select(`
      *,
      manager:manager_id(id, name, phone),
      beneficiary:beneficiary_id(id, name, phone)
    `)
    .eq('id', reportId)
    .single();

  if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 });

  // Approve the report
  await admin.from('visit_reports').update({
    status: 'approved',
    approved_at: new Date().toISOString(),
    approved_by: user.id,
  }).eq('id', reportId);

  // Find subscription and create payment
  const { data: subscription } = await admin
    .from('subscriptions')
    .select('id, payer_id')
    .eq('beneficiary_id', report.beneficiary_id)
    .eq('manager_id', report.manager_id)
    .eq('status', 'active')
    .maybeSingle();

  if (subscription) {
    await admin.from('payments').insert({
      subscription_id: subscription.id,
      visit_report_id: reportId,
      amount: 0,
      status: 'pending',
    }).then(() => {});
  }

  // Get payer info for notifications
  let payerEmail: string | null = null;
  let payerPhone: string | null = null;
  let payerName: string | null = null;

  if (subscription?.payer_id) {
    const { data: payer } = await admin
      .from('profiles')
      .select('email, name, phone')
      .eq('id', subscription.payer_id)
      .single();
    payerEmail = payer?.email ?? null;
    payerPhone = payer?.phone ?? null;
    payerName = payer?.name ?? null;
  }

  // Get manager phone for notification
  const managerPhone = (report.manager as any)?.phone ?? null;

  const visitDate = new Date(report.visit_date + 'T00:00:00')
    .toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
  const moodLabel = ({ good: '좋음', fair: '보통', concern: '관심 필요' } as Record<string, string>)[report.mood] ?? report.mood;

  // Send email
  if (payerEmail && process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? 'onboarding@resend.dev',
        to: payerEmail,
        subject: `[곁에] ${report.beneficiary?.name ?? '어르신'} 방문 보고서가 승인되었습니다`,
        html: buildEmailHtml({
          payerName,
          beneficiaryName: report.beneficiary?.name ?? null,
          managerName: report.manager?.name ?? null,
          visitDate,
          mood: moodLabel,
          summary: report.summary,
          reportId,
          approverName: me?.name ?? null,
        }),
      });
    } catch (e) {
      console.error('[approve-report] email error:', e);
    }
  }

  // Send SMS via Aligo
  if (payerPhone && process.env.ALIGO_API_KEY && process.env.ALIGO_USER_ID && process.env.ALIGO_SENDER) {
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
      const msg = `[곁에] ${report.beneficiary?.name ?? '어르신'} 방문 보고서 승인\n방문일: ${report.visit_date}\n매니저: ${report.manager?.name ?? '—'}\n안부: ${moodLabel}\n${siteUrl ? siteUrl + '/manager/report/' + reportId : ''}`.trim();

      const params = new URLSearchParams({
        key: process.env.ALIGO_API_KEY,
        user_id: process.env.ALIGO_USER_ID,
        sender: process.env.ALIGO_SENDER,
        receiver: payerPhone.replace(/-/g, ''),
        msg,
        msg_type: 'LMS',
        title: '방문 보고서 승인 알림',
      });

      const res = await fetch('https://apis.aligo.in/send/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      const json = await res.json();
      if (json.result_code !== '1') {
        console.error('[approve-report] SMS error:', json);
      }
    } catch (e) {
      console.error('[approve-report] SMS error:', e);
    }
  }

  // SMS to manager (승인 알림)
  if (managerPhone && process.env.ALIGO_API_KEY && process.env.ALIGO_USER_ID && process.env.ALIGO_SENDER) {
    try {
      const msg = `[곁에] 보고서 승인 완료\n대상자: ${report.beneficiary?.name ?? '어르신'}\n방문일: ${report.visit_date}\n보고서가 승인되었습니다.`;
      const params = new URLSearchParams({
        key: process.env.ALIGO_API_KEY,
        user_id: process.env.ALIGO_USER_ID,
        sender: process.env.ALIGO_SENDER,
        receiver: managerPhone.replace(/-/g, ''),
        msg,
        msg_type: 'SMS',
      });
      await fetch('https://apis.aligo.in/send/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
    } catch (e) {
      console.error('[approve-report] manager SMS error:', e);
    }
  }

  return NextResponse.json({ ok: true });
}

function buildEmailHtml(data: {
  payerName: string | null;
  beneficiaryName: string | null;
  managerName: string | null;
  visitDate: string;
  mood: string;
  summary: string;
  reportId: string;
  approverName: string | null;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const reportUrl = siteUrl ? `${siteUrl}/manager/report/${data.reportId}` : '';

  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F5F3EF;font-family:-apple-system,BlinkMacSystemFont,'Noto Sans KR',sans-serif;">
  <div style="max-width:540px;margin:32px auto;background:#fff;border:0.5px solid rgba(42,40,35,0.18);">
    <div style="padding:28px 36px 22px;border-bottom:0.5px solid rgba(42,40,35,0.12);">
      <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:6px;">
        <svg width="22" height="22" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="7" width="11" height="26" rx="2.5" fill="#2C5F5D"/><rect x="21" y="16" width="13" height="17" rx="2.5" fill="#2C5F5D" opacity="0.55"/></svg>
        <span style="font-family:Georgia,serif;font-size:17px;font-weight:900;color:#2A2823;letter-spacing:-0.02em;">곁에</span>
      </div>
      <p style="margin:0;font-size:11px;color:#9B9488;letter-spacing:0.12em;text-transform:uppercase;">방문 보고서 승인 알림</p>
    </div>
    <div style="padding:32px 36px;">
      <p style="margin:0 0 24px;font-size:15px;color:#2A2823;line-height:1.8;">
        안녕하세요${data.payerName ? ', <strong>' + data.payerName + '</strong>님' : ''}.<br>
        <strong>${data.beneficiaryName ?? '어르신'}</strong>의 방문 보고서가 승인되었습니다.
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;border-top:0.5px solid rgba(42,40,35,0.15);">
        <tr>
          <td style="padding:10px 16px 10px 0;color:#9B9488;white-space:nowrap;width:90px;border-bottom:0.5px solid rgba(42,40,35,0.1);">방문 일자</td>
          <td style="padding:10px 0;color:#2A2823;font-weight:500;border-bottom:0.5px solid rgba(42,40,35,0.1);">${data.visitDate}</td>
        </tr>
        <tr>
          <td style="padding:10px 16px 10px 0;color:#9B9488;border-bottom:0.5px solid rgba(42,40,35,0.1);">담당 매니저</td>
          <td style="padding:10px 0;color:#2A2823;border-bottom:0.5px solid rgba(42,40,35,0.1);">${data.managerName ?? '—'}</td>
        </tr>
        <tr>
          <td style="padding:10px 16px 10px 0;color:#9B9488;border-bottom:0.5px solid rgba(42,40,35,0.1);">안부 상태</td>
          <td style="padding:10px 0;color:#2A2823;border-bottom:0.5px solid rgba(42,40,35,0.1);">${data.mood}</td>
        </tr>
        <tr>
          <td style="padding:10px 16px 10px 0;color:#9B9488;vertical-align:top;">방문 일지</td>
          <td style="padding:10px 0;color:#2A2823;line-height:1.9;">${data.summary.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</td>
        </tr>
      </table>
      ${reportUrl ? `<div style="margin-top:28px;">
        <a href="${reportUrl}" style="display:inline-block;background:#2C5F5D;color:#fff;text-decoration:none;padding:11px 22px;font-size:13px;letter-spacing:0.04em;">보고서 전체 보기 →</a>
      </div>` : ''}
    </div>
    <div style="padding:14px 36px;border-top:0.5px solid rgba(42,40,35,0.12);background:#F8F6F2;">
      <p style="margin:0;font-size:11px;color:#B0A898;line-height:1.7;">
        본 메일은 곁에 케어 서비스에서 자동 발송된 알림입니다.
        ${data.approverName ? '<br>승인자: ' + data.approverName : ''}
        <br>© ${new Date().getFullYear()} 곁에 케어
      </p>
    </div>
  </div>
</body>
</html>`;
}
