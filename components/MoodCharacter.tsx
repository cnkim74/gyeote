'use client';

import { useId } from 'react';

export type Gender = 'm' | 'f' | null;

interface MoodCharacterProps {
  mood: 'good' | 'fair' | 'concern';
  gender?: Gender;
  size?: number;
  showLabel?: boolean;
}

const LABELS = { good: '좋음', fair: '보통', concern: '관심 필요' };

const BROWS = {
  good:    { l: 'M 27,40 Q 36,35 45,39', r: 'M 73,40 Q 64,35 55,39' },
  fair:    { l: 'M 27,41 Q 36,39 45,41', r: 'M 73,41 Q 64,39 55,41' },
  concern: { l: 'M 27,38 Q 36,43 45,39', r: 'M 73,38 Q 64,43 55,39' },
};

type Mood = keyof typeof BROWS;

function GrandpaFace({ mood, uid }: { mood: Mood; uid: string }) {
  const b = BROWS[mood];
  const fgId = `fg${uid}`;
  const shId = `sh${uid}`;
  const mouth = mood === 'good' ? 'M 36,73 Q 50,83 64,73'
              : mood === 'fair' ? 'M 36,75 Q 50,77 64,75'
              : 'M 36,77 Q 50,69 64,77';

  return (
    <>
      <defs>
        <radialGradient id={fgId} cx="40%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#FAD9A4" />
          <stop offset="100%" stopColor="#DDA060" />
        </radialGradient>
        <radialGradient id={shId} cx="40%" cy="28%" r="58%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Side hair (horseshoe) */}
      <ellipse cx="12" cy="54" rx="12" ry="23" fill="#B2B0AC" />
      <ellipse cx="88" cy="54" rx="12" ry="23" fill="#B2B0AC" />
      {/* Face */}
      <circle cx="50" cy="52" r="38" fill={`url(#${fgId})`} />
      {/* 3D shine */}
      <ellipse cx="37" cy="30" rx="13" ry="9" fill={`url(#${shId})`} />
      {/* Forehead wrinkles */}
      <path d="M 33,28 Q 50,25 67,28" stroke="#C49060" strokeWidth="1.2" fill="none" opacity="0.4" />
      <path d="M 36,35 Q 50,32 64,35" stroke="#C49060" strokeWidth="1" fill="none" opacity="0.28" />
      {/* Eyebrows — thick, gray */}
      <path d={b.l} stroke="#888480" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d={b.r} stroke="#888480" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      {/* Eyes */}
      <ellipse cx="36" cy="49" rx="4" ry="4.5" fill="#3D3228" />
      <ellipse cx="64" cy="49" rx="4" ry="4.5" fill="#3D3228" />
      <circle cx="37.5" cy="47.5" r="1.4" fill="white" />
      <circle cx="65.5" cy="47.5" r="1.4" fill="white" />
      {/* Nose */}
      <path d="M 47,57 Q 50,62 53,57" stroke="#C49060" strokeWidth="1.3" fill="none" opacity="0.55" />
      {/* Mustache */}
      <path d="M 40,65 Q 50,61 60,65" stroke="#CCCAC6" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Mouth */}
      <path d={mouth} stroke="#8A5C40" strokeWidth="2.8" fill="none" strokeLinecap="round" />
    </>
  );
}

function GrandmaFace({ mood, uid }: { mood: Mood; uid: string }) {
  const b = BROWS[mood];
  const fgId = `fg${uid}`;
  const shId = `sh${uid}`;
  const mouth = mood === 'good' ? 'M 36,67 Q 50,78 64,67'
              : mood === 'fair' ? 'M 36,70 Q 50,72 64,70'
              : 'M 36,72 Q 50,64 64,72';

  return (
    <>
      <defs>
        <radialGradient id={fgId} cx="40%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#FDE8C8" />
          <stop offset="100%" stopColor="#E8B078" />
        </radialGradient>
        <radialGradient id={shId} cx="40%" cy="28%" r="58%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Bun (drawn before face so face covers lower portion) */}
      <circle cx="50" cy="16" r="15" fill="#C6C4BF" />
      <ellipse cx="44" cy="10" rx="5" ry="3.5" fill="white" opacity="0.22" />
      {/* Side hair tendrils */}
      <path d="M 14,38 Q 11,52 14,65" stroke="#D0CEC9" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M 86,38 Q 89,52 86,65" stroke="#D0CEC9" strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* Face */}
      <circle cx="50" cy="52" r="38" fill={`url(#${fgId})`} />
      {/* 3D shine */}
      <ellipse cx="37" cy="30" rx="13" ry="9" fill={`url(#${shId})`} />
      {/* Cheeks */}
      <ellipse cx="28" cy="62" rx="9" ry="6" fill="#F9A8D4" opacity="0.36" />
      <ellipse cx="72" cy="62" rx="9" ry="6" fill="#F9A8D4" opacity="0.36" />
      {/* Eyebrows — thin, soft */}
      <path d={b.l} stroke="#9A8A7A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d={b.r} stroke="#9A8A7A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {/* Eyes */}
      <ellipse cx="36" cy="49" rx="4" ry="4.5" fill="#3D3228" />
      <ellipse cx="64" cy="49" rx="4" ry="4.5" fill="#3D3228" />
      <circle cx="37.5" cy="47.5" r="1.4" fill="white" />
      <circle cx="65.5" cy="47.5" r="1.4" fill="white" />
      {/* Nose */}
      <path d="M 47,56 Q 50,60 53,56" stroke="#C49060" strokeWidth="1.2" fill="none" opacity="0.5" />
      {/* Mouth */}
      <path d={mouth} stroke="#8A5C40" strokeWidth="2.8" fill="none" strokeLinecap="round" />
    </>
  );
}

export function MoodCharacter({ mood, gender = null, size = 64, showLabel = true }: MoodCharacterProps) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {gender === 'f' ? <GrandmaFace mood={mood} uid={uid} /> : <GrandpaFace mood={mood} uid={uid} />}
      </svg>
      {showLabel && (
        <span style={{ fontSize: 12, fontWeight: 600, color: '#5A4A3A' }}>{LABELS[mood]}</span>
      )}
    </div>
  );
}

export function MoodCharacterRow({
  selected,
  gender,
}: {
  selected: 'good' | 'fair' | 'concern';
  gender?: Gender;
}) {
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
      {(['good', 'fair', 'concern'] as const).map(m => (
        <div key={m} style={{ opacity: m === selected ? 1 : 0.22 }}>
          <MoodCharacter mood={m} gender={gender} size={m === selected ? 72 : 48} showLabel={m === selected} />
        </div>
      ))}
    </div>
  );
}
