import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { getArchetypeMeta, getRarityMeta, getStatColor } from '../../utils';

const SCAN_STEPS = [
  { text: 'SCANNING WALLET...', delay: 0 },
  { text: 'ANALYZING ACTIVITY...', delay: 1200 },
  { text: 'IDENTIFYING COMBAT STYLE...', delay: 2400 },
  { text: 'CALCULATING POWER...', delay: 3600 },
  { text: 'SUMMONING WARRIOR...', delay: 4800 },
];

interface WarriorRevealProps {
  onComplete: () => void;
}

export default function WarriorReveal({ onComplete }: WarriorRevealProps) {
  const { warrior, isGenerating, error, generateCurrentWarrior } = useGame();
  const [scanStep, setScanStep] = useState(0);
  const [showWarrior, setShowWarrior] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // Progress through scan steps
    SCAN_STEPS.forEach((step, i) => {
      setTimeout(() => setScanStep(i), step.delay);
    });

    // Show warrior if ready after scanning
    const showDelay = isGenerating ? 8000 : 6000;
    setTimeout(() => {
      if (warrior) {
        setShowWarrior(true);
        setTimeout(() => setShowStats(true), 800);
      }
    }, showDelay);
  }, [warrior, isGenerating]);

  // If warrior appears before timeout, adjust
  useEffect(() => {
    if (warrior && scanStep >= 4) {
      setTimeout(() => {
        setShowWarrior(true);
        setTimeout(() => setShowStats(true), 800);
      }, 500);
    }
  }, [warrior, scanStep]);

  const meta = warrior ? getArchetypeMeta(warrior.archetype) : null;
  const rarityMeta = warrior ? getRarityMeta(warrior.rarity) : null;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, #9945FF 0%, transparent 60%)' }}
        />
      </div>

      {/* Scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="scan-line" style={{ background: 'linear-gradient(90deg, transparent 0%, #14F195 50%, transparent 100%)' }} />
      </div>

      <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
        <AnimatePresence mode="wait">
          {!showWarrior ? (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hex scan effect */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="w-32 h-32 mx-auto mb-8 relative"
              >
                <div className="absolute inset-0 border-2 border-brand-purple/40 rounded-full" />
                <div className="absolute inset-2 border-2 border-brand-cyan/30 rounded-full" />
                <div className="absolute inset-4 border border-brand-purple/20 rounded-full" />
                <motion.div
                  animate={{ rotate: -720 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-6 border border-brand-cyan/40 rounded-full border-t-brand-cyan"
                />
                <div className="absolute inset-0 flex items-center justify-center text-4xl">⚡</div>
              </motion.div>

              {/* Steps */}
              <div className="space-y-3 mb-8">
                {SCAN_STEPS.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: i <= scanStep ? 1 : 0.2,
                      x: 0,
                    }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center justify-center gap-3"
                  >
                    <motion.div
                      animate={i < scanStep ? {} : i === scanStep ? { opacity: [0, 1, 0] } : {}}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className={`w-2 h-2 rounded-full ${
                        i < scanStep ? 'bg-brand-cyan' : i === scanStep ? 'bg-brand-purple' : 'bg-gray-700'
                      }`}
                    />
                    <span
                      className={`font-mono text-sm tracking-widest ${
                        i < scanStep ? 'text-brand-cyan' : i === scanStep ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {step.text}
                    </span>
                    {i < scanStep && <span className="text-brand-cyan text-xs">✓</span>}
                  </motion.div>
                ))}
              </div>

              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-gray-500 text-xs font-mono"
              >
                {isGenerating ? 'Analyzing blockchain data...' : 'Reading on-chain history...'}
              </motion.p>

              {error && !isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 border border-red-500/50 bg-red-500/10 rounded-lg max-w-sm mx-auto"
                >
                  <p className="text-red-400 font-mono text-sm mb-4">Error: {error}</p>
                  <button 
                    onClick={generateCurrentWarrior}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 font-mono text-xs rounded transition-colors"
                  >
                    RETRY SCAN
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : warrior ? (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Awakened text */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <p className="font-mono text-sm text-brand-cyan tracking-widest mb-2">
                  YOUR WARRIOR HAS AWAKENED.
                </p>
                <p className="text-gray-500 text-xs font-mono">{warrior.rarity} · {warrior.archetype.replace('_', ' ')}</p>
              </motion.div>

              {/* Warrior emoji - floating */}
              <motion.div
                initial={{ scale: 0.3, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="relative inline-block mb-6"
              >
                {/* Rarity glow */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 blur-3xl rounded-full"
                  style={{ background: rarityMeta?.color, opacity: 0.3 }}
                />
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-9xl relative z-10"
                  style={{ filter: `drop-shadow(0 0 20px ${meta?.color})` }}
                >
                  {meta?.emoji}
                </motion.div>
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="font-display text-4xl md:text-6xl text-white mb-2"
                style={{ textShadow: `0 0 30px ${meta?.color}80` }}
              >
                {warrior.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="font-display text-lg mb-1"
                style={{ color: meta?.color }}
              >
                {warrior.archetype.replace(/_/g, ' ')}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="font-mono text-xs mb-8"
                style={{ color: rarityMeta?.color }}
              >
                ✦ {warrior.rarity} WARRIOR ✦
              </motion.p>

              {/* Stats reveal */}
              {showStats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card p-6 mb-8 text-left max-w-md mx-auto"
                >
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {[
                      { label: 'HP', value: warrior.hp, max: 200 },
                      { label: 'ATTACK', value: warrior.attack, max: 150 },
                      { label: 'DEFENSE', value: warrior.defense, max: 150 },
                      { label: 'SPEED', value: warrior.speed, max: 150 },
                      { label: 'LUCK', value: warrior.luck, max: 100 },
                      { label: 'INTEL', value: warrior.intelligence, max: 150 },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                      >
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500 font-mono">{stat.label}</span>
                          <span className="font-mono" style={{ color: getStatColor(stat.value) }}>{stat.value}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                            transition={{ delay: 0.2 + 0.1 * i, duration: 0.8 }}
                            className="h-full rounded-full"
                            style={{ background: getStatColor(stat.value) }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Personality traits */}
                  <div className="flex flex-wrap gap-2">
                    {warrior.personality.map(trait => (
                      <span
                        key={trait}
                        className="text-xs font-mono px-2 py-1 rounded border"
                        style={{ color: meta?.color, borderColor: meta?.color + '30', background: meta?.color + '10' }}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showStats ? 1 : 0, y: showStats ? 0 : 20 }}
                transition={{ delay: 0.5 }}
                onClick={onComplete}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-xl px-10 py-4"
              >
                ⚔️ ENTER THE ARENA
              </motion.button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
