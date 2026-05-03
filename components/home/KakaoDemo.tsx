import Image from 'next/image';
import {
  Calendar,
  CircleDot,
  MessageSquare,
  Pill,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Reveal } from '../Reveal';
import { KakaoBubble } from '../KakaoBubble';

const bullets: [string, LucideIcon][] = [
  ['안색·식사·걸음걸이 등 그날의 컨디션', CircleDot],
  ['병원 결과·약 변경 사항', Pill],
  ['다음 방문 일정 안내', Calendar],
];

export function KakaoDemo() {
  return (
    <section id="report" className="py-24 md:py-36 hairline-t">
      <div className="max-w-page mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-5">
          <div className="num text-primary text-[15px]">no. 04</div>
          <div className="mt-2 text-[12px] tracking-[0.2em] uppercase font-en text-mute">
            Daily Report
          </div>

          <Reveal>
            <h2 className="mt-8 font-serif-ko font-bold text-ink text-[30px] md:text-[42px] leading-[1.3] tracking-[-0.015em]">
              당신의 휴대폰에
              <br />
              매일 도착합니다.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-[15.5px] text-ink/80 leading-[1.9] max-w-[420px]">
              방문이 끝난 저녁, 매니저가 직접 작성한 짧은 안부 한 통.
              사진 한 장과 함께 도착합니다.
              <br />
              <br />
              과장된 안심이 아니라,{' '}
              <span className="text-ink font-medium">사실대로의 오늘</span>을
              전합니다.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <ul className="mt-10 space-y-3 text-[14px] text-ink/80">
              {bullets.map(([t, IconComp]) => (
                <li key={t} className="flex items-start gap-3">
                  <IconComp
                    size={15}
                    strokeWidth={1.4}
                    className="text-primary mt-1"
                  />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="md:col-span-7">
          <Reveal delay={200}>
            <div
              className="relative bg-kakao p-8 md:p-12 hairline"
              style={{ background: '#FAE100' }}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-kakaoDeep">
                  <MessageSquare size={16} strokeWidth={2} />
                  <span className="text-[13px] font-semibold tracking-tight">
                    카카오톡 · 알림톡
                  </span>
                </div>
                <div className="text-[11px] text-kakaoDeep/60 font-en">
                  10월 24일 (목)
                </div>
              </div>

              <div className="space-y-7">
                <KakaoBubble head time="오후 4:32">
                  <p className="font-medium mb-2">[곁에] 오늘의 방문 리포트</p>
                  <p>
                    안녕하세요. 오늘도 어머님 곁에 다녀왔습니다.
                    <br />
                    <br />
                    안동 시립병원 정형외과 진료에 함께 다녀왔고, 무릎 상태는
                    지난달과 비슷하다 하셨습니다. 돌아오는 길에 시장에서 사과와
                    두부를 사 가지고 들어왔습니다.
                    <br />
                    <br />
                    안색 좋으셨고, 점심은 잘 드셨습니다.
                  </p>
                </KakaoBubble>

                <div className="pl-8">
                  <KakaoBubble time="오후 4:33">
                    <div className="aspect-[4/3] w-[260px] hairline overflow-hidden -mx-1 -mt-1 mb-3 relative">
                      <Image
                        src="https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=600&q=80"
                        alt="시장 사진"
                        fill
                        sizes="260px"
                        className="object-cover"
                        style={{ filter: 'saturate(0.85)' }}
                      />
                    </div>
                    <p className="text-[12.5px] text-kakaoDeep/70">
                      — 안동 구시장 앞에서
                    </p>
                  </KakaoBubble>
                </div>

                <KakaoBubble time="오후 4:34">
                  <p>
                    다음 방문은{' '}
                    <span className="font-semibold">10월 31일 (목) 오후 2시</span>
                    로 약속드렸습니다.
                    <br />
                    그날은 면사무소 서류 한 건이 있어 함께 다녀올 예정입니다.
                  </p>
                  <p className="mt-3 text-kakaoDeep/70">— 매니저 이정숙 드림</p>
                </KakaoBubble>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11.5px] text-mute">
              <span className="font-en italic">Plate ii. — Sample alert</span>
              <span>실제 발송 톤을 그대로 옮겼습니다</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
