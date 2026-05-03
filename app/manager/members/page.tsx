import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { UserPlus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import type { MemberRequest } from '@/types';

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

const STATUS = {
  pending:  { icon: Clock,         color: 'text-amber-600',  bg: 'bg-amber-50',  label: '승인 대기' },
  approved: { icon: CheckCircle,   color: 'text-[#2D6A4F]',  bg: 'bg-[#E8F4EC]', label: '승인됨' },
  rejected: { icon: XCircle,       color: 'text-[#842029]',  bg: 'bg-[#FDE8E8]', label: '반려됨' },
} as const;

export default async function MembersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const { data } = await admin
    .from('member_requests')
    .select('*')
    .eq('manager_id', user!.id)
    .order('created_at', { ascending: false });

  const requests = (data ?? []) as MemberRequest[];

  return (
    <div className="max-w-2xl mx-auto px-6 md:px-10 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-en text-[11px] tracking-[0.2em] uppercase text-mute mb-2">Members</p>
          <h1 className="font-serif-ko font-black text-ink text-[26px]">어르신 등록 관리</h1>
        </div>
        <Link
          href="/manager/members/new"
          className="flex items-center gap-2 bg-primary text-surface px-4 py-2.5 text-[13px] hover:bg-primary-deep transition-colors mt-1"
        >
          <UserPlus size={14} strokeWidth={1.4} />
          새 등록 신청
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="bg-paper p-14 text-center" style={border}>
          <UserPlus size={28} strokeWidth={1} className="mx-auto text-mute mb-4" />
          <p className="font-serif-ko text-[18px] text-ink mb-2">등록 신청 내역이 없습니다</p>
          <p className="text-[13px] text-mute mb-6">담당 어르신을 등록하면 관리자 승인 후 연결됩니다.</p>
          <Link
            href="/manager/members/new"
            className="inline-block bg-primary text-surface px-6 py-3 text-[13px] hover:bg-primary-deep transition-colors"
          >
            첫 어르신 등록하기
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map(r => {
            const st = STATUS[r.status];
            const Icon = st.icon;
            return (
              <div key={r.id} className="bg-paper px-5 py-4 flex items-center gap-4" style={border}>
                <Avatar src={r.avatar_url} name={r.name} size={44} />
                <div className="flex-1 min-w-0">
                  <p className="font-serif-ko text-[15px] text-ink">{r.name}</p>
                  {r.phone && <p className="text-[12px] text-mute mt-0.5">{r.phone}</p>}
                  {r.address && <p className="text-[11px] text-mute mt-0.5">{r.address}</p>}
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 ${st.bg}`}>
                  <Icon size={12} strokeWidth={1.4} className={st.color} />
                  <span className={`text-[11px] ${st.color}`}>{st.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
