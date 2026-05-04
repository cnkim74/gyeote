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

/* ── 3D clay-style characters (reference: smooth Pixar/3D avatar style) ── */

function CareChar() {
  return (
    <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="ca_skin" cx="38%" cy="30%" r="62%">
          <stop offset="0%" stopColor="#FFEEDD" />
          <stop offset="45%" stopColor="#F8C89A" />
          <stop offset="100%" stopColor="#E5A070" />
        </radialGradient>
        <radialGradient id="ca_hair" cx="34%" cy="20%" r="64%">
          <stop offset="0%" stopColor="#C8904C" />
          <stop offset="50%" stopColor="#8A5428" />
          <stop offset="100%" stopColor="#552E0E" />
        </radialGradient>
        <radialGradient id="ca_body" cx="32%" cy="20%" r="68%">
          <stop offset="0%" stopColor="#52A89E" />
          <stop offset="100%" stopColor="#1E4E4C" />
        </radialGradient>
        <radialGradient id="ca_hand" cx="35%" cy="28%" r="58%">
          <stop offset="0%" stopColor="#FFEEDD" />
          <stop offset="100%" stopColor="#E8AA7A" />
        </radialGradient>
        <filter id="ca_shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#00000020" />
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="100" cy="232" rx="58" ry="10" fill="#00000015" />

      {/* Body */}
      <rect x="54" y="148" width="92" height="80" rx="28" fill="url(#ca_body)" filter="url(#ca_shadow)" />
      {/* Collar V */}
      <path d="M82 148 L100 168 L118 148" fill="#FFEEDD" opacity="0.9" />
      {/* Badge */}
      <rect x="82" y="162" width="30" height="22" rx="6" fill="white" opacity="0.9" />
      <path d="M91 170 Q97 165 103 170 Q97 176 91 170Z" fill="#C97B5D" />
      <rect x="86" y="176" width="18" height="2" rx="1" fill="#C0C0C0" opacity="0.6" />

      {/* Arms */}
      <rect x="28" y="150" width="28" height="52" rx="14" fill="url(#ca_body)" />
      <rect x="144" y="150" width="28" height="52" rx="14" fill="url(#ca_body)" />
      {/* Hands */}
      <ellipse cx="42" cy="207" rx="17" ry="14" fill="url(#ca_hand)" />
      <ellipse cx="158" cy="207" rx="17" ry="14" fill="url(#ca_hand)" />
      {/* Heart */}
      <path d="M150 202 Q154 196 158 200 Q162 196 166 202 Q162 208 158 212 Q154 208 150 202Z" fill="#E84B6A" />

      {/* Neck */}
      <ellipse cx="100" cy="140" rx="14" ry="12" fill="#F8C89A" />

      {/* Hair back */}
      <ellipse cx="100" cy="78" rx="56" ry="52" fill="url(#ca_hair)" />
      {/* Bob sides */}
      <ellipse cx="48" cy="96" rx="16" ry="30" fill="url(#ca_hair)" />
      <ellipse cx="152" cy="96" rx="16" ry="30" fill="url(#ca_hair)" />

      {/* Face */}
      <ellipse cx="100" cy="90" rx="50" ry="54" fill="url(#ca_skin)" filter="url(#ca_shadow)" />

      {/* Hair front top */}
      <ellipse cx="100" cy="48" rx="52" ry="26" fill="url(#ca_hair)" />
      {/* Hair shine */}
      <ellipse cx="82" cy="40" rx="18" ry="7" fill="#DDB870" opacity="0.52" transform="rotate(-18 82 40)" />

      {/* Eyebrows */}
      <path d="M72 70 Q80 65 87 69" stroke="#3A2010" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <path d="M113 69 Q120 65 128 70" stroke="#3A2010" strokeWidth="2.8" strokeLinecap="round" fill="none" />

      {/* Eyes — tiny clay dots */}
      <circle cx="81" cy="84" r="5.5" fill="#1A0C06" />
      <circle cx="78" cy="81" r="2" fill="white" opacity="0.92" />
      <circle cx="119" cy="84" r="5.5" fill="#1A0C06" />
      <circle cx="116" cy="81" r="2" fill="white" opacity="0.92" />

      {/* Cheeks */}
      <ellipse cx="62" cy="100" rx="16" ry="10" fill="#FFB0A0" opacity="0.38" />
      <ellipse cx="138" cy="100" rx="16" ry="10" fill="#FFB0A0" opacity="0.38" />

      {/* Nose — subtle */}
      <ellipse cx="100" cy="106" rx="5" ry="3.5" fill="#D89068" opacity="0.35" />

      {/* Smile */}
      <path d="M84 118 Q100 130 116 118" stroke="#C87060" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M86 119 Q100 128 114 119 Q111 125 100 126 Q89 125 86 119Z" fill="#FFEEDD" opacity="0.7" />
    </svg>
  );
}

