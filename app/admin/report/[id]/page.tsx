import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ReportDocument } from '@/components/ReportDocument';

export default async function AdminReportViewPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const admin = createAdminClient();

  const { data: report } = await admin
    .from('visit_reports')
    .select(`
      *,
      manager:manager_id(id, name, phone),
      beneficiary:beneficiary_id(id, name, phone, address, address_detail)
    `)
    .eq('id', params.id)
    .single();

  if (!report) redirect('/admin/reports');

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
    <div className="py-6">
      <ReportDocument
        report={report as any}
        approverName={approverName}
        backHref="/admin/reports"
      />
    </div>
  );
}
