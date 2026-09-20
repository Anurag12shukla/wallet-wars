import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BattleResult, BattleRound } from '../../types';
import { getArchetypeMeta, shortenAddress } from '../../utils';

interface BattleScreenProps {
  battleResult: BattleResult | null;
  loading: boolean;
  error: string | null;
  onRematch: () => void;
  onNewChallenge: () => void;
  playerOneWallet: string;
  playerTwoWallet: string;
}

const ACTION_ICONS: Record<string, string> = {
  ATTACK: '⚔️',
  CRITICAL_HIT: '💥',
  DODGE: '💨',
  COUNTER: '⚡',
  BLOCK: '🛡️',
  SPECIAL_ATTACK: '✨',
};

const ACTION_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  ATTACK: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200' },
  CRITICAL_HIT: { bg: 'bg-pastel-pink-100', text: 'text-rose-700', border: 'border-pastel-pink-200' },
  DODGE: { bg: 'bg-pastel-blue-100', text: 'text-blue-700', border: 'border-pastel-blue-200' },
  COUNTER: { bg: 'bg-pastel-cream-100', text: 'text-amber-800', border: 'border-pastel-cream-200' },
  BLOCK: { bg: 'bg-pastel-sage-100', text: 'text-emerald-800', border: 'border-pastel-sage-200' },
  SPECIAL_ATTACK: { bg: 'bg-pastel-lavender-100', text: 'text-pastel-lavender-700', border: 'border-pastel-lavender-200' },
};

