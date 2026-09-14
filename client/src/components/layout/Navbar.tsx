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
        className="sticky top-0 z-50 border-b border-robinhood-border bg-robinhood-darker/90 backdrop-blur-md"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-robinhood-green/30 bg-black flex items-center justify-center text-sm font-bold shadow-[0_0_12px_rgba(0,200,5,0.3)]">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-xl tracking-widest text-white group-hover:text-robinhood-green transition-colors">
                  WALLET<span className="text-robinhood-green font-bold">WARS</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-full bg-robinhood-green/10 text-robinhood-green border border-robinhood-green/30">
                  Robinhood Ed.
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`font-display text-sm tracking-wider transition-colors duration-200 hover:text-robinhood-green ${
                    location.pathname === link.href
                      ? 'text-robinhood-green font-semibold'
                      : 'text-gray-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {warrior && currentIdentifier && (
                <Link
                  to={`/warrior/${currentIdentifier}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-robinhood-green/40 bg-robinhood-card hover:border-robinhood-green hover:shadow-[0_0_15px_rgba(0,200,5,0.25)] transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-robinhood-green animate-pulse"></span>
                  <span className="text-xs text-gray-300 font-mono">{shortenAddress(currentIdentifier)}</span>
                  <span className="text-xs font-display font-semibold text-robinhood-green">{warrior.name}</span>
                  <span className="text-[10px] font-mono text-gray-400">Lv.{warrior.level}</span>
                </Link>
              )}

              <button
                onClick={() => setShowAccountModal(true)}
                className="px-3 py-1.5 rounded-lg border border-robinhood-border hover:border-robinhood-green/50 bg-robinhood-card text-xs font-display tracking-wider text-gray-200 hover:text-white transition-all flex items-center gap-1.5"
              >
                <span className="text-robinhood-green">⚡</span>
                {warrior ? 'SWITCH PROFILE' : 'LINK ROBINHOOD'}
              </button>

              <RobinhoodWalletButton />
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
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
              className="md:hidden border-t border-robinhood-border bg-robinhood-darker/95 backdrop-blur-md"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`font-display text-sm tracking-wider py-2 transition-colors ${
                      location.pathname === link.href ? 'text-robinhood-green font-bold' : 'text-gray-300'
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
                  className="w-full py-2 px-3 text-left rounded-lg bg-robinhood-card border border-robinhood-green/30 text-robinhood-green text-sm font-display tracking-wider"
                >
                  ⚡ {warrior ? 'Switch Robinhood Profile' : 'Link Robinhood Profile'}
                </button>
                <div className="pt-2">
                  <RobinhoodWalletButton />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Robinhood Link Modal */}
      <AnimatePresence>
        {showAccountModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-robinhood-card border border-robinhood-green/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,200,5,0.2)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-robinhood-green/20 text-robinhood-green flex items-center justify-center text-sm font-bold">
                    🏹
                  </div>
                  <h3 className="font-display text-lg font-bold text-white tracking-wide">
                    LINK ROBINHOOD PROFILE
                  </h3>
                </div>
                <button
                  onClick={() => setShowAccountModal(false)}
                  className="text-gray-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-gray-300 mb-4">
                Enter your Robinhood username, Web3 wallet address (<code className="text-robinhood-green">0x...</code>), or choose a demo profile to enter the arena.
              </p>

              <form onSubmit={handleLinkAccount} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">
                    Robinhood Username or Wallet Address
                  </label>
                  <input
                    type="text"
                    value={inputAccount}
                    onChange={(e) => setInputAccount(e.target.value)}
                    placeholder="e.g. @wsb_champion or 0x71C..."
                    className="w-full px-3 py-2.5 rounded-lg bg-black/60 border border-robinhood-border focus:border-robinhood-green focus:outline-none text-white text-sm font-mono placeholder-gray-500"
                    autoFocus
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isGenerating || !inputAccount.trim()}
                    className="flex-1 py-2.5 rounded-lg bg-robinhood-green text-black font-display font-bold text-sm tracking-wider hover:bg-robinhood-green-light transition-all disabled:opacity-50"
                  >
                    {isGenerating ? 'ANALYZING...' : 'INITIALIZE GLADIATOR'}
                  </button>
                </div>
              </form>

              <div className="mt-5 pt-4 border-t border-robinhood-border/60">
                <span className="text-[11px] uppercase tracking-wider font-mono text-gray-400 block mb-2">
                  Quick Select Demo Profiles
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
                      className="text-left text-xs p-2 rounded-lg bg-black/40 border border-robinhood-border hover:border-robinhood-green/40 hover:bg-robinhood-card-hover transition-all text-gray-300"
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
