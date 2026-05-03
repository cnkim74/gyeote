'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCcw, Check, PenLine } from 'lucide-react';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onClear: () => void;
  savedUrl?: string | null;
}

const CANVAS_W = 900;
const CANVAS_H = 260;

export function SignaturePad({ onSave, onClear, savedUrl }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const points = useRef<{ x: number; y: number }[]>([]);

  function getCtx() {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = '#2A2823';
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    return ctx;
  }

  function relPos(e: { clientX: number; clientY: number }): { x: number; y: number } {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (CANVAS_W / rect.width),
      y: (e.clientY - rect.top)  * (CANVAS_H / rect.height),
    };
  }

  function onStart(e: React.MouseEvent | React.TouchEvent) {
    if (confirmed) return;
    e.preventDefault();
    drawing.current = true;
    setIsEmpty(false);
    const pos = 'touches' in e ? relPos(e.touches[0]) : relPos(e.nativeEvent as MouseEvent);
    lastPos.current = pos;
    points.current = [pos];
  }

  function onMove(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing.current || confirmed) return;
    e.preventDefault();
    const pos = 'touches' in e ? relPos(e.touches[0]) : relPos(e.nativeEvent as MouseEvent);
    const ctx = getCtx();
    if (!ctx || !lastPos.current) return;

    points.current.push(pos);

    // Smooth curve with quadratic bezier
    if (points.current.length >= 3) {
      const prev  = points.current[points.current.length - 3];
      const mid1  = points.current[points.current.length - 2];
      const curr  = points.current[points.current.length - 1];
      const cpX = (prev.x + curr.x) / 2;
      const cpY = (prev.y + curr.y) / 2;
      ctx.beginPath();
      ctx.moveTo((prev.x + mid1.x) / 2, (prev.y + mid1.y) / 2);
      ctx.quadraticCurveTo(mid1.x, mid1.y, (mid1.x + curr.x) / 2, (mid1.y + curr.y) / 2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    lastPos.current = pos;
  }

  function onEnd() {
    drawing.current = false;
    lastPos.current = null;
    points.current = [];
  }

  function clear() {
    const ctx = getCtx();
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    setIsEmpty(true);
    setConfirmed(false);
    onClear();
  }

  function confirm() {
    if (isEmpty) return;
    const canvas = canvasRef.current!;
    const dataUrl = canvas.toDataURL('image/png');
    setConfirmed(true);
    onSave(dataUrl);
  }

  const border = { border: '0.5px solid rgba(42,40,35,0.28)' };

  return (
    <div>
      {/* Canvas area */}
      <div
        className="relative bg-white select-none"
        style={{
          ...border,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="w-full block"
          style={{
            height: 130,
            cursor: confirmed ? 'default' : 'crosshair',
            touchAction: 'none',
          }}
          onMouseDown={onStart}
          onMouseMove={onMove}
          onMouseUp={onEnd}
          onMouseLeave={onEnd}
          onTouchStart={onStart}
          onTouchMove={onMove}
          onTouchEnd={onEnd}
        />

        {/* Placeholder text */}
        {isEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2">
            <PenLine size={20} strokeWidth={1.2} className="text-mute" />
            <p className="text-[13px] text-mute">여기에 서명하세요</p>
            <p className="text-[11px] text-mute/60">태블릿·마우스·터치 모두 사용 가능</p>
          </div>
        )}

        {/* Confirmed overlay */}
        {confirmed && (
          <div
            className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1"
            style={{ background: 'rgba(44,95,93,0.1)', border: '0.5px solid rgba(44,95,93,0.3)' }}
          >
            <Check size={11} strokeWidth={2} className="text-primary" />
            <span className="text-[11px] text-primary">서명 완료</span>
          </div>
        )}

        {/* Bottom guide line */}
        <div
          className="absolute bottom-8 left-6 right-6"
          style={{ borderBottom: '1px dashed rgba(42,40,35,0.15)' }}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={clear}
          className="flex items-center gap-1.5 px-3.5 py-2 text-[12.5px] text-mute hover:text-ink transition-colors bg-paper"
          style={border}
        >
          <RotateCcw size={12} strokeWidth={1.5} />
          다시 쓰기
        </button>
        {!confirmed && (
          <button
            type="button"
            onClick={confirm}
            disabled={isEmpty}
            className="flex items-center gap-1.5 px-4 py-2 text-[12.5px] bg-primary text-surface hover:bg-primary-deep transition-colors disabled:opacity-40"
          >
            <Check size={12} strokeWidth={2} />
            서명 확인
          </button>
        )}
      </div>
    </div>
  );
}
