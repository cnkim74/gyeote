import Link from 'next/link';
import { Reveal } from '../Reveal';

export function Hero() {
  return (
    <section id="top" className="relative">
      <div className="max-w-page mx-auto px-6 md:px-10 pt-28 md:pt-36">
        <div className="flex items-center justify-between text-[11.5px] tracking-[0.22em] uppercase font-en text-mute">
          <span>Vol. 01 — Autumn 2026</span>
          <span className="hidden md:inline">A Quarterly from Andong</span>
          <span>No. 01</span>
        </div>
        <div className="mt-5 hairline-t" />
      </div>

      <div className="max-w-page mx-auto px-6 md:px-10 pt-24 md:pt-40 pb-24 md:pb-40">
        <Reveal>
          <h1 className="font-serif-ko font-black text-ink leading-[1.06] tracking-[-0.025em] text-[64px] md:text-[120px] lg:text-[148px]">
            자녀를 대신해,
            <br />
            부모님 <span className="text-primary">곁에</span>.
          </h1>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-16 md:mt-24 grid md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-6 md:col-start-7">
              <p className="font-serif-ko text-[18px] md:text-[20px] text-ink/80 leading-[1.8] max-w-[440px]">
                매주 전화 너머의 “괜찮다”와
                <br />
                실제의 오늘 사이를 잇는
                <br />
                <span className="text-ink">동행 구독.</span>
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="max-w-page mx-auto px-6 md:px-10 pb-16 md:pb-24">
        <div className="hairline-t pt-6 flex flex-col md:flex-row md:items-baseline md:justify-between gap-3">
          <span className="font-en italic text-[13px] text-mute">— 운영 슬로건</span>
          <span className="font-serif-ko text-[15px] md:text-[17px] text-ink">
            오늘도 곁에 다녀왔습니다.
          </span>
          <Link
            href="/#cta"
            className="text-[12.5px] tracking-[0.18em] uppercase font-en text-primary hover:text-primary-deep ulink self-start md:self-auto"
          >
            Begin →
          </Link>
        </div>
      </div>
    </section>
  );
}
