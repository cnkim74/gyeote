'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Reveal } from '../Reveal';

const items = [
  {
    q: '방문 중 사고가 발생하면 어떻게 됩니까?',
    a: '모든 매니저는 영업배상책임보험에 가입되어 있고, 곁에 본사 차원에서 별도 보장보험을 추가로 운영합니다. 사고 발생 시 매니저는 즉시 본사와 자녀분께 동시 보고하며, 병원 동행 후 24시간 내 서면 리포트를 별도로 발송드립니다.',
  },
  {
    q: '약 복용은 도와주시나요?',
    a: '복약 알림과 곁에서의 확인은 가능합니다. 다만 의료법상 직접 투여는 하지 않으며, 처방 변경이 필요한 경우 병원 동행으로 의료진과 직접 상의드립니다. 약 봉투 정리·요일별 분류는 매니저가 함께 도와드립니다.',
  },
  {
    q: '부모님이 “남이 오는 건 싫다”고 거부하시면요?',
    a: '많은 분들이 처음 한두 번은 어색해 하십니다. 곁에는 첫 두 번을 “자녀의 부탁으로 인사드리러 온 사람”의 형태로 시작하고, 세 번째부터 동행 업무를 자연스럽게 시작합니다. 그래도 어려우시면 1개월 내 전액 환불해드립니다.',
  },
  {
    q: '서비스 가능한 지역은 어디까지입니까?',
    a: '현재는 안동을 중심으로 예천 · 영주 · 의성 · 봉화 · 청송 · 영양 7개 시·군에서 운영하고 있습니다. 2026년 상반기 중 영천 · 군위로 확장 예정입니다. 그 외 지역은 대기 신청을 받고 있습니다.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number>(0);
  return (
    <section id="faq" className="py-24 md:py-36 hairline-t bg-paper">
      <div className="max-w-page mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-3">
          <div className="num text-primary text-[15px]">no. 09</div>
          <div className="mt-2 text-[12px] tracking-[0.2em] uppercase font-en text-mute">
            Questions
          </div>
        </div>
        <div className="md:col-span-9">
          <Reveal>
            <h2 className="font-serif-ko font-bold text-ink text-[28px] md:text-[40px] leading-[1.34] tracking-[-0.015em] max-w-[640px]">
              자주 받는, 진짜 걱정들.
            </h2>
          </Reveal>

          <div className="mt-12 hairline-t">
            {items.map((it, i) => {
              const isOpen = open === i;
              return (
                <div key={it.q} className="hairline-b">
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full py-6 md:py-7 flex items-start justify-between gap-6 text-left group"
                  >
                    <div className="flex items-start gap-5">
                      <span className="num text-primary text-[14px] mt-1 w-8 shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-serif-ko font-bold text-[18px] md:text-[20px] text-ink leading-[1.5]">
                        {it.q}
                      </span>
                    </div>
                    {isOpen ? (
                      <Minus
                        size={18}
                        strokeWidth={1.4}
                        className="text-mute mt-1 group-hover:text-ink transition-colors shrink-0"
                      />
                    ) : (
                      <Plus
                        size={18}
                        strokeWidth={1.4}
                        className="text-mute mt-1 group-hover:text-ink transition-colors shrink-0"
                      />
                    )}
                  </button>
                  <div
                    className={`grid transition-all duration-500 ease-out ${
                      isOpen
                        ? 'grid-rows-[1fr] opacity-100 pb-7'
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pl-[52px] pr-12 max-w-read text-[15px] text-ink/85 leading-[1.95]">
                        {it.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
