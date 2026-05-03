'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CalendarVisit {
  id: string;
  visit_date: string;
  mood: 'good' | 'fair' | 'concern';
  status: 'pending' | 'approved' | 'rejected';
  summary: string;
  manager_name?: string | null;
  beneficiary_name?: string | null;
}

interface VisitCalendarProps {
  visits: CalendarVisit[];
  showManagerName?: boolean;
  showBeneficiaryName?: boolean;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const STATUS_DOT = {
  approved: 'bg-[#2C5F5D]',
  pending:  'bg-amber-400',
  rejected: 'bg-[#C97B5D]',
} as const;

const MOOD_LABEL = {
  good:    { text: '좋음',    color: 'text-[#2D6A4F]', bg: 'bg-[#E8F4EC]' },
  fair:    { text: '보통',    color: 'text-[#8A6914]', bg: 'bg-[#FFF8E1]' },
  concern: { text: '관심필요', color: 'text-[#842029]', bg: 'bg-[#FDE8E8]' },
} as const;

const STATUS_LABEL = {
  approved: { text: '승인됨',    color: 'text-[#2D6A4F]' },
  pending:  { text: '승인 대기', color: 'text-amber-700' },
  rejected: { text: '반려됨',    color: 'text-[#842029]' },
} as const;

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

export function VisitCalendar({ visits, showManagerName, showBeneficiaryName }: VisitCalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<string | null>(null);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelected(null);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelected(null);
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun

  // Group visits by date string
  const byDate: Record<string, CalendarVisit[]> = {};
  visits.forEach(v => {
    if (!byDate[v.visit_date]) byDate[v.visit_date] = [];
    byDate[v.visit_date].push(v);
  });

  // Build calendar cells
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  function dateKey(d: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  const selectedVisits = selected ? (byDate[selected] ?? []) : [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={prevMonth} className="p-1.5 text-mute hover:text-ink transition-colors">
          <ChevronLeft size={18} strokeWidth={1.4} />
        </button>
        <p className="font-serif-ko text-[17px] text-ink font-bold">
          {year}년 {month + 1}월
        </p>
        <button onClick={nextMonth} className="p-1.5 text-mute hover:text-ink transition-colors">
          <ChevronRight size={18} strokeWidth={1.4} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div key={d} className={`text-center text-[11px] py-1.5 ${i === 0 ? 'text-accent' : i === 6 ? 'text-[#1B6FE4]' : 'text-mute'}`}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-px bg-line">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} className="bg-surface h-14" />;
          const key = dateKey(day);
          const dayVisits = byDate[key] ?? [];
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          const isSelected = selected === key;
          const dow = (firstDay + day - 1) % 7;

          return (
            <div
              key={idx}
              onClick={() => dayVisits.length > 0 && setSelected(isSelected ? null : key)}
              className={`bg-paper h-14 flex flex-col items-center pt-2 pb-1 transition-colors relative
                ${dayVisits.length > 0 ? 'cursor-pointer hover:bg-primary/5' : ''}
                ${isSelected ? 'bg-primary/8 ring-1 ring-primary/30' : ''}
              `}
            >
              <span className={`text-[13px] leading-none mb-1.5 w-6 h-6 flex items-center justify-center
                ${isToday ? 'bg-primary text-surface rounded-full font-bold' : ''}
                ${dow === 0 ? 'text-accent' : dow === 6 ? 'text-[#1B6FE4]' : 'text-ink'}
                ${isToday ? '!text-surface' : ''}
              `}>
                {day}
              </span>
              {/* Visit dots */}
              {dayVisits.length > 0 && (
                <div className="flex gap-0.5 flex-wrap justify-center px-1">
                  {dayVisits.slice(0, 3).map((v, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[v.status]}`}
                    />
                  ))}
                  {dayVisits.length > 3 && (
                    <span className="text-[9px] text-mute">+{dayVisits.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 px-1">
        {Object.entries(STATUS_DOT).map(([key, cls]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${cls}`} />
            <span className="text-[11px] text-mute">{STATUS_LABEL[key as keyof typeof STATUS_LABEL].text}</span>
          </div>
        ))}
      </div>

      {/* Selected day detail */}
      {selected && selectedVisits.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-[11px] tracking-[0.15em] uppercase text-mute">
            {selected.replace(/-/g, '. ')} 방문 내역
          </p>
          {selectedVisits.map(v => {
            const mood = MOOD_LABEL[v.mood];
            const st = STATUS_LABEL[v.status];
            return (
              <div key={v.id} className="bg-paper p-4" style={border}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`${mood.bg} ${mood.color} text-[11px] px-2 py-0.5`}>{mood.text}</span>
                  <span className={`text-[11px] ${st.color}`}>{st.text}</span>
                  {showManagerName && v.manager_name && (
                    <span className="text-[12px] text-mute">{v.manager_name} 매니저</span>
                  )}
                  {showBeneficiaryName && v.beneficiary_name && (
                    <span className="text-[12px] text-mute">{v.beneficiary_name}</span>
                  )}
                </div>
                <p className="text-[13px] text-ink line-clamp-2 leading-[1.7]">{v.summary}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
