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
    <div className="min-h-screen py-12 bg-obsidian-deepest relative">
      {/* Ambient Halo Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300 text-xs font-mono mb-4">
            🏅 BATTLE BADGES & FEATS
          </div>
          <h1 className="text-section text-white mb-2">
            ARENA <span className="gradient-gold">ACHIEVEMENTS</span>
          </h1>
          {account ? (
            <p className="text-gold-400 font-mono text-sm font-bold">{unlockedCount}/{achievements.length} UNLOCKED</p>
          ) : (
            <p className="text-gray-400 text-sm">Link your gladiator to track and unlock combat achievements.</p>
          )}
        </motion.div>

        {/* Filter buttons */}
        <div className="flex gap-2 justify-center mb-10">
          {(['all', 'unlocked', 'locked'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl font-display text-xs tracking-wider transition-all border font-bold ${
                filter === f
                  ? 'bg-gold-500/20 border-gold-400 text-gold-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                  : 'border-gold-500/20 bg-obsidian-card text-gray-400 hover:border-gold-500/40 hover:text-white'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-3 border-gold-400 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((achievement, i) => {
              const rarityMeta = getRarityMeta(achievement.rarity);
              return (
                <motion.div
                  key={achievement.achievementId}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.05, 0.4) }}
                  className={`glass-card p-5 transition-all border-gold-500/20 ${achievement.unlocked ? 'glass-card-hover border-gold-500/40' : 'opacity-40'}`}
                  style={achievement.unlocked ? { borderColor: rarityMeta.color + '50' } : {}}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0"
                      style={achievement.unlocked ? { background: rarityMeta.color + '20', border: `1px solid ${rarityMeta.color}40` } : { background: 'rgba(255,255,255,0.03)' }}
                    >
                      {achievement.unlocked ? achievement.icon : '🔒'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className={`font-display text-sm font-bold ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                          {achievement.name}
                        </h3>
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold flex-shrink-0"
                          style={{ color: achievement.unlocked ? rarityMeta.color : '#6B7280', borderColor: (achievement.unlocked ? rarityMeta.color : '#6B7280') + '40' }}
                        >
                          {achievement.rarity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2 leading-relaxed">{achievement.description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-gold-500/10">
                        <span className="text-[11px] font-mono text-gray-500 truncate">{achievement.requirements.description}</span>
                        <span className="text-xs font-mono text-gold-400 font-bold ml-2">+{achievement.xpReward} XP</span>
                      </div>
                      {achievement.unlocked && achievement.unlockedAt && (
                        <p className="text-[10px] font-mono text-gray-500 mt-1">
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
