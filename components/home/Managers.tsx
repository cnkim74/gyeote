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

/* ── Cute chibi-style characters ── */

function CareCharacter() {
  return (
    <svg viewBox="0 0 160 190" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Background blob */}
      <ellipse cx="80" cy="155" rx="62" ry="30" fill="#D8EEE8" />

      {/* Body — teal uniform */}
      <rect x="44" y="128" width="72" height="55" rx="20" fill="#2C5F5D" />
      {/* Collar */}
      <path d="M68 128 L80 142 L92 128" fill="#F9E8D0" />
      {/* White badge with heart */}
      <rect x="66" y="140" width="28" height="20" rx="5" fill="white" opacity="0.9" />
      <path d="M75 147 Q80 143 85 147 Q80 153 75 147Z" fill="#C97B5D" />

      {/* Neck */}
      <rect x="70" y="116" width="20" height="16" rx="8" fill="#F5C898" />

      {/* Arms */}
      <rect x="24" y="128" width="22" height="42" rx="11" fill="#2C5F5D" />
      <rect x="114" y="128" width="22" height="42" rx="11" fill="#2C5F5D" />
      {/* Hands */}
      <ellipse cx="35" cy="173" rx="13" ry="11" fill="#F5C898" />
      <ellipse cx="125" cy="173" rx="13" ry="11" fill="#F5C898" />
      {/* Heart in right hand */}
      <path d="M119 169 Q122 165 125 168 Q128 165 131 169 Q128 173 125 176 Q122 173 119 169Z" fill="#C97B5D" />

      {/* Head — big round */}
      <circle cx="80" cy="72" r="56" fill="#F5C898" />
      {/* Face highlight */}
      <ellipse cx="70" cy="56" rx="22" ry="16" fill="#FFDFC0" opacity="0.5" />

      {/* Hair — bob */}
      <ellipse cx="80" cy="30" rx="52" ry="38" fill="#2A1E18" />
      <ellipse cx="80" cy="72" rx="56" ry="30" fill="#2A1E18" />
      {/* Hair sides */}
      <ellipse cx="30" cy="75" rx="14" ry="28" fill="#2A1E18" />
      <ellipse cx="130" cy="75" rx="14" ry="28" fill="#2A1E18" />
      {/* Hair shine */}
      <ellipse cx="62" cy="28" rx="14" ry="6" fill="#4A3830" opacity="0.7" transform="rotate(-15 62 28)" />

      {/* Face (on top of hair) */}
      <ellipse cx="80" cy="80" rx="44" ry="48" fill="#F5C898" />

      {/* Eyebrows — simple arched */}
      <path d="M57 58 Q64 53 71 57" stroke="#3A2010" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M89 57 Q96 53 103 58" stroke="#3A2010" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Eyes — simple cute */}
      <circle cx="64" cy="72" r="11" fill="white" />
      <circle cx="64" cy="73" r="7" fill="#1A0C04" />
      <circle cx="60" cy="69" r="3.5" fill="white" />

      <circle cx="96" cy="72" r="11" fill="white" />
      <circle cx="96" cy="73" r="7" fill="#1A0C04" />
      <circle cx="92" cy="69" r="3.5" fill="white" />

      {/* Cheeks */}
      <circle cx="48" cy="84" r="12" fill="#FFB0A0" opacity="0.45" />
      <circle cx="112" cy="84" r="12" fill="#FFB0A0" opacity="0.45" />

      {/* Cute smile */}
      <path d="M66 96 Q80 108 94 96" stroke="#D07860" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Teeth */}
      <path d="M68 97 Q80 106 92 97 Q89 103 80 103 Q71 103 68 97Z" fill="white" opacity="0.85" />

      {/* Nose — just two dots */}
      <circle cx="76" cy="89" r="2" fill="#D09060" opacity="0.5" />
      <circle cx="84" cy="89" r="2" fill="#D09060" opacity="0.5" />
    </svg>
  );
}

