import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEVMWallet } from '../context/EVMWalletContext';
import { useGame } from '../context/GameContext';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { getStats } from '../services/api';
import { getArchetypeMeta, formatNumber } from '../utils';
import type { AppStats } from '../types';


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
    <div className="relative overflow-hidden bg-[#F7F8F5]">
      {/* HERO SECTION */}
      <section className="min-h-[85vh] flex items-center relative overflow-hidden pt-10 pb-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left: Hero text */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Live Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-stone-200 bg-white text-slate-700 text-xs font-mono mb-6 shadow-soft-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold">LIVE ON ROBINHOOD CHAIN • CHAIN ID 4663</span>
                </div>

                <h1 className="text-hero text-slate-900 mb-6 font-extrabold tracking-tight">
                  Your trading portfolio <br className="hidden sm:inline" />
                  has a <span className="text-amber-500">fighter.</span>
                </h1>

                <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed max-w-xl font-normal">
                  Transform your trading activity, stock holdings, crypto positions, and buying power into a living on-chain combat gladiator. Battle other traders for arena supremacy.
                </p>

                {/* Instant Profile Summoner Card */}
                <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 max-w-xl shadow-soft-sm mb-8 relative">
                  {/* Handwritten annotation */}
                  <div className="font-handwriting text-slate-500 text-sm mb-2 flex items-center gap-1.5">
                    <span>✦ enter any Robinhood handle or 0x wallet address</span>
                  </div>

                  <form onSubmit={handleQuickSummon} className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      value={quickInput}
                      onChange={(e) => setQuickInput(e.target.value)}
                      placeholder="e.g. @wsb_champion or 0x71C..."
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-stone-200 focus:border-slate-400 focus:bg-white focus:outline-none text-slate-900 text-sm font-mono placeholder-slate-400 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="btn-primary py-3 px-6 whitespace-nowrap"
                    >
                      {isGenerating ? 'SUMMONING...' : '⚔️ SUMMON & BATTLE'}
                    </button>
                  </form>
                </div>

                {/* Platform Stats */}
                {stats && (
                  <div className="flex flex-wrap gap-8 pt-2">
                    <div>
                      <p className="text-3xl font-display font-extrabold text-slate-900">{formatNumber(stats.totalWarriors)}</p>
                      <p className="text-xs text-slate-500 font-mono tracking-wider font-semibold">GLADIATORS</p>
                    </div>
                    <div>
                      <p className="text-3xl font-display font-extrabold text-slate-900">{formatNumber(stats.totalBattles)}</p>
                      <p className="text-xs text-slate-500 font-mono tracking-wider font-semibold">BATTLES FOUGHT</p>
                    </div>
                    {stats.topWarrior && (
                      <div>
                        <p className="text-3xl font-display font-extrabold text-amber-600 truncate max-w-[200px]">{stats.topWarrior.name}</p>
                        <p className="text-xs text-slate-500 font-mono tracking-wider font-semibold">REIGNING CHAMPION</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right: Showcase card in product/UI style */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                {/* Handwritten sticky tag */}
                <div className="absolute -top-3.5 -right-2 font-handwriting text-amber-700 text-sm bg-pastel-cream-100 border border-pastel-cream-200 px-3 py-1 rounded-full rotate-2 shadow-soft-xs z-20 font-bold">
                  ★ on-chain combat avatar
                </div>

                <motion.div
                  key={currentShowcase}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white border border-stone-200 rounded-3xl p-7 shadow-soft-md relative"
                >
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-pastel-cream-50 border border-pastel-cream-200 flex items-center justify-center text-6xl shadow-soft-xs">
                      {showcaseMeta.emoji}
                    </div>
                    <h3 className="font-display text-xl text-slate-900 font-extrabold tracking-tight">{showcase.name}</h3>
                    <div className="inline-block mt-2">
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-pastel-sage-100 text-pastel-sage-700 border border-pastel-sage-200">
                        {showcase.archetype.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center mb-5">
                    {['HP', 'ATK', 'DEF', 'SPD', 'LUCK', 'INT'].map((stat) => (
                      <div key={stat} className="py-2 px-1 rounded-xl bg-slate-50 border border-stone-200/80">
                        <p className="text-[10px] text-slate-500 font-mono font-semibold">{stat}</p>
                        <p className="font-display font-bold text-slate-900 text-sm">85</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                    <div className="text-left">
                      <span className="text-[10px] text-slate-500 font-mono block font-semibold">LEVEL</span>
                      <p className="font-display font-bold text-amber-600 text-base leading-none">LVL {showcase.level}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 font-mono block font-semibold">SIGNATURE ABILITY</span>
                      <p className="font-display text-xs font-bold text-slate-800">{showcaseMeta.ability}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 border-t border-stone-200/80 bg-white relative">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-blue-50 border border-pastel-blue-200 text-pastel-blue-700 text-xs font-mono font-bold mb-3">
              SIMPLE PROTOCOL
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight mb-3">
              How it works
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto text-sm sm:text-base">
              The on-chain translation from financial market activity to RPG arena combat stats.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                step: '01',
                icon: '🏹',
                title: 'Link Wallet',
                desc: 'Enter your Robinhood username, Web3 EVM address, or select a preset gladiator.',
                cardClass: 'bg-pastel-sage-50/70 border-pastel-sage-200',
                badgeClass: 'text-pastel-sage-700',
              },
              {
                step: '02',
                icon: '📊',
                title: 'Analyze History',
                desc: 'Our engine evaluates buying power, stock & crypto diversity, and options leverage.',
                cardClass: 'bg-pastel-blue-50/70 border-pastel-blue-200',
                badgeClass: 'text-pastel-blue-700',
              },
              {
                step: '03',
                icon: '⚔️',
                title: 'Synthesize Fighter',
                desc: 'Your gladiator is generated with combat stats, signature traits, and RPG abilities.',
                cardClass: 'bg-pastel-lavender-50/70 border-pastel-lavender-200',
                badgeClass: 'text-pastel-lavender-700',
              },
              {
                step: '04',
                icon: '🏆',
                title: 'Enter Combat',
                desc: 'Clash in tactical turn-based arena battles to climb the global leaderboard.',
                cardClass: 'bg-pastel-cream-50/70 border-pastel-cream-200',
                badgeClass: 'text-amber-700',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border text-center transition-all shadow-soft-xs hover:shadow-soft-sm ${item.cardClass}`}
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 mx-auto flex items-center justify-center text-2xl mb-4 shadow-soft-xs">
                  {item.icon}
                </div>
                <div className={`text-xs font-mono font-bold mb-1.5 ${item.badgeClass}`}>{item.step}</div>
                <h3 className="font-display text-lg text-slate-900 mb-2 font-bold">{item.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ARCHETYPES */}
      <section className="py-20 border-t border-stone-200/80 bg-[#F7F8F5]">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-lavender-50 border border-pastel-lavender-200 text-pastel-lavender-700 text-xs font-mono font-bold mb-3">
              COMBAT CLASSES
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight mb-3">
              Gladiator Archetypes
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto text-sm sm:text-base">
              10 iconic trading combat classes. What is your gladiator destiny?
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
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
                  className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 hover:shadow-soft-sm transition-all text-center group cursor-pointer"
                  onClick={() => {
                    navigate('/arena');
                  }}
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{arch.emoji}</div>
                  <h4 className="font-display text-xs font-bold text-slate-900">{arch.label}</h4>
                  <p className="text-[10px] font-mono mt-1 text-slate-500 line-clamp-1 font-semibold">
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
        <section className="py-20 border-t border-stone-200/80 bg-white">
          <div className="w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight mb-2">
                Arena Champions
              </h2>
              <p className="text-slate-600 text-sm">Top ranked gladiators dominating the arena.</p>
            </motion.div>

            <div className="space-y-2.5">
              {leaderboard.slice(0, 5).map((entry, i) => {
                const meta = getArchetypeMeta(entry.archetype);
                const rankEmojis = ['🥇', '🥈', '🥉', '4', '5'];
                return (
                  <motion.div
                    key={entry.walletAddress}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="p-4 rounded-xl bg-[#F7F8F5] border border-stone-200 flex items-center gap-4 hover:border-stone-300 transition-colors"
                  >
                    <span className="text-xl font-display w-7 text-center flex-shrink-0 font-bold">
                      {rankEmojis[i]}
                    </span>
                    <span className="text-2xl">{meta.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-slate-900 font-bold truncate text-sm">{entry.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{entry.archetype.replace('_', ' ')} · LVL {entry.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-slate-900 font-bold text-sm">{entry.wins} WINS</p>
                      <p className="text-xs text-slate-500 font-mono">{entry.winRate}% WR</p>
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
      <section className="py-24 border-t border-stone-200/80 bg-gradient-to-b from-[#F7F8F5] to-[#EFEFEA]">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 rounded-2xl mx-auto mb-6 overflow-hidden border border-stone-200 bg-white p-1 shadow-soft-xs">
              <img src="/logo.jpg" alt="Wallet Wars" className="w-full h-full object-cover rounded-[10px]" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight mb-4">
              Your wallet is a weapon.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mb-8 font-normal max-w-md mx-auto">
              The arena is open. Battle rival traders for on-chain dominance.
            </p>
            <div className="flex justify-center">
              <motion.button
                onClick={handleEnterArena}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary text-base px-10 py-3.5 shadow-soft-xs"
              >
                ⚔️ ENTER THE ARENA
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
