import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const STEPS = [
  {
    n: '01',
    title: 'CONNECT YOUR WALLET',
    desc: 'Connect your EVM Web3 wallet (MetaMask, Robinhood Wallet, Rainbow, Rabby) to the Robinhood Testnet (Chain ID 46630). We never ask for your private key.',
    icon: '🔗',
    detail: 'Your wallet connection is handled directly via standard EIP-1193 EVM providers. One-click network switching to Robinhood Testnet is included.',
  },
  {
    n: '02',
    title: 'PORTFOLIO & ON-CHAIN ANALYSIS',
    desc: 'We scan public Robinhood Testnet blockchain data, balances, and trading history to understand your gladiator\'s combat style.',
    icon: '🔍',
    detail: 'We analyze: wallet age, transaction count, frequency, ETH balance, options and margin intensity, holding behavior, and risk appetite.',
  },
  {
    n: '03',
    title: 'WARRIOR GENERATION',
    desc: 'Your unique warrior is deterministically generated from your wallet telemetry. The same wallet always summons the same gladiator.',
    icon: '⚔️',
    detail: '12 combat archetypes: OPTIONS DEGEN, ROBINHOOD WHALE, DIAMOND HANDS, PAPER HANDS, NFT HUNTER, DEFI MAGE, MEME LORD, MARGIN SURVIVOR, ROBINHOOD GOLD, ON-CHAIN ORACLE, SHADOW TRADER, SPEED DEMON.',
  },
  {
    n: '04',
    title: 'BATTLE IN THE ARENA',
    desc: 'Enter any 0x wallet address or Robinhood username to challenge rival traders. The combat engine runs deterministically.',
    icon: '⚡',
    detail: 'Battle results are fully certified and can be recorded on-chain on Robinhood Testnet.',
  },
  {
    n: '05',
    title: 'EARN XP & CLIMB',
    desc: 'Win battles to earn XP, level up your warrior, unlock achievements, and climb the global Robinhood leaderboard.',
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
            <div>✅ Your wallet is connected via standard EVM Web3 provider</div>
            <div>✅ Native integration with Robinhood Network Testnet (Chain ID 46630)</div>
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
