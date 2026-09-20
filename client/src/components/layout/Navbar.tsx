import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEVMWallet } from '../../context/EVMWalletContext';
import { useGame } from '../../context/GameContext';
import { getArchetypeMeta } from '../../utils';
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
  const meta = warrior ? getArchetypeMeta(warrior.archetype) : null;

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
        className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#F7F8F5]/90 backdrop-blur-md shadow-soft-xs"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo & Brand Identity */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-stone-200/90 bg-white p-0.5 shadow-soft-xs group-hover:border-stone-300 transition-all flex items-center justify-center">
                <img src="/logo.jpg" alt="Wallet Wars Logo" className="w-full h-full object-cover rounded-[10px]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight leading-none text-slate-900">
                    WALLET<span className="text-amber-500 ml-1">WARS</span>
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 tracking-wider hidden sm:block">
                  wallets battle for glory
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-3 lg:gap-5 flex-shrink-0">
              {NAV_LINKS.map(link => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`font-display text-xs tracking-wider font-semibold transition-all duration-200 py-1.5 px-1 relative whitespace-nowrap ${
                      isActive ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full"
                      />
                    )}
                  </Link>
                );
              })}

              {warrior && currentIdentifier && (
                <Link
                  to={`/warrior/${currentIdentifier}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-pastel-lavender-200 bg-pastel-lavender-50/80 hover:bg-pastel-lavender-100 hover:border-pastel-lavender-300 transition-all whitespace-nowrap flex-shrink-0"
                  title={`${warrior.name} (Level ${warrior.level})`}
                >
                  <span className="text-base leading-none">{meta?.emoji || '⚔️'}</span>
                  <span className="text-xs font-display font-bold text-slate-900 whitespace-nowrap">{warrior.name}</span>
                  <span className="text-[10px] font-mono text-pastel-lavender-700 bg-white/80 px-2 py-0.5 rounded-full border border-pastel-lavender-200 whitespace-nowrap font-bold">
                    Lv.{warrior.level}
                  </span>
                </Link>
              )}

              <button
                onClick={() => setShowAccountModal(true)}
                className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 text-xs font-display font-semibold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-1.5 shadow-soft-xs whitespace-nowrap flex-shrink-0"
              >
                <span className="text-amber-500">⚡</span>
                {warrior ? 'SWITCH PROFILE' : 'LINK HANDLE'}
              </button>

              <RobinhoodWalletButton />
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-stone-200/50 transition-colors"
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
              className="md:hidden border-t border-stone-200 bg-[#F7F8F5]"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`font-display text-sm tracking-wider py-2 font-semibold transition-colors ${
                      location.pathname === link.href ? 'text-slate-900 font-bold' : 'text-slate-600'
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
                  className="w-full py-2.5 px-3 text-left rounded-xl bg-white border border-stone-200 text-slate-800 text-sm font-display font-semibold shadow-soft-xs"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 shadow-soft-lg relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-pastel-cream-100 text-amber-600 border border-pastel-cream-200 flex items-center justify-center text-sm font-bold">
                    ⚔️
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-900 tracking-tight">
                    LINK GLADIATOR PROFILE
                  </h3>
                </div>
                <button
                  onClick={() => setShowAccountModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Enter your Robinhood username or Web3 EVM wallet address (<code className="text-amber-600 font-mono">0x...</code>) to initialize your combat gladiator.
              </p>

              <form onSubmit={handleLinkAccount} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1.5 font-medium">
                    Trading Handle or Wallet Address
                  </label>
                  <input
                    type="text"
                    value={inputAccount}
                    onChange={(e) => setInputAccount(e.target.value)}
                    placeholder="e.g. @wsb_champion or 0x71C..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-stone-200 focus:border-slate-400 focus:bg-white focus:outline-none text-slate-900 text-sm font-mono placeholder-slate-400 transition-all"
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
