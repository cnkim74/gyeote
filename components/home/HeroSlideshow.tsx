'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { G } from '../G';

interface SlideImage {
  id: string;
  url: string;
  caption: string;
}

export function HeroSlideshow({ images }: { images: SlideImage[] }) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % images.length);
        setFading(false);
      }, 500);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const slide = images[current];

  return (
    <section className="pt-24 md:pt-36 pb-0">
      <div className="max-w-page mx-auto px-6 md:px-10">

        {/* Label row */}
        <div className="flex items-center gap-4 mb-8 md:mb-14">
          <span className="num text-[11px] tracking-[0.2em] text-mute whitespace-nowrap">no. 01</span>
          <div className="flex-1 h-px" style={{ background: 'var(--line)' }} />
          <span className="font-en text-[11px] tracking-[0.22em] uppercase text-mute whitespace-nowrap">
            ANDONG · 안동
          </span>
        </div>

        {/* Mobile: stack vertically / Desktop: two columns */}
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-14">

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h1 className="font-serif-ko font-black text-ink leading-[1.08] tracking-[-0.025em] text-[40px] md:text-[70px] lg:text-[86px] mb-6 md:mb-10">
              자녀를 대신해,
              <br />
              부모님 <G />.
            </h1>

            <p
              className="text-[15px] md:text-[16px] text-ink/65 leading-[1.95] mb-8 md:mb-12 max-w-[380px]"
              style={{ wordBreak: 'keep-all' }}
            >
              매주 전화로는 닿지 않는 거리.
              곁에는 매니저가 부모님을 정기적으로 찾아뵙고,
              그날의 안부를 자녀에게 카카오톡으로
              전해드리는 동행 구독 서비스입니다.
            </p>

            <div className="flex items-center gap-5 flex-wrap">
              <Link
                href="/#cta"
                className="inline-flex items-center bg-primary text-surface px-6 py-3.5 text-[14px] tracking-tight hover:bg-primary-deep transition-colors"
              >
                30일 체험으로 시작하기
              </Link>
              <Link
                href="/#service"
                className="text-[14px] text-ink/65 hover:text-ink transition-colors ulink"
              >
                서비스가 어떻게 운영되나요
              </Link>
            </div>
          </div>

          {/* Image frame */}
          <div
            className="relative overflow-hidden w-full md:shrink-0 md:[width:clamp(300px,42%,500px)]"
            style={{
              aspectRatio: '4 / 5',
              border: '0.5px solid rgba(42,40,35,0.18)',
            }}
          >
            <div
              className="absolute inset-0 w-full h-full transition-opacity duration-500"
              style={{ opacity: fading ? 0 : 1 }}
            >
              <Image
                src={slide.url}
                alt={slide.caption}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>

            {/* Floating visit card */}
            <div
              className="absolute bottom-5 left-4 bg-paper/95 backdrop-blur-sm px-4 py-3.5 max-w-[200px]"
              style={{ border: '0.5px solid rgba(42,40,35,0.18)' }}
            >
              <p className="font-en text-[9.5px] tracking-[0.2em] uppercase text-mute mb-1.5">
                Last Visit
              </p>
              <p className="font-serif-ko text-[13px] text-ink leading-[1.6]">
                10월 24일 · 어머님 안색 좋으셨습니다.
              </p>
            </div>

            {/* Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-5 right-4 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`슬라이드 ${i + 1}`}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      background: i === current ? '#FBF7EE' : 'rgba(251,247,238,0.45)',
                      transform: i === current ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="mt-8 md:mt-10 px-6 md:px-10 max-w-page mx-auto py-4 md:py-5 flex items-center justify-between text-[12.5px] gap-4"
        style={{ borderTop: '0.5px solid rgba(42,40,35,0.18)' }}
      >
        <span className="font-en italic text-mute hidden md:inline">— 운영 슬로건</span>
        <span className="font-serif-ko text-ink whitespace-nowrap">오늘도 <G /> 다녀왔습니다.</span>
        <span className="font-en italic text-mute hidden md:inline">Plate i.</span>
        <span className="text-mute text-[11px] truncate">{slide.caption}</span>
      </div>
    </section>
  );
}
