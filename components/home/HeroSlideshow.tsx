'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
    <section className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        {/* Left: Text Content */}
        <div className="w-[55%] flex flex-col pl-10 md:pl-16 lg:pl-20 pr-10 pt-32 md:pt-40 pb-8">
          {/* Label */}
          <div className="flex items-center gap-4 mb-10 md:mb-14">
            <span className="num text-[11px] tracking-[0.2em] text-mute whitespace-nowrap">no. 01</span>
            <div className="flex-1 h-px" style={{ background: 'var(--line)' }} />
            <span className="font-en text-[11px] tracking-[0.22em] uppercase text-mute whitespace-nowrap">
              ANDONG · 안동
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif-ko font-black text-ink leading-[1.08] tracking-[-0.025em] text-[52px] md:text-[68px] lg:text-[84px] mb-8 md:mb-10">
            자녀를 대신해,
            <br />
            부모님 <span className="text-primary">곁에</span>.
          </h1>

          {/* Body */}
          <p className="text-[14.5px] md:text-[15.5px] text-ink/65 leading-[1.95] mb-10 md:mb-12 max-w-[400px]">
            매주 전화로는 닿지 않는 거리.
            <br />
            곁에는 매니저가 부모님을 정기적으로 찾아뵙고,
            <br />
            그날의 안부를 자녀에게 카카오톡으로
            <br />
            전해드리는 동행 구독 서비스입니다.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-7 flex-wrap">
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

        {/* Right: Image Slideshow */}
        <div className="w-[45%] relative overflow-hidden">
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: fading ? 0 : 1 }}
          >
            <Image
              src={slide.url}
              alt={slide.caption}
              fill
              className="object-cover"
              priority
              sizes="45vw"
            />
          </div>

          {/* Floating visit card */}
          <div className="absolute bottom-8 left-6 bg-paper/95 backdrop-blur-sm px-5 py-4 max-w-[220px]" style={{ border: '0.5px solid rgba(42,40,35,0.18)' }}>
            <p className="font-en text-[10px] tracking-[0.2em] uppercase text-mute mb-2">Last Visit</p>
            <p className="font-serif-ko text-[14px] text-ink leading-[1.6]">
              10월 24일 · 어머님 안색 좋으셨습니다.
            </p>
          </div>

          {/* Slide dots */}
          {images.length > 1 && (
            <div className="absolute bottom-6 right-5 flex gap-1.5">
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

      {/* Bottom bar */}
      <div
        className="px-10 md:px-16 lg:px-20 py-5 flex items-center justify-between text-[12.5px]"
        style={{ borderTop: '0.5px solid rgba(42,40,35,0.18)' }}
      >
        <span className="font-en italic text-mute">— 운영 슬로건</span>
        <span className="font-serif-ko text-ink">오늘도 곁에 다녀왔습니다.</span>
        <span className="font-en italic text-mute">Plate i.</span>
        <span className="text-mute">{slide.caption}</span>
      </div>
    </section>
  );
}
