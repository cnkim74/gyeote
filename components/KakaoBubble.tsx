import type { ReactNode } from 'react';

type KakaoBubbleProps = {
  children: ReactNode;
  time: string;
  head?: boolean;
};

export function KakaoBubble({ children, time, head }: KakaoBubbleProps) {
  return (
    <div className="relative">
      <div
        className="kakao-tail bg-white hairline px-5 py-4 max-w-[340px] relative"
        style={{ borderRadius: 2 }}
      >
        {head && (
          <div className="flex items-center gap-2 pb-2 mb-3 border-b border-black/10">
            <div
              className="w-7 h-7 bg-kakao flex items-center justify-center"
              style={{ borderRadius: 6 }}
            >
              <span className="font-serif-ko font-black text-[12px] text-kakaoDeep">
                곁
              </span>
            </div>
            <div className="leading-tight">
              <div className="text-[11.5px] text-kakaoDeep/70 font-medium">
                알림톡 도착
              </div>
              <div className="text-[12px] text-kakaoDeep font-semibold">
                곁에 · 안동지점
              </div>
            </div>
          </div>
        )}
        <div className="text-[13.5px] text-kakaoDeep leading-[1.7]">
          {children}
        </div>
      </div>
      <div className="mt-1.5 ml-2 text-[10.5px] text-mute">{time}</div>
    </div>
  );
}
