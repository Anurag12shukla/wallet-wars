import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-darker/80 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚔️</span>
            <span className="font-display text-lg text-white tracking-widest">
              WALLET<span className="text-brand-purple">WARS</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm text-center">
            Built on Solana. Your wallet is your warrior.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/how-it-works" className="text-gray-400 hover:text-white text-sm transition-colors">
              How It Works
            </Link>
            <Link to="/arena" className="text-gray-400 hover:text-white text-sm transition-colors">
              Arena
            </Link>
            <Link to="/leaderboard" className="text-gray-400 hover:text-white text-sm transition-colors">
              Leaderboard
            </Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-brand-border/50 text-center text-gray-600 text-xs">
          <p>Wallet Wars uses only public blockchain data. No private keys. No seed phrases. No transactions signed without consent.</p>
        </div>
      </div>
    </footer>
  );
}
