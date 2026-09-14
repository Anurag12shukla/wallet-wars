import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const STEPS = [
  {
    n: '01',
    title: 'CONNECT YOUR WALLET OR HANDLE',
    desc: 'Connect your EVM Web3 wallet (MetaMask, Robinhood Wallet, Rabby, Rainbow) or enter any Robinhood handle. We never ask for your private key.',
    icon: '👑',
    detail: 'Non-custodial connection via standard EIP-1193 EVM providers with instant network switching to Robinhood Testnet (Chain ID 46630).',
  },
  {
    n: '02',
    title: 'TELEMETRY & ON-CHAIN ANALYSIS',
    desc: 'Our engine scans public Robinhood Testnet ledger data, balances, and trading positions to evaluate your gladiator\'s combat style.',
    icon: '📊',
    detail: 'We evaluate: wallet age, transaction frequency, buying power, options leverage, stock/crypto diversity, and risk temperament.',
  },
  {
    n: '03',
    title: 'GLADIATOR SYNTHESIS',
    desc: 'Your fighter is deterministically generated from your telemetry. The same wallet always summons the exact same gladiator.',
    icon: '⚔️',
    detail: '10 combat archetypes: OPTIONS DEGEN, ROBINHOOD WHALE, DIAMOND HANDS, DOGE KING, INDEX MAXI, MARGIN SURVIVOR, ROBINHOOD GOLD, DAY TRADER, PAPER HANDS, ALGO QUANT.',
  },
  {
    n: '04',
    title: 'CLASH IN THE ARENA',
    desc: 'Challenge rival traders, whale wallets, or demo champions. The combat engine simulates tactical turn-based RPG mechanics.',
    icon: '⚡',
    detail: 'Critical hits, dodges, blocks, and signature abilities are computed transparently with deterministic seeds.',
  },
  {
    n: '05',
    title: 'EARN XP & CLAIM THE THRONE',
    desc: 'Win battles to earn XP, level up your gladiator, unlock trophies, and climb the global leaderboards.',
    icon: '🏆',
    detail: 'Victory: +250–450 XP | Defeat: +50 XP | Daily Challenges: +500 XP | Achievement Milestones: variable XP.',
  },
  {
    n: '06',
    title: 'SHARE & SPREAD THE GLORY',
    desc: 'Share your gladiator profile and battle battle logs with friends to challenge them in the coliseum.',
    icon: '🌐',
    detail: 'Every battle produces a certified shareable battle log URL and gladiator profile card.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen py-12 bg-obsidian-deepest relative">
      {/* Ambient Halo Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300 text-xs font-mono mb-4">
            📜 ARENA PROTOCOL HANDBOOK
          </div>
          <h1 className="text-section text-white mb-4">HOW <span className="gradient-gold">IT WORKS</span></h1>
          <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Wallet Wars transforms your public trading identity into an RPG combat gladiator.
            No pay-to-win. No RNG manipulation. Pure on-chain battle supremacy.
          </p>
        </motion.div>

        <div className="space-y-6 mb-16">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, x: i % 2 === 0 ? -25 : 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 sm:p-7 glass-card-hover border-gold-500/25"
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-3xl flex-shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono text-gold-400 font-bold">{step.n}</span>
                    <h2 className="font-display text-lg sm:text-xl text-white font-bold">{step.title}</h2>
                  </div>
                  <p className="text-gray-300 text-sm mb-2 leading-relaxed">{step.desc}</p>
                  <p className="text-gray-400 text-xs leading-relaxed font-mono bg-black/40 p-2.5 rounded-xl border border-gold-500/10">{step.detail}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security notice */}
        <div className="glass-card p-7 mb-12 border-gold-500/30 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🛡️</span>
            <h2 className="font-display text-xl text-white font-bold">SECURITY & PRIVACY GUARANTEE</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3.5 text-xs font-mono text-gray-300">
            <div className="p-2.5 rounded-xl bg-black/40 border border-gold-500/10">✅ We NEVER ask for your private keys</div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-gold-500/10">✅ We NEVER ask for your seed phrase</div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-gold-500/10">✅ We NEVER auto-sign blockchain transactions</div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-gold-500/10">✅ We ONLY read public ledger state</div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-gold-500/10">✅ Standard EIP-1193 EVM Web3 provider</div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-gold-500/10">✅ Live on Robinhood Testnet (Chain ID 46630)</div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/arena" className="btn-primary text-xl px-12 py-4">
            ⚔️ ENTER THE ARENA
          </Link>
        </div>
      </div>
    </div>
  );
}
