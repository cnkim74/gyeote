'use client';

import { useState } from 'react';
import { ArrowRight, Gift, Sparkles, ShoppingCart, Camera, Flower2, Cake } from 'lucide-react';
import { Reveal } from '../Reveal';
import Link from 'next/link';
import { G } from '../G';

const OPTIONS = [
  {
    id: 'flowers',
    icon: Flower2,
    label: '생화 꽃다발',
    desc: '지역 꽃집에서 직접 고른 싱싱한 꽃',
    est: '35,000~50,000',
  },
  {
    id: 'cake',
    icon: Cake,
    label: '생일 케이크',
    desc: '지역 베이커리 수제 케이크',
    est: '30,000~50,000',
  },
  {
    id: 'grocery',
    icon: ShoppingCart,
    label: '장보기 대행',
    desc: '필요한 식재료·생필품 구매 대행',
    est: '영수증 실비',
  },
  {
    id: 'local',
    icon: Gift,
    label: '지역 특산품',
    desc: '안동 지역 소상공인 엄선 선물',
    est: '30,000~',
  },
  {
    id: 'photo',
    icon: Camera,
    label: '기념 사진 촬영',
    desc: '소중한 순간을 사진으로 남겨 전달',
    est: '포함',
  },
];

export function SpecialDay() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const hasOptions = selected.size > 0;

  return (
    <section className="py-24 md:py-36 hairline-t" style={{ background: '#F5EFE3' }}>
      <div className="max-w-page mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="grid md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-3">
            <div className="num text-accent text-[15px]">별도 서비스</div>
            <div className="mt-2 text-[12px] tracking-[0.2em] uppercase font-en text-mute">
              Special Day
            </div>
          </div>
          <div className="md:col-span-9">
            <Reveal>
              <h2 className="font-serif-ko font-bold text-ink text-[28px] md:text-[40px] leading-[1.34] tracking-[-0.015em]">
                특별한 날,<br />
                특별하게 신청하는 <G />.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-6 text-[15px] text-ink/80 leading-[1.9] max-w-read">
                구독이 아닐 때도 곁에의 서비스를 체험할 수 있습니다.
                생신·기념일·명절 등 특별한 날, 원하는 옵션을 직접 선택하면
                전담 매니저가 직접 현장에서 구매하고 함께해 드립니다.
                비용은 <strong className="text-ink">실비 청구</strong>로 투명하게 정산됩니다.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Quote builder */}
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-7">
            <p className="text-[11px] tracking-[0.2em] uppercase font-en text-mute mb-5">옵션 선택</p>
            <div className="flex flex-col gap-3">
              {OPTIONS.map((opt, i) => {
                const active = selected.has(opt.id);
                const Icon = opt.icon;
                return (
                  <Reveal key={opt.id} delay={i * 60}>
                    <button
                      type="button"
                      onClick={() => toggle(opt.id)}
                      className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-all ${
                        active
                          ? 'bg-accent/10 ring-1 ring-accent'
                          : 'bg-paper hover:bg-paper/80 hairline'
                      }`}
                    >
                      <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${
                        active ? 'bg-accent text-white' : 'bg-surface text-mute'
                      }`}>
                        <Icon size={18} strokeWidth={1.4} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[14px] font-medium ${active ? 'text-accent' : 'text-ink'}`}>
                          {opt.label}
                        </p>
                        <p className="text-[12px] text-mute mt-0.5">{opt.desc}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-[12px] font-medium ${active ? 'text-accent' : 'text-mute'}`}>
                          {opt.est}
                        </p>
                        <p className="text-[10px] text-mute">원</p>
                      </div>
                    </button>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Quote summary */}
          <div className="md:col-span-5">
            <Reveal delay={200}>
              <div className="sticky top-24">
                <p className="text-[11px] tracking-[0.2em] uppercase font-en text-mute mb-5">자동 견적</p>
                <div className="bg-paper hairline p-7">

                  <div className="flex items-center justify-between pb-4 hairline-b">
                    <div>
                      <p className="text-[13px] text-mute">1회 기본 방문료</p>
                      <p className="text-[11px] text-mute mt-0.5">매니저 동행 · 2~3시간</p>
                    </div>
                    <p className="font-serif-ko font-bold text-[22px] text-ink">50,000<span className="text-[14px] font-normal text-mute ml-1">원</span></p>
                  </div>

                  {selected.size > 0 && (
                    <div className="py-4 hairline-b flex flex-col gap-3">
                      {OPTIONS.filter(o => selected.has(o.id)).map(opt => {
                        const Icon = opt.icon;
                        return (
                          <div key={opt.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon size={13} strokeWidth={1.4} className="text-accent" />
                              <p className="text-[13px] text-ink">{opt.label}</p>
                            </div>
                            <p className="text-[12px] text-mute">{opt.est}원 <span className="text-[10px]">실비</span></p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-5">
                    <div className="flex items-end justify-between mb-1">
                      <p className="text-[13px] text-mute">예상 합계</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[11px] text-mute">최소</span>
                        <span className="font-serif-ko font-bold text-[28px] text-ink">
                          50,000
                        </span>
                        <span className="text-[14px] text-mute">원~</span>
                      </div>
                    </div>
                    {hasOptions && (
                      <p className="text-[11px] text-mute leading-[1.7]">
                        + 선택 옵션 실비 (영수증 기준 투명 정산)
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex flex-col gap-2">
                    <div className="flex items-start gap-2 bg-surface px-4 py-3">
                      <Sparkles size={13} strokeWidth={1.4} className="text-accent mt-0.5 shrink-0" />
                      <p className="text-[12px] text-mute leading-[1.7]">
                        신청 후 전담 매니저가 직접 연락드려 일정과 세부 내용을 확정합니다.
                      </p>
                    </div>
                    <Link
                      href="/#cta"
                      className="mt-2 flex items-center justify-between px-5 py-3.5 bg-accent text-surface hover:bg-accent/90 transition-colors text-[14px]"
                    >
                      <span>특별 방문 신청하기</span>
                      <ArrowRight size={15} strokeWidth={1.4} />
                    </Link>
                  </div>
                </div>

                <p className="mt-4 text-[12px] text-mute leading-[1.7]">
                  * 이미 구독 중인 경우 담당 매니저에게 직접 요청하실 수 있습니다.<br />
                  * 실비 항목은 영수증을 촬영 후 카카오톡으로 전달해 드립니다.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
