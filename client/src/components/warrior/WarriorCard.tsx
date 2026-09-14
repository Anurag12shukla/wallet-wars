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
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      className={`glass-card relative overflow-hidden transition-all duration-300 border-gold-500/30 ${
        onClick ? 'cursor-pointer glass-card-hover' : ''
      } ${compact ? 'p-4' : 'p-6'}`}
      style={{
        borderColor: glowing ? rarityMeta.color + '80' : undefined,
        boxShadow: glowing ? `0 0 30px ${rarityMeta.glow}` : undefined,
      }}
    >
      {/* Rarity glow top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${rarityMeta.color} 50%, transparent 100%)` }}
      />

      {/* Archetype background glow */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${meta.color} 0%, transparent 70%)` }}
      />

      {/* Demo badge */}
      {warrior.isDemo && (
        <div className="absolute top-3 right-3 z-10">
          <span className="text-[10px] font-mono bg-gold-500/20 text-gold-300 border border-gold-500/40 px-2 py-0.5 rounded-full font-bold">
            DEMO
          </span>
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl">{meta.emoji}</span>
              <span
                className="text-[10px] font-display tracking-widest px-2.5 py-0.5 rounded-full border font-bold"
                style={{ color: rarityMeta.color, borderColor: rarityMeta.color + '50', background: rarityMeta.color + '15' }}
              >
                {warrior.rarity}
              </span>
            </div>
            <h3 className={`font-display ${compact ? 'text-lg' : 'text-2xl'} text-white font-bold leading-tight`}>
              {warrior.name}
            </h3>
            <p className="text-xs font-mono text-gray-400 mt-0.5">
              {shortenAddress(warrior.walletAddress)}
            </p>
          </div>

          {/* Level badge */}
          <div className="text-right">
            <div
              className="text-xs font-display tracking-wider px-3 py-1 rounded-full font-bold shadow-sm"
              style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FFD700', border: '1px solid rgba(245, 158, 11, 0.35)' }}
            >
              LVL {warrior.level}
            </div>
            <p className="text-[11px] text-gray-400 mt-1 font-display font-semibold">{warrior.archetype.replace('_', ' ')}</p>
          </div>
        </div>

        {/* W/L/Streak */}
        <div className="flex gap-2.5 mb-4">
          <div className="flex-1 text-center py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-lg font-display text-emerald-400 font-bold">{warrior.wins}</p>
            <p className="text-[10px] text-gray-400 font-mono">WINS</p>
          </div>
          <div className="flex-1 text-center py-2 rounded-xl bg-crimson/10 border border-crimson/20">
            <p className="text-lg font-display text-crimson font-bold">{warrior.losses}</p>
            <p className="text-[10px] text-gray-400 font-mono">LOSSES</p>
          </div>
          <div className="flex-1 text-center py-2 rounded-xl bg-gold-500/15 border border-gold-500/30">
            <p className="text-lg font-display text-gold-400 font-bold">{warrior.winStreak}</p>
            <p className="text-[10px] text-gold-400/80 font-mono font-semibold">STREAK</p>
          </div>
        </div>

        {/* Stats */}
        {showStats && !compact && (
          <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-gold-500/10">
            {stats.map(stat => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-gray-400 w-10 flex-shrink-0 font-semibold">{stat.label}</span>
                <div className="flex-1">
                  <StatBar value={stat.value} max={stat.max} color={getStatColor(stat.value)} />
                </div>
                <span className="text-[11px] font-mono text-gray-200 w-8 text-right font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Ability */}
        {!compact && (
          <div className="mt-3.5 p-2.5 rounded-xl flex items-center justify-between" style={{ background: meta.color + '12', border: `1px solid ${meta.color}25` }}>
            <span className="text-[11px] font-mono text-gray-400">SIGNATURE ABILITY</span>
            <p className="text-xs font-display tracking-wider font-bold" style={{ color: meta.color }}>
              {meta.ability}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