function MedicalCharacter() {
  return (
    <svg viewBox="0 0 160 190" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Background blob */}
      <ellipse cx="80" cy="155" rx="62" ry="30" fill="#D8E8F8" />

      {/* Body — white uniform */}
      <rect x="44" y="128" width="72" height="55" rx="20" fill="#EEF6FF" stroke="#C8DCEF" strokeWidth="1.5" />
      {/* Collar */}
      <path d="M68 128 L80 142 L92 128" fill="#F9E8D0" />
      {/* Red cross badge */}
      <rect x="66" y="138" width="28" height="22" rx="5" fill="white" stroke="#E8E0D8" strokeWidth="1" />
      <rect x="75" y="142" width="10" height="14" rx="3" fill="#E63946" />
      <rect x="69" y="146" width="22" height="6" rx="3" fill="#E63946" />

      {/* Stethoscope */}
      <path d="M52 130 Q38 145 38 158 Q38 166 46 166 Q54 166 54 158" stroke="#9B9488" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="54" cy="159" r="7" fill="#B0A898" />
      <circle cx="54" cy="159" r="4" fill="#8A8078" />

      {/* Neck */}
      <rect x="70" y="116" width="20" height="16" rx="8" fill="#F5C8A0" />
      {/* Arms */}
      <rect x="24" y="128" width="22" height="42" rx="11" fill="#EEF6FF" stroke="#C8DCEF" strokeWidth="1.5" />
      <rect x="114" y="128" width="22" height="42" rx="11" fill="#EEF6FF" stroke="#C8DCEF" strokeWidth="1.5" />
      <ellipse cx="35" cy="173" rx="13" ry="11" fill="#F5C898" />
      <ellipse cx="125" cy="173" rx="13" ry="11" fill="#F5C898" />

      {/* Head */}
      <circle cx="80" cy="72" r="56" fill="#F5C898" />
      <ellipse cx="70" cy="56" rx="22" ry="16" fill="#FFDFC0" opacity="0.5" />

      {/* Hair — neat bun style */}
      <ellipse cx="80" cy="28" rx="50" ry="36" fill="#1E1610" />
      <ellipse cx="80" cy="72" rx="56" ry="28" fill="#1E1610" />
      <ellipse cx="30" cy="73" rx="13" ry="26" fill="#1E1610" />
      <ellipse cx="130" cy="73" rx="13" ry="26" fill="#1E1610" />
      {/* Bun */}
      <circle cx="80" cy="16" r="16" fill="#1E1610" />
      <circle cx="80" cy="16" r="11" fill="#2A2018" />
      <ellipse cx="75" cy="12" rx="5" ry="3" fill="#3A3028" opacity="0.7" />
      {/* Hair shine */}
      <ellipse cx="63" cy="30" rx="13" ry="5" fill="#3A3028" opacity="0.6" transform="rotate(-12 63 30)" />

      {/* Face */}
      <ellipse cx="80" cy="80" rx="44" ry="48" fill="#F5C898" />

      {/* Eyebrows */}
      <path d="M57 59 Q64 54 71 58" stroke="#3A2010" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <path d="M89 58 Q96 54 103 59" stroke="#3A2010" strokeWidth="2.8" strokeLinecap="round" fill="none" />

      {/* Eyes */}
      <circle cx="64" cy="72" r="11" fill="white" />
      <circle cx="64" cy="73" r="7" fill="#1A0C04" />
      <circle cx="60" cy="69" r="3.5" fill="white" />

      <circle cx="96" cy="72" r="11" fill="white" />
      <circle cx="96" cy="73" r="7" fill="#1A0C04" />
      <circle cx="92" cy="69" r="3.5" fill="white" />

      {/* Cheeks */}
      <circle cx="48" cy="84" r="12" fill="#FFB0B8" opacity="0.4" />
      <circle cx="112" cy="84" r="12" fill="#FFB0B8" opacity="0.4" />

      {/* Gentle smile */}
      <path d="M68 95 Q80 105 92 95" stroke="#D07860" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M70 96 Q80 104 90 96 Q88 101 80 102 Q72 101 70 96Z" fill="white" opacity="0.8" />

      <circle cx="76" cy="88" r="2" fill="#D09060" opacity="0.5" />
      <circle cx="84" cy="88" r="2" fill="#D09060" opacity="0.5" />
    </svg>
  );
}