function MedicalChar() {
  return (
    <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="me_skin" cx="38%" cy="30%" r="62%">
          <stop offset="0%" stopColor="#FFEDDA" />
          <stop offset="45%" stopColor="#F8C898" />
          <stop offset="100%" stopColor="#E5A272" />
        </radialGradient>
        <radialGradient id="me_hair" cx="34%" cy="20%" r="64%">
          <stop offset="0%" stopColor="#BE8844" />
          <stop offset="50%" stopColor="#7E4E20" />
          <stop offset="100%" stopColor="#4E2C0A" />
        </radialGradient>
        <radialGradient id="me_body" cx="32%" cy="20%" r="68%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#C8DCEE" />
        </radialGradient>
        <filter id="me_shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#00000018" />
        </filter>
      </defs>

      <ellipse cx="100" cy="232" rx="58" ry="10" fill="#00000015" />

      {/* Body white uniform */}
      <rect x="54" y="148" width="92" height="80" rx="28" fill="url(#me_body)" stroke="#D8E8F5" strokeWidth="1.5" filter="url(#me_shadow)" />
      <path d="M82 148 L100 166 L118 148" fill="#FFEEDD" opacity="0.85" />
      {/* Red cross */}
      <rect x="83" y="162" width="34" height="24" rx="6" fill="white" stroke="#E8E0DC" strokeWidth="1" />
      <rect x="93" y="166" width="14" height="16" rx="4" fill="#E63946" />
      <rect x="86" y="171" width="28" height="6" rx="3" fill="#E63946" />

      {/* Stethoscope */}
      <path d="M60 158 Q42 172 40 188 Q40 200 52 200 Q64 200 64 188" stroke="#9B9488" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="64" cy="189" r="9" fill="#B0A090" />
      <circle cx="64" cy="189" r="5" fill="#8A7868" />
      <ellipse cx="61" cy="186" rx="2.5" ry="1.5" fill="#C8B8A8" opacity="0.6" />

      {/* Arms */}
      <rect x="28" y="150" width="28" height="52" rx="14" fill="url(#me_body)" stroke="#D8E8F5" strokeWidth="1.5" />
      <rect x="144" y="150" width="28" height="52" rx="14" fill="url(#me_body)" stroke="#D8E8F5" strokeWidth="1.5" />
      <ellipse cx="42" cy="207" rx="17" ry="14" fill="#F8C898" />
      <ellipse cx="158" cy="207" rx="17" ry="14" fill="#F8C898" />

      {/* Neck */}
      <ellipse cx="100" cy="140" rx="14" ry="12" fill="#F8C898" />

      {/* Hair back */}
      <ellipse cx="100" cy="74" rx="54" ry="50" fill="url(#me_hair)" />
      <ellipse cx="48" cy="90" rx="15" ry="28" fill="url(#me_hair)" />
      <ellipse cx="152" cy="90" rx="15" ry="28" fill="url(#me_hair)" />

      {/* Face */}
      <ellipse cx="100" cy="88" rx="50" ry="54" fill="url(#me_skin)" filter="url(#me_shadow)" />

      {/* Bun */}
      <circle cx="100" cy="30" r="20" fill="url(#me_hair)" />
      <circle cx="100" cy="30" r="14" fill="#6A4020" />
      <ellipse cx="93" cy="24" rx="6" ry="3.5" fill="#B07838" opacity="0.60" />

      {/* Hair front */}
      <ellipse cx="100" cy="48" rx="52" ry="22" fill="url(#me_hair)" />
      <ellipse cx="80" cy="42" rx="16" ry="6" fill="#D4A058" opacity="0.52" transform="rotate(-12 80 42)" />

      {/* Eyebrows */}
      <path d="M72 68 Q80 63 87 67" stroke="#2A1808" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <path d="M113 67 Q120 63 128 68" stroke="#2A1808" strokeWidth="2.8" strokeLinecap="round" fill="none" />

      {/* Eyes */}
      <circle cx="81" cy="82" r="5.5" fill="#1A0C06" />
      <circle cx="78" cy="79" r="2" fill="white" opacity="0.92" />
      <circle cx="119" cy="82" r="5.5" fill="#1A0C06" />
      <circle cx="116" cy="79" r="2" fill="white" opacity="0.92" />

      {/* Cheeks */}
      <ellipse cx="62" cy="98" rx="16" ry="10" fill="#FFB8C0" opacity="0.36" />
      <ellipse cx="138" cy="98" rx="16" ry="10" fill="#FFB8C0" opacity="0.36" />

      {/* Nose */}
      <ellipse cx="100" cy="104" rx="5" ry="3.5" fill="#D89068" opacity="0.32" />

      {/* Smile */}
      <path d="M84 116 Q100 127 116 116" stroke="#C87060" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M86 117 Q100 126 114 117 Q111 123 100 124 Q89 123 86 117Z" fill="#FFEDDA" opacity="0.7" />
    </svg>
  );
}

