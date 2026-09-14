import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { getWarrior } from '../services/api';
import { getAchievements } from '../services/api';
import type { Warrior, Achievement } from '../types';
import { getArchetypeMeta, getRarityMeta, getStatColor, xpProgressPercent, shortenAddress } from '../utils';
import StatBar from '../components/shared/StatBar';
import LoadingScreen from '../components/shared/LoadingScreen';

export default function WarriorPage() {
  const { wallet } = useParams<{ wallet: string }>();
  const { publicKey } = useWallet();
  const [warrior, setWarrior] = useState<Warrior | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isMyWarrior = publicKey?.toString() === wallet;

  useEffect(() => {
    if (!wallet) return;
    setLoading(true);
    Promise.all([
      getWarrior(wallet),
      getAchievements(wallet),
    ]).then(([wRes, aRes]) => {
      if (wRes.success && wRes.data) setWarrior(wRes.data);
      else setError('Warrior not found.');
      if (aRes.success && aRes.data) setAchievements(aRes.data.filter(a => a.unlocked));
    }).catch(() => setError('Failed to load warrior.')).finally(() => setLoading(false));
  }, [wallet]);

  if (loading) return <LoadingScreen message="LOADING WARRIOR..." />;
  if (error || !warrior) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass-card p-8">
          <p className="text-4xl mb-4">⚠️</p>
          <p className="text-white font-display text-xl mb-2">WARRIOR NOT FOUND</p>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <Link to="/arena" className="btn-primary">GO TO ARENA</Link>
        </div>
      </div>
    );
  }

  const meta = getArchetypeMeta(warrior.archetype);
  const rarityMeta = getRarityMeta(warrior.rarity);
  const xpPct = xpProgressPercent(warrior.xp, warrior.level);
  const winRate = warrior.wins + warrior.losses > 0
    ? Math.round((warrior.wins / (warrior.wins + warrior.losses)) * 100)
    : 0;

  const stats = [
    { label: 'HP', value: warrior.hp, max: 200 },
    { label: 'ATTACK', value: warrior.attack, max: 150 },
    { label: 'DEFENSE', value: warrior.defense, max: 150 },
    { label: 'SPEED', value: warrior.speed, max: 150 },
    { label: 'LUCK', value: warrior.luck, max: 100 },
    { label: 'INTELLIGENCE', value: warrior.intelligence, max: 150 },
    { label: 'RISK', value: warrior.risk, max: 150 },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative"
        >
          {/* Rarity glow */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 blur-3xl"
            style={{ background: rarityMeta.color, opacity: 0.08 }}
          />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-8xl mb-4 relative"
            style={{ filter: `drop-shadow(0 0 20px ${meta.color})` }}
          >
            {meta.emoji}
          </motion.div>

          <div className="flex items-center justify-center gap-3 mb-2">
            <span
              className="text-xs font-mono px-3 py-1 rounded-full border"
              style={{ color: rarityMeta.color, borderColor: rarityMeta.color + '40', background: rarityMeta.color + '10' }}
            >
              {warrior.rarity}
            </span>
            <span
              className="text-xs font-mono px-3 py-1 rounded-full border"
              style={{ color: meta.color, borderColor: meta.color + '40', background: meta.color + '10' }}
            >
              {warrior.archetype.replace(/_/g, ' ')}
            </span>
            {warrior.isDemo && (
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400">DEMO</span>
            )}
          </div>

          <h1 className="font-display text-5xl md:text-7xl text-white mb-2" style={{ textShadow: `0 0 30px ${meta.color}40` }}>
            {warrior.name}
          </h1>
          <p className="text-gray-400 font-mono text-sm">{shortenAddress(warrior.walletAddress, 6)}</p>

          {/* Level & XP */}
          <div className="mt-6 max-w-sm mx-auto">
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-brand-purple">LEVEL {warrior.level}</span>
              <span className="text-gray-500">{warrior.xp} XP</span>
            </div>
            <div className="xp-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPct}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="xp-bar-fill"
              />
            </div>
          </div>
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Combat record */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h2 className="font-display text-sm text-gray-400 tracking-widest mb-4">COMBAT RECORD</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center py-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-3xl font-display text-green-400">{warrior.wins}</p>
                <p className="text-xs text-gray-500">WINS</p>
              </div>
              <div className="text-center py-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-3xl font-display text-red-400">{warrior.losses}</p>
                <p className="text-xs text-gray-500">LOSSES</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center py-3 rounded-lg bg-brand-purple/10 border border-brand-purple/20">
                <p className="text-2xl font-display text-brand-purple">{winRate}%</p>
                <p className="text-xs text-gray-500">WIN RATE</p>
              </div>
              <div className="text-center py-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-2xl font-display text-yellow-400">{warrior.bestWinStreak}</p>
                <p className="text-xs text-gray-500">BEST STREAK</p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <h2 className="font-display text-sm text-gray-400 tracking-widest mb-4">COMBAT STATS</h2>
            <div className="space-y-3">
              {stats.map(stat => (
                <div key={stat.label} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-500 w-24 flex-shrink-0">{stat.label}</span>
                  <div className="flex-1">
                    <StatBar value={stat.value} max={stat.max} color={getStatColor(stat.value)} />
                  </div>
                  <span className="text-sm font-mono w-8 text-right" style={{ color: getStatColor(stat.value) }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Personality */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 mb-6"
        >
          <h2 className="font-display text-sm text-gray-400 tracking-widest mb-4">PERSONALITY</h2>
          <div className="flex flex-wrap gap-2">
            {warrior.personality.map(trait => (
              <span
                key={trait}
                className="px-3 py-1.5 rounded-lg font-mono text-sm border"
                style={{ color: meta.color, borderColor: meta.color + '30', background: meta.color + '10' }}
              >
                {trait}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Wallet Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 mb-6"
        >
          <h2 className="font-display text-sm text-gray-400 tracking-widest mb-4">WALLET ANALYSIS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'WALLET AGE', value: `${warrior.walletAnalysis.walletAge}d` },
              { label: 'TRANSACTIONS', value: warrior.walletAnalysis.transactionCount },
              { label: 'TX/DAY', value: warrior.walletAnalysis.transactionFrequency.toFixed(1) },
              { label: 'TOKEN ACTIVITY', value: `${warrior.walletAnalysis.tokenActivity}%` },
              { label: 'NFT ACTIVITY', value: `${warrior.walletAnalysis.nftActivity}%` },
              { label: 'DEFI ACTIVITY', value: `${warrior.walletAnalysis.defiActivity}%` },
              { label: 'HOLDING SCORE', value: `${warrior.walletAnalysis.holdingScore}%` },
              { label: 'RISK SCORE', value: `${warrior.walletAnalysis.riskScore}%` },
            ].map(item => (
              <div key={item.label} className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-gray-500 font-mono mb-1">{item.label}</p>
                <p className="font-display text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6 mb-8"
          >
            <h2 className="font-display text-sm text-gray-400 tracking-widest mb-4">
              ACHIEVEMENTS ({achievements.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {achievements.map(a => {
                const rMeta = getRarityMeta(a.rarity);
                return (
                  <div
                    key={a.achievementId}
                    className="glass-card p-3 text-center"
                    style={{ borderColor: rMeta.color + '30' }}
                  >
                    <p className="text-2xl mb-1">{a.icon}</p>
                    <p className="font-display text-xs text-white">{a.name}</p>
                    <p className="text-xs font-mono mt-1" style={{ color: rMeta.color }}>{a.rarity}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/arena" className="btn-primary px-8 py-3 text-center">
            ⚔️ CHALLENGE IN ARENA
          </Link>
          <button
            onClick={() => {
              const url = `${window.location.origin}/warrior/${wallet}`;
              navigator.share?.({ title: warrior.name, url }) || navigator.clipboard?.writeText(url);
            }}
            className="btn-secondary px-8 py-3"
          >
            🔗 SHARE WARRIOR
          </button>
        </div>
      </div>
    </div>
  );
}
