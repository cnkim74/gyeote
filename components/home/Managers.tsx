import { MapPin, ArrowRight, BadgeCheck, Heart } from 'lucide-react';
import { Reveal } from '../Reveal';
import Link from 'next/link';

const cards = [
  {
    tag: '매니저 ㅈ',
    role: '요양보호사 1급 · 12년차',
    cert: '요양보호사 1급',
    line: '"처음엔 어색하셔도, 세 번째 방문이면 시장 가는 길을 같이 걷게 됩니다."',
    area: '안동 · 예천',
    roleIcon: 'care',
  },
  {
    tag: '매니저 ㅇ',
    role: '간호조무사 · 사회복지사 2급',
    cert: '간호조무사',
    line: '"병원에서 들으신 말씀, 자녀분께도 같은 결로 전달드리려 노력합니다."',
    area: '영주 · 봉화',
    roleIcon: 'medical',
  },
  {
    tag: '매니저 ㄱ',
    role: '사회복지사 1급 · 9년차',
    cert: '사회복지사 1급',
    line: '"행정 서류는 어머님 손을 빌려, 함께 끝내고 옵니다. 대신해드리지 않습니다."',
    area: '의성 · 청송',
    roleIcon: 'social',
  },
];

function RoleIcon({ type }: { type: string }) {
  if (type === 'care') {
    // Care worker — person with heart, helping gesture
    return (
      <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Body */}
        <ellipse cx="60" cy="52" rx="20" ry="22" fill="#2C5F5D" opacity="0.12" />
        {/* Head */}
        <circle cx="60" cy="30" r="16" fill="#2C5F5D" opacity="0.18" />
        <circle cx="60" cy="30" r="13" fill="#E8D5C0" />
        {/* Hair */}
        <ellipse cx="60" cy="19" rx="13" ry="7" fill="#5A3E28" />
        {/* Face */}
        <circle cx="55" cy="30" r="1.5" fill="#5A3E28" />
        <circle cx="65" cy="30" r="1.5" fill="#5A3E28" />
        <path d="M56 35 Q60 38 64 35" stroke="#5A3E28" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Uniform / torso */}
        <path d="M38 70 Q40 55 60 52 Q80 55 82 70 L82 100 Q82 104 78 104 L42 104 Q38 104 38 100 Z" fill="#2C5F5D" opacity="0.85" />
        {/* Arms */}
        <path d="M38 70 Q28 80 30 95" stroke="#2C5F5D" strokeWidth="10" strokeLinecap="round" opacity="0.8" fill="none" />
        <path d="M82 70 Q92 80 90 95" stroke="#2C5F5D" strokeWidth="10" strokeLinecap="round" opacity="0.8" fill="none" />
        {/* Hands */}
        <circle cx="30" cy="96" r="7" fill="#E8D5C0" />
        <circle cx="90" cy="96" r="7" fill="#E8D5C0" />
        {/* Heart in hands */}
        <path d="M24 94 Q27 89 30 92 Q33 89 36 94 Q33 98 30 101 Q27 98 24 94Z" fill="#C97B5D" opacity="0.9" />
        {/* Legs */}
        <rect x="46" y="104" width="12" height="30" rx="4" fill="#3D4A3E" />
        <rect x="62" y="104" width="12" height="30" rx="4" fill="#3D4A3E" />
        {/* Shoes */}
        <ellipse cx="52" cy="134" rx="9" ry="5" fill="#2A2823" />
        <ellipse cx="68" cy="134" rx="9" ry="5" fill="#2A2823" />
        {/* Badge */}
        <rect x="50" y="68" width="20" height="14" rx="3" fill="white" opacity="0.9" />
        <rect x="52" y="70" width="16" height="2" rx="1" fill="#2C5F5D" opacity="0.6" />
        <rect x="52" y="74" width="10" height="1.5" rx="0.75" fill="#2C5F5D" opacity="0.4" />
        <rect x="52" y="77" width="12" height="1.5" rx="0.75" fill="#2C5F5D" opacity="0.4" />
      </svg>
    );
  }
  if (type === 'medical') {
    // Nursing assistant — person with medical cross
    return (
      <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Head */}
        <circle cx="60" cy="30" r="13" fill="#E8D5C0" />
        {/* Hair */}
        <ellipse cx="60" cy="19.5" rx="13" ry="6.5" fill="#2A2823" />
        {/* Bun */}
        <circle cx="60" cy="16" r="5" fill="#2A2823" />
        {/* Nurse cap */}
        <rect x="46" y="14" width="28" height="8" rx="2" fill="white" opacity="0.95" />
        <rect x="56" y="11" width="8" height="14" rx="1" fill="white" opacity="0.95" />
        <path d="M57 14 h6 M60 11 v6" stroke="#C97B5D" strokeWidth="1.5" strokeLinecap="round" />
        {/* Face */}
        <circle cx="55" cy="30" r="1.5" fill="#5A3E28" />
        <circle cx="65" cy="30" r="1.5" fill="#5A3E28" />
        <path d="M56 35 Q60 38 64 35" stroke="#5A3E28" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Uniform */}
        <path d="M38 70 Q40 55 60 52 Q80 55 82 70 L82 100 Q82 104 78 104 L42 104 Q38 104 38 100 Z" fill="white" stroke="#2C5F5D" strokeWidth="1" opacity="0.9" />
        {/* Cross on uniform */}
        <rect x="55" y="70" width="10" height="3" rx="1" fill="#C97B5D" opacity="0.9" />
        <rect x="58" y="67" width="4" height="9" rx="1" fill="#C97B5D" opacity="0.9" />
        {/* Arms */}
        <path d="M38 70 Q28 80 30 95" stroke="#2C5F5D" strokeWidth="10" strokeLinecap="round" opacity="0.4" fill="none" />
        <path d="M82 70 Q92 80 90 95" stroke="#2C5F5D" strokeWidth="10" strokeLinecap="round" opacity="0.4" fill="none" />
        {/* Hands */}
        <circle cx="30" cy="96" r="7" fill="#E8D5C0" />
        <circle cx="90" cy="96" r="7" fill="#E8D5C0" />
        {/* Clipboard */}
        <rect x="84" y="78" width="16" height="22" rx="2" fill="white" stroke="#2C5F5D" strokeWidth="1" opacity="0.9" />
        <rect x="88" y="74" width="8" height="5" rx="1" fill="#2C5F5D" opacity="0.6" />
        <rect x="86" y="84" width="12" height="1.5" rx="0.75" fill="#9B9488" />
        <rect x="86" y="88" width="10" height="1.5" rx="0.75" fill="#9B9488" />
        <rect x="86" y="92" width="8" height="1.5" rx="0.75" fill="#9B9488" />
        {/* Legs */}
        <rect x="46" y="104" width="12" height="30" rx="4" fill="#3D4A3E" />
        <rect x="62" y="104" width="12" height="30" rx="4" fill="#3D4A3E" />
        <ellipse cx="52" cy="134" rx="9" ry="5" fill="#2A2823" />
        <ellipse cx="68" cy="134" rx="9" ry="5" fill="#2A2823" />
      </svg>
    );
  }
  // social worker — person with document/forms, helping posture
  return (
    <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Head */}
      <circle cx="60" cy="30" r="13" fill="#E8D5C0" />
      {/* Hair */}
      <ellipse cx="60" cy="19" rx="13" ry="7" fill="#6B4423" />
      {/* Face */}
      <circle cx="55" cy="30" r="1.5" fill="#5A3E28" />
      <circle cx="65" cy="30" r="1.5" fill="#5A3E28" />
      <path d="M56 35 Q60 38 64 35" stroke="#5A3E28" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Suit / formal wear */}
      <path d="M38 70 Q40 55 60 52 Q80 55 82 70 L82 100 Q82 104 78 104 L42 104 Q38 104 38 100 Z" fill="#3D4A3E" opacity="0.9" />
      {/* Collar / shirt */}
      <path d="M55 52 L60 62 L65 52" fill="white" opacity="0.9" />
      {/* Arms */}
      <path d="M38 70 Q26 80 25 96" stroke="#3D4A3E" strokeWidth="11" strokeLinecap="round" opacity="0.85" fill="none" />
      <path d="M82 70 Q94 78 96 90" stroke="#3D4A3E" strokeWidth="11" strokeLinecap="round" opacity="0.85" fill="none" />
      {/* Hands */}
      <circle cx="25" cy="97" r="7" fill="#E8D5C0" />
      <circle cx="96" cy="90" r="7" fill="#E8D5C0" />
      {/* Document / form in hands */}
      <rect x="14" y="92" width="18" height="24" rx="2" fill="white" stroke="#9B9488" strokeWidth="0.8" opacity="0.95" />
      <rect x="17" y="97" width="12" height="1.5" rx="0.75" fill="#9B9488" />
      <rect x="17" y="101" width="10" height="1.5" rx="0.75" fill="#9B9488" />
      <rect x="17" y="105" width="12" height="1.5" rx="0.75" fill="#9B9488" />
      <rect x="17" y="109" width="8" height="1.5" rx="0.75" fill="#9B9488" />
      {/* Pen */}
      <rect x="33" y="88" width="2" height="14" rx="1" fill="#2C5F5D" transform="rotate(-20 33 88)" />
      {/* Legs */}
      <rect x="46" y="104" width="12" height="30" rx="4" fill="#2A2823" />
      <rect x="62" y="104" width="12" height="30" rx="4" fill="#2A2823" />
      <ellipse cx="52" cy="134" rx="9" ry="5" fill="#1a1816" />
      <ellipse cx="68" cy="134" rx="9" ry="5" fill="#1a1816" />
    </svg>
  );
}

