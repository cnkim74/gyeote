'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STATUS_OPTIONS = [
  { value: 'pending',   label: '접수 대기', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'confirmed', label: '확정',     color: 'bg-primary/10 text-primary border-primary/20' },
  { value: 'done',      label: '완료',     color: 'bg-ink/5 text-mute border-ink/15' },
  { value: 'cancelled', label: '취소',     color: 'bg-red-50 text-red-500 border-red-200' },
];

export function StatusBadge({ requestId, currentStatus }: { requestId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const current = STATUS_OPTIONS.find(s => s.value === status) ?? STATUS_OPTIONS[0];

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setSaving(true);
    await fetch('/api/special-request/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: requestId, status: next }),
    });
    setStatus(next);
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="relative shrink-0">
      <select
        value={status}
        onChange={handleChange}
        disabled={saving}
        className={`text-[11.5px] font-medium px-2.5 py-1 border appearance-none cursor-pointer pr-6 ${current.color} disabled:opacity-60`}
      >
        {STATUS_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px]">▾</span>
    </div>
  );
}
