interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}

const COLORS = [
  '#2C5F5D', '#5D8A6B', '#8A6914', '#C97B5D',
  '#4A7A7A', '#6B5D8A', '#8A5D5D', '#5D7A4A',
];

function colorFromName(name: string | null | undefined) {
  if (!name) return COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function Avatar({ src, name, size = 40, className = '' }: AvatarProps) {
  const initial = name ? name.slice(0, 1) : '?';
  const bg = colorFromName(name);
  const fontSize = Math.round(size * 0.42);

  if (src) {
    return (
      <div
        className={`rounded-full overflow-hidden flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={name ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }

  return (
    <div
      className={`rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white select-none ${className}`}
      style={{ width: size, height: size, background: bg, fontSize }}
    >
      {initial}
    </div>
  );
}
