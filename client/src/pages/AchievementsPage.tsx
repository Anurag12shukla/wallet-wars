import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { getAchievements } from '../services/api';
import type { Achievement } from '../types';
import { getRarityMeta } from '../utils';

export default function AchievementsPage() {
  const { publicKey } = useWallet();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    getAchievements(publicKey?.toString())
      .then(res => { if (res.success && res.data) setAchievements(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [publicKey]);

  const filtered = achievements.filter(a => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-section text-white mb-2">
            <span className="gradient-text">ACHIEVEMENTS</span>
          </h1>
          {publicKey && (
            <p className="text-gray-400">{unlockedCount}/{achievements.length} unlocked</p>
          )}
        </motion.div>

        {/* Filter */}
        <div className="flex gap-2 justify-center mb-8">
          {(['all', 'unlocked', 'locked'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-display text-xs tracking-wider transition-all border ${
                filter === f ? 'bg-brand-purple/20 border-brand-purple text-brand-purple' : 'border-brand-border text-gray-400'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-2 border-brand-purple border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((achievement, i) => {
              const rarityMeta = getRarityMeta(achievement.rarity);
              return (
                <motion.div
                  key={achievement.achievementId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.05, 0.5) }}
                  className={`glass-card p-5 transition-all ${achievement.unlocked ? 'glass-card-hover' : 'opacity-50'}`}
                  style={achievement.unlocked ? { borderColor: rarityMeta.color + '30' } : {}}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="text-3xl w-12 h-12 flex items-center justify-center rounded-lg flex-shrink-0"
                      style={achievement.unlocked ? { background: rarityMeta.color + '15', border: `1px solid ${rarityMeta.color}30` } : { background: 'rgba(255,255,255,0.03)' }}
                    >
                      {achievement.unlocked ? achievement.icon : '🔒'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className={`font-display text-sm ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                          {achievement.name}
                        </h3>
                        <span
                          className="text-xs font-mono flex-shrink-0"
                          style={{ color: achievement.unlocked ? rarityMeta.color : '#374151' }}
                        >
                          {achievement.rarity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{achievement.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-gray-600">{achievement.requirements.description}</span>
                        <span className="text-xs font-mono text-brand-cyan">+{achievement.xpReward} XP</span>
                      </div>
                      {achievement.unlocked && achievement.unlockedAt && (
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
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
