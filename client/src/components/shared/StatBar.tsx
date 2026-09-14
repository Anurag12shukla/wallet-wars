import React from 'react';

interface StatBarProps {
  value: number;
  max?: number;
  color?: string;
  animated?: boolean;
  height?: number;
}

export default function StatBar({ value, max = 100, color = '#9945FF', animated = true, height = 6 }: StatBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className="relative rounded-full overflow-hidden"
      style={{ height: `${height}px`, background: 'rgba(255,255,255,0.06)' }}
    >
      <div
        className="h-full rounded-full relative overflow-hidden"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}aa, ${color})`,
          transition: animated ? 'width 1s ease' : undefined,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
            animation: 'shimmer-bar 2s linear infinite',
          }}
        />
      </div>
    </div>
  );
}
