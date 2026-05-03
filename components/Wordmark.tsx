type WordmarkProps = {
  size?: number;
  color?: string;
  showMark?: boolean;
};

export function Wordmark({ size = 28, color = '#2A2823', showMark = true }: WordmarkProps) {
  const markH = size * 1.1;
  const markW = markH * (40 / 40);

  return (
    <span className="inline-flex items-center gap-2" style={{ color }}>
      {showMark && (
        <svg
          width={markW * 0.72}
          height={markH * 0.72}
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0 }}
        >
          <rect x="6" y="7" width="11" height="26" rx="2.5" fill="#2C5F5D" />
          <rect x="21" y="16" width="13" height="17" rx="2.5" fill="#2C5F5D" opacity="0.55" />
        </svg>
      )}
      <span className="inline-flex items-baseline gap-1.5">
        <span
          className="font-serif-ko font-black"
          style={{ fontSize: size, lineHeight: 1 }}
        >
          곁에
        </span>
        <span
          className="font-en italic tracking-wide"
          style={{ fontSize: size * 0.46, opacity: 0.6 }}
        >
          Gyeote
        </span>
      </span>
    </span>
  );
}
