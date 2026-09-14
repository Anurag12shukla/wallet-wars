import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useGame } from '../context/GameContext';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { getStats } from '../services/api';
import { getArchetypeMeta, getRarityMeta, formatNumber, DEMO_WARRIORS } from '../utils';
import type { AppStats } from '../types';

const SCAN_STEPS = [
  'SCANNING WALLET...',
  'ANALYZING ACTIVITY...',
  'IDENTIFYING COMBAT STYLE...',
  'CALCULATING POWER...',
  'SUMMONING WARRIOR...',
];

const ARCHETYPE_SHOWCASE = [
  { archetype: 'WHALE', name: 'THE LEVIATHAN', level: 18 },
  { archetype: 'DEGEN', name: 'DEGEN PRIME', level: 12 },
  { archetype: 'SOLANA_SAMURAI', name: 'THE SOL SAMURAI', level: 21 },
  { archetype: 'DEFI_MAGE', name: 'YIELD ORACLE', level: 15 },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const { warrior } = useGame();
  const { entries: leaderboard } = useLeaderboard('overall', 5);
  const [stats, setStats] = useState<AppStats | null>(null);
  const [currentShowcase, setCurrentShowcase] = useState(0);

  useEffect(() => {
    getStats().then(res => res.success && res.data && setStats(res.data));
    const interval = setInterval(() => {
      setCurrentShowcase(prev => (prev + 1) % ARCHETYPE_SHOWCASE.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEnterArena = () => {
    if (publicKey) navigate('/arena');
    else navigate('/arena');
  };

  const showcase = ARCHETYPE_SHOWCASE[currentShowcase];
  const showcaseMeta = getArchetypeMeta(showcase.archetype);

  return (
    <div className="relative overflow-hidden">
      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center relative overflow-hidden pt-8">
        {/* Background particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="particle absolute w-1 h-1 rounded-full bg-brand-purple"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.3 + Math.random() * 0.4,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Hero text */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-purple/30 bg-brand-purple/10 text-brand-cyan text-xs font-mono mb-6">
                  <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                  LIVE ON SOLANA DEVNET
                </div>

                <h1 className="text-hero mb-6">
                  <span className="block text-white">YOUR</span>
                  <span className="block text-white">WALLET</span>
                  <span className="block gradient-text">HAS A</span>
                  <span className="block text-white">FIGHTER.</span>
                </h1>

                <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-md">
                  Turn your Solana wallet into an RPG warrior. Battle other wallets,
                  earn XP, unlock achievements, and climb the arena.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    onClick={handleEnterArena}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary text-lg px-8 py-4"
                    id="enter-arena-btn"
                  >
                    ⚔️ ENTER THE ARENA
                  </motion.button>

                  <Link
                    to="/arena"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/arena', { state: { demo: true } });
                    }}
                    className="btn-secondary text-lg px-8 py-4 text-center"
                    id="demo-battle-btn"
                  >
                    🎮 PLAY DEMO BATTLE
                  </Link>
                </div>

                {/* Stats */}
                {stats && (
                  <div className="flex gap-8 mt-10">
                    <div>
                      <p className="text-2xl font-display text-brand-purple">{formatNumber(stats.totalWarriors)}</p>
                      <p className="text-xs text-gray-500 font-mono">WARRIORS</p>
                    </div>
                    <div>
                      <p className="text-2xl font-display text-brand-cyan">{formatNumber(stats.totalBattles)}</p>
                      <p className="text-xs text-gray-500 font-mono">BATTLES</p>
                    </div>
                    {stats.topWarrior && (
                      <div>
                        <p className="text-2xl font-display text-yellow-400">{stats.topWarrior.name?.split(' ').slice(-1)[0]}</p>
                        <p className="text-xs text-gray-500 font-mono">TOP WARRIOR</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right: Showcase card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative">
                {/* Outer glow */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 rounded-2xl blur-3xl"
                  style={{ background: showcaseMeta.color, opacity: 0.15 }}
                />

                <motion.div
                  key={currentShowcase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="glass-card p-8 w-80 relative"
                  style={{ borderColor: showcaseMeta.color + '40' }}
                >
                  <div className="text-center mb-6">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-8xl mb-4"
                    >
                      {showcaseMeta.emoji}
                    </motion.div>
                    <h3 className="font-display text-2xl text-white">{showcase.name}</h3>
                    <p className="font-display text-sm tracking-wider mt-1" style={{ color: showcaseMeta.color }}>
                      {showcase.archetype.replace('_', ' ')}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center mb-4">
                    {['HP', 'ATK', 'DEF', 'SPD', 'LUCK', 'INT'].map((stat, i) => (
                      <div key={stat} className="py-2 rounded-lg bg-white/5">
                        <p className="text-xs text-gray-500">{stat}</p>
                        <p className="font-display text-white">{50 + Math.floor(Math.random() * 80)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <div className="text-center">
                      <span className="text-xs text-gray-500">LEVEL</span>
                      <p className="font-display text-brand-purple">{showcase.level}</p>
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-gray-500">ABILITY</span>
                      <p className="font-display text-xs" style={{ color: showcaseMeta.color }}>{showcaseMeta.ability}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-section text-center mb-16 text-white"
          >
            HOW <span className="gradient-text">IT WORKS</span>
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', icon: '🔗', title: 'CONNECT', desc: 'Connect your Solana wallet. Phantom, Solflare, or Backpack.' },
              { step: '02', icon: '🔍', title: 'SCAN', desc: 'We analyze your wallet\'s on-chain history and behavior.' },
              { step: '03', icon: '⚔️', title: 'AWAKEN', desc: 'Your warrior is generated from your actual wallet activity.' },
              { step: '04', icon: '🏆', title: 'BATTLE', desc: 'Fight other wallets, earn XP, unlock achievements.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center glass-card-hover"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-xs font-mono text-brand-purple mb-2">{item.step}</div>
                <h3 className="font-display text-xl text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ARCHETYPES */}
      <section className="py-24 border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-section text-white mb-4">WARRIOR <span className="gradient-text">ARCHETYPES</span></h2>
            <p className="text-gray-400">12 unique archetypes. Which one are you?</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { archetype: 'DEGEN', emoji: '🦍' },
              { archetype: 'WHALE', emoji: '🐋' },
              { archetype: 'DIAMOND_HANDS', emoji: '💎' },
              { archetype: 'NFT_HUNTER', emoji: '🎨' },
              { archetype: 'DEFI_MAGE', emoji: '🔮' },
              { archetype: 'RUG_SURVIVOR', emoji: '💀' },
              { archetype: 'MEME_LORD', emoji: '🚀' },
              { archetype: 'SOLANA_SAMURAI', emoji: '⚔️' },
              { archetype: 'ON_CHAIN_ORACLE', emoji: '🔭' },
              { archetype: 'SHADOW_TRADER', emoji: '👤' },
              { archetype: 'SPEED_DEMON', emoji: '⚡' },
              { archetype: 'PAPER_HANDS', emoji: '📄' },
            ].map((item, i) => {
              const meta = getArchetypeMeta(item.archetype);
              return (
                <motion.div
                  key={item.archetype}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="glass-card p-4 text-center glass-card-hover"
                  style={{ borderColor: meta.color + '20' }}
                >
                  <div className="text-3xl mb-2">{item.emoji}</div>
                  <p className="text-xs font-display tracking-wider" style={{ color: meta.color }}>
                    {item.archetype.replace('_', ' ')}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LEADERBOARD PREVIEW */}
      {leaderboard.length > 0 && (
        <section className="py-24 border-t border-brand-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-section text-white mb-4">GLOBAL <span className="gradient-text">LEADERBOARD</span></h2>
            </motion.div>

            <div className="space-y-3">
              {leaderboard.slice(0, 5).map((entry, i) => {
                const meta = getArchetypeMeta(entry.archetype);
                const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
                return (
                  <motion.div
                    key={entry.walletAddress}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-4 flex items-center gap-4 glass-card-hover"
                  >
                    <span
                      className="text-2xl font-display w-8 text-center flex-shrink-0"
                      style={{ color: rankColors[i] || '#ffffff80' }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-2xl">{meta.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-white truncate">{entry.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{entry.archetype.replace('_', ' ')} · LVL {entry.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-green-400">{entry.wins}W</p>
                      <p className="text-xs text-gray-500">{entry.winRate}% WR</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link to="/leaderboard" className="btn-secondary">
                VIEW FULL LEADERBOARD →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="py-32 border-t border-brand-border relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: 'radial-gradient(ellipse at center, #9945FF 0%, transparent 70%)' }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-hero mb-6">
              <span className="text-white">YOUR WALLET</span>
              <span className="block gradient-text">IS A WEAPON.</span>
            </h2>
            <p className="text-gray-300 text-xl mb-10">The arena is waiting.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={handleEnterArena}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-xl px-10 py-5"
              >
                ⚔️ ENTER THE ARENA
              </motion.button>
              <Link
                to="/arena"
                onClick={(e) => { e.preventDefault(); navigate('/arena', { state: { demo: true } }); }}
                className="btn-secondary text-xl px-10 py-5 text-center"
              >
                🎮 TRY DEMO
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
