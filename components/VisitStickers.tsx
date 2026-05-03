'use client';

export interface VisitStickerItem {
  id: string;
  visit_date: string;
  mood: 'good' | 'fair' | 'concern';
  status: 'pending' | 'approved' | 'rejected';
}

interface VisitStickersProps {
  visits: VisitStickerItem[];
  title?: string;
}

const STICKER = {
  good:    { bg: '#2C5F5D', ring: 'rgba(44,95,93,0.22)',  label: '좋음' },
  fair:    { bg: '#B58900', ring: 'rgba(181,137,0,0.22)',  label: '보통' },
  concern: { bg: '#C97B5D', ring: 'rgba(201,123,93,0.22)', label: '관심' },
} as const;

const border = { border: '0.5px solid rgba(42,40,35,0.18)' };

export function VisitStickers({ visits, title }: VisitStickersProps) {
  const approved = visits
    .filter(v => v.status === 'approved')
    .sort((a, b) => a.visit_date.localeCompare(b.visit_date));

  // Group by YYYY-MM
  const byMonth: Record<string, VisitStickerItem[]> = {};
  approved.forEach(v => {
    const key = v.visit_date.slice(0, 7);
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(v);
  });
  const months = Object.keys(byMonth).sort();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] tracking-[0.15em] uppercase text-mute">
          {title ?? '누적 방문'}
        </p>
        <div className="flex items-center gap-1">
          <span className="font-serif-ko text-[26px] font-black text-ink leading-none">
            {approved.length}
          </span>
          <span className="text-[11px] text-mute">회</span>
        </div>
      </div>

      {approved.length === 0 ? (
        <div className="bg-paper p-6 text-center" style={border}>
          <p className="text-[13px] text-mute">아직 승인된 방문이 없습니다</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {months.map(monthKey => {
            const [y, m] = monthKey.split('-');
            const items = byMonth[monthKey];
            return (
              <div key={monthKey}>
                <p className="text-[10px] tracking-[0.12em] text-mute mb-2.5">
                  {y}년 {parseInt(m)}월 &middot; {items.length}회
                </p>
                <div className="flex flex-wrap gap-2">
                  {items.map(v => {
                    const s = STICKER[v.mood];
                    const day = parseInt(v.visit_date.slice(8, 10));
                    return (
                      <div
                        key={v.id}
                        title={`${v.visit_date} · ${s.label}`}
                        style={{
                          background: s.bg,
                          boxShadow: `0 0 0 4px ${s.ring}`,
                          width: 36,
                          height: 36,
                        }}
                        className="rounded-full flex items-center justify-center text-white text-[12px] font-medium shrink-0 cursor-default select-none"
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
