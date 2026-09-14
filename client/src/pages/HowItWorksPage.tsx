import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const STEPS = [
  {
    n: '01',
    title: 'CONNECT YOUR WALLET',
    desc: 'Connect your Solana wallet using Phantom, Solflare, or Backpack. We never ask for your private key or seed phrase.',
    icon: '🔗',
    detail: 'Your wallet connection is handled entirely by the official Solana Wallet Adapter. We only read your public address.',
  },
  {
    n: '02',
    title: 'WALLET ANALYSIS',
    desc: 'We scan publicly available Solana blockchain data to understand your wallet\'s history and behavior.',
    icon: '🔍',
    detail: 'We analyze: wallet age, transaction count, frequency, token holdings, NFT activity, DeFi interactions, trading patterns, holding behavior, and risk profile.',
  },
  {
    n: '03',
    title: 'WARRIOR GENERATION',
    desc: 'Your unique warrior is deterministically generated from your wallet data. The same wallet always generates the same base warrior.',
    icon: '⚔️',
    detail: '12 archetypes available: DEGEN, WHALE, DIAMOND HANDS, PAPER HANDS, NFT HUNTER, DEFI MAGE, MEME LORD, RUG SURVIVOR, SOLANA SAMURAI, ON-CHAIN ORACLE, SHADOW TRADER, SPEED DEMON.',
  },
  {
    n: '04',
    title: 'BATTLE OTHER WALLETS',
    desc: 'Enter a wallet address to challenge any Solana user. The battle is calculated on the backend using deterministic algorithms.',
    icon: '⚡',
    detail: 'Battle results are fully deterministic - no randomness from the frontend. The backend runs the battle engine and returns the certified result.',
  },
  {
    n: '05',
    title: 'EARN XP & CLIMB',
    desc: 'Win battles to earn XP, level up your warrior, unlock achievements, and climb the global leaderboard.',
    icon: '🏆',
    detail: 'Win: +250 XP | Defeat: +50 XP | Daily Challenge: +500 XP | Achievement: variable XP',
  },
  {
    n: '06',
    title: 'SHARE & CHALLENGE',
    desc: 'Share your warrior profile and battle results. Challenge friends with a link. Grow the arena.',
    icon: '🌐',
    detail: 'Every battle has a unique shareable URL. Every warrior has a public profile page. Spread the fight.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-section text-white mb-4">HOW <span className="gradient-text">IT WORKS</span></h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Wallet Wars turns your on-chain history into a unique fighter.
            No random stats. No pay-to-win. Pure on-chain identity.
          </p>
        </motion.div>

        <div className="space-y-6 mb-16">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 glass-card-hover"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-2xl flex-shrink-0">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-brand-purple">{step.n}</span>
                    <h2 className="font-display text-xl text-white">{step.title}</h2>
                  </div>
                  <p className="text-gray-300 mb-2">{step.desc}</p>
                  <p className="text-gray-500 text-sm">{step.detail}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security notice */}
        <div className="glass-card p-6 mb-8 border-brand-cyan/20">
          <h2 className="font-display text-brand-cyan mb-4">🛡️ SECURITY & PRIVACY</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-400">
            <div>✅ We NEVER ask for your private key</div>
            <div>✅ We NEVER ask for your seed phrase</div>
            <div>✅ We NEVER automatically sign transactions</div>
            <div>✅ We ONLY read public blockchain data</div>
            <div>✅ Your wallet is connected via official Solana Wallet Adapter</div>
            <div>✅ Battle results are calculated on the backend, not frontend</div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/arena" className="btn-primary text-xl px-10 py-4">
            ⚔️ ENTER THE ARENA
          </Link>
        </div>
      </div>
    </div>
  );
}
