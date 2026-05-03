import { Reveal } from '../Reveal';

export function Problem() {
  return (
    <section className="py-32 md:py-48 hairline-t">
      <div className="max-w-page mx-auto px-6 md:px-10">
        <div className="flex items-baseline justify-between mb-24 md:mb-36">
          <span className="num text-primary text-[15px]">no. 02</span>
          <span className="text-[11.5px] tracking-[0.22em] uppercase font-en text-mute">
            The Distance
          </span>
        </div>

        <Reveal>
          <h2 className="font-serif-ko font-bold text-ink text-[34px] md:text-[60px] lg:text-[68px] leading-[1.22] tracking-[-0.02em] max-w-[18ch]">
            자녀는 멀리 있고,
            <br />
            부모는 점점
            <br />
            도움이 필요해집니다.
          </h2>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-32 md:mt-44 grid md:grid-cols-12 gap-6">
            <div className="md:col-span-6 md:col-start-7">
              <blockquote className="font-serif-ko text-[20px] md:text-[24px] text-ink/85 leading-[1.7] max-w-[520px]">
                “전화로는 어머니의 걸음걸이가 보이지 않더군요.
                <span className="text-primary"> 그게 가장 무서웠습니다.”</span>
              </blockquote>
              <div className="mt-6 hairline-t pt-3 text-[12px] text-mute font-en italic">
                — 서울 거주 김OO 님 · 어머니 안동
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
