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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#F7F8F5]">
      <div className="max-w-2xl mx-auto px-4 text-center relative z-10 py-12">
        <AnimatePresence mode="wait">
          {!showWarrior ? (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border border-stone-200 rounded-3xl p-8 sm:p-12 shadow-soft-sm"
            >
              {/* Rotating scan rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="w-32 h-32 mx-auto mb-8 relative"
              >
                <div className="absolute inset-0 border-2 border-stone-200 rounded-full" />
                <div className="absolute inset-2 border-2 border-dashed border-stone-300 rounded-full" />
                <div className="absolute inset-4 border border-stone-200 rounded-full" />
                <motion.div
                  animate={{ rotate: -720 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-6 border-2 border-amber-500 rounded-full border-t-transparent"
                />
                <div className="absolute inset-0 flex items-center justify-center text-3xl">👑</div>
              </motion.div>

              {/* Steps */}
              <div className="space-y-3 mb-8 text-left max-w-md mx-auto">
                {SCAN_STEPS.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{
                      opacity: i <= scanStep ? 1 : 0.35,
                      x: 0,
                    }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-stone-200/80"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      i < scanStep ? 'bg-emerald-500' : i === scanStep ? 'bg-amber-500 animate-ping' : 'bg-slate-300'
                    }`} />
                    <span
                      className={`font-mono text-xs tracking-wide flex-1 font-semibold ${
                        i <= scanStep ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {step.text}
                    </span>
                    {i < scanStep && <span className="text-emerald-600 text-xs font-bold">✓</span>}
                  </motion.div>
                ))}
              </div>

              <motion.p
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-slate-500 text-xs font-mono font-medium"
              >
                {isGenerating ? 'Synthesizing on-chain fighter profile...' : 'Reading blockchain records...'}
              </motion.p>

              {error && !isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 border border-rose-200 bg-rose-50 rounded-xl max-w-sm mx-auto"
                >
                  <p className="text-rose-600 font-mono text-sm mb-4">Error: {error}</p>
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
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-pastel-sage-200 bg-pastel-sage-100 text-pastel-sage-700 text-xs font-mono font-bold mb-3">
                  👑 GLADIATOR AWAKENED
                </div>
                <p className="text-slate-500 text-xs font-mono font-semibold">{warrior.rarity} · {warrior.archetype.replace('_', ' ')}</p>
              </div>

              {/* Warrior emoji */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-white border border-stone-200 flex items-center justify-center text-7xl shadow-soft-sm"
              >
                {meta?.emoji}
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display text-3xl sm:text-5xl text-slate-900 font-extrabold mb-1 tracking-tight"
              >
                {warrior.name}
              </motion.h1>

              <p className="font-display text-base mb-1 font-bold text-slate-700">
                {warrior.archetype.replace(/_/g, ' ')}
              </p>

              <p className="font-mono text-xs mb-8 font-bold text-amber-600">
                ✦ {warrior.rarity} TIER GLADIATOR ✦
              </p>

              {/* Stats reveal */}
              {showStats && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white border border-stone-200 rounded-3xl p-6 mb-8 text-left max-w-md mx-auto shadow-soft-sm"
                >
                  <div className="grid grid-cols-2 gap-3.5 mb-4">
                    {[
                      { label: 'HP', value: warrior.hp, max: 200 },
                      { label: 'ATTACK', value: warrior.attack, max: 150 },
                      { label: 'DEFENSE', value: warrior.defense, max: 150 },
                      { label: 'SPEED', value: warrior.speed, max: 150 },
                      { label: 'LUCK', value: warrior.luck, max: 100 },
                      { label: 'INTEL', value: warrior.intelligence, max: 150 },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <div className="flex justify-between text-xs mb-1 font-mono font-bold">
                          <span className="text-slate-500">{stat.label}</span>
                          <span className="text-slate-900">{stat.value}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full rounded-full"
                            style={{ background: getStatColor(stat.value) }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Personality traits */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-stone-100">
                    {warrior.personality.map(trait => (
                      <span
                        key={trait}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-pastel-lavender-50 border border-pastel-lavender-200 text-pastel-lavender-700 font-semibold"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: showStats ? 1 : 0, y: showStats ? 0 : 15 }}
                transition={{ delay: 0.4 }}
                onClick={onComplete}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary text-base px-10 py-3.5 shadow-soft-sm"
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
