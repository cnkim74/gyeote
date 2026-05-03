interface ApprovalStampProps {
  date: string; // YYYY-MM-DD
  size?: number;
}

export function ApprovalStamp({ date, size = 110 }: ApprovalStampProps) {
  const [y, m, d] = date.split('-');
  const label = `${y}.${m}.${d}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 110 110"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.88 }}
    >
      {/* Outer ring */}
      <circle cx="55" cy="55" r="51" fill="none" stroke="#B91C1C" strokeWidth="3" />
      {/* Inner ring */}
      <circle cx="55" cy="55" r="43" fill="none" stroke="#B91C1C" strokeWidth="1.2" />

      {/* Top arc text: 곁에 방문 케어 서비스 */}
      <path id="stamp-top" d="M 14 55 A 41 41 0 0 1 96 55" fill="none" />
      <text fontSize="9.5" fill="#B91C1C" fontFamily="serif" letterSpacing="2">
        <textPath href="#stamp-top" startOffset="12%">곁에  방문  케어  서비스</textPath>
      </text>

      {/* Center text */}
      <text
        x="55" y="60"
        textAnchor="middle"
        fontSize="22"
        fontWeight="bold"
        fill="#B91C1C"
        fontFamily="serif"
        letterSpacing="6"
      >
        승인
      </text>

      {/* Bottom arc text: date */}
      <path id="stamp-bottom" d="M 14 55 A 41 41 0 0 0 96 55" fill="none" />
      <text fontSize="9" fill="#B91C1C" fontFamily="serif" letterSpacing="1.5">
        <textPath href="#stamp-bottom" startOffset="22%">{label}</textPath>
      </text>
    </svg>
  );
}
