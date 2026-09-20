import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEVMWallet } from '../context/EVMWalletContext';
import { getWarrior, getAchievements } from '../services/api';
import type { Warrior, Achievement } from '../types';
import { getArchetypeMeta, getRarityMeta, getStatColor, xpProgressPercent, shortenAddress } from '../utils';
import { getExplorerAddressUrl } from '../config/robinhood';
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
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8F5] p-4">
        <div className="text-center bg-white border border-stone-200 rounded-3xl p-8 shadow-soft-sm max-w-md">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="text-slate-900 font-display text-xl font-bold mb-2">GLADIATOR NOT FOUND</p>
          <p className="text-slate-600 text-sm mb-6">{error}</p>
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
    <div className="min-h-screen py-12 bg-[#F7F8F5] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 relative"
        >
          <div className="w-28 h-28 mx-auto mb-4 rounded-3xl bg-white border border-stone-200 flex items-center justify-center text-7xl shadow-soft-sm">
            {meta.emoji}
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span
              className="text-xs font-mono px-3 py-0.5 rounded-full border font-bold"
              style={{ color: rarityMeta.color, borderColor: rarityMeta.color + '40', background: rarityMeta.color + '10' }}
            >
              {warrior.rarity}
            </span>
            <span
              className="text-xs font-mono px-3 py-0.5 rounded-full border font-bold bg-pastel-sage-100 text-pastel-sage-700 border-pastel-sage-200"
            >
              {warrior.archetype.replace(/_/g, ' ')}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl text-slate-900 font-extrabold mb-1 tracking-tight">
            {warrior.name}
          </h1>

          {warrior.walletAddress.startsWith('0x') ? (
            <a
              href={getExplorerAddressUrl(warrior.walletAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 font-mono text-xs inline-flex items-center gap-1.5 transition-colors font-medium"
            >
              <span>{shortenAddress(warrior.walletAddress, 6)}</span>
              <span className="text-amber-600">↗ Robinhood Chain</span>
            </a>
          ) : (
            <p className="text-slate-500 font-mono text-xs">{shortenAddress(warrior.walletAddress, 6)}</p>
          )}

          {/* Level & XP */}
          <div className="mt-5 max-w-sm mx-auto">
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-amber-700 font-bold">LEVEL {warrior.level}</span>
              <span className="text-slate-500 font-medium">{warrior.xp} XP</span>
            </div>
            <div className="xp-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPct}%` }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="xp-bar-fill"
              />
            </div>
          </div>
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Combat record */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-stone-200 rounded-3xl p-6 shadow-soft-xs"
          >
            <h2 className="font-display text-xs text-slate-500 tracking-widest uppercase font-bold mb-4">COMBAT RECORD</h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center py-3 rounded-2xl bg-pastel-sage-50 border border-pastel-sage-200">
                <p className="text-3xl font-display font-extrabold text-pastel-sage-700">{warrior.wins}</p>
                <p className="text-[10px] text-pastel-sage-600 font-mono font-semibold">WINS</p>
              </div>
              <div className="text-center py-3 rounded-2xl bg-pastel-pink-50 border border-pastel-pink-200">
                <p className="text-3xl font-display font-extrabold text-pastel-pink-700">{warrior.losses}</p>
                <p className="text-[10px] text-pastel-pink-600 font-mono font-semibold">LOSSES</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center py-3 rounded-2xl bg-pastel-cream-50 border border-pastel-cream-200">
                <p className="text-2xl font-display font-extrabold text-amber-700">{winRate}%</p>
                <p className="text-[10px] text-amber-600 font-mono font-semibold">WIN RATE</p>
              </div>
              <div className="text-center py-3 rounded-2xl bg-slate-50 border border-stone-200">
                <p className="text-2xl font-display font-extrabold text-slate-900">{warrior.bestWinStreak}</p>
                <p className="text-[10px] text-slate-500 font-mono font-semibold">BEST STREAK</p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-stone-200 rounded-3xl p-6 lg:col-span-2 shadow-soft-xs"
          >
            <h2 className="font-display text-xs text-slate-500 tracking-widest uppercase font-bold mb-4">COMBAT STATS</h2>
            <div className="space-y-2.5">
              {stats.map(stat => (
                <div key={stat.label} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-500 w-28 flex-shrink-0 font-semibold">{stat.label}</span>
                  <div className="flex-1">
                    <StatBar value={stat.value} max={stat.max} color={getStatColor(stat.value)} />
                  </div>
                  <span className="text-xs font-mono text-slate-900 w-8 text-right font-bold">{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Personality */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white border border-stone-200 rounded-3xl p-6 mb-6 shadow-soft-xs"
        >
          <h2 className="font-display text-xs text-slate-500 tracking-widest uppercase font-bold mb-3">SIGNATURE TRAITS</h2>
          <div className="flex flex-wrap gap-2">
            {warrior.personality.map(trait => (
              <span
                key={trait}
                className="px-3 py-1.5 rounded-xl font-mono text-xs border font-semibold bg-pastel-lavender-50 border-pastel-lavender-200 text-pastel-lavender-700"
              >
                {trait}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Wallet Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-stone-200 rounded-3xl p-6 mb-6 shadow-soft-xs"
        >
          <h2 className="font-display text-xs text-slate-500 tracking-widest uppercase font-bold mb-4">ON-CHAIN TELEMETRY</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
              <div key={item.label} className="bg-slate-50 rounded-2xl p-3 border border-stone-200/80">
                <p className="text-[10px] text-slate-500 font-mono mb-1 font-semibold">{item.label}</p>
                <p className="font-display text-slate-900 font-bold text-base">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white border border-stone-200 rounded-3xl p-6 mb-8 shadow-soft-xs"
          >
            <h2 className="font-display text-xs text-slate-500 tracking-widest uppercase font-bold mb-4">
              GLADIATOR BADGES ({achievements.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {achievements.map(a => {
                const rMeta = getRarityMeta(a.rarity);
                return (
                  <div
                    key={a.achievementId}
                    className="p-3.5 rounded-2xl border border-stone-200 bg-slate-50 text-center"
                  >
                    <p className="text-2xl mb-1">{a.icon}</p>
                    <p className="font-display text-xs text-slate-900 font-bold truncate">{a.name}</p>
                    <p className="text-[10px] font-mono mt-0.5 font-semibold" style={{ color: rMeta.color }}>{a.rarity}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
          <Link to="/arena" className="btn-primary px-8 py-3.5 text-center text-sm shadow-soft-xs">
            ⚔️ CHALLENGE IN ARENA
          </Link>
          <button
            onClick={() => {
              const url = `${window.location.origin}/warrior/${wallet}`;
              navigator.share?.({ title: warrior.name, url }) || navigator.clipboard?.writeText(url);
            }}
            className="btn-secondary px-8 py-3.5 text-sm shadow-soft-xs"
          >
            🔗 SHARE GLADIATOR
          </button>
        </div>
      </div>
    </div>
  );
}
