import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEVMWallet } from '../../context/EVMWalletContext';
import { useGame } from '../../context/GameContext';
import { shortenAddress } from '../../utils';
import RobinhoodWalletButton from './RobinhoodWalletButton';

const NAV_LINKS = [
  { href: '/arena', label: 'ARENA' },
  { href: '/leaderboard', label: 'LEADERBOARD' },
  { href: '/achievements', label: 'ACHIEVEMENTS' },
  { href: '/how-it-works', label: 'HOW IT WORKS' },
];

export default function Navbar() {
  const location = useLocation();
  const { account } = useEVMWallet();
  const { warrior, activeAccount, generateForAccount, isGenerating } = useGame();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [inputAccount, setInputAccount] = useState('');

  const currentIdentifier = warrior?.walletAddress || activeAccount || account;

  const handleLinkAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAccount.trim()) return;
    await generateForAccount(inputAccount.trim());
    setShowAccountModal(false);
    setInputAccount('');
  };

  return (
    <>
      <nav
        className="sticky top-0 z-50 border-b border-gold-500/20 bg-obsidian-darker/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo & Brand Identity */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-gold-500/40 bg-black flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover:border-gold-400 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all">
                <img src="/logo.jpg" alt="Wallet Wars Logo" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-2xl sm:text-3xl tracking-widest leading-none">
                    <span className="gradient-chrome font-extrabold">WALLET</span>
                    <span className="gradient-gold font-extrabold ml-1">WARS</span>
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full bg-gold-500/15 text-gold-300 border border-gold-500/30">
                    👑 Testnet
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-400 tracking-wider hidden sm:block">
                  wallets battle for glory
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`font-display text-sm tracking-wider transition-all duration-200 hover:text-gold-400 relative py-1 ${
                    location.pathname === link.href
                      ? 'text-gold-400 font-bold'
                      : 'text-gray-300'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.href && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                    />
                  )}
                </Link>
              ))}

              {warrior && currentIdentifier && (
                <Link
                  to={`/warrior/${currentIdentifier}`}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-gold-500/40 bg-obsidian-card hover:border-gold-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></span>
                  <span className="text-xs text-gray-300 font-mono">{shortenAddress(currentIdentifier)}</span>
                  <span className="text-xs font-display font-bold gradient-gold">{warrior.name}</span>
                  <span className="text-[10px] font-mono text-gold-300 bg-gold-500/10 px-1.5 py-0.5 rounded border border-gold-500/20">Lv.{warrior.level}</span>
                </Link>
              )}

              <button
                onClick={() => setShowAccountModal(true)}
                className="px-3.5 py-2 rounded-xl border border-gold-500/30 hover:border-gold-400 bg-obsidian-card text-xs font-display tracking-wider text-gray-200 hover:text-gold-300 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span className="text-gold-400">⚡</span>
                {warrior ? 'SWITCH PROFILE' : 'LINK HANDLE'}
              </button>

              <RobinhoodWalletButton />
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-gold-400 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gold-500/20 bg-obsidian-darker/98 backdrop-blur-md"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`font-display text-sm tracking-wider py-2 transition-colors ${
                      location.pathname === link.href ? 'text-gold-400 font-bold' : 'text-gray-300'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setShowAccountModal(true);
                  }}
                  className="w-full py-2.5 px-3 text-left rounded-xl bg-obsidian-card border border-gold-500/30 text-gold-400 text-sm font-display tracking-wider"
                >
                  ⚡ {warrior ? 'Switch Profile' : 'Link Profile / Handle'}
                </button>
                <div className="pt-2">
                  <RobinhoodWalletButton />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Robinhood / Wallet Link Modal */}
      <AnimatePresence>
        {showAccountModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-obsidian-card border border-gold-500/40 rounded-2xl p-6 shadow-[0_0_40px_rgba(245,158,11,0.25)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center text-sm font-bold">
                    ⚔️
                  </div>
                  <h3 className="font-display text-lg font-bold text-white tracking-wide">
                    LINK GLADIATOR PROFILE
                  </h3>
                </div>
                <button
                  onClick={() => setShowAccountModal(false)}
                  className="text-gray-400 hover:text-white text-lg font-bold w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                Enter your Robinhood username, Web3 EVM wallet address (<code className="text-gold-400">0x...</code>), or choose a demo gladiator to enter the arena.
              </p>

              <form onSubmit={handleLinkAccount} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5">
                    Trading Handle or Wallet Address
                  </label>
                  <input
                    type="text"
                    value={inputAccount}
                    onChange={(e) => setInputAccount(e.target.value)}
                    placeholder="e.g. @wsb_champion or 0x71C..."
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-gold-500/30 focus:border-gold-400 focus:outline-none text-white text-sm font-mono placeholder-gray-500 shadow-inner"
                    autoFocus
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isGenerating || !inputAccount.trim()}
                    className="btn-primary w-full py-3"
                  >
                    {isGenerating ? 'ANALYZING WALLET...' : '⚔️ INITIALIZE GLADIATOR'}
                  </button>
                </div>
              </form>

              <div className="mt-5 pt-4 border-t border-gold-500/20">
                <span className="text-[11px] uppercase tracking-wider font-mono text-gold-400/80 block mb-2">
                  Demo Gladiators
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '📈 0DTE Options Degen', id: 'demo_options_001' },
                    { label: '🐋 Robinhood Whale', id: 'demo_whale_001' },
                    { label: '🐕 Doge Moon King', id: 'demo_doge_001' },
                    { label: '👑 Robinhood Gold VIP', id: 'demo_gold_001' },
                  ].map(preset => (
                    <button
                      key={preset.id}
                      onClick={async () => {
                        await generateForAccount(preset.id);
                        setShowAccountModal(false);
                      }}
                      className="text-left text-xs p-2.5 rounded-xl bg-black/50 border border-gold-500/20 hover:border-gold-400 hover:bg-gold-500/10 transition-all text-gray-300 flex items-center gap-1.5"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
