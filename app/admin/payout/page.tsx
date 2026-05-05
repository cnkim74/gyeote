import { createAdminClient } from '@/lib/supabase/admin';
import { PayoutCalc } from './PayoutCalc';

export default async function PayoutPage() {
  const supabase = createAdminClient();

  // 매니저별 담당 구독 현황
  const { data: subs } = await supabase
    .from('subscriptions')
    .select('manager_id, plan, manager:manager_id(id, name)')
    .eq('status', 'active');

  // 매니저별로 집계
  const managerMap: Record<string, { id: string; name: string; plan: string; subscribers: number }> = {};

  for (const s of (subs ?? []) as any[]) {
    const mid = s.manager_id;
    if (!mid) continue;
    if (!managerMap[mid]) {
      managerMap[mid] = {
        id: mid,
        name: s.manager?.name ?? '이름 없음',
        plan: s.plan ?? 'care',
        subscribers: 0,
      };
    }
    managerMap[mid].subscribers += 1;
  }

  const managers = Object.values(managerMap);

  return (
    <div className="p-8 md:p-10 max-w-3xl">
      <div className="mb-8">
        <p className="font-en text-[11px] tracking-[0.2em] uppercase text-mute mb-2">Admin · Finance</p>
        <h1 className="font-serif-ko font-black text-ink text-[28px] mb-1">매니저 지급액 계산</h1>
        <p className="text-[13px] text-mute">업계 기준 지급 비율 참고 및 월 정산 금액 산출</p>
      </div>

      <PayoutCalc managers={managers} />
    </div>
  );
}
