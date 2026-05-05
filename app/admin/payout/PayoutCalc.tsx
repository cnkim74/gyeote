'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, Info } from 'lucide-react';

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

const PLANS: { key: string; label: string; price: number; color: string }[] = [
  { key: 'care_light', label: '곁에 안부',  price: 79000,  color: '#4A7A58' },
  { key: 'care',       label: '곁에 케어',  price: 149000, color: '#2C5F5D' },
  { key: 'care_deep',  label: '곁에 깊이',  price: 229000, color: '#1F4544' },
];

const INDUSTRY_REFS = [
  { label: '정부 장기요양 법적 의무', rate: 87, note: '방문요양 수가의 87.1% 인건비 의무 지출 (보건복지부 고시 2025)', color: '#8A8070' },
  { label: '정부 장기요양 실수령',    rate: 70, note: '4대보험·공제 후 요양보호사 실수령 기준 (수가의 65~75%)', color: '#8A8070' },
  { label: '민간 비급여 업체 평균',   rate: 57, note: '케어링·케어닥 등 민간 서비스 추정 (50~65%)', color: '#8A8070' },
  { label: '민간 비급여 상위 (권장)', rate: 68, note: '우수 매니저 유지를 위한 경쟁력 있는 수준 (65~75%)', color: '#2C5F5D' },
];

interface ManagerRow {
  id: string;
  name: string;
  plan: string;
  subscribers: number;
}

