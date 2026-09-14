import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGame } from '../../context/GameContext';
import { shortenAddress } from '../../utils';

const NAV_LINKS = [
  { href: '/arena', label: 'ARENA' },
  { href: '/leaderboard', label: 'LEADERBOARD' },
  { href: '/achievements', label: 'ACHIEVEMENTS' },
  { href: '/how-it-works', label: 'HOW IT WORKS' },
];

export default function Navbar() {
  const location = useLocation();
  const { publicKey } = useWallet();
  const { warrior } = useGame();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b border-brand-border bg-brand-darker/90 backdrop-blur-md"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple to-purple-800 flex items-center justify-center text-sm font-bold">
              ⚔️
            </div>
            <span className="font-display text-xl tracking-widest text-white group-hover:text-brand-purple transition-colors">
              WALLET<span className="text-brand-purple">WARS</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-display text-sm tracking-wider transition-colors duration-200 hover:text-brand-purple ${
                  location.pathname === link.href
                    ? 'text-brand-purple'
                    : 'text-gray-400'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {publicKey && warrior && (
              <Link
                to={`/warrior/${publicKey.toString()}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-border bg-brand-card hover:border-brand-purple/40 transition-all"
              >
                <span className="text-xs text-gray-400 font-mono">{shortenAddress(publicKey.toString())}</span>
                <span className="text-xs font-display text-brand-purple">{warrior.name}</span>
              </Link>
            )}

            <WalletMultiButton />
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
            className="md:hidden border-t border-brand-border bg-brand-darker/95 backdrop-blur-md"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-display text-sm tracking-wider py-2 transition-colors ${
                    location.pathname === link.href ? 'text-brand-purple' : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                <WalletMultiButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
