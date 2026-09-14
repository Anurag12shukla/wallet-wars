import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { getArchetypeMeta, getRarityMeta, getStatColor } from '../../utils';

const SCAN_STEPS = [
  { text: 'SCANNING ON-CHAIN HISTORY...', delay: 0 },
  { text: 'EVALUATING BUYING POWER & LEVERAGE...', delay: 1200 },
  { text: 'DETERMINING COMBAT STYLE & ARCHETYPE...', delay: 2400 },
  { text: 'CALCULATING RPG COMBAT ATTRIBUTES...', delay: 3600 },
  { text: 'AWAKENING GLADIATOR...', delay: 4800 },
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
    SCAN_STEPS.forEach((step, i) => {
      setTimeout(() => setScanStep(i), step.delay);
    });

    const showDelay = isGenerating ? 7500 : 5500;
    setTimeout(() => {
      if (warrior) {
        setShowWarrior(true);
        setTimeout(() => setShowStats(true), 800);
      }
    }, showDelay);
  }, [warrior, isGenerating]);

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-obsidian-deepest">
      {/* Animated background halo */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.12, 0.25, 0.12] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, #F59E0B 0%, transparent 65%)' }}
        />
      </div>

      {/* Gold Scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="scan-line" style={{ background: 'linear-gradient(90deg, transparent 0%, #FFD700 50%, transparent 100%)' }} />
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
              {/* Rotating Gold scan rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                className="w-36 h-36 mx-auto mb-8 relative"
              >
                <div className="absolute inset-0 border-2 border-gold-500/40 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.3)]" />
                <div className="absolute inset-2 border-2 border-gold-300/30 rounded-full" />
                <div className="absolute inset-4 border border-gold-500/20 rounded-full" />
                <motion.div
                  animate={{ rotate: -720 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-6 border-2 border-gold-400/60 rounded-full border-t-gold-400"
                />
                <div className="absolute inset-0 flex items-center justify-center text-4xl">👑</div>
              </motion.div>

              {/* Steps */}
              <div className="space-y-3.5 mb-8">
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
                      className={`w-2.5 h-2.5 rounded-full ${
                        i < scanStep ? 'bg-gold-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : i === scanStep ? 'bg-gold-300' : 'bg-gray-800'
                      }`}
                    />
                    <span
                      className={`font-mono text-xs sm:text-sm tracking-widest font-bold ${
                        i < scanStep ? 'text-gold-300' : i === scanStep ? 'text-white' : 'text-gray-600'
                      }`}
                    >
                      {step.text}
                    </span>
                    {i < scanStep && <span className="text-gold-400 text-xs font-bold">✓</span>}
                  </motion.div>
                ))}
              </div>

              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-gray-400 text-xs font-mono"
              >
                {isGenerating ? 'Synthesizing on-chain fighter profile...' : 'Reading blockchain records...'}
              </motion.p>

              {error && !isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 border border-crimson/50 bg-crimson/10 rounded-xl max-w-sm mx-auto"
                >
                  <p className="text-crimson font-mono text-sm mb-4">Error: {error}</p>
                  <button 
                    onClick={generateCurrentWarrior}
                    className="btn-secondary text-xs py-2 px-4"
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300 text-xs font-mono mb-3">
                  👑 GLADIATOR AWAKENED
                </div>
                <p className="text-gray-400 text-xs font-mono">{warrior.rarity} · {warrior.archetype.replace('_', ' ')}</p>
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
                  style={{ background: rarityMeta?.color || '#FFD700', opacity: 0.35 }}
                />
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-9xl relative z-10 filter drop-shadow-[0_0_25px_rgba(245,158,11,0.5)]"
                >
                  {meta?.emoji}
                </motion.div>
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="font-display text-4xl sm:text-6xl text-white font-extrabold mb-2"
              >
                {warrior.name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="font-display text-xl mb-1 font-bold"
                style={{ color: meta?.color }}
              >
                {warrior.archetype.replace(/_/g, ' ')}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="font-mono text-xs mb-8 font-bold"
                style={{ color: rarityMeta?.color }}
              >
                ✦ {warrior.rarity} TIER GLADIATOR ✦
              </motion.p>

              {/* Stats reveal */}
              {showStats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card p-6 mb-8 text-left max-w-md mx-auto border-gold-500/30 shadow-2xl"
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
                        <div className="flex justify-between text-xs mb-1 font-mono font-bold">
                          <span className="text-gray-400">{stat.label}</span>
                          <span style={{ color: getStatColor(stat.value) }}>{stat.value}</span>
                        </div>
                        <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-gold-500/10">
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
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gold-500/15">
                    {warrior.personality.map(trait => (
                      <span
                        key={trait}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-lg border font-bold"
                        style={{ color: meta?.color, borderColor: meta?.color + '40', background: meta?.color + '15' }}
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
                className="btn-primary text-xl px-12 py-4"
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
