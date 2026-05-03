import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { ReportDocument } from '@/components/ReportDocument';

export default async function ReportViewPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const admin = createAdminClient();

  const { data: report } = await admin
    .from('visit_reports')
    .select(`
      *,
      manager:manager_id(id, name, phone, avatar_url),
      beneficiary:beneficiary_id(id, name, phone, address, address_detail, avatar_url)
    `)
    .eq('id', params.id)
    .single();

  if (!report) redirect('/manager');

  let approverName: string | null = null;
  if (report.approved_by) {
    const { data: approver } = await admin
      .from('profiles')
      .select('name')
      .eq('id', report.approved_by)
      .single();
    approverName = approver?.name ?? null;
  }

  return (
    <ReportDocument
      report={report as any}
      approverName={approverName}
      backHref="/manager"
    />
  );
}
