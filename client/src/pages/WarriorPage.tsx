import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEVMWallet } from '../context/EVMWalletContext';
import { getWarrior, getAchievements } from '../services/api';
import type { Warrior, Achievement } from '../types';
import { getArchetypeMeta, getRarityMeta, getStatColor, xpProgressPercent, shortenAddress } from '../utils';
import StatBar from '../components/shared/StatBar';
import LoadingScreen from '../components/shared/LoadingScreen';

export default function WarriorPage() {
  const { wallet } = useParams<{ wallet: string }>();
  const { } = useEVMWallet();
  const [warrior, setWarrior] = useState<Warrior | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <LoadingScreen message="SUMMONING GLADIATOR PROFILE..." />;
  if (error || !warrior) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-deepest p-4">
        <div className="text-center glass-card p-8 border-gold-500/30 max-w-md">
          <p className="text-5xl mb-4">⚠️</p>
          <p className="text-white font-display text-2xl font-bold mb-2">GLADIATOR NOT FOUND</p>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <Link to="/arena" className="btn-primary">⚔️ GO TO ARENA</Link>
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
    <div className="min-h-screen py-12 bg-obsidian-deepest relative">
      {/* Ambient Halo Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gold-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-9xl mb-4 relative filter drop-shadow-[0_0_25px_rgba(245,158,11,0.4)]"
          >
            {meta.emoji}
          </motion.div>

          <div className="flex items-center justify-center gap-2.5 mb-3">
            <span
              className="text-xs font-mono px-3 py-1 rounded-full border font-bold"
              style={{ color: rarityMeta.color, borderColor: rarityMeta.color + '50', background: rarityMeta.color + '15' }}
            >
              {warrior.rarity}
            </span>
            <span
              className="text-xs font-mono px-3 py-1 rounded-full border font-bold"
              style={{ color: meta.color, borderColor: meta.color + '50', background: meta.color + '15' }}
            >
              {warrior.archetype.replace(/_/g, ' ')}
            </span>
            {warrior.isDemo && (
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 font-bold">DEMO</span>
            )}
          </div>

          <h1 className="font-display text-5xl md:text-7xl text-white font-extrabold mb-2">
            {warrior.name}
          </h1>
          {warrior.walletAddress.startsWith('0x') ? (
            <a
              href={`https://explorer.testnet.chain.robinhood.com/address/${warrior.walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gold-300 font-mono text-sm inline-flex items-center gap-1.5 transition-colors"
            >
              <span>{shortenAddress(warrior.walletAddress, 6)}</span>
              <span className="text-xs text-gold-400">↗ Robinhood Testnet</span>
            </a>
          ) : (
            <p className="text-gray-400 font-mono text-sm">{shortenAddress(warrior.walletAddress, 6)}</p>
          )}

          {/* Level & XP */}
          <div className="mt-6 max-w-sm mx-auto">
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-gold-400 font-bold">LEVEL {warrior.level}</span>
              <span className="text-gray-400">{warrior.xp} XP</span>
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
            className="glass-card p-6 border-gold-500/30"
          >
            <h2 className="font-display text-xs text-gold-400 tracking-widest uppercase font-bold mb-4">COMBAT RECORD</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-3xl font-display font-bold text-emerald-400">{warrior.wins}</p>
                <p className="text-[10px] text-gray-400 font-mono">WINS</p>
              </div>
              <div className="text-center py-3 rounded-xl bg-crimson/10 border border-crimson/20">
                <p className="text-3xl font-display font-bold text-crimson">{warrior.losses}</p>
                <p className="text-[10px] text-gray-400 font-mono">LOSSES</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center py-3 rounded-xl bg-gold-500/15 border border-gold-500/30">
                <p className="text-2xl font-display font-bold text-gold-400">{winRate}%</p>
                <p className="text-[10px] text-gray-400 font-mono">WIN RATE</p>
              </div>
              <div className="text-center py-3 rounded-xl bg-black/50 border border-gold-500/15">
                <p className="text-2xl font-display font-bold text-white">{warrior.bestWinStreak}</p>
                <p className="text-[10px] text-gray-400 font-mono">BEST STREAK</p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 lg:col-span-2 border-gold-500/30"
          >
            <h2 className="font-display text-xs text-gold-400 tracking-widest uppercase font-bold mb-4">COMBAT STATS</h2>
            <div className="space-y-3">
              {stats.map(stat => (
                <div key={stat.label} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-400 w-28 flex-shrink-0 font-semibold">{stat.label}</span>
                  <div className="flex-1">
                    <StatBar value={stat.value} max={stat.max} color={getStatColor(stat.value)} />
                  </div>
                  <span className="text-xs font-mono w-8 text-right font-bold" style={{ color: getStatColor(stat.value) }}>{stat.value}</span>
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
          className="glass-card p-6 mb-6 border-gold-500/25"
        >
          <h2 className="font-display text-xs text-gold-400 tracking-widest uppercase font-bold mb-4">SIGNATURE TRAITS</h2>
          <div className="flex flex-wrap gap-2">
            {warrior.personality.map(trait => (
              <span
                key={trait}
                className="px-3 py-1.5 rounded-xl font-mono text-xs border font-bold"
                style={{ color: meta.color, borderColor: meta.color + '40', background: meta.color + '15' }}
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
          className="glass-card p-6 mb-6 border-gold-500/25"
        >
          <h2 className="font-display text-xs text-gold-400 tracking-widest uppercase font-bold mb-4">ON-CHAIN TELEMETRY</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
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
              <div key={item.label} className="bg-black/50 rounded-xl p-3 border border-gold-500/10">
                <p className="text-[10px] text-gray-400 font-mono mb-1">{item.label}</p>
                <p className="font-display text-white font-bold text-base">{item.value}</p>
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
            className="glass-card p-6 mb-8 border-gold-500/25"
          >
            <h2 className="font-display text-xs text-gold-400 tracking-widest uppercase font-bold mb-4">
              GLADIATOR BADGES ({achievements.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {achievements.map(a => {
                const rMeta = getRarityMeta(a.rarity);
                return (
                  <div
                    key={a.achievementId}
                    className="glass-card p-3.5 text-center border-gold-500/20"
                    style={{ borderColor: rMeta.color + '40' }}
                  >
                    <p className="text-3xl mb-1.5">{a.icon}</p>
                    <p className="font-display text-xs text-white font-bold">{a.name}</p>
                    <p className="text-[10px] font-mono mt-1 font-semibold" style={{ color: rMeta.color }}>{a.rarity}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/arena" className="btn-primary px-10 py-3.5 text-center text-base">
            ⚔️ CHALLENGE IN ARENA
          </Link>
          <button
            onClick={() => {
              const url = `${window.location.origin}/warrior/${wallet}`;
              navigator.share?.({ title: warrior.name, url }) || navigator.clipboard?.writeText(url);
            }}
            className="btn-secondary px-10 py-3.5 text-base"
          >
            🔗 SHARE GLADIATOR
          </button>
        </div>
      </div>
    </div>
  );
}