export default function BattleScreen({
  battleResult,
  loading,
  error,
  onRematch,
  onNewChallenge,
  playerOneWallet,
  playerTwoWallet,
}: BattleScreenProps) {
  const [phase, setPhase] = useState<'countdown' | 'fighting' | 'result'>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [visibleRounds, setVisibleRounds] = useState<BattleRound[]>([]);
  const [, setCurrentRoundIdx] = useState(-1);
  const [p1Hp, setP1Hp] = useState(100);
  const [p2Hp, setP2Hp] = useState(100);
  const [shakeP1, setShakeP1] = useState(false);
  const [shakeP2, setShakeP2] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const p1 = battleResult?.playerOneWarrior;
  const p2 = battleResult?.playerTwoWarrior;
  const p1Meta = p1 ? getArchetypeMeta(p1.archetype) : null;
  const p2Meta = p2 ? getArchetypeMeta(p2.archetype) : null;

  const p1MaxHp = 100;
  const p2MaxHp = 100;

  // Countdown
  useEffect(() => {
    if (!battleResult && loading) {
      setPhase('countdown');
      return;
    }
    if (battleResult) {
      setP1Hp(p1MaxHp);
      setP2Hp(p2MaxHp);
      const countInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countInterval);
            setPhase('fighting');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countInterval);
    }
  }, [battleResult, loading]);

  // Animate rounds
  useEffect(() => {
    if (phase !== 'fighting' || !battleResult) return;
    const rounds = battleResult.rounds;
    if (rounds.length === 0) {
      setPhase('result');
      return;
    }

    let idx = 0;
    const animate = () => {
      if (idx >= rounds.length) {
        setTimeout(() => setPhase('result'), 900);
        return;
      }

      const round = rounds[idx];
      setCurrentRoundIdx(idx);
      setVisibleRounds(prev => [...prev, round]);

      // Update HP
      setP1Hp(round.playerOneHp);
      setP2Hp(round.playerTwoHp);

      // Shake effect
      if (round.attacker === 'playerOne' && !round.isDodge) {
        setShakeP2(true);
        setTimeout(() => setShakeP2(false), 450);
      } else if (round.attacker === 'playerTwo' && !round.isDodge) {
        setShakeP1(true);
        setTimeout(() => setShakeP1(false), 450);
      }

      // Scroll log
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }

      idx++;
      setTimeout(animate, 750);
    };

    const startDelay = setTimeout(animate, 400);
    return () => clearTimeout(startDelay);
  }, [phase, battleResult]);

  const p1HpPct = Math.max(0, (p1Hp / p1MaxHp) * 100);
  const p2HpPct = Math.max(0, (p2Hp / p2MaxHp) * 100);

  const p1Address = (playerOneWallet || battleResult?.playerOneWarrior?.walletAddress || '').toLowerCase();
  const winnerAddress = (battleResult?.winner || '').toLowerCase();

  const isP1Winner = battleResult?.winnerPlayer
    ? battleResult.winnerPlayer === 'playerOne'
    : (winnerAddress !== '' && winnerAddress === p1Address);

  if (loading && !battleResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8F5]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="font-display text-slate-800 text-sm tracking-wider font-bold">
            ⚔️ SIMULATING ARENA COMBAT...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8F5] p-4">
        <div className="bg-white border border-rose-200 rounded-3xl p-8 text-center max-w-md shadow-soft-md">
          <p className="text-4xl mb-3">❌</p>
          <p className="font-display text-xl text-slate-900 font-bold mb-2">BATTLE FAILED</p>
          <p className="text-slate-600 text-sm mb-6">{error}</p>
          <button onClick={onNewChallenge} className="btn-primary">TRY AGAIN</button>
        </div>
      </div>
    );
  }

  if (!battleResult) return null;

  return (
    <div className="min-h-screen py-8 relative bg-[#F7F8F5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Countdown overlay */}
        <AnimatePresence>
          {phase === 'countdown' && countdown > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                key={countdown}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="font-display text-center"
              >
                <div className="text-[12rem] leading-none font-extrabold text-white drop-shadow-md">
                  {countdown}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FIGHT text after countdown */}
        <AnimatePresence>
          {phase === 'countdown' && countdown === 0 && (
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.8, opacity: 0 }}
              transition={{ type: 'spring' }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <div className="text-[6rem] sm:text-[8rem] font-display font-extrabold text-white tracking-tight drop-shadow-lg">
                FIGHT!
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gladiators Combatants Cards */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 mb-6 relative">
          {/* Player 1 */}
          <motion.div
            animate={shakeP1 ? { x: [-4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.35 }}
            className={`bg-white border rounded-3xl p-4 md:p-6 shadow-soft-sm transition-all ${
              isP1Winner && phase === 'result' ? 'border-emerald-400 ring-2 ring-emerald-400/20' : 'border-stone-200'
            }`}
          >
            {phase === 'result' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-xs font-display font-bold tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-2 border ${
                  isP1Winner
                    ? 'text-emerald-700 bg-pastel-sage-100 border-pastel-sage-200'
                    : 'text-rose-700 bg-pastel-pink-100 border-pastel-pink-200'
                }`}
              >
                {isP1Winner ? '👑 ARENA VICTOR' : '💀 DEFEATED'}
              </motion.div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl sm:text-4xl">{p1Meta?.emoji}</span>
              <div className="min-w-0">
                <p className="font-display text-sm sm:text-base text-slate-900 font-bold truncate">{p1?.name}</p>
                <p className="text-xs text-slate-500 font-mono">{shortenAddress(playerOneWallet)}</p>
              </div>
            </div>
            {/* HP Bar */}
            <div className="mb-1.5 flex justify-between text-xs font-mono font-bold">
              <span className="text-slate-500">HEALTH</span>
              <span className={p1HpPct > 60 ? 'text-emerald-600' : p1HpPct > 30 ? 'text-amber-600' : 'text-rose-600'}>
                {Math.max(0, p1Hp)}/{p1MaxHp}
              </span>
            </div>
            <div className="hp-bar-container">
              <motion.div
                className={`hp-bar-fill ${p1HpPct > 60 ? 'high' : p1HpPct > 30 ? 'medium' : 'low'}`}
                animate={{ width: `${p1HpPct}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-1.5 text-center">
              {[
                { label: 'ATK', value: p1?.attack },
                { label: 'DEF', value: p1?.defense },
                { label: 'SPD', value: p1?.speed },
              ].map(s => (
                <div key={s.label} className="bg-slate-50 border border-stone-200/80 rounded-xl py-1.5">
                  <p className="text-[10px] text-slate-500 font-mono font-semibold">{s.label}</p>
                  <p className="text-xs sm:text-sm font-display font-bold text-slate-900">{s.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* VS Divider in Center */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
            <div className="font-display text-2xl font-extrabold text-amber-600 bg-white border border-stone-200 w-12 h-12 rounded-full flex items-center justify-center shadow-soft-sm">
              VS
            </div>
          </div>

          {/* Player 2 */}
          <motion.div
            animate={shakeP2 ? { x: [-4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.35 }}
            className={`bg-white border rounded-3xl p-4 md:p-6 shadow-soft-sm transition-all ${
              !isP1Winner && phase === 'result' ? 'border-emerald-400 ring-2 ring-emerald-400/20' : 'border-stone-200'
            }`}
          >
            {phase === 'result' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-xs font-display font-bold tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-2 border ${
                  !isP1Winner
                    ? 'text-emerald-700 bg-pastel-sage-100 border-pastel-sage-200'
                    : 'text-rose-700 bg-pastel-pink-100 border-pastel-pink-200'
                }`}
              >
                {!isP1Winner ? '👑 ARENA VICTOR' : '💀 DEFEATED'}
              </motion.div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl sm:text-4xl">{p2Meta?.emoji}</span>
              <div className="min-w-0">
                <p className="font-display text-sm sm:text-base text-slate-900 font-bold truncate">{p2?.name}</p>
                <p className="text-xs text-slate-500 font-mono">{shortenAddress(playerTwoWallet)}</p>
              </div>
            </div>
            <div className="mb-1.5 flex justify-between text-xs font-mono font-bold">
              <span className="text-slate-500">HEALTH</span>
              <span className={p2HpPct > 60 ? 'text-emerald-600' : p2HpPct > 30 ? 'text-amber-600' : 'text-rose-600'}>
                {Math.max(0, p2Hp)}/{p2MaxHp}
              </span>
            </div>
            <div className="hp-bar-container">
              <motion.div
                className={`hp-bar-fill ${p2HpPct > 60 ? 'high' : p2HpPct > 30 ? 'medium' : 'low'}`}
                animate={{ width: `${p2HpPct}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-1.5 text-center">
              {[
                { label: 'ATK', value: p2?.attack },
                { label: 'DEF', value: p2?.defense },
                { label: 'SPD', value: p2?.speed },
              ].map(s => (
                <div key={s.label} className="bg-slate-50 border border-stone-200/80 rounded-xl py-1.5">
                  <p className="text-[10px] text-slate-500 font-mono font-semibold">{s.label}</p>
                  <p className="text-xs sm:text-sm font-display font-bold text-slate-900">{s.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Battle Log */}
        <div className="bg-white border border-stone-200 rounded-3xl p-5 mb-6 shadow-soft-sm">
          <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-2">
            <h3 className="font-display text-xs tracking-wider text-slate-900 font-bold">LIVE COMBAT TELEMETRY</h3>
            <span className="text-[10px] font-mono text-slate-500">TURN-BASED ENGINE</span>
          </div>
          <div
            ref={logRef}
            className="h-44 overflow-y-auto space-y-2 font-mono text-xs pr-2"
            style={{ scrollBehavior: 'smooth' }}
          >
            <AnimatePresence>
              {visibleRounds.map((round, i) => {
                const actionStyle = ACTION_STYLES[round.action] || ACTION_STYLES.ATTACK;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2 rounded-xl bg-slate-50 border border-stone-200/70 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm">{ACTION_ICONS[round.action] || '⚔️'}</span>
                      <span className="text-slate-800 truncate font-medium">{round.description}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${actionStyle.bg} ${actionStyle.text} ${actionStyle.border}`}>
                      {round.action.replace('_', ' ')}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Result Action Buttons */}
        {phase === 'result' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="p-6 rounded-3xl bg-white border border-stone-200 max-w-lg mx-auto shadow-soft-md">
              <div className="text-4xl mb-2">{isP1Winner ? '🏆' : '💀'}</div>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 mb-1">
                {isP1Winner ? `${p1?.name || 'PLAYER ONE'} WINS!` : `${p2?.name || 'PLAYER TWO'} WINS!`}
              </h2>
              <p className="text-xs text-slate-500 font-mono mb-4">
                Deterministic arena duel evaluated over {visibleRounds.length} rounds.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                <button onClick={onRematch} className="btn-primary py-2.5 px-6 text-xs">
                  ⚔️ REMATCH
                </button>
                <button onClick={onNewChallenge} className="btn-secondary py-2.5 px-6 text-xs">
                  🎯 NEW OPPONENT
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
