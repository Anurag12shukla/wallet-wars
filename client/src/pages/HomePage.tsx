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

const TICKERS = [
  { symbol: '$BTC', price: '$68,420', change: '+4.2%', isUp: true },
  { symbol: '$NVDA', price: '$128.50', change: '+6.8%', isUp: true },
  { symbol: '$DOGE', price: '$0.165', change: '+14.2%', isUp: true },
  { symbol: '$SPY', price: '$560.10', change: '+0.8%', isUp: true },
  { symbol: '$ETH', price: '$2,640', change: '+3.5%', isUp: true },
  { symbol: '$TSLA', price: '$248.80', change: '+5.4%', isUp: true },
  { symbol: 'ROBINHOOD GOLD', price: '5.0% APY', change: 'MAX YIELD', isUp: true },
];

const ARCHETYPE_SHOWCASE = [
  { archetype: 'OPTIONS_DEGEN', name: '0DTE GAMMA TITAN', level: 14 },
  { archetype: 'ROBINHOOD_WHALE', name: 'THE ROBINHOOD LEVIATHAN', level: 20 },
  { archetype: 'DIAMOND_HANDS', name: 'DIAMOND WRAITH', level: 16 },
  { archetype: 'DOGE_KING', name: 'DOGE MOON LORD', level: 12 },
  { archetype: 'ROBINHOOD_GOLD', name: 'ROBINHOOD GOLD ARCHON', level: 18 },
  { archetype: 'MARGIN_SURVIVOR', name: 'THE MARGIN REAPER', level: 15 },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const { warrior, generateForAccount, isGenerating, activeAccount } = useGame();
  const { entries: leaderboard } = useLeaderboard('overall', 5);
  const [stats, setStats] = useState<AppStats | null>(null);
  const [currentShowcase, setCurrentShowcase] = useState(0);
  const [quickInput, setQuickInput] = useState('');

  useEffect(() => {
    getStats().then(res => res.success && res.data && setStats(res.data));
    const interval = setInterval(() => {
      setCurrentShowcase(prev => (prev + 1) % ARCHETYPE_SHOWCASE.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const handleQuickSummon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) {
      navigate('/arena');
      return;
    }
    await generateForAccount(quickInput.trim());
    navigate('/arena');
  };

  const showcase = ARCHETYPE_SHOWCASE[currentShowcase];
  const showcaseMeta = getArchetypeMeta(showcase.archetype);

  return (
    <div className="relative overflow-hidden bg-robinhood-darker">
      {/* ROBINHOOD LIVE MARKET TICKER */}
      <div className="w-full bg-black/70 border-b border-robinhood-border py-2 px-4 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-8 justify-between text-xs font-mono">
        <div className="flex items-center gap-8 animate-none sm:animate-marquee">
          {TICKERS.map((t, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-gray-300 font-bold">{t.symbol}</span>
              <span className="text-gray-400">{t.price}</span>
              <span className={t.isUp ? 'text-robinhood-green font-semibold' : 'text-robinhood-red font-semibold'}>
                {t.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="min-h-[85vh] flex items-center relative overflow-hidden pt-6 pb-16">
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-robinhood-green/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left: Hero text */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-robinhood-green/30 bg-robinhood-green/10 text-robinhood-green text-xs font-mono mb-6 shadow-[0_0_15px_rgba(0,200,5,0.2)]">
                  <span className="w-2 h-2 rounded-full bg-robinhood-green animate-pulse" />
                  ROBINHOOD PORTFOLIO ARENA
                </div>

                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
                  <span className="block text-white">YOUR ROBINHOOD</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-robinhood-green via-emerald-400 to-yellow-300">
                    PORTFOLIO
                  </span>
                  <span className="block text-white">HAS A FIGHTER.</span>
                </h1>

                <p className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed max-w-xl">
                  Transform your Robinhood trading activity, stock holdings, crypto positions, and buying power into a living on-chain combat gladiator. Battle other traders for arena supremacy.
                </p>

                {/* Instant Profile Summoner */}
                <div className="bg-robinhood-card border border-robinhood-border rounded-2xl p-4 sm:p-5 max-w-xl shadow-[0_0_25px_rgba(0,0,0,0.5)] mb-8">
                  <form onSubmit={handleQuickSummon} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={quickInput}
                      onChange={(e) => setQuickInput(e.target.value)}
                      placeholder="Enter Robinhood username or wallet (e.g. @wsb_god)"
                      className="flex-1 px-4 py-3 rounded-xl bg-black/60 border border-robinhood-border focus:border-robinhood-green focus:outline-none text-white text-sm font-mono placeholder-gray-500"
                    />
                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="px-6 py-3 rounded-xl bg-robinhood-green text-black font-display font-bold text-sm tracking-wider hover:bg-robinhood-green-light transition-all shadow-[0_0_15px_rgba(0,200,5,0.3)] disabled:opacity-50 whitespace-nowrap"
                    >
                      {isGenerating ? 'SUMMONING...' : '⚔️ SUMMON & BATTLE'}
                    </button>
                  </form>

                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-robinhood-border/40 text-xs">
                    <span className="text-gray-400 font-mono text-[11px]">DEMO TRADERS:</span>
                    {[
                      { name: '0DTE Degen', id: 'demo_options_001' },
                      { name: 'RH Whale', id: 'demo_whale_001' },
                      { name: 'Doge King', id: 'demo_doge_001' },
                      { name: 'Gold VIP', id: 'demo_gold_001' },
                    ].map(demo => (
                      <button
                        key={demo.id}
                        onClick={async () => {
                          await generateForAccount(demo.id);
                          navigate('/arena');
                        }}
                        className="px-2.5 py-1 rounded-md bg-black/50 border border-robinhood-border hover:border-robinhood-green/60 text-gray-300 hover:text-white transition-all font-mono text-[11px]"
                      >
                        {demo.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platform Stats */}
                {stats && (
                  <div className="flex flex-wrap gap-8">
                    <div>
                      <p className="text-2xl font-display font-bold text-robinhood-green">{formatNumber(stats.totalWarriors)}</p>
                      <p className="text-xs text-gray-400 font-mono">GLADIATORS</p>
                    </div>
                    <div>
                      <p className="text-2xl font-display font-bold text-emerald-400">{formatNumber(stats.totalBattles)}</p>
                      <p className="text-xs text-gray-400 font-mono">BATTLES FOUGHT</p>
                    </div>
                    {stats.topWarrior && (
                      <div>
                        <p className="text-2xl font-display font-bold text-yellow-400">{stats.topWarrior.name}</p>
                        <p className="text-xs text-gray-400 font-mono">REIGNING CHAMPION</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right: Showcase card */}
            <div className="lg:col-span-5 flex justify-center">
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
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 border-t border-robinhood-border bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white mb-4">
              HOW IT <span className="text-robinhood-green">WORKS</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
              The on-chain translation from financial market activity to RPG arena combat stats.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', icon: '🏹', title: 'LINK', desc: 'Enter your Robinhood username, Web3 address (0x...), or choose a trader profile.' },
              { step: '02', icon: '📊', title: 'ANALYZE', desc: 'Our engine evaluates buying power, stock & crypto diversity, and options leverage.' },
              { step: '03', icon: '⚔️', title: 'SYNTHESIZE', desc: 'Your gladiator is created with combat stats, signature traits, and personality.' },
              { step: '04', icon: '🏆', title: 'CONQUER', desc: 'Clash in tactical turn-based arena battles to climb the WallStreetBets leaderboard.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-robinhood-card border border-robinhood-border hover:border-robinhood-green/50 p-6 rounded-2xl text-center transition-all group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <div className="text-xs font-mono text-robinhood-green mb-2">{item.step}</div>
                <h3 className="font-display text-xl text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ARCHETYPES */}
      <section className="py-24 border-t border-robinhood-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white mb-4">
              TRADER <span className="text-robinhood-green">ARCHETYPES</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto text-sm sm:text-base">
              10 iconic Robinhood & WallStreetBets trading classes. What is your combat destiny?
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { archetype: 'OPTIONS_DEGEN', emoji: '📈', label: '0DTE Degen' },
              { archetype: 'ROBINHOOD_WHALE', emoji: '🐋', label: 'RH Whale' },
              { archetype: 'DIAMOND_HANDS', emoji: '💎', label: 'Diamond Hands' },
              { archetype: 'DOGE_KING', emoji: '🐕', label: 'Doge King' },
              { archetype: 'INDEX_MAXI', emoji: '📊', label: 'Index Maxi' },
              { archetype: 'MARGIN_SURVIVOR', emoji: '🩸', label: 'Margin Survivor' },
              { archetype: 'ROBINHOOD_GOLD', emoji: '👑', label: 'Gold VIP' },
              { archetype: 'DAY_TRADER', emoji: '⚡', label: 'Day Trader' },
              { archetype: 'PAPER_HANDS', emoji: '📄', label: 'Paper Hands' },
              { archetype: 'ALGO_QUANT', emoji: '🤖', label: 'Algo Quant' },
            ].map((arch) => {
              const meta = getArchetypeMeta(arch.archetype);
              return (
                <div
                  key={arch.archetype}
                  className="p-4 rounded-xl bg-robinhood-card border border-robinhood-border hover:border-robinhood-green/50 transition-all text-center group cursor-pointer"
                  onClick={() => {
                    navigate('/arena');
                  }}
                >
                  <div className="text-3xl mb-2 group-hover:scale-125 transition-transform">{arch.emoji}</div>
                  <h4 className="font-display text-sm font-bold text-white">{arch.label}</h4>
                  <p className="text-[11px] font-mono mt-1 line-clamp-1" style={{ color: meta.color }}>
                    {meta.ability}
                  </p>
                </div>
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
