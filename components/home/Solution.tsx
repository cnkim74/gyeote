import { CreditCard, Footprints, MessageCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Reveal } from '../Reveal';

type Step = {
  n: string;
  title: string;
  body: string;
  Icon: LucideIcon;
};

const steps: Step[] = [
  {
    n: '01',
    title: '자녀가 결제합니다',
    body: '월 구독으로 부모님께 드릴 동행 횟수를 정합니다. 결제는 자녀, 사용은 부모님 — 카드 정보는 부모님께 노출되지 않습니다.',
    Icon: CreditCard,
  },
  {
    n: '02',
    title: '매니저가 방문합니다',
    body: '안동 거점 매니저가 약속된 날, 부모님 댁으로 찾아뵙습니다. 병원·행정·장보기·말벗 — 그날 필요한 동행을 함께 합니다.',
    Icon: Footprints,
  },
  {
    n: '03',
    title: '카톡으로 전해드립니다',
    body: '방문이 끝나면 그날의 안부와 사진 한 장이 자녀의 카카오톡으로 도착합니다. 호들갑 없이, 차분한 어른의 어조로.',
    Icon: MessageCircle,
  },
];

export function Solution() {
  return (
    <section id="service" className="py-24 md:py-36 hairline-t bg-paper">
      <div className="max-w-page mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 mb-16 md:mb-24">
          <div className="md:col-span-3">
            <div className="num text-primary text-[15px]">no. 03</div>
            <div className="mt-2 text-[12px] tracking-[0.2em] uppercase font-en text-mute">
              How it works
            </div>
          </div>
          <div className="md:col-span-9">
            <Reveal>
              <h2 className="font-serif-ko font-bold text-ink text-[28px] md:text-[40px] leading-[1.34] tracking-[-0.015em] max-w-[760px]">
                결제는 자녀가, 사용은 부모님이.
                <br />
                매니저가 그 사이를 잇습니다.
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="grid md:grid-cols-3 hairline-t">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 120}>
              <div
                className={`p-8 md:p-10 h-full ${i < steps.length - 1 ? 'hairline-b md:border-b-0' : ''}`}
                style={{
                  borderRight:
                    i < 2 ? '0.5px solid rgba(42,40,35,0.18)' : 'none',
                }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="num text-primary text-[34px]">{s.n}</span>
                  <s.Icon
                    size={20}
                    strokeWidth={1.3}
                    className="text-primary/70"
                  />
                </div>
                <h3 className="mt-8 font-serif-ko font-bold text-[22px] text-ink">
                  {s.title}
                </h3>
                <p className="mt-4 text-[14.5px] text-ink/80 leading-[1.85]">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
