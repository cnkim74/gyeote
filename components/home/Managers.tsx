import { MapPin } from 'lucide-react';
import { Reveal } from '../Reveal';

const cards = [
  {
    tag: '매니저 ㅈ',
    role: '요양보호사 1급 · 12년차',
    line: '“처음엔 어색하셔도, 세 번째 방문이면 시장 가는 길을 같이 걷게 됩니다.”',
    area: '안동 · 예천',
  },
  {
    tag: '매니저 ㅇ',
    role: '간호조무사 · 사회복지사 2급',
    line: '“병원에서 들으신 말씀, 자녀분께도 같은 결로 전달드리려 노력합니다.”',
    area: '영주 · 봉화',
  },
  {
    tag: '매니저 ㄱ',
    role: '사회복지사 1급 · 9년차',
    line: '“행정 서류는 어머님 손을 빌려, 함께 끝내고 옵니다. 대신해드리지 않습니다.”',
    area: '의성 · 청송',
  },
];

export function Managers() {
  return (
    <section id="managers" className="py-24 md:py-36 hairline-t bg-paper">
      <div className="max-w-page mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <div className="num text-primary text-[15px]">no. 07</div>
          <div className="mt-2 text-[12px] tracking-[0.2em] uppercase font-en text-mute">
            Managers
          </div>
          <Reveal>
            <h2 className="mt-8 font-serif-ko font-bold text-ink text-[28px] md:text-[40px] leading-[1.32] tracking-[-0.015em]">
              자격을 갖추는 것은
              <br />
              기본입니다.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-[15px] text-ink/80 leading-[1.9] max-w-[380px]">
              모든 매니저는{' '}
              <span className="text-ink font-medium">
                요양보호사 · 간호조무사 · 사회복지사
              </span>{' '}
              자격을 보유하고, 곁에가 마련한{' '}
              <em className="font-en">Report Tone Guide</em>에 따라 따뜻함의
              결을 표준화합니다. 사람마다 다른 따뜻함이 같은 어조로
              전달됩니다.
            </p>
          </Reveal>
        </div>

        <div className="md:col-span-8">
          <div className="grid sm:grid-cols-3 hairline-t hairline-b">
            {cards.map((c, i) => (
              <Reveal key={c.tag} delay={i * 120}>
                <div
                  className="p-7 h-full flex flex-col"
                  style={{
                    borderRight:
                      i < 2 ? '0.5px solid rgba(42,40,35,0.18)' : 'none',
                  }}
                >
                  <div className="aspect-square w-full mb-6 hairline flex items-center justify-center bg-surface">
                    <div className="font-serif-ko font-black text-primary text-[64px] tracking-tight">
                      {c.tag.slice(-1)}
                    </div>
                  </div>
                  <div className="text-[11px] tracking-[0.18em] uppercase font-en text-mute">
                    {c.tag}
                  </div>
                  <div className="mt-1.5 text-[13.5px] text-primary">
                    {c.role}
                  </div>
                  <p className="mt-4 font-serif-ko text-[15.5px] text-ink leading-[1.7] flex-1">
                    {c.line}
                  </p>
                  <div className="mt-6 hairline-t pt-3 text-[12px] text-mute flex items-center gap-2">
                    <MapPin size={12} strokeWidth={1.4} />
                    {c.area}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