function SocialChar() {
  return (
    <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="so_skin" cx="38%" cy="30%" r="62%">
          <stop offset="0%" stopColor="#FFEBD6" />
          <stop offset="45%" stopColor="#F5BC88" />
          <stop offset="100%" stopColor="#E09A60" />
        </radialGradient>
        <radialGradient id="so_hair" cx="36%" cy="22%" r="62%">
          <stop offset="0%" stopColor="#CC9450" />
          <stop offset="50%" stopColor="#8C5C28" />
          <stop offset="100%" stopColor="#58320E" />
        </radialGradient>
        <radialGradient id="so_body" cx="32%" cy="20%" r="68%">
          <stop offset="0%" stopColor="#4A6BAA" />
          <stop offset="100%" stopColor="#1A2D5A" />
        </radialGradient>
        <filter id="so_shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#00000018" />
        </filter>
      </defs>

      <ellipse cx="100" cy="232" rx="58" ry="10" fill="#00000015" />

      {/* Body navy */}
      <rect x="54" y="148" width="92" height="80" rx="28" fill="url(#so_body)" filter="url(#so_shadow)" />
      {/* White shirt */}
      <path d="M82 148 L100 164 L118 148 L112 140 L100 148 L88 140 Z" fill="white" opacity="0.92" />
      {/* Tie */}
      <path d="M96 148 L104 148 L106 170 L100 176 L94 170 Z" fill="#2C5F5D" />

      {/* Clipboard */}
      <rect x="14" y="168" width="30" height="40" rx="5" fill="white" stroke="#C8C0B0" strokeWidth="1.5" filter="url(#so_shadow)" />
      <rect x="20" y="162" width="18" height="10" rx="4" fill="#B0A090" />
      <rect x="18" y="182" width="22" height="3" rx="1.5" fill="#D8D0C8" />
      <rect x="18" y="190" width="18" height="3" rx="1.5" fill="#D8D0C8" />
      <rect x="18" y="198" width="22" height="3" rx="1.5" fill="#D8D0C8" />

      {/* Arms */}
      <rect x="28" y="150" width="28" height="52" rx="14" fill="url(#so_body)" />
      <rect x="144" y="150" width="28" height="52" rx="14" fill="url(#so_body)" />
      <ellipse cx="42" cy="207" rx="17" ry="14" fill="#F5BC88" />
      <ellipse cx="158" cy="207" rx="17" ry="14" fill="#F5BC88" />

      {/* Neck */}
      <ellipse cx="100" cy="140" rx="14" ry="12" fill="#F5BC88" />

      {/* Hair back */}
      <ellipse cx="100" cy="74" rx="54" ry="48" fill="url(#so_hair)" />
      <ellipse cx="48" cy="86" rx="14" ry="24" fill="url(#so_hair)" />
      <ellipse cx="152" cy="86" rx="14" ry="24" fill="url(#so_hair)" />

      {/* Face */}
      <ellipse cx="100" cy="88" rx="50" ry="54" fill="url(#so_skin)" filter="url(#so_shadow)" />

      {/* Short hair top — male cut */}
      <ellipse cx="100" cy="46" rx="52" ry="24" fill="url(#so_hair)" />
      {/* Side part */}
      <path d="M68 46 Q100 36 132 46 Q120 38 100 36 Q80 38 68 46Z" fill="#A87040" opacity="0.42" />
      {/* Hair shine */}
      <ellipse cx="82" cy="38" rx="20" ry="6" fill="#E0B870" opacity="0.48" transform="rotate(-10 82 38)" />

      {/* Eyebrows — male, straighter */}
      <path d="M71 68 Q80 63 88 67" stroke="#2A1808" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M112 67 Q120 63 129 68" stroke="#2A1808" strokeWidth="3.2" strokeLinecap="round" fill="none" />

      {/* Eyes */}
      <circle cx="81" cy="83" r="5.5" fill="#150800" />
      <circle cx="78" cy="80" r="2" fill="white" opacity="0.90" />
      <circle cx="119" cy="83" r="5.5" fill="#150800" />
      <circle cx="116" cy="80" r="2" fill="white" opacity="0.90" />

      {/* Cheeks */}
      <ellipse cx="62" cy="100" rx="15" ry="9" fill="#FFB090" opacity="0.3" />
      <ellipse cx="138" cy="100" rx="15" ry="9" fill="#FFB090" opacity="0.3" />

      {/* Nose */}
      <ellipse cx="100" cy="106" rx="6" ry="4" fill="#C88050" opacity="0.3" />

      {/* Friendly smile */}
      <path d="M84 118 Q100 130 116 118" stroke="#C07050" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M86 119 Q100 128 114 119 Q111 125 100 126 Q89 125 86 119Z" fill="#FFEBD6" opacity="0.7" />
    </svg>
  );
}

