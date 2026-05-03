import { createClient } from '@/lib/supabase/server';
import { ROLE_LABELS, type UserRole, type Profile } from '@/types';
import { RoleSelect } from '@/components/admin/RoleSelect';
import Link from 'next/link';

const ROLES = Object.keys(ROLE_LABELS) as UserRole[];

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const supabase = createClient();
  const roleFilter = searchParams.role as UserRole | undefined;

  let query = supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (roleFilter && ROLES.includes(roleFilter)) {
    query = query.eq('role', roleFilter);
  }

  const { data: users } = await query;
  const profiles = (users ?? []) as Profile[];

  const tabClass = (role?: UserRole) => {
    const active = roleFilter === role || (!role && !roleFilter);
    return `px-3.5 py-1.5 text-[12.5px] transition-colors ${
      active ? 'bg-primary text-surface' : 'bg-paper text-mute hover:text-ink'
    }`;
  };

  return (
    <div className="p-8 md:p-10">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="font-serif-ko font-black text-ink text-[28px]">회원 관리</h1>
        <span className="text-[13px] text-mute">{profiles.length}명</span>
      </div>

      {/* Role tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Link href="/admin/users" className={tabClass(undefined)} style={{ border: '0.5px solid rgba(42,40,35,0.18)' }}>
          전체
        </Link>
        {ROLES.map(r => (
          <Link
            key={r}
            href={`/admin/users?role=${r}`}
            className={tabClass(r)}
            style={{ border: '0.5px solid rgba(42,40,35,0.18)' }}
          >
            {ROLE_LABELS[r]}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden" style={{ border: '0.5px solid rgba(42,40,35,0.18)' }}>
        <table className="w-full text-[13px] bg-paper">
          <thead>
            <tr style={{ borderBottom: '0.5px solid rgba(42,40,35,0.18)' }}>
              {['이름', '이메일', '전화번호', '역할', '가입일'].map(h => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-[10.5px] tracking-[0.18em] uppercase text-mute font-normal"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {profiles.map((user, i) => (
              <tr
                key={user.id}
                style={
                  i < profiles.length - 1
                    ? { borderBottom: '0.5px solid rgba(42,40,35,0.18)' }
                    : {}
                }
              >
                <td className="px-5 py-3.5 text-ink">{user.name ?? '—'}</td>
                <td className="px-5 py-3.5 text-mute">{user.email}</td>
                <td className="px-5 py-3.5 text-mute">{user.phone ?? '—'}</td>
                <td className="px-5 py-3.5">
                  <RoleSelect userId={user.id} currentRole={user.role} />
                </td>
                <td className="px-5 py-3.5 text-mute">
                  {new Date(user.created_at).toLocaleDateString('ko-KR')}
                </td>
              </tr>
            ))}
            {profiles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-mute">
                  해당하는 회원이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
