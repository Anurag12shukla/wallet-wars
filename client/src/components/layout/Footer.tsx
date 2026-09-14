import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-gold-500/20 bg-obsidian-deepest/90 py-12 mt-auto relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-gold-500/40 bg-black flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.3)]">
              <img src="/logo.jpg" alt="Wallet Wars" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center">
              <span className="font-display text-xl tracking-widest leading-none">
                <span className="gradient-chrome font-extrabold">WALLET</span>
                <span className="gradient-gold font-extrabold ml-1">WARS</span>
              </span>
            </div>
          </div>

          <p className="text-gray-400 text-xs text-center max-w-md">
            Built on Robinhood Network (Chain ID 46630). Transform your on-chain activity and trading buying power into a battle-ready gladiator.
          </p>

          <div className="flex items-center gap-6 text-xs font-display tracking-wider">
            <Link to="/how-it-works" className="text-gray-400 hover:text-gold-300 transition-colors">
              HOW IT WORKS
            </Link>
            <Link to="/arena" className="text-gray-400 hover:text-gold-300 transition-colors">
              ARENA
            </Link>
            <Link to="/leaderboard" className="text-gray-400 hover:text-gold-300 transition-colors">
              LEADERBOARD
            </Link>
            <Link to="/achievements" className="text-gray-400 hover:text-gold-300 transition-colors">
              ACHIEVEMENTS
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gold-500/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center text-gray-500 text-[11px] font-mono">
          <p>© 2026 WALLET WARS • walletwars.online • All rights reserved</p>
          <p>Non-custodial & secure. Uses public blockchain ledger data only.</p>
        </div>
      </div>
    </footer>
  );
}
