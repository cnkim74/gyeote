'use client';

import { useState } from 'react';

interface StarRatingProps {
  value: number;           // 0 = unset, 1–10
  onChange: (v: number) => void;
  readonly?: boolean;
}

export function StarRating({ value, onChange, readonly = false }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const active = hovered || value;

  function label(n: number) {
    if (n <= 2)  return '많은 도움 필요';
    if (n <= 4)  return '보조 필요';
    if (n <= 6)  return '양호';
    if (n <= 8)  return '좋음';
    return '매우 좋음';
  }

  return (
    <div>
      <div
        className="flex gap-1"
        onMouseLeave={() => !readonly && setHovered(0)}
      >
        {Array.from({ length: 10 }, (_, i) => {
          const n = i + 1;
          const filled = n <= active;
          return (
            <button
              key={n}
              type="button"
              disabled={readonly}
              onClick={() => !readonly && onChange(value === n ? 0 : n)}
              onMouseEnter={() => !readonly && setHovered(n)}
              className="p-0.5 transition-transform hover:scale-110 disabled:cursor-default"
              aria-label={`${n}점`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"
                  fill={filled ? '#E8A318' : 'none'}
                  stroke={filled ? '#E8A318' : 'rgba(42,40,35,0.25)'}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <p className="text-[12px] text-mute">
          {active > 0 ? (
            <span className="text-[#B5820A] font-medium">
              {active}점 · {label(active)}
            </span>
          ) : (
            <span>1~10점 선택</span>
          )}
        </p>
        <p className="text-[11px] text-mute/60">10점 만점</p>
      </div>
    </div>
  );
}
