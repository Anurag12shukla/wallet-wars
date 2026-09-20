import React from 'react';

interface StatBarProps {
  value: number;
  max?: number;
  color?: string;
  animated?: boolean;
  height?: number;
}

export default function StatBar({ value, max = 100, color = '#3B82F6', animated = true, height = 6 }: StatBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className="relative rounded-full overflow-hidden bg-slate-100"
      style={{ height: `${height}px` }}
    >
      <div
        className="h-full rounded-full relative"
        style={{
          width: `${pct}%`,
          backgroundColor: color,
          transition: animated ? 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)' : undefined,
        }}
      />
    </div>
  );
}
