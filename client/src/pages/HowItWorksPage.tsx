import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const STEPS = [
  {
    n: '01',
    title: 'Connect Wallet or Enter Handle',
    desc: 'Connect your EVM Web3 wallet (MetaMask, Robinhood Wallet, Rabby, Rainbow) or enter any Robinhood handle. We never ask for your private key.',
    icon: '👑',
    detail: 'Non-custodial connection via standard EIP-1193 EVM providers with instant network switching to Robinhood Chain (Chain ID 4663).',
  },
  {
    n: '02',
    title: 'Telemetry & On-Chain Analysis',
    desc: 'Our engine scans public Robinhood Chain ledger data, balances, and trading positions to evaluate your gladiator\'s combat style.',
    icon: '📊',
    detail: 'We evaluate: wallet age, transaction frequency, buying power, options leverage, stock/crypto diversity, and risk temperament.',
  },
  {
    n: '03',
    title: 'Gladiator Synthesis',
    desc: 'Your fighter is deterministically generated from your telemetry. The same wallet always summons the exact same gladiator.',
    icon: '⚔️',
    detail: '10 combat archetypes: OPTIONS DEGEN, ROBINHOOD WHALE, DIAMOND HANDS, DOGE KING, INDEX MAXI, MARGIN SURVIVOR, ROBINHOOD GOLD, DAY TRADER, PAPER HANDS, ALGO QUANT.',
  },
  {
    n: '04',
    title: 'Clash in the Arena',
    desc: 'Challenge rival traders, whale wallets, or on-chain opponents. The combat engine simulates tactical turn-based RPG mechanics.',
    icon: '⚡',
    detail: 'Critical hits, dodges, blocks, and signature abilities are computed transparently with deterministic seeds.',
  },
  {
    n: '05',
    title: 'Earn XP & Level Up',
    desc: 'Win battles to earn XP, level up your gladiator, unlock trophies, and climb the global leaderboards.',
    icon: '🏆',
    detail: 'Victory: +250–450 XP | Defeat: +50 XP | Daily Challenges: +500 XP | Achievement Milestones: variable XP.',
  },
  {
    n: '06',
    title: 'Share Certified Battle Logs',
    desc: 'Share your gladiator profile and battle logs with friends to challenge them in the coliseum.',
    icon: '🌐',
    detail: 'Every battle produces a certified shareable battle log URL and gladiator profile card.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen py-12 bg-[#F7F8F5] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-stone-200 bg-white text-slate-700 text-xs font-mono font-semibold mb-3 shadow-soft-xs">
            📜 ARENA PROTOCOL HANDBOOK
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight mb-3">
            How It Works
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Wallet Wars transforms your public trading identity into an RPG combat gladiator.
            No pay-to-win. No RNG manipulation. Pure on-chain battle supremacy.
          </p>
        </motion.div>

        <div className="space-y-4 mb-16">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
              className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 shadow-soft-xs hover:border-stone-300 hover:shadow-soft-sm transition-all"
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="w-12 h-12 rounded-2xl bg-pastel-cream-50 border border-pastel-cream-200 flex items-center justify-center text-2xl flex-shrink-0 shadow-soft-xs">
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-amber-600 font-bold">{step.n}</span>
                    <h2 className="font-display text-base sm:text-lg text-slate-900 font-bold">{step.title}</h2>
                  </div>
                  <p className="text-slate-600 text-sm mb-2.5 leading-relaxed">{step.desc}</p>
                  <p className="text-slate-500 text-xs leading-relaxed font-mono bg-slate-50 p-2.5 rounded-xl border border-stone-200/80">{step.detail}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security notice */}
        <div className="bg-white border border-stone-200 rounded-3xl p-7 mb-12 shadow-soft-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-2xl">🛡️</span>
            <h2 className="font-display text-lg text-slate-900 font-bold">Security & Privacy Guarantee</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono text-slate-700">
            <div className="p-3 rounded-xl bg-slate-50 border border-stone-200/80">✅ We NEVER ask for your private keys</div>
            <div className="p-3 rounded-xl bg-slate-50 border border-stone-200/80">✅ We NEVER ask for your seed phrase</div>
            <div className="p-3 rounded-xl bg-slate-50 border border-stone-200/80">✅ We NEVER auto-sign blockchain transactions</div>
            <div className="p-3 rounded-xl bg-slate-50 border border-stone-200/80">✅ We ONLY read public ledger state</div>
            <div className="p-3 rounded-xl bg-slate-50 border border-stone-200/80">✅ Standard EIP-1193 EVM Web3 provider</div>
            <div className="p-3 rounded-xl bg-slate-50 border border-stone-200/80">✅ Live on Robinhood Chain Mainnet (Chain ID 4663)</div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/arena" className="btn-primary text-base px-10 py-3.5 shadow-soft-sm">
            ⚔️ ENTER THE ARENA
          </Link>
        </div>
      </div>
    </div>
  );
}
