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
    color: '#2C7A72',
  },
  {
    tag: '매니저 ㅇ',
    role: '간호조무사 · 사회복지사 2급',
    cert: '간호조무사',
    line: '"병원에서 들으신 말씀, 자녀분께도 같은 결로 전달드리려 노력합니다."',
    area: '영주 · 봉화',
    type: 'medical' as const,
    color: '#5C7CA8',
  },
  {
    tag: '매니저 ㄱ',
    role: '사회복지사 1급 · 9년차',
    cert: '사회복지사 1급',
    line: '"행정 서류는 어머님 손을 빌려, 함께 끝내고 옵니다. 대신해드리지 않습니다."',
    area: '의성 · 청송',
    type: 'social' as const,
    color: '#4A7A58',
  },
];

/* ── 역할 아이콘: 선 일러스트 ── */

function CareIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
      {/* Heart */}
      <path
        d="M28 46 C28 46 6 32 6 18 C6 11 12 6 19 6 C23 6 27 9 28 13 C29 9 33 6 37 6 C44 6 50 11 50 18 C50 32 28 46 28 46Z"
        stroke={color} strokeWidth="2.2" strokeLinejoin="round" fill={`${color}14`}
      />
      {/* Person inside heart */}
      <circle cx="28" cy="19" r="4.5" stroke={color} strokeWidth="1.8" fill={`${color}20`} />
      <path
        d="M21 32 Q24 27 28 27 Q32 27 35 32"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none"
      />
    </svg>
  );
}

function MedicalIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
      {/* Ear tips */}
      <circle cx="17" cy="9" r="3" stroke={color} strokeWidth="2" fill={`${color}14`} />
      <circle cx="39" cy="9" r="3" stroke={color} strokeWidth="2" fill={`${color}14`} />
      {/* Tubes */}
      <path
        d="M17 12 L17 22 Q17 29 28 29 Q39 29 39 22 L39 12"
        stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round"
      />
      {/* Stem */}
      <path d="M28 29 L28 39" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      {/* Chest piece */}
      <circle cx="28" cy="46" r="7" stroke={color} strokeWidth="2.2" fill={`${color}14`} />
      <circle cx="28" cy="46" r="3" fill={color} opacity="0.35" />
    </svg>
  );
}

function SocialIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
      {/* Clipboard body */}
      <rect x="9" y="13" width="38" height="40" rx="4" stroke={color} strokeWidth="2.2" fill={`${color}08`} />
      {/* Clip */}
      <rect x="19" y="8" width="18" height="11" rx="5" stroke={color} strokeWidth="2" fill={`${color}14`} />
      {/* Text lines */}
      <line x1="17" y1="28" x2="39" y2="28" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="17" y1="36" x2="35" y2="36" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      {/* Checkmark on last line */}
      <polyline
        points="17,44 21,48 30,40"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </svg>
  );
}

function RoleIcon({ type, color }: { type: 'care' | 'medical' | 'social'; color: string }) {
  if (type === 'care') return <CareIcon color={color} />;
  if (type === 'medical') return <MedicalIcon color={color} />;
  return <SocialIcon color={color} />;
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
                    <div className="w-full mb-6 flex items-center justify-center py-3">
                      <div
                        className="w-[88px] h-[88px] rounded-full flex items-center justify-center"
                        style={{ background: `${c.color}12` }}
                      >
                        <RoleIcon type={c.type} color={c.color} />
                      </div>
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
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
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
