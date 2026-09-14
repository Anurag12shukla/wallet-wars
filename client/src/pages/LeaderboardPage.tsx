import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { getArchetypeMeta, shortenAddress } from '../utils';

const CATEGORIES = [
  { id: 'overall', label: '👑 OVERALL' },
  { id: 'wins', label: '⚔️ MOST WINS' },
  { id: 'xp', label: '⚡ TOP XP' },
  { id: 'level', label: '🏆 HIGHEST LEVEL' },
  { id: 'winStreak', label: '🔥 BEST STREAK' },
  { id: 'degens', label: '📈 DEGENS' },
  { id: 'rugSurvivors', label: '🩸 MARGIN SURVIVORS' },
];

export default function LeaderboardPage() {
  const [activeCategory, setActiveCategory] = useState('overall');
  const { entries, loading, error } = useLeaderboard(activeCategory, 50);

  const RANK_STYLES: Record<number, string> = {
    1: 'text-gold-400 text-glow-gold font-extrabold',
    2: 'text-chrome font-bold',
    3: 'text-amber-500 font-bold',
  };

  return (
    <div className="min-h-screen py-12 bg-obsidian-deepest relative">
      {/* Ambient Halo Glow */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300 text-xs font-mono mb-4">
            👑 HALL OF CHAMPIONS
          </div>
          <h1 className="text-section text-white mb-2">GLOBAL <span className="gradient-gold">LEADERBOARD</span></h1>
          <p className="text-gray-400 text-sm sm:text-base">The elite gladiators commanding the arena. Who rules the leaderboard?</p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl font-display text-xs tracking-wider transition-all border font-bold ${
                activeCategory === cat.id
                  ? 'bg-gold-500/20 border-gold-400 text-gold-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                  : 'border-gold-500/20 bg-obsidian-card text-gray-400 hover:border-gold-500/40 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-3 border-gold-400 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="font-display text-gold-400 animate-pulse font-bold">LOADING ARENA RANKS...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-crimson font-mono">{error}</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 glass-card p-12 border-gold-500/20">
            <p className="text-5xl mb-4">🏟️</p>
            <p className="text-white font-display text-2xl font-bold mb-2">ARENA IS EMPTY</p>
            <p className="text-gray-400 text-sm mb-6">Be the first gladiator to claim the throne.</p>
            <Link to="/arena" className="btn-primary">⚔️ ENTER ARENA</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, i) => {
              const meta = getArchetypeMeta(entry.archetype);
              const isTop3 = entry.rank <= 3;

              return (
                <motion.div
                  key={entry.walletAddress}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.4) }}
                  className={`glass-card p-4 sm:p-5 flex items-center gap-4 glass-card-hover border-gold-500/20 ${
                    isTop3 ? 'border-gold-500/40 bg-obsidian-card/95 shadow-[0_4px_20px_rgba(0,0,0,0.5)]' : ''
                  }`}
                  style={isTop3 ? { borderColor: ['#FFD700', '#E2E8F0', '#F59E0B'][entry.rank - 1] + '60' } : {}}
                >
                  {/* Rank */}
                  <div className={`text-2xl font-display w-10 text-center flex-shrink-0 ${RANK_STYLES[entry.rank] || 'text-gray-500'}`}>
                    {entry.rank === 1 ? '👑' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                  </div>

                  {/* Emoji */}
                  <span className="text-3xl flex-shrink-0 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]">{meta.emoji}</span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/warrior/${entry.walletAddress}`}
                        className="font-display text-base sm:text-lg text-white hover:text-gold-300 font-bold transition-colors truncate"
                      >
                        {entry.name}
                      </Link>
                      {entry.isDemo && (
                        <span className="text-[10px] font-mono text-gold-400 bg-gold-500/15 border border-gold-500/30 px-2 py-0.5 rounded-full font-bold flex-shrink-0">DEMO</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      <span className="text-gold-400/90">{entry.archetype.replace(/_/g, ' ')}</span> · LVL {entry.level} · {shortenAddress(entry.walletAddress)}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6 text-right">
                    <div>
                      <p className="font-display text-emerald-400 font-bold text-base">{entry.wins}</p>
                      <p className="text-[10px] text-gray-400 font-mono">WINS</p>
                    </div>
                    <div>
                      <p className="font-display text-crimson font-bold text-base">{entry.losses}</p>
                      <p className="text-[10px] text-gray-400 font-mono">LOSSES</p>
                    </div>
                    <div>
                      <p className="font-display text-gold-400 font-bold text-base">{entry.winRate}%</p>
                      <p className="text-[10px] text-gray-400 font-mono">WIN RATE</p>
                    </div>
                    <div>
                      <p className="font-display text-white font-bold text-base">{entry.xp.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 font-mono">TOTAL XP</p>
                    </div>
                  </div>

                  {/* Mobile stats */}
                  <div className="md:hidden text-right">
                    <p className="font-display text-emerald-400 font-bold">{entry.wins}W</p>
                    <p className="text-xs text-gray-400 font-mono">{entry.winRate}% WR</p>
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
