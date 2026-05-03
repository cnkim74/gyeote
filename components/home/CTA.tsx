import { ArrowRight, Phone } from 'lucide-react';
import { Reveal } from '../Reveal';

export function CTA() {
  return (
    <section
      id="cta"
      className="py-28 md:py-40 hairline-t bg-primary text-surface relative overflow-hidden"
    >
      <div className="max-w-page mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-8">
          <div className="num text-surface/60 text-[15px]">no. 10</div>
          <div className="mt-2 text-[12px] tracking-[0.2em] uppercase font-en text-surface/60">
            Begin
          </div>
          <Reveal>
            <h2 className="mt-10 font-serif-ko font-bold text-[36px] md:text-[64px] lg:text-[76px] leading-[1.18] tracking-[-0.02em]">
              오늘도 곁에
              <br />
              다녀왔습니다.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-8 text-surface/85 text-[16px] md:text-[17px] leading-[1.85] max-w-[520px]">
              첫 달 50% 할인으로 시작합니다. 상담 후 일주일 내, 부모님 댁으로
              첫 인사를 다녀옵니다.
            </p>
          </Reveal>
        </div>
        <div className="md:col-span-4 md:text-right">
          <Reveal delay={200}>
            <div className="flex md:flex-col gap-4 md:items-end">
              <a
                href="#"
                className="inline-flex items-center justify-between gap-3 bg-surface text-primary px-6 py-4 min-w-[260px] text-[15px] tracking-tight hover:bg-paper transition-colors"
              >
                30일 체험으로 시작하기
                <ArrowRight size={16} strokeWidth={1.4} />
              </a>
              <a
                href="tel:054-000-0000"
                className="inline-flex items-center justify-between gap-3 hairline px-6 py-4 min-w-[260px] text-[15px] tracking-tight text-surface hover:bg-surface/10"
                style={{ borderColor: 'rgba(245,239,227,0.4)' }}
              >
                전화로 상담받기
                <Phone size={16} strokeWidth={1.4} />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
