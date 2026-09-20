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

  return (
    <div className="min-h-screen py-12 bg-[#F7F8F5] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-stone-200 bg-white text-slate-700 text-xs font-mono font-semibold mb-3 shadow-soft-xs">
            👑 HALL OF CHAMPIONS
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight mb-2">
            Global Leaderboard
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">The elite gladiators commanding the arena. Who rules the leaderboard?</p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl font-display text-xs tracking-wider transition-all border font-semibold ${
                  isActive
                    ? 'bg-slate-900 border-slate-900 text-white shadow-soft-xs'
                    : 'border-stone-200 bg-white text-slate-600 hover:border-stone-300 hover:text-slate-900 shadow-soft-xs'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="text-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="font-display text-slate-700 font-bold text-sm">LOADING ARENA RANKS...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-rose-600 font-mono text-sm">{error}</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 bg-white border border-stone-200 rounded-3xl p-10 shadow-soft-sm">
            <p className="text-4xl mb-3">🏟️</p>
            <p className="text-slate-900 font-display text-xl font-bold mb-2">ARENA IS EMPTY</p>
            <p className="text-slate-600 text-sm mb-6">Be the first gladiator to claim the throne.</p>
            <Link to="/arena" className="btn-primary">⚔️ ENTER ARENA</Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {entries.map((entry, i) => {
              const meta = getArchetypeMeta(entry.archetype);
              const isTop3 = entry.rank <= 3;

              return (
                <motion.div
                  key={entry.walletAddress}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  className={`p-4 sm:p-4.5 rounded-2xl border flex items-center gap-4 transition-all shadow-soft-xs ${
                    entry.rank === 1
                      ? 'bg-pastel-cream-50/70 border-pastel-cream-200'
                      : isTop3
                      ? 'bg-white border-stone-200 hover:border-stone-300'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {/* Rank */}
                  <div className="text-xl font-display w-8 text-center flex-shrink-0 font-bold text-slate-700">
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                  </div>

                  {/* Emoji */}
                  <span className="text-2xl flex-shrink-0">{meta.emoji}</span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/warrior/${entry.walletAddress}`}
                        className="font-display text-sm sm:text-base text-slate-900 hover:text-amber-600 font-bold transition-colors truncate"
                      >
                        {entry.name}
                      </Link>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      <span className="text-slate-700 font-semibold">{entry.archetype.replace(/_/g, ' ')}</span> · LVL {entry.level} · {shortenAddress(entry.walletAddress)}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6 text-right">
                    <div>
                      <p className="font-display text-emerald-700 font-bold text-sm">{entry.wins}</p>
                      <p className="text-[10px] text-slate-500 font-mono font-medium">WINS</p>
                    </div>
                    <div>
                      <p className="font-display text-rose-700 font-bold text-sm">{entry.losses}</p>
                      <p className="text-[10px] text-slate-500 font-mono font-medium">LOSSES</p>
                    </div>
                    <div>
                      <p className="font-display text-slate-900 font-bold text-sm">{entry.winRate}%</p>
                      <p className="text-[10px] text-slate-500 font-mono font-medium">WIN RATE</p>
                    </div>
                    <div>
                      <p className="font-display text-slate-700 font-bold text-sm">{entry.xp.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-500 font-mono font-medium">TOTAL XP</p>
                    </div>
                  </div>

                  {/* Mobile stats */}
                  <div className="md:hidden text-right">
                    <p className="font-display text-emerald-700 font-bold text-xs">{entry.wins}W</p>
                    <p className="text-[11px] text-slate-500 font-mono">{entry.winRate}% WR</p>
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
