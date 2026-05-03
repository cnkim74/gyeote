type WordmarkProps = {
  size?: number;
  color?: string;
};

export function Wordmark({ size = 28, color = '#2A2823' }: WordmarkProps) {
  return (
    <span className="inline-flex items-baseline gap-2" style={{ color }}>
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
  );
}
