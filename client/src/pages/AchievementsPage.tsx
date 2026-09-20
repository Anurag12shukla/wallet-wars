import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEVMWallet } from '../context/EVMWalletContext';
import { getAchievements } from '../services/api';
import type { Achievement } from '../types';
import { getRarityMeta } from '../utils';

export default function AchievementsPage() {
  const { account } = useEVMWallet();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    getAchievements(account || undefined)
      .then(res => { if (res.success && res.data) setAchievements(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [account]);

  const filtered = achievements.filter(a => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen py-12 bg-[#F7F8F5] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-stone-200 bg-white text-slate-700 text-xs font-mono font-semibold mb-3 shadow-soft-xs">
            🏅 BATTLE BADGES & FEATS
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight mb-2">
            Arena Achievements
          </h1>
          {account ? (
            <p className="text-amber-600 font-mono text-sm font-bold">{unlockedCount}/{achievements.length} UNLOCKED</p>
          ) : (
            <p className="text-slate-600 text-sm">Link your gladiator to track and unlock combat achievements.</p>
          )}
        </motion.div>

        {/* Filter buttons */}
        <div className="flex gap-2 justify-center mb-10">
          {(['all', 'unlocked', 'locked'] as const).map(f => {
            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl font-display text-xs tracking-wider transition-all border font-semibold ${
                  isActive
                    ? 'bg-slate-900 border-slate-900 text-white shadow-soft-xs'
                    : 'border-stone-200 bg-white text-slate-600 hover:border-stone-300 hover:text-slate-900 shadow-soft-xs'
                }`}
              >
                {f.toUpperCase()}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((achievement, i) => {
              const rarityMeta = getRarityMeta(achievement.rarity);
              return (
                <motion.div
                  key={achievement.achievementId}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  className={`p-5 rounded-2xl border transition-all shadow-soft-xs ${
                    achievement.unlocked
                      ? 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-soft-sm'
                      : 'bg-slate-50/60 border-stone-200/70 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`text-2xl w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0 border ${
                        achievement.unlocked
                          ? 'bg-pastel-cream-50 border-pastel-cream-200'
                          : 'bg-stone-100 border-stone-200'
                      }`}
                    >
                      {achievement.unlocked ? achievement.icon : '🔒'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className={`font-display text-sm font-bold truncate ${achievement.unlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                          {achievement.name}
                        </h3>
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold flex-shrink-0"
                          style={{
                            color: achievement.unlocked ? rarityMeta.color : '#94A3B8',
                            borderColor: (achievement.unlocked ? rarityMeta.color : '#CBD5E1') + '50',
                            backgroundColor: achievement.unlocked ? rarityMeta.color + '10' : '#F1F5F9',
                          }}
                        >
                          {achievement.rarity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2.5 leading-relaxed">{achievement.description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                        <span className="text-[11px] font-mono text-slate-500 truncate">{achievement.requirements.description}</span>
                        <span className="text-xs font-mono text-amber-600 font-bold ml-2">+{achievement.xpReward} XP</span>
                      </div>
                      {achievement.unlocked && achievement.unlockedAt && (
                        <p className="text-[10px] font-mono text-slate-400 mt-1">
                          Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
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
