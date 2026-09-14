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
      className={`glass-card relative overflow-hidden transition-all duration-300 ${
        onClick ? 'cursor-pointer glass-card-hover' : ''
      } ${compact ? 'p-4' : 'p-6'}`}
      style={{
        borderColor: glowing ? rarityMeta.color + '60' : undefined,
        boxShadow: glowing ? `0 0 30px ${rarityMeta.glow}` : undefined,
      }}
    >
      {/* Rarity glow top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${rarityMeta.color} 50%, transparent 100%)` }}
      />

      {/* Archetype background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{ background: `radial-gradient(ellipse at center, ${meta.color} 0%, transparent 70%)` }}
      />

      {/* Demo badge */}
      {warrior.isDemo && (
        <div className="absolute top-3 right-3">
          <span className="text-xs font-mono bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded">
            DEMO
          </span>
        </div>
      )}

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{meta.emoji}</span>
              <span
                className={`text-xs font-display tracking-widest px-2 py-0.5 rounded border`}
                style={{ color: rarityMeta.color, borderColor: rarityMeta.color + '40', background: rarityMeta.color + '10' }}
              >
                {warrior.rarity}
              </span>
            </div>
            <h3 className={`font-display ${compact ? 'text-lg' : 'text-2xl'} text-white leading-tight`}>
              {warrior.name}
            </h3>
            <p className="text-xs font-mono text-gray-500 mt-0.5">
              {shortenAddress(warrior.walletAddress)}
            </p>
          </div>

          {/* Level badge */}
          <div className="text-right">
            <div
              className="text-xs font-display tracking-wider px-3 py-1 rounded-full"
              style={{ background: meta.color + '20', color: meta.color, border: `1px solid ${meta.color}40` }}
            >
              LVL {warrior.level}
            </div>
            <p className="text-xs text-gray-500 mt-1 font-display">{warrior.archetype.replace('_', ' ')}</p>
          </div>
        </div>

        {/* W/L/Streak */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 text-center py-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-lg font-display text-green-400">{warrior.wins}</p>
            <p className="text-xs text-gray-500">WINS</p>
          </div>
          <div className="flex-1 text-center py-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-lg font-display text-red-400">{warrior.losses}</p>
            <p className="text-xs text-gray-500">LOSSES</p>
          </div>
          <div className="flex-1 text-center py-2 rounded-lg bg-brand-purple/10 border border-brand-purple/20">
            <p className="text-lg font-display text-brand-purple">{warrior.winStreak}</p>
            <p className="text-xs text-gray-500">STREAK</p>
          </div>
        </div>

        {/* Stats */}
        {showStats && !compact && (
          <div className="space-y-2">
            {stats.map(stat => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-500 w-10 flex-shrink-0">{stat.label}</span>
                <div className="flex-1">
                  <StatBar value={stat.value} max={stat.max} color={getStatColor(stat.value)} />
                </div>
                <span className="text-xs font-mono text-gray-300 w-8 text-right">{stat.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Ability */}
        {!compact && (
          <div className="mt-4 p-3 rounded-lg" style={{ background: meta.color + '10', border: `1px solid ${meta.color}20` }}>
            <p className="text-xs font-display tracking-wider" style={{ color: meta.color }}>
              ABILITY: {meta.ability}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