function ManagerCharacter({ type }: { type: 'care' | 'medical' | 'social' }) {
  if (type === 'care') return <CareChar />;
  if (type === 'medical') return <MedicalChar />;
  return <SocialChar />;
}

export function Managers() {
  return (
    <>
      <section id="managers" className="py-24 md:py-36 hairline-t bg-paper">
        <div className="max-w-page mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="num text-primary text-[15px]">no. 07</div>
            <div className="mt-2 text-[12px] tracking-[0.2em] uppercase font-en text-mute">Managers</div>
            <Reveal>
              <h2 className="mt-8 font-serif-ko font-bold text-ink text-[28px] md:text-[40px] leading-[1.32] tracking-[-0.015em]">
                자격을 갖추는 것은<br />기본입니다.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 text-[15px] text-ink/80 leading-[1.9] max-w-[380px]">
                모든 매니저는{' '}
                <span className="text-ink font-medium">요양보호사 · 간호조무사 · 사회복지사</span>{' '}
                국가 자격증을 보유합니다. 곁에가 마련한{' '}
                <em className="font-en">Report Tone Guide</em>에 따라 따뜻함의 결을 표준화합니다.
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
                    <div className="w-full mb-5 flex items-center justify-center" style={{ height: 200 }}>
                      <ManagerCharacter type={c.type} />
                    </div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <BadgeCheck size={12} strokeWidth={1.5} className="text-primary shrink-0" />
                      <span className="text-[11px] text-primary font-medium">{c.cert}</span>
                    </div>
                    <div className="text-[11px] tracking-[0.18em] uppercase font-en text-mute">{c.tag}</div>
                    <div className="mt-1 text-[12.5px] text-mute">{c.role}</div>
                    <p className="mt-4 font-serif-ko text-[15px] text-ink leading-[1.7] flex-1">{c.line}</p>
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

      {/* Recruitment */}
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
                  의미 있는 일에<br />도전하세요.
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="mt-6 text-[15px] text-surface/75 leading-[1.9] max-w-read">
                  곁에의 매니저는 단순한 서비스 제공자가 아닙니다.
                  어르신의 하루를 가장 가까이서 함께하며,
                  가족에게 그 온기를 전달하는 사람입니다.
                  자격증을 보유하고 계신가요? 지금 도전해 보세요.
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
