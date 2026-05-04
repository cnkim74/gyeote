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
    type: 'care' as const,
  },
  {
    tag: '매니저 ㅇ',
    role: '간호조무사 · 사회복지사 2급',
    cert: '간호조무사',
    line: '"병원에서 들으신 말씀, 자녀분께도 같은 결로 전달드리려 노력합니다."',
    area: '영주 · 봉화',
    type: 'medical' as const,
  },
  {
    tag: '매니저 ㄱ',
    role: '사회복지사 1급 · 9년차',
    cert: '사회복지사 1급',
    line: '"행정 서류는 어머님 손을 빌려, 함께 끝내고 옵니다. 대신해드리지 않습니다."',
    area: '의성 · 청송',
    type: 'social' as const,
  },
];

/* ── Pixar-style 3D character SVGs ── */

function CareCharacter() {
  // 요양보호사 — female, teal uniform, heart badge, bob hair
  return (
    <svg viewBox="0 0 160 210" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="c_face" cx="42%" cy="36%" r="58%">
          <stop offset="0%" stopColor="#FFE0C0" />
          <stop offset="65%" stopColor="#F5C090" />
          <stop offset="100%" stopColor="#E8A870" />
        </radialGradient>
        <radialGradient id="c_body" cx="35%" cy="25%" r="65%">
          <stop offset="0%" stopColor="#4A8A87" />
          <stop offset="100%" stopColor="#1F4544" />
        </radialGradient>
        <radialGradient id="c_hair" cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#3A2A24" />
          <stop offset="100%" stopColor="#1A1210" />
        </radialGradient>
        <radialGradient id="c_bg" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#E8F4EC" />
          <stop offset="100%" stopColor="#D0E8D4" />
        </radialGradient>
      </defs>

      {/* Background circle */}
      <ellipse cx="80" cy="145" rx="70" ry="60" fill="url(#c_bg)" />

      {/* Body / uniform */}
      <path d="M32 145 Q34 118 55 110 L80 105 L105 110 Q126 118 128 145 L128 210 L32 210 Z" fill="url(#c_body)" />
      {/* Collar white */}
      <path d="M67 108 L80 124 L93 108" fill="white" opacity="0.9" />
      {/* Arms */}
      <ellipse cx="26" cy="148" rx="16" ry="38" fill="url(#c_body)" transform="rotate(-8 26 148)" />
      <ellipse cx="134" cy="148" rx="16" ry="38" fill="url(#c_body)" transform="rotate(8 134 148)" />
      {/* Hands */}
      <ellipse cx="18" cy="178" rx="12" ry="10" fill="#F5C090" />
      <ellipse cx="142" cy="178" rx="12" ry="10" fill="#F5C090" />

      {/* Heart in right hand */}
      <path d="M136 172 Q139 167 142 170 Q145 167 148 172 Q145 177 142 180 Q139 177 136 172Z" fill="#C97B5D" />

      {/* Badge on uniform */}
      <rect x="62" y="125" width="22" height="16" rx="3" fill="white" opacity="0.95" />
      <path d="M68 131 Q71 127 73 130 Q75 127 78 131 Q75 134 73 136 Q71 134 68 131Z" fill="#C97B5D" />

      {/* Neck */}
      <rect x="70" y="97" width="20" height="14" rx="6" fill="#F0BA84" />

      {/* Hair — bob cut */}
      <ellipse cx="80" cy="60" rx="46" ry="48" fill="url(#c_hair)" />
      {/* Hair bottom sweep */}
      <ellipse cx="40" cy="80" rx="18" ry="26" fill="url(#c_hair)" />
      <ellipse cx="120" cy="80" rx="18" ry="26" fill="url(#c_hair)" />
      {/* Hair sheen */}
      <ellipse cx="65" cy="38" rx="16" ry="7" fill="#5A4038" opacity="0.6" transform="rotate(-15 65 38)" />

      {/* Face */}
      <ellipse cx="80" cy="68" rx="40" ry="44" fill="url(#c_face)" />

      {/* Eyebrows */}
      <path d="M56 50 Q63 46 70 50" stroke="#3A2010" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M90 50 Q97 46 104 50" stroke="#3A2010" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Eyes — large Pixar style */}
      <ellipse cx="63" cy="63" rx="13" ry="14" fill="white" />
      <circle cx="64" cy="64" r="9" fill="#3B2010" />
      <circle cx="64" cy="64" r="5" fill="#5A3820" />
      <circle cx="64" cy="64" r="3" fill="#100800" />
      <circle cx="60" cy="60" r="3" fill="white" />
      <circle cx="67" cy="62" r="1.2" fill="white" opacity="0.8" />

      <ellipse cx="97" cy="63" rx="13" ry="14" fill="white" />
      <circle cx="96" cy="64" r="9" fill="#3B2010" />
      <circle cx="96" cy="64" r="5" fill="#5A3820" />
      <circle cx="96" cy="64" r="3" fill="#100800" />
      <circle cx="92" cy="60" r="3" fill="white" />
      <circle cx="99" cy="62" r="1.2" fill="white" opacity="0.8" />

      {/* Eyelashes */}
      <path d="M50 60 Q52 55 56 56" stroke="#2A1808" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M108 58 Q109 53 113 55" stroke="#2A1808" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* Cheeks */}
      <ellipse cx="50" cy="74" rx="14" ry="9" fill="#FFB0A0" opacity="0.4" />
      <ellipse cx="110" cy="74" rx="14" ry="9" fill="#FFB0A0" opacity="0.4" />

      {/* Nose */}
      <ellipse cx="80" cy="80" rx="5" ry="3.5" fill="#D89060" opacity="0.45" />

      {/* Smile */}
      <path d="M67 90 Q80 100 93 90" stroke="#C07058" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M67 90 Q80 98 93 90" fill="#E8988A" opacity="0.3" />

      {/* Teeth */}
      <path d="M70 91 Q80 97 90 91 Q88 95 80 96 Q72 95 70 91Z" fill="white" opacity="0.8" />
    </svg>
  );
}

