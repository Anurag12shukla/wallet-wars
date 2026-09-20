import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-stone-200/80 bg-[#EFEFEA]/50 py-12 mt-auto relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-stone-200 bg-white p-0.5 shadow-soft-xs flex items-center justify-center">
              <img src="/logo.jpg" alt="Wallet Wars" className="w-full h-full object-cover rounded-[8px]" />
            </div>
            <div className="flex items-center">
              <span className="font-display text-lg font-extrabold tracking-tight leading-none text-slate-900">
                WALLET<span className="text-amber-500 ml-1">WARS</span>
              </span>
            </div>
          </div>

          <p className="text-slate-600 text-xs text-center max-w-md leading-relaxed">
            Built on Robinhood Chain (Chain ID 4663). Transform your on-chain activity and trading buying power into a battle-ready gladiator.
          </p>

          <div className="flex items-center gap-6 text-xs font-display font-semibold tracking-wider">
            <Link to="/how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">
              HOW IT WORKS
            </Link>
            <Link to="/arena" className="text-slate-600 hover:text-slate-900 transition-colors">
              ARENA
            </Link>
            <Link to="/leaderboard" className="text-slate-600 hover:text-slate-900 transition-colors">
              LEADERBOARD
            </Link>
            <Link to="/achievements" className="text-slate-600 hover:text-slate-900 transition-colors">
              ACHIEVEMENTS
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center text-slate-500 text-[11px] font-mono">
          <p>© 2026 WALLET WARS • walletwars.online • All rights reserved</p>
          <p>Non-custodial & secure. Uses public blockchain ledger data only.</p>
        </div>
      </div>
    </footer>
  );
}