export function Managers() {
  return (
    <>
      <section id="managers" className="py-24 md:py-36 hairline-t bg-paper">
        <div className="max-w-page mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="num text-primary text-[15px]">no. 07</div>
            <div className="mt-2 text-[12px] tracking-[0.2em] uppercase font-en text-mute">
              Managers
            </div>
            <Reveal>
              <h2 className="mt-8 font-serif-ko font-bold text-ink text-[28px] md:text-[40px] leading-[1.32] tracking-[-0.015em]">
                자격을 갖추는 것은
                <br />
                기본입니다.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 text-[15px] text-ink/80 leading-[1.9] max-w-[380px]">
                모든 매니저는{' '}
                <span className="text-ink font-medium">
                  요양보호사 · 간호조무사 · 사회복지사
                </span>{' '}
                국가 자격증을 보유합니다. 곁에가 마련한{' '}
                <em className="font-en">Report Tone Guide</em>에 따라 따뜻함의
                결을 표준화합니다.
              </p>
            </Reveal>

            {/* Cert badges */}
            <Reveal delay={180}>
              <div className="mt-8 flex flex-col gap-2.5">
                {['요양보호사 1급', '간호조무사', '사회복지사 1·2급'].map(cert => (
                  <div key={cert} className="flex items-center gap-2.5">
                    <BadgeCheck size={15} strokeWidth={1.5} className="text-primary shrink-0" />
                    <span className="text-[13.5px] text-ink/80">{cert}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-8">
            <div className="grid sm:grid-cols-3 hairline-t hairline-b">
              {cards.map((c, i) => (
                <Reveal key={c.tag} delay={i * 120}>
                  <div
                    className="p-7 h-full flex flex-col"
                    style={{
                      borderRight: i < 2 ? '0.5px solid rgba(42,40,35,0.18)' : 'none',
                    }}
                  >
                    {/* Role illustration */}
                    <div className="w-full mb-6 flex items-end justify-center bg-surface hairline" style={{ height: 180, padding: '12px 16px 0' }}>
                      <RoleIcon type={c.roleIcon} />
                    </div>

                    {/* Cert badge */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <BadgeCheck size={12} strokeWidth={1.5} className="text-primary shrink-0" />
                      <span className="text-[11px] text-primary font-medium">{c.cert}</span>
                    </div>

                    <div className="text-[11px] tracking-[0.18em] uppercase font-en text-mute">
                      {c.tag}
                    </div>
                    <div className="mt-1 text-[12.5px] text-mute">
                      {c.role}
                    </div>
                    <p className="mt-4 font-serif-ko text-[15px] text-ink leading-[1.7] flex-1">
                      {c.line}
                    </p>
                    <div className="mt-6 hairline-t pt-3 text-[12px] text-mute flex items-center gap-2">
                      <MapPin size={12} strokeWidth={1.4} />
                      {c.area}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Manager recruitment */}
      <section className="py-20 md:py-28 hairline-t" style={{ background: '#2C5F5D' }}>
        <div className="max-w-page mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7">
              <Reveal>
                <div className="flex items-center gap-2 mb-4">
                  <Heart size={14} strokeWidth={1.4} className="text-accent" />
                  <p className="text-[11px] tracking-[0.2em] uppercase font-en text-surface/60">
                    Join Us
                  </p>
                </div>
                <h2 className="font-serif-ko font-bold text-surface text-[28px] md:text-[38px] leading-[1.34] tracking-[-0.015em]">
                  의미 있는 일에
                  <br />
                  도전하세요.
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="mt-6 text-[15px] text-surface/75 leading-[1.9] max-w-read">
                  곁에의 매니저는 단순한 서비스 제공자가 아닙니다.
                  어르신의 하루를 가장 가까이서 함께하며,
                  가족에게 그 온기를 전달하는 사람입니다.
                  자격증을 보유하고 계신가요?
                  지금 곁에 매니저에 도전해 보세요.
                </p>
              </Reveal>

              <Reveal delay={160}>
                <div className="mt-8 grid sm:grid-cols-3 gap-4">
                  {[
                    { label: '유연한 일정', desc: '본인 일정에 맞는 방문 배정' },
                    { label: '전문 교육 지원', desc: '리포트 작성·케어 역량 교육' },
                    { label: '정산 투명', desc: '방문 완료 후 익월 자동 정산' },
                  ].map(item => (
                    <div key={item.label} className="p-4" style={{ border: '0.5px solid rgba(255,255,255,0.2)' }}>
                      <p className="text-[13.5px] font-medium text-surface">{item.label}</p>
                      <p className="text-[12px] text-surface/60 mt-1 leading-[1.6]">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="md:col-span-5 flex flex-col gap-4">
              <Reveal delay={200}>
                <div className="p-7" style={{ background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.18)' }}>
                  <p className="text-[12px] tracking-[0.15em] uppercase font-en text-surface/50 mb-4">지원 자격</p>
                  <div className="flex flex-col gap-3">
                    {[
                      '요양보호사 1급 이상 자격 보유자',
                      '또는 간호조무사 / 사회복지사',
                      '경북 북부권 거주자 우대',
                      '따뜻한 마음을 가진 분 누구나',
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                        <p className="text-[14px] text-surface/80 leading-[1.7]">{item}</p>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/#cta"
                    className="mt-6 flex items-center justify-between px-5 py-3.5 bg-surface text-primary hover:bg-paper transition-colors text-[14px]"
                  >
                    <span>매니저 지원하기</span>
                    <ArrowRight size={15} strokeWidth={1.4} />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