function MedicalCharacter() {
  // 간호조무사 — female, white uniform, stethoscope, bun hair
  return (
    <svg viewBox="0 0 160 210" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="m_face" cx="42%" cy="36%" r="58%">
          <stop offset="0%" stopColor="#FFE4C8" />
          <stop offset="65%" stopColor="#F5C898" />
          <stop offset="100%" stopColor="#E8B07A" />
        </radialGradient>
        <radialGradient id="m_body" cx="35%" cy="25%" r="65%">
          <stop offset="0%" stopColor="#F0F8FF" />
          <stop offset="100%" stopColor="#C8DCF0" />
        </radialGradient>
        <radialGradient id="m_hair" cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#2C2018" />
          <stop offset="100%" stopColor="#100C08" />
        </radialGradient>
        <radialGradient id="m_bg" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#EAF4FF" />
          <stop offset="100%" stopColor="#D0E4F8" />
        </radialGradient>
      </defs>

      <ellipse cx="80" cy="145" rx="70" ry="60" fill="url(#m_bg)" />

      {/* Body white uniform */}
      <path d="M32 145 Q34 118 55 110 L80 105 L105 110 Q126 118 128 145 L128 210 L32 210 Z" fill="url(#m_body)" stroke="#C8DCF0" strokeWidth="1" />
      <path d="M67 108 L80 122 L93 108" fill="#E8EFF8" opacity="0.9" />
      <ellipse cx="26" cy="148" rx="16" ry="38" fill="url(#m_body)" transform="rotate(-8 26 148)" stroke="#C8DCF0" strokeWidth="0.8" />
      <ellipse cx="134" cy="148" rx="16" ry="38" fill="url(#m_body)" transform="rotate(8 134 148)" stroke="#C8DCF0" strokeWidth="0.8" />
      <ellipse cx="18" cy="178" rx="12" ry="10" fill="#F5C898" />
      <ellipse cx="142" cy="178" rx="12" ry="10" fill="#F5C898" />

      {/* Red cross badge */}
      <rect x="62" y="122" width="24" height="18" rx="4" fill="white" stroke="#C8DCF0" strokeWidth="0.8" />
      <rect x="70" y="125" width="8" height="12" rx="2" fill="#E63946" />
      <rect x="65" y="128" width="18" height="6" rx="2" fill="#E63946" />

      {/* Stethoscope */}
      <path d="M55 115 Q45 125 42 140 Q42 150 50 150 Q58 150 58 142" stroke="#9B9488" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="58" cy="143" r="6" fill="#B0A898" stroke="#888" strokeWidth="1" />

      {/* Neck */}
      <rect x="70" y="97" width="20" height="14" rx="6" fill="#F0C08A" />

      {/* Hair — bun style */}
      <ellipse cx="80" cy="56" rx="42" ry="44" fill="url(#m_hair)" />
      {/* Bun on top */}
      <circle cx="80" cy="18" r="14" fill="url(#m_hair)" />
      <circle cx="80" cy="18" r="10" fill="#2C2018" />
      {/* Bun sheen */}
      <ellipse cx="76" cy="14" rx="5" ry="3" fill="#4A3828" opacity="0.7" />
      {/* Hair sheen */}
      <ellipse cx="66" cy="38" rx="14" ry="6" fill="#4A3828" opacity="0.5" transform="rotate(-10 66 38)" />

      {/* Face */}
      <ellipse cx="80" cy="66" rx="40" ry="43" fill="url(#m_face)" />

      {/* Eyebrows — neat arch */}
      <path d="M57 49 Q64 44 71 49" stroke="#2A1808" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M89 49 Q96 44 103 49" stroke="#2A1808" strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* Eyes */}
      <ellipse cx="64" cy="62" rx="12" ry="13" fill="white" />
      <circle cx="65" cy="63" r="8.5" fill="#2C1A0A" />
      <circle cx="65" cy="63" r="5" fill="#4A3018" />
      <circle cx="65" cy="63" r="3" fill="#0A0400" />
      <circle cx="61" cy="59" r="3" fill="white" />
      <circle cx="68" cy="61" r="1.2" fill="white" opacity="0.8" />

      <ellipse cx="96" cy="62" rx="12" ry="13" fill="white" />
      <circle cx="95" cy="63" r="8.5" fill="#2C1A0A" />
      <circle cx="95" cy="63" r="5" fill="#4A3018" />
      <circle cx="95" cy="63" r="3" fill="#0A0400" />
      <circle cx="91" cy="59" r="3" fill="white" />
      <circle cx="98" cy="61" r="1.2" fill="white" opacity="0.8" />

      {/* Cheeks */}
      <ellipse cx="50" cy="73" rx="13" ry="8" fill="#FFB8B0" opacity="0.35" />
      <ellipse cx="110" cy="73" rx="13" ry="8" fill="#FFB8B0" opacity="0.35" />

      {/* Nose */}
      <ellipse cx="80" cy="79" rx="5" ry="3.5" fill="#D8906A" opacity="0.4" />

      {/* Smile — professional / gentle */}
      <path d="M69 89 Q80 97 91 89" stroke="#C07860" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M72 91 Q80 96 88 91 Q86 94 80 95 Q74 94 72 91Z" fill="white" opacity="0.75" />
    </svg>
  );
}