function SocialCharacter() {
  return (
    <svg viewBox="0 0 160 190" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Background blob */}
      <ellipse cx="80" cy="155" rx="62" ry="30" fill="#DDE2F4" />

      {/* Body — navy jacket */}
      <rect x="44" y="128" width="72" height="55" rx="20" fill="#2D4373" />
      {/* White shirt collar */}
      <path d="M68 128 L80 140 L92 128 L88 122 L80 128 L72 122 Z" fill="white" opacity="0.95" />
      {/* Green tie */}
      <path d="M77 128 L83 128 L85 148 L80 153 L75 148 Z" fill="#2C5F5D" />

      {/* Clipboard */}
      <rect x="8" y="145" width="26" height="34" rx="4" fill="white" stroke="#C8C0B0" strokeWidth="1.5" />
      <rect x="14" y="140" width="14" height="8" rx="3" fill="#B0A898" />
      <rect x="12" y="156" width="18" height="2.5" rx="1" fill="#D0C8C0" />
      <rect x="12" y="162" width="15" height="2.5" rx="1" fill="#D0C8C0" />
      <rect x="12" y="168" width="18" height="2.5" rx="1" fill="#D0C8C0" />

      {/* Neck */}
      <rect x="70" y="116" width="20" height="16" rx="8" fill="#F0B880" />
      {/* Arms */}
      <rect x="24" y="128" width="22" height="42" rx="11" fill="#2D4373" />
      <rect x="114" y="128" width="22" height="42" rx="11" fill="#2D4373" />
      <ellipse cx="35" cy="173" rx="13" ry="11" fill="#F0B880" />
      <ellipse cx="125" cy="173" rx="13" ry="11" fill="#F0B880" />

      {/* Head */}
      <circle cx="80" cy="72" r="56" fill="#F0B880" />
      <ellipse cx="70" cy="56" rx="22" ry="16" fill="#FFD8A8" opacity="0.5" />

      {/* Hair — short male */}
      <ellipse cx="80" cy="28" rx="52" ry="34" fill="#1C1410" />
      <ellipse cx="80" cy="60" rx="56" ry="24" fill="#1C1410" />
      <ellipse cx="30" cy="68" rx="12" ry="22" fill="#1C1410" />
      <ellipse cx="130" cy="68" rx="12" ry="22" fill="#1C1410" />
      {/* Short cut top */}
      <rect x="28" y="22" width="104" height="22" rx="11" fill="#1C1410" />
      {/* Hair shine */}
      <ellipse cx="63" cy="28" rx="16" ry="5" fill="#3A3028" opacity="0.55" transform="rotate(-8 63 28)" />

      {/* Face */}
      <ellipse cx="80" cy="80" rx="44" ry="48" fill="#F0B880" />

      {/* Eyebrows — straighter */}
      <path d="M56 59 Q64 55 71 59" stroke="#2A1808" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M89 59 Q96 55 104 59" stroke="#2A1808" strokeWidth="3.2" strokeLinecap="round" fill="none" />

      {/* Eyes */}
      <circle cx="64" cy="73" r="11" fill="white" />
      <circle cx="64" cy="74" r="7" fill="#150800" />
      <circle cx="60" cy="70" r="3.5" fill="white" />

      <circle cx="96" cy="73" r="11" fill="white" />
      <circle cx="96" cy="74" r="7" fill="#150800" />
      <circle cx="92" cy="70" r="3.5" fill="white" />

      {/* Cheeks subtle */}
      <circle cx="48" cy="86" r="11" fill="#FFB090" opacity="0.3" />
      <circle cx="112" cy="86" r="11" fill="#FFB090" opacity="0.3" />

      {/* Friendly smile */}
      <path d="M66 97 Q80 109 94 97" stroke="#C07850" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M68 98 Q80 107 92 98 Q89 104 80 104 Q71 104 68 98Z" fill="white" opacity="0.8" />

      <circle cx="76" cy="90" r="2" fill="#C08050" opacity="0.5" />
      <circle cx="84" cy="90" r="2" fill="#C08050" opacity="0.5" />
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
                    <div className="w-full mb-5" style={{ height: 190 }}>
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
