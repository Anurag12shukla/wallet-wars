import React from 'react';
import { motion } from 'framer-motion';
import type { Warrior } from '../../types';
import { getArchetypeMeta, getRarityMeta, getStatColor, shortenAddress } from '../../utils';
import StatBar from '../shared/StatBar';

interface WarriorCardProps {
  warrior: Warrior;
  onClick?: () => void;
  compact?: boolean;
  showStats?: boolean;
  glowing?: boolean;
}

export default function WarriorCard({ warrior, onClick, compact = false, showStats = true, glowing = false }: WarriorCardProps) {
  const meta = getArchetypeMeta(warrior.archetype);
  const rarityMeta = getRarityMeta(warrior.rarity);

  const stats = [
    { label: 'HP', value: warrior.hp, max: 200 },
    { label: 'ATK', value: warrior.attack, max: 150 },
    { label: 'DEF', value: warrior.defense, max: 150 },
    { label: 'SPD', value: warrior.speed, max: 150 },
    { label: 'LUCK', value: warrior.luck, max: 100 },
    { label: 'INT', value: warrior.intelligence, max: 150 },
  ];

  return (
    <motion.div
      onClick={onClick}
      whileHover={onClick ? { scale: 1.015, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.985 } : {}}
      className={`glass-card relative overflow-hidden transition-all duration-200 border-stone-200 bg-white shadow-soft-sm ${
        onClick ? 'cursor-pointer hover:border-stone-300 hover:shadow-soft-md' : ''
      } ${compact ? 'p-4' : 'p-6'}`}
      style={{
        borderColor: glowing ? rarityMeta.color + '70' : undefined,
      }}
    >
      {/* Top subtle rarity accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: rarityMeta.color }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl leading-none">{meta.emoji}</span>
              <span
                className="text-[10px] font-display font-bold tracking-wider px-2.5 py-0.5 rounded-full border"
                style={{ color: rarityMeta.color, borderColor: rarityMeta.color + '40', background: rarityMeta.color + '12' }}
              >
                {warrior.rarity}
              </span>
            </div>
            <h3 className={`font-display ${compact ? 'text-base' : 'text-xl sm:text-2xl'} text-slate-900 font-extrabold leading-tight tracking-tight`}>
              {warrior.name}
            </h3>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              {shortenAddress(warrior.walletAddress)}
            </p>
          </div>

          {/* Level badge */}
          <div className="text-right">
            <div className="text-xs font-mono font-bold tracking-wide px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-stone-200">
              LVL {warrior.level}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-display font-semibold">{warrior.archetype.replace(/_/g, ' ')}</p>
          </div>
        </div>

        {/* W/L/Streak */}
        <div className="flex gap-2.5 mb-4">
          <div className="flex-1 text-center py-2.5 rounded-xl bg-pastel-sage-50 border border-pastel-sage-200">
            <p className="text-lg font-display text-pastel-sage-700 font-extrabold">{warrior.wins}</p>
            <p className="text-[10px] text-pastel-sage-600 font-mono font-semibold">WINS</p>
          </div>
          <div className="flex-1 text-center py-2.5 rounded-xl bg-pastel-pink-50 border border-pastel-pink-200">
            <p className="text-lg font-display text-pastel-pink-700 font-extrabold">{warrior.losses}</p>
            <p className="text-[10px] text-pastel-pink-600 font-mono font-semibold">LOSSES</p>
          </div>
          <div className="flex-1 text-center py-2.5 rounded-xl bg-pastel-cream-50 border border-pastel-cream-200">
            <p className="text-lg font-display text-amber-700 font-extrabold">{warrior.winStreak}</p>
            <p className="text-[10px] text-amber-600 font-mono font-semibold">STREAK</p>
          </div>
        </div>

        {/* Stats */}
        {showStats && !compact && (
          <div className="space-y-2 bg-slate-50/70 p-3.5 rounded-xl border border-stone-200/80">
            {stats.map(stat => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-500 w-10 flex-shrink-0 font-semibold">{stat.label}</span>
                <div className="flex-1">
                  <StatBar value={stat.value} max={stat.max} color={getStatColor(stat.value)} />
                </div>
                <span className="text-[11px] font-mono text-slate-800 w-8 text-right font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Ability */}
        {!compact && (
          <div className="mt-3.5 p-3 rounded-xl flex items-center justify-between bg-pastel-lavender-50 border border-pastel-lavender-200">
            <span className="text-[10px] font-mono text-pastel-lavender-700 font-semibold uppercase tracking-wider">SIGNATURE ABILITY</span>
            <p className="text-xs font-display tracking-wider font-bold text-pastel-lavender-700">
              {meta.ability}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