function SocialCharacter() {
  // 사회복지사 — male, navy jacket, clipboard, neat short hair
  return (
    <svg viewBox="0 0 160 210" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="s_face" cx="42%" cy="36%" r="58%">
          <stop offset="0%" stopColor="#FFD8B0" />
          <stop offset="65%" stopColor="#F0B880" />
          <stop offset="100%" stopColor="#E0A060" />
        </radialGradient>
        <radialGradient id="s_body" cx="35%" cy="25%" r="65%">
          <stop offset="0%" stopColor="#3D5490" />
          <stop offset="100%" stopColor="#1A2A55" />
        </radialGradient>
        <radialGradient id="s_hair" cx="42%" cy="32%" r="58%">
          <stop offset="0%" stopColor="#2A1E16" />
          <stop offset="100%" stopColor="#0E0A06" />
        </radialGradient>
        <radialGradient id="s_bg" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#E8ECF8" />
          <stop offset="100%" stopColor="#D0D8F0" />
        </radialGradient>
      </defs>

      <ellipse cx="80" cy="145" rx="70" ry="60" fill="url(#s_bg)" />

      {/* Body — navy jacket */}
      <path d="M32 145 Q34 118 55 110 L80 105 L105 110 Q126 118 128 145 L128 210 L32 210 Z" fill="url(#s_body)" />
      {/* White shirt/collar */}
      <path d="M67 108 L80 120 L93 108 L88 103 L80 108 L72 103 Z" fill="white" opacity="0.92" />
      {/* Tie */}
      <path d="M78 108 L82 108 L84 130 L80 135 L76 130 Z" fill="#2C5F5D" opacity="0.9" />
      <ellipse cx="26" cy="148" rx="16" ry="38" fill="url(#s_body)" transform="rotate(-8 26 148)" />
      <ellipse cx="134" cy="148" rx="16" ry="38" fill="url(#s_body)" transform="rotate(8 134 148)" />
      <ellipse cx="18" cy="178" rx="12" ry="10" fill="#F0B880" />
      <ellipse cx="142" cy="178" rx="12" ry="10" fill="#F0B880" />

      {/* Clipboard in left hand */}
      <rect x="4" y="152" width="22" height="30" rx="3" fill="white" stroke="#B0A898" strokeWidth="1" />
      <rect x="9" y="148" width="12" height="7" rx="2" fill="#B0A898" />
      <rect x="7" y="160" width="16" height="2" rx="1" fill="#C8C0B0" />
      <rect x="7" y="165" width="14" height="2" rx="1" fill="#C8C0B0" />
      <rect x="7" y="170" width="16" height="2" rx="1" fill="#C8C0B0" />
      <rect x="7" y="175" width="10" height="2" rx="1" fill="#C8C0B0" />
      {/* Pen */}
      <rect x="25" y="148" width="3" height="18" rx="1.5" fill="#2C5F5D" transform="rotate(15 25 148)" />

      {/* Neck */}
      <rect x="70" y="97" width="20" height="14" rx="6" fill="#E8A870" />

      {/* Hair — short neat male */}
      <ellipse cx="80" cy="56" rx="42" ry="42" fill="url(#s_hair)" />
      {/* Short cut — slightly flat top */}
      <rect x="38" y="32" width="84" height="20" rx="10" fill="url(#s_hair)" />
      {/* Hair sheen */}
      <ellipse cx="66" cy="36" rx="18" ry="5" fill="#4A3828" opacity="0.5" transform="rotate(-5 66 36)" />

      {/* Face — slightly more angular / male */}
      <ellipse cx="80" cy="68" rx="39" ry="42" fill="url(#s_face)" />

      {/* Eyebrows — straighter, male */}
      <path d="M57 51 Q64 47 70 51" stroke="#2A1808" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <path d="M90 51 Q97 47 103 51" stroke="#2A1808" strokeWidth="2.8" strokeLinecap="round" fill="none" />

      {/* Eyes */}
      <ellipse cx="63" cy="64" rx="12" ry="12.5" fill="white" />
      <circle cx="64" cy="65" r="8" fill="#251505" />
      <circle cx="64" cy="65" r="4.5" fill="#3D2808" />
      <circle cx="64" cy="65" r="2.8" fill="#080200" />
      <circle cx="60" cy="61" r="2.8" fill="white" />
      <circle cx="67" cy="63" r="1.1" fill="white" opacity="0.8" />

      <ellipse cx="97" cy="64" rx="12" ry="12.5" fill="white" />
      <circle cx="96" cy="65" r="8" fill="#251505" />
      <circle cx="96" cy="65" r="4.5" fill="#3D2808" />
      <circle cx="96" cy="65" r="2.8" fill="#080200" />
      <circle cx="92" cy="61" r="2.8" fill="white" />
      <circle cx="99" cy="63" r="1.1" fill="white" opacity="0.8" />

      {/* Cheeks subtle */}
      <ellipse cx="50" cy="76" rx="12" ry="7" fill="#FFB090" opacity="0.25" />
      <ellipse cx="110" cy="76" rx="12" ry="7" fill="#FFB090" opacity="0.25" />

      {/* Nose — slightly larger, male */}
      <path d="M75 82 Q80 85 85 82" stroke="#C08060" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="80" cy="82" rx="6" ry="4" fill="#D89060" opacity="0.35" />

      {/* Slight smile — confident */}
      <path d="M68 92 Q80 100 92 92" stroke="#B87050" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M71 93 Q80 98 89 93 Q87 97 80 97 Q73 97 71 93Z" fill="white" opacity="0.7" />
    </svg>
  );
}

function ManagerCharacter({ type }: { type: 'care' | 'medical' | 'social' }) {
  if (type === 'care') return <CareCharacter />;
  if (type === 'medical') return <MedicalCharacter />;
  return <SocialCharacter />;
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
                    style={{ borderRight: i < 2 ? '0.5px solid rgba(42,40,35,0.18)' : 'none' }}
                  >
                    {/* Pixar character */}
                    <div className="w-full mb-5 flex items-end justify-center" style={{ height: 200 }}>
                      <ManagerCharacter type={c.type} />
                    </div>

                    <div className="flex items-center gap-1.5 mb-2">
                      <BadgeCheck size={12} strokeWidth={1.5} className="text-primary shrink-0" />
                      <span className="text-[11px] text-primary font-medium">{c.cert}</span>
                    </div>
                    <div className="text-[11px] tracking-[0.18em] uppercase font-en text-mute">
                      {c.tag}
                    </div>
                    <div className="mt-1 text-[12.5px] text-mute">{c.role}</div>
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
                  <p className="text-[11px] tracking-[0.2em] uppercase font-en text-surface/60">Join Us</p>
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

            <div className="md:col-span-5">
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
