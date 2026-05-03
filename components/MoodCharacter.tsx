interface MoodCharacterProps {
  mood: 'good' | 'fair' | 'concern';
  size?: number;
  showLabel?: boolean;
}

const MOODS = {
  good: {
    label: '좋음',
    bg: '#E8F4EC',
    stroke: '#2C5F5D',
    face: '#2C5F5D',
    cheek: '#F9A8D4',
    svg: (c: string, f: string, ch: string) => (
      <>
        {/* Cheeks */}
        <ellipse cx="30" cy="58" rx="9" ry="6" fill={ch} opacity="0.45" />
        <ellipse cx="70" cy="58" rx="9" ry="6" fill={ch} opacity="0.45" />
        {/* Eyes */}
        <ellipse cx="36" cy="42" rx="4" ry="5" fill={f} />
        <ellipse cx="64" cy="42" rx="4" ry="5" fill={f} />
        {/* Eye shine */}
        <circle cx="38" cy="40" r="1.5" fill="white" />
        <circle cx="66" cy="40" r="1.5" fill="white" />
        {/* Smile */}
        <path d="M 32 62 Q 50 76 68 62" fill="none" stroke={f} strokeWidth="3.5" strokeLinecap="round" />
      </>
    ),
  },
  fair: {
    label: '보통',
    bg: '#FFF8E1',
    stroke: '#B58900',
    face: '#8A6914',
    cheek: '#FCD34D',
    svg: (c: string, f: string, ch: string) => (
      <>
        {/* Cheeks */}
        <ellipse cx="30" cy="56" rx="8" ry="5" fill={ch} opacity="0.3" />
        <ellipse cx="70" cy="56" rx="8" ry="5" fill={ch} opacity="0.3" />
        {/* Eyes - slightly squinted */}
        <ellipse cx="36" cy="43" rx="4" ry="3.5" fill={f} />
        <ellipse cx="64" cy="43" rx="4" ry="3.5" fill={f} />
        <circle cx="38" cy="42" r="1.2" fill="white" />
        <circle cx="66" cy="42" r="1.2" fill="white" />
        {/* Flat mouth */}
        <path d="M 35 65 Q 50 68 65 65" fill="none" stroke={f} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  concern: {
    label: '관심필요',
    bg: '#FDE8E8',
    stroke: '#C97B5D',
    face: '#842029',
    cheek: '#FCA5A5',
    svg: (c: string, f: string, ch: string) => (
      <>
        {/* Worried brows */}
        <path d="M 27 33 Q 36 28 42 34" fill="none" stroke={f} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 73 33 Q 64 28 58 34" fill="none" stroke={f} strokeWidth="2.5" strokeLinecap="round" />
        {/* Eyes */}
        <ellipse cx="36" cy="44" rx="4" ry="5" fill={f} />
        <ellipse cx="64" cy="44" rx="4" ry="5" fill={f} />
        <circle cx="38" cy="42" r="1.5" fill="white" />
        <circle cx="66" cy="42" r="1.5" fill="white" />
        {/* Frown */}
        <path d="M 32 70 Q 50 60 68 70" fill="none" stroke={f} strokeWidth="3.5" strokeLinecap="round" />
        {/* Sweat drop */}
        <ellipse cx="76" cy="36" rx="3" ry="4" fill="#93C5FD" opacity="0.7" />
      </>
    ),
  },
};

export function MoodCharacter({ mood, size = 64, showLabel = true }: MoodCharacterProps) {
  const m = MOODS[mood];
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body */}
        <circle cx="50" cy="50" r="46" fill={m.bg} stroke={m.stroke} strokeWidth="2.5" />
        {m.svg(m.bg, m.face, m.cheek)}
      </svg>
      {showLabel && (
        <span style={{ fontSize: 12, color: m.face, fontWeight: 600 }}>{m.label}</span>
      )}
    </div>
  );
}

export function MoodCharacterRow({ selected }: { selected: 'good' | 'fair' | 'concern' }) {
  const moods = (['good', 'fair', 'concern'] as const);
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
      {moods.map(m => (
        <div key={m} style={{ opacity: m === selected ? 1 : 0.22, transition: 'opacity 0.2s' }}>
          <MoodCharacter mood={m} size={m === selected ? 72 : 48} showLabel={m === selected} />
        </div>
      ))}
    </div>
  );
}
