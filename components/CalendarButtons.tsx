'use client';

interface CalendarButtonsProps {
  title: string;
  date: string; // YYYY-MM-DD
  address?: string | null;
  description?: string | null;
}

export function CalendarButtons({ title, date, address, description }: CalendarButtonsProps) {
  function addToGoogle() {
    const d = date.replace(/-/g, '');
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.set('action', 'TEMPLATE');
    url.searchParams.set('text', title);
    url.searchParams.set('dates', `${d}/${d}`);
    if (address) url.searchParams.set('location', address);
    if (description) url.searchParams.set('details', description);
    window.open(url.toString(), '_blank');
  }

  function downloadIcs() {
    const d = date.replace(/-/g, '');
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//GYEOTE//KR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${d}`,
      `DTEND;VALUE=DATE:${d}`,
      `SUMMARY:${title}`,
      address ? `LOCATION:${address.replace(/\n/g, ' ')}` : '',
      description ? `DESCRIPTION:${description.replace(/\n/g, '\\n')}` : '',
      `UID:gyeote-${Date.now()}@gyeote.com`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean).join('\r\n');

    const blob = new Blob([lines], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex gap-1.5 mt-2">
      <button
        onClick={downloadIcs}
        className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-mute hover:text-ink transition-colors"
        style={{ border: '0.5px solid rgba(42,40,35,0.18)' }}
        title="Apple 캘린더에 추가 (.ics)"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        Apple
      </button>
      <button
        onClick={addToGoogle}
        className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-mute hover:text-ink transition-colors"
        style={{ border: '0.5px solid rgba(42,40,35,0.18)' }}
        title="Google 캘린더에 추가"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.89 4 3 4.9 3 6v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z" fill="currentColor"/>
        </svg>
        Google
      </button>
    </div>
  );
}