export function PayoutCalc({ managers }: { managers: ManagerRow[] }) {
  const [rate, setRate] = useState(65);
  const [customRates, setCustomRates] = useState<Record<string, number>>({});

  const fmt = (n: number) =>
    n.toLocaleString('ko-KR') + '원';

  // 요금제 가격 조회
  function planPrice(planKey: string) {
    return PLANS.find(p => p.key === planKey)?.price ?? 0;
  }

  // 전체 수익 합계
  const totalRevenue = managers.reduce((acc, m) => {
    return acc + planPrice(m.plan) * m.subscribers;
  }, 0);

  const totalPayout = managers.reduce((acc, m) => {
    const r = customRates[m.id] ?? rate;
    return acc + Math.round(planPrice(m.plan) * m.subscribers * r / 100);
  }, 0);

  const platformIncome = totalRevenue - totalPayout;

  return (
    <div className="flex flex-col gap-8">

      {/* 업계 비율 참고 */}
      <div className="bg-paper p-6" style={border}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={14} strokeWidth={1.4} className="text-primary" />
          <p className="text-[11px] tracking-[0.18em] uppercase text-mute font-medium">업계 지급 비율 참고</p>
        </div>
        <div className="flex flex-col gap-3">
          {INDUSTRY_REFS.map(ref => (
            <div key={ref.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] text-ink">{ref.label}</span>
                <span className="font-serif-ko font-bold text-[18px]" style={{ color: ref.color }}>
                  {ref.rate}%
                </span>
              </div>
              <div className="relative h-1.5 bg-surface rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${ref.rate}%`, background: ref.color, opacity: 0.6 }}
                />
              </div>
              <p className="text-[11px] text-mute mt-1">{ref.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2 bg-surface px-3 py-2.5">
          <Info size={12} strokeWidth={1.4} className="text-primary mt-0.5 shrink-0" />
          <p className="text-[12px] text-mute leading-[1.65]">
            곁에 방문 1회당 수익은 약 <strong className="text-ink">18,600~19,800원</strong>입니다.
            민간 평균(57%) 지급 시 회당 <strong className="text-ink">약 11,000원</strong>,
            우수 기준(68%) 지급 시 <strong className="text-ink">약 13,000원</strong>입니다.
            운영비(리포트·AI·보험·CS) 감안 시 <strong className="text-primary">60~65%</strong> 권장.
          </p>
        </div>
      </div>

      {/* 지급 비율 설정 */}
      <div className="bg-paper p-6" style={border}>
        <div className="flex items-center gap-2 mb-4">
          <Calculator size={14} strokeWidth={1.4} className="text-primary" />
          <p className="text-[11px] tracking-[0.18em] uppercase text-mute font-medium">기본 지급 비율 설정</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={40} max={80} step={1}
            value={rate}
            onChange={e => setRate(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
          <div className="w-20 shrink-0 text-right">
            <span className="font-serif-ko font-bold text-[28px] text-primary">{rate}</span>
            <span className="text-[14px] text-mute">%</span>
          </div>
        </div>
        <div className="flex justify-between text-[11px] text-mute mt-1">
          <span>40% (최소)</span>
          <span className="text-primary font-medium">권장 60~65%</span>
          <span>80% (최대)</span>
        </div>
      </div>

      {/* 매니저별 계산 */}
      {managers.length > 0 ? (
        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-mute mb-4">매니저별 지급액</p>
          <div className="flex flex-col gap-3">
            {managers.map(m => {
              const price   = planPrice(m.plan);
              const revenue = price * m.subscribers;
              const r       = customRates[m.id] ?? rate;
              const payout  = Math.round(revenue * r / 100);
              const planInfo = PLANS.find(p => p.key === m.plan);

              return (
                <div key={m.id} className="bg-paper p-5" style={border}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-[14px] text-ink font-medium">{m.name} 매니저</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-[10px] px-2 py-0.5 text-white"
                          style={{ background: planInfo?.color ?? '#666' }}
                        >
                          {planInfo?.label ?? m.plan}
                        </span>
                        <span className="text-[12px] text-mute">담당 {m.subscribers}명</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-mute">지급액</p>
                      <p className="font-serif-ko font-bold text-[20px] text-primary">{fmt(payout)}</p>
                    </div>
                  </div>

                  {/* 매니저별 개별 비율 조정 */}
                  <div className="flex items-center gap-3 pt-3 hairline-t">
                    <span className="text-[11px] text-mute shrink-0">개별 조정</span>
                    <input
                      type="range"
                      min={40} max={80} step={1}
                      value={customRates[m.id] ?? rate}
                      onChange={e => setCustomRates(prev => ({ ...prev, [m.id]: Number(e.target.value) }))}
                      className="flex-1 accent-primary"
                    />
                    <span className="text-[13px] font-medium text-ink shrink-0 w-10 text-right">
                      {customRates[m.id] ?? rate}%
                    </span>
                    {customRates[m.id] !== undefined && customRates[m.id] !== rate && (
                      <button
                        type="button"
                        onClick={() => setCustomRates(prev => { const n = { ...prev }; delete n[m.id]; return n; })}
                        className="text-[11px] text-mute underline shrink-0"
                      >
                        초기화
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                    <div className="bg-surface py-2">
                      <p className="text-[10px] text-mute">월 수익</p>
                      <p className="text-[13px] text-ink font-medium">{fmt(revenue)}</p>
                    </div>
                    <div className="bg-surface py-2">
                      <p className="text-[10px] text-mute">매니저 지급 ({r}%)</p>
                      <p className="text-[13px] text-primary font-medium">{fmt(payout)}</p>
                    </div>
                    <div className="bg-surface py-2">
                      <p className="text-[10px] text-mute">운영 수익 ({100 - r}%)</p>
                      <p className="text-[13px] text-mute">{fmt(revenue - payout)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-paper p-6 text-center text-[13px] text-mute" style={border}>
          활성 매니저가 없습니다.
        </div>
      )}

      {/* 전체 합계 */}
      <div className="bg-primary text-surface p-6">
        <p className="text-[11px] tracking-[0.18em] uppercase opacity-60 mb-5">이번 달 정산 요약</p>
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <p className="text-[11px] opacity-60 mb-1">총 수익</p>
            <p className="font-serif-ko font-bold text-[22px]">{fmt(totalRevenue)}</p>
          </div>
          <div>
            <p className="text-[11px] opacity-60 mb-1">매니저 지급 합계</p>
            <p className="font-serif-ko font-bold text-[22px] text-accent">{fmt(totalPayout)}</p>
          </div>
          <div>
            <p className="text-[11px] opacity-60 mb-1">운영 수익</p>
            <p className="font-serif-ko font-bold text-[22px]">{fmt(platformIncome)}</p>
          </div>
        </div>
        <div className="h-2 bg-surface/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: totalRevenue > 0 ? `${(totalPayout / totalRevenue) * 100}%` : '0%' }}
          />
        </div>
        <div className="flex justify-between text-[11px] opacity-50 mt-1">
          <span>매니저 {totalRevenue > 0 ? Math.round(totalPayout / totalRevenue * 100) : 0}%</span>
          <span>운영 {totalRevenue > 0 ? Math.round(platformIncome / totalRevenue * 100) : 0}%</span>
        </div>
      </div>

    </div>
  );
}
