import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { getArchetypeMeta, getRarityMeta, shortenAddress } from '../utils';

const CATEGORIES = [
  { id: 'overall', label: 'OVERALL' },
  { id: 'wins', label: 'MOST WINS' },
  { id: 'xp', label: 'TOP XP' },
  { id: 'level', label: 'HIGHEST LEVEL' },
  { id: 'winStreak', label: 'BEST STREAK' },
  { id: 'degens', label: 'DEGENS' },
  { id: 'rugSurvivors', label: 'RUG SURVIVORS' },
];

export default function LeaderboardPage() {
  const [activeCategory, setActiveCategory] = useState('overall');
  const { entries, loading, error } = useLeaderboard(activeCategory, 50);

  const RANK_STYLES: Record<number, string> = {
    1: 'text-yellow-400 text-glow-gold',
    2: 'text-gray-300',
    3: 'text-amber-600',
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-section text-white mb-2">GLOBAL <span className="gradient-text">LEADERBOARD</span></h1>
          <p className="text-gray-400">Who rules the arena?</p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-display text-xs tracking-wider transition-all border ${
                activeCategory === cat.id
                  ? 'bg-brand-purple/20 border-brand-purple text-brand-purple'
                  : 'border-brand-border text-gray-400 hover:border-gray-500'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-2 border-brand-purple border-t-transparent rounded-full mx-auto mb-4" />
            <p className="font-display text-brand-purple animate-pulse">LOADING...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-gray-400">{error}</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 glass-card p-12">
            <p className="text-4xl mb-4">🏟️</p>
            <p className="text-white font-display text-xl mb-2">ARENA IS EMPTY</p>
            <p className="text-gray-400 text-sm mb-6">Be the first to climb the leaderboard.</p>
            <Link to="/arena" className="btn-primary">ENTER ARENA</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => {
              const meta = getArchetypeMeta(entry.archetype);
              const rarityMeta = getRarityMeta(entry.rarity);
              const isTop3 = entry.rank <= 3;

              return (
                <motion.div
                  key={entry.walletAddress}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.5) }}
                  className={`glass-card p-4 flex items-center gap-4 glass-card-hover ${isTop3 ? 'border-opacity-50' : ''}`}
                  style={isTop3 ? { borderColor: ['#FFD700', '#C0C0C0', '#CD7F32'][entry.rank - 1] + '40' } : {}}
                >
                  {/* Rank */}
                  <div className={`text-2xl font-display w-10 text-center flex-shrink-0 ${RANK_STYLES[entry.rank] || 'text-gray-500'}`}>
                    {entry.rank === 1 ? '👑' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                  </div>

                  {/* Emoji */}
                  <span className="text-2xl flex-shrink-0">{meta.emoji}</span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/warrior/${entry.walletAddress}`}
                        className="font-display text-white hover:text-brand-purple transition-colors truncate"
                      >
                        {entry.name}
                      </Link>
                      {entry.isDemo && (
                        <span className="text-xs font-mono text-yellow-400 bg-yellow-500/10 px-1.5 rounded flex-shrink-0">DEMO</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-mono">
                      {entry.archetype.replace(/_/g, ' ')} · LVL {entry.level} · {shortenAddress(entry.walletAddress)}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6 text-right">
                    <div>
                      <p className="font-display text-green-400">{entry.wins}</p>
                      <p className="text-xs text-gray-600">WINS</p>
                    </div>
                    <div>
                      <p className="font-display text-red-400">{entry.losses}</p>
                      <p className="text-xs text-gray-600">LOSSES</p>
                    </div>
                    <div>
                      <p className="font-display text-brand-purple">{entry.winRate}%</p>
                      <p className="text-xs text-gray-600">WIN RATE</p>
                    </div>
                    <div>
                      <p className="font-display text-brand-cyan">{entry.xp.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">XP</p>
                    </div>
                  </div>

                  {/* Mobile stats */}
                  <div className="md:hidden text-right">
                    <p className="font-display text-green-400">{entry.wins}W</p>
                    <p className="text-xs text-gray-500">{entry.winRate}% WR</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
