import Link from 'next/link';
import { ArrowRight, Minus } from 'lucide-react';
import { Reveal } from '../Reveal';

type Tier = {
  name: string;
  sub: string;
  price: string;
  visits: string;
  bullets: string[];
  cta: string;
  featured?: boolean;
};

const tiers: Tier[] = [
  {
    name: '곁에 안부',
    sub: '한 달에 두 번, 짧은 안부',
    price: '80,000',
    visits: '월 2회 안부 방문',
    bullets: [
      '회당 1시간 내외 댁내 동행',
      '식사·복약·안색 확인',
      '카카오톡 리포트 (사진 포함)',
    ],
    cta: '안부 시작하기',
  },
  {
    name: '곁에 케어',
    sub: '가장 많이 선택하시는 동행',
    price: '220,000',
    visits: '월 4회 종합 동행',
    bullets: [
      '회당 2~3시간 동행',
      '병원·약국·면사무소 동행',
      '장보기·세탁·간단 가사',
      '카카오톡 리포트 + 월간 요약',
    ],
    cta: '케어로 시작하기',
    featured: true,
  },
  {
    name: '곁에 깊이',
    sub: '주 2회 + 비상 시 곁에',
    price: '450,000',
    visits: '주 2회 + 긴급 on-call',
    bullets: [
      '주 2회 정기 동행',
      '24시간 긴급 연락 매니저 배정',
      '병원 입·퇴원 동행',
      '주간 리포트 + 월간 가족 통화',
    ],
    cta: '깊이로 시작하기',
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-36 hairline-t bg-paper">
      <div className="max-w-page mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 mb-14 md:mb-20">
          <div className="md:col-span-3">
            <div className="num text-primary text-[15px]">no. 05</div>
            <div className="mt-2 text-[12px] tracking-[0.2em] uppercase font-en text-mute">
              Plans
            </div>
          </div>
          <div className="md:col-span-9">
            <Reveal>
              <h2 className="font-serif-ko font-bold text-ink text-[28px] md:text-[40px] leading-[1.34] tracking-[-0.015em] max-w-[720px]">
                필요한 만큼 곁에.
                <br />
                세 가지의 호흡으로 시작합니다.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 text-[14.5px] text-mute max-w-read leading-[1.85]">
                모든 요금은 부가세 포함, 첫 달은 50% 할인됩니다. 언제든 다음
                달부터 변경·해지할 수 있습니다.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="grid md:grid-cols-3 hairline-t">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <div
                className="p-8 md:p-10 h-full flex flex-col relative hairline-b md:border-b-0"
                style={{
                  borderRight:
                    i < 2 ? '0.5px solid rgba(42,40,35,0.18)' : 'none',
                  background: t.featured ? '#2C5F5D' : 'transparent',
                  color: t.featured ? '#F5EFE3' : 'inherit',
                }}
              >
                {t.featured && (
                  <div className="absolute top-0 right-0 px-3 py-1.5 text-[10.5px] font-en italic tracking-wider bg-accent text-surface">
                    Recommended
                  </div>
                )}
                <div>
                  <h3
                    className={`font-serif-ko font-bold text-[26px] ${t.featured ? 'text-surface' : 'text-ink'}`}
                  >
                    {t.name}
                  </h3>
                  <p
                    className={`mt-1.5 text-[13px] ${t.featured ? 'text-surface/70' : 'text-mute'}`}
                  >
                    {t.sub}
                  </p>
                </div>

                <div className="mt-8 flex items-baseline gap-2">
                  <span
                    className={`text-[12px] ${t.featured ? 'text-surface/60' : 'text-mute'}`}
                  >
                    월
                  </span>
                  <span className="font-serif-ko font-bold text-[40px] tracking-tight">
                    {t.price}
                  </span>
                  <span
                    className={`text-[13px] ${t.featured ? 'text-surface/70' : 'text-ink/70'}`}
                  >
                    원
                  </span>
                </div>
                <div
                  className={`mt-2 text-[13px] ${t.featured ? 'text-surface/70' : 'text-primary'}`}
                >
                  {t.visits}
                </div>

                <ul className="mt-8 space-y-3 flex-1">
                  {t.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-[14px] leading-[1.7]"
                    >
                      <Minus
                        size={14}
                        strokeWidth={1.4}
                        className={
                          t.featured
                            ? 'text-accent mt-1.5'
                            : 'text-primary mt-1.5'
                        }
                      />
                      <span
                        className={t.featured ? 'text-surface/90' : 'text-ink/85'}
                      >
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/#cta"
                  className={`mt-10 inline-flex items-center justify-between gap-2 px-5 py-3 text-[14px] tracking-tight transition-colors ${
                    t.featured
                      ? 'bg-surface text-primary hover:bg-paper'
                      : 'hairline text-ink hover:bg-primary hover:text-surface hover:border-primary'
                  }`}
                >
                  {t.cta}
                  <ArrowRight size={15} strokeWidth={1.4} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
