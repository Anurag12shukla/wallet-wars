import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEVMWallet } from '../context/EVMWalletContext';
import { useGame } from '../context/GameContext';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { getStats } from '../services/api';
import { getArchetypeMeta, formatNumber } from '../utils';
import type { AppStats } from '../types';

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
  const { } = useEVMWallet();
  const { generateForAccount, isGenerating } = useGame();
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

  const handleEnterArena = () => {
    navigate('/arena');
  };

  const showcase = ARCHETYPE_SHOWCASE[currentShowcase];
  const showcaseMeta = getArchetypeMeta(showcase.archetype);

  return (
    <div className="relative overflow-hidden bg-obsidian-deepest">
      {/* LIVE MARKET TICKER */}
      <div className="w-full bg-obsidian-darker/90 border-b border-gold-500/20 py-2.5 px-4 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-8 animate-none sm:animate-marquee">
          {TICKERS.map((t, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-gray-300 font-bold">{t.symbol}</span>
              <span className="text-gray-400">{t.price}</span>
              <span className={t.isUp ? 'text-gold-400 font-semibold' : 'text-crimson font-semibold'}>
                {t.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="min-h-[88vh] flex items-center relative overflow-hidden pt-8 pb-20">
        {/* Banner Artwork Backdrop */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <img src="/banner.png" alt="Arena Backdrop" className="w-full h-full object-cover object-center scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-deepest via-obsidian-deepest/80 to-transparent" />
        </div>

        {/* Ambient Gold Radial Halo */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gold-500/15 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left: Hero text */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-300 text-xs font-mono mb-6 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                  <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                  LIVE ON ROBINHOOD TESTNET • CHAIN ID 46630
                </div>

                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.03] mb-6">
                  <span className="block text-white">YOUR TRADING</span>
                  <span className="block gradient-gold">
                    PORTFOLIO
                  </span>
                  <span className="block text-white">HAS A FIGHTER.</span>
                </h1>

                <p className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed max-w-xl">
                  Transform your trading activity, stock holdings, crypto positions, and buying power into a living on-chain combat gladiator. Battle other traders for arena supremacy.
                </p>

                {/* Instant Profile Summoner */}
                <div className="bg-obsidian-card border border-gold-500/30 rounded-2xl p-4 sm:p-5 max-w-xl shadow-[0_0_35px_rgba(0,0,0,0.7)] mb-8 backdrop-blur-xl">
                  <form onSubmit={handleQuickSummon} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={quickInput}
                      onChange={(e) => setQuickInput(e.target.value)}
                      placeholder="Enter Robinhood handle or wallet (e.g. @wsb_god)"
                      className="flex-1 px-4 py-3.5 rounded-xl bg-black/70 border border-gold-500/30 focus:border-gold-400 focus:outline-none text-white text-sm font-mono placeholder-gray-500 shadow-inner"
                    />
                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="btn-primary py-3 px-6 whitespace-nowrap"
                    >
                      {isGenerating ? 'SUMMONING...' : '⚔️ SUMMON & BATTLE'}
                    </button>
                  </form>

                  <div className="flex flex-wrap items-center gap-2 mt-3.5 pt-3.5 border-t border-gold-500/20 text-xs">
                    <span className="text-gold-400/80 font-mono text-[11px]">DEMO GLADIATORS:</span>
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
                        className="px-3 py-1 rounded-lg bg-black/60 border border-gold-500/20 hover:border-gold-400 hover:bg-gold-500/10 text-gray-300 hover:text-gold-200 transition-all font-mono text-[11px]"
                      >
                        {demo.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platform Stats */}
                {stats && (
                  <div className="flex flex-wrap gap-8 pt-2">
                    <div>
                      <p className="text-3xl font-display font-bold gradient-gold">{formatNumber(stats.totalWarriors)}</p>
                      <p className="text-xs text-gray-400 font-mono tracking-wider">GLADIATORS</p>
                    </div>
                    <div>
                      <p className="text-3xl font-display font-bold text-white">{formatNumber(stats.totalBattles)}</p>
                      <p className="text-xs text-gray-400 font-mono tracking-wider">BATTLES FOUGHT</p>
                    </div>
                    {stats.topWarrior && (
                      <div>
                        <p className="text-3xl font-display font-bold text-gold-400 truncate max-w-[200px]">{stats.topWarrior.name}</p>
                        <p className="text-xs text-gray-400 font-mono tracking-wider">REIGNING CHAMPION</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right: Showcase card with glowing gold aura */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative">
                {/* Outer halo glow */}
                <motion.div
                  animate={{ scale: [1, 1.06, 1], opacity: [0.35, 0.65, 0.35] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-3xl blur-3xl bg-gold-500/20 pointer-events-none"
                />

                <motion.div
                  key={currentShowcase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="glass-card p-8 w-80 sm:w-88 relative border-gold-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
                >
                  <div className="text-center mb-6">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-8xl mb-4 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                    >
                      {showcaseMeta.emoji}
                    </motion.div>
                    <h3 className="font-display text-2xl text-white font-bold">{showcase.name}</h3>
                    <p className="font-display text-sm tracking-widest mt-1 uppercase" style={{ color: showcaseMeta.color }}>
                      {showcase.archetype.replace('_', ' ')}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-center mb-5">
                    {['HP', 'ATK', 'DEF', 'SPD', 'LUCK', 'INT'].map((stat) => (
                      <div key={stat} className="py-2 px-1 rounded-xl bg-black/50 border border-gold-500/10">
                        <p className="text-[10px] text-gray-400 font-mono">{stat}</p>
                        <p className="font-display font-bold text-white text-sm">85</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gold-500/20">
                    <div className="text-left">
                      <span className="text-[10px] text-gray-400 font-mono block">LEVEL</span>
                      <p className="font-display font-bold text-gold-400 text-lg leading-none">LVL {showcase.level}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 font-mono block">SIGNATURE ABILITY</span>
                      <p className="font-display text-xs font-bold" style={{ color: showcaseMeta.color }}>{showcaseMeta.ability}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 border-t border-gold-500/20 bg-obsidian-dark/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white mb-4">
              HOW IT <span className="gradient-gold">WORKS</span>
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base">
              The on-chain translation from financial market activity to RPG arena combat stats.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', icon: '🏹', title: 'LINK', desc: 'Enter your Robinhood username, Web3 EVM address (0x...), or select a preset gladiator.' },
              { step: '02', icon: '📊', title: 'ANALYZE', desc: 'Our engine evaluates buying power, stock & crypto diversity, and options leverage.' },
              { step: '03', icon: '⚔️', title: 'SYNTHESIZE', desc: 'Your gladiator is generated with combat stats, signature traits, and RPG abilities.' },
              { step: '04', icon: '🏆', title: 'CONQUER', desc: 'Clash in tactical turn-based arena battles to climb the global leaderboard.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center group border-gold-500/25 hover:border-gold-400"
              >
                <div className="text-4xl mb-4 group-hover:scale-115 transition-transform">{item.icon}</div>
                <div className="text-xs font-mono text-gold-400 font-bold mb-2">{item.step}</div>
                <h3 className="font-display text-xl text-white mb-2 font-bold">{item.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ARCHETYPES */}
      <section className="py-24 border-t border-gold-500/20 bg-obsidian-deepest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white mb-4">
              GLADIATOR <span className="gradient-gold">ARCHETYPES</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto text-sm sm:text-base">
              10 iconic trading combat classes. What is your gladiator destiny?
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
                  className="p-4 rounded-xl bg-obsidian-card border border-gold-500/20 hover:border-gold-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all text-center group cursor-pointer"
                  onClick={() => {
                    navigate('/arena');
                  }}
                >
                  <div className="text-3xl mb-2 group-hover:scale-120 transition-transform">{arch.emoji}</div>
                  <h4 className="font-display text-sm font-bold text-white">{arch.label}</h4>
                  <p className="text-[11px] font-mono mt-1 line-clamp-1 font-semibold" style={{ color: meta.color }}>
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
        <section className="py-24 border-t border-gold-500/20 bg-obsidian-dark/70">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-section text-white mb-4">ARENA <span className="gradient-gold">CHAMPIONS</span></h2>
            </motion.div>

            <div className="space-y-3">
              {leaderboard.slice(0, 5).map((entry, i) => {
                const meta = getArchetypeMeta(entry.archetype);
                const rankEmojis = ['🥇', '🥈', '🥉', '4', '5'];
                return (
                  <motion.div
                    key={entry.walletAddress}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-4 flex items-center gap-4 glass-card-hover border-gold-500/20"
                  >
                    <span className="text-2xl font-display w-8 text-center flex-shrink-0">
                      {rankEmojis[i]}
                    </span>
                    <span className="text-2xl">{meta.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-white font-bold truncate">{entry.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{entry.archetype.replace('_', ' ')} · LVL {entry.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-gold-400 font-bold">{entry.wins} WINS</p>
                      <p className="text-xs text-gray-400">{entry.winRate}% WR</p>
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
      <section className="py-32 border-t border-gold-500/20 relative overflow-hidden bg-obsidian-deepest">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, #F59E0B 0%, transparent 70%)' }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-2xl mx-auto mb-6 overflow-hidden border border-gold-500/40 shadow-[0_0_25px_rgba(245,158,11,0.4)]">
              <img src="/logo.jpg" alt="Wallet Wars" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-hero mb-6">
              <span className="block text-white">YOUR WALLET</span>
              <span className="block gradient-gold">IS A WEAPON.</span>
            </h2>
            <p className="text-gray-300 text-xl mb-10 font-medium">The arena is waiting. Claim your glory.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={handleEnterArena}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-xl px-12 py-5"
              >
                ⚔️ ENTER THE ARENA
              </motion.button>
              <Link
                to="/arena"
                onClick={(e) => { e.preventDefault(); navigate('/arena', { state: { demo: true } }); }}
                className="btn-secondary text-xl px-12 py-5 text-center"
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
