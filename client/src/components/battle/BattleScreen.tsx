import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BattleResult, BattleRound } from '../../types';
import { getArchetypeMeta, shortenAddress } from '../../utils';

interface BattleScreenProps {
  battleResult: BattleResult | null;
  loading: boolean;
  error: string | null;
  isDemo: boolean;
  onRematch: () => void;
  onNewChallenge: () => void;
  playerOneWallet: string;
  playerTwoWallet: string;
}

const ACTION_COLORS: Record<string, string> = {
  ATTACK: '#FFFFFF',
  CRITICAL_HIT: '#F59E0B',
  DODGE: '#E2E8F0',
  COUNTER: '#FBBF24',
  BLOCK: '#94A3B8',
  SPECIAL_ATTACK: '#FFD700',
};

const ACTION_ICONS: Record<string, string> = {
  ATTACK: '⚔️',
  CRITICAL_HIT: '💥',
  DODGE: '💨',
  COUNTER: '⚡',
  BLOCK: '🛡️',
  SPECIAL_ATTACK: '✨',
};

export default function BattleScreen({
  battleResult,
  loading,
  error,
  isDemo,
  onRematch,
  onNewChallenge,
  playerOneWallet,
  playerTwoWallet,
}: BattleScreenProps) {
  const [phase, setPhase] = useState<'countdown' | 'fighting' | 'result'>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [visibleRounds, setVisibleRounds] = useState<BattleRound[]>([]);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(-1);
  const [p1Hp, setP1Hp] = useState(100);
  const [p2Hp, setP2Hp] = useState(100);
  const [shakeP1, setShakeP1] = useState(false);
  const [shakeP2, setShakeP2] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const p1 = battleResult?.playerOneWarrior;
  const p2 = battleResult?.playerTwoWarrior;
  const p1Meta = p1 ? getArchetypeMeta(p1.archetype) : null;
  const p2Meta = p2 ? getArchetypeMeta(p2.archetype) : null;

  const p1MaxHp = p1?.hp || 100;
  const p2MaxHp = p2?.hp || 100;

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
        setTimeout(() => setPhase('result'), 1000);
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
        setTimeout(() => setShakeP2(false), 500);
      } else if (round.attacker === 'playerTwo' && !round.isDodge) {
        setShakeP1(true);
        setTimeout(() => setShakeP1(false), 500);
      }

      // Scroll log
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }

      idx++;
      setTimeout(animate, 800);
    };

    const startDelay = setTimeout(animate, 500);
    return () => clearTimeout(startDelay);
  }, [phase, battleResult]);

  const p1HpPct = Math.max(0, (p1Hp / p1MaxHp) * 100);
  const p2HpPct = Math.max(0, (p2Hp / p2MaxHp) * 100);

  const isP1Winner = battleResult?.winner === playerOneWallet;
  const iAmWinner = isP1Winner;

  if (loading && !battleResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-deepest">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-3 border-gold-400 border-t-transparent rounded-full mx-auto mb-4 shadow-[0_0_25px_rgba(245,158,11,0.4)]"
          />
          <p className="font-display text-gold-400 text-lg tracking-widest animate-pulse font-bold">
            ⚔️ SIMULATING ARENA COMBAT...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-deepest p-4">
        <div className="glass-card p-8 text-center max-w-md border-crimson/40 shadow-2xl">
          <p className="text-5xl mb-4">❌</p>
          <p className="font-display text-2xl text-white font-bold mb-2">BATTLE FAILED</p>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button onClick={onNewChallenge} className="btn-primary">TRY AGAIN</button>
        </div>
      </div>
    );
  }

  if (!battleResult) return null;

  return (
    <div className="min-h-screen py-8 relative bg-obsidian-deepest">
      {/* Battle Ambient Gold Radial Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.1, 0.22, 0.1] }}
          transition={{ duration: 3.5, repeat: Infinity }}
          style={{ background: 'radial-gradient(ellipse at center, #F59E0B 0%, transparent 65%)', position: 'absolute', inset: 0 }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Countdown overlay */}
        <AnimatePresence>
          {phase === 'countdown' && countdown > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center"
            >
              <motion.div
                key={countdown}
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="font-display text-center"
              >
                <div className="text-[14rem] leading-none font-extrabold gradient-gold" style={{ textShadow: '0 0 50px rgba(245,158,11,0.8)' }}>
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
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ type: 'spring' }}
              className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center"
            >
              <div className="text-[7rem] sm:text-[9rem] font-display font-extrabold gradient-gold tracking-widest drop-shadow-[0_0_40px_rgba(245,158,11,0.8)]">
                FIGHT!
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gladiators Combatants Cards */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8">
          {/* Player 1 */}
          <motion.div
            animate={shakeP1 ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`glass-card p-4 md:p-6 border-gold-500/30 ${isP1Winner && phase === 'result' ? 'border-gold-400 shadow-[0_0_30px_rgba(245,158,11,0.4)]' : ''}`}
          >
            {isDemo && <div className="text-xs text-gold-400 font-mono font-bold mb-2">DEMO COMBATANT</div>}
            {phase === 'result' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-xs font-display font-bold tracking-widest mb-2 ${isP1Winner ? 'text-gold-400' : 'text-crimson'}`}
              >
                {isP1Winner ? '👑 ARENA VICTOR' : '💀 DEFEATED'}
              </motion.div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl sm:text-4xl">{p1Meta?.emoji}</span>
              <div className="min-w-0">
                <p className="font-display text-sm sm:text-base text-white font-bold truncate">{p1?.name}</p>
                <p className="text-xs text-gray-400 font-mono">{shortenAddress(playerOneWallet)}</p>
              </div>
            </div>
            {/* HP Bar */}
            <div className="mb-1.5 flex justify-between text-xs font-mono font-bold">
              <span className="text-gray-400">HEALTH</span>
              <span className={p1HpPct > 60 ? 'text-emerald-400' : p1HpPct > 30 ? 'text-gold-400' : 'text-crimson'}>
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
                <div key={s.label} className="bg-black/50 border border-gold-500/10 rounded-lg py-1.5">
                  <p className="text-[10px] text-gray-400 font-mono">{s.label}</p>
                  <p className="text-sm font-display font-bold text-white">{s.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* VS Divider */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="font-display text-4xl gradient-gold font-extrabold filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
            >
              VS
            </motion.div>
          </div>

          {/* Player 2 */}
          <motion.div
            animate={shakeP2 ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`glass-card p-4 md:p-6 border-gold-500/30 ${!isP1Winner && phase === 'result' ? 'border-gold-400 shadow-[0_0_30px_rgba(245,158,11,0.4)]' : ''}`}
          >
            {isDemo && <div className="text-xs text-gold-400 font-mono font-bold mb-2">DEMO COMBATANT</div>}
            {phase === 'result' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-xs font-display font-bold tracking-widest mb-2 ${!isP1Winner ? 'text-gold-400' : 'text-crimson'}`}
              >
                {!isP1Winner ? '👑 ARENA VICTOR' : '💀 DEFEATED'}
              </motion.div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl sm:text-4xl">{p2Meta?.emoji}</span>
              <div className="min-w-0">
                <p className="font-display text-sm sm:text-base text-white font-bold truncate">{p2?.name}</p>
                <p className="text-xs text-gray-400 font-mono">{shortenAddress(playerTwoWallet)}</p>
              </div>
            </div>
            <div className="mb-1.5 flex justify-between text-xs font-mono font-bold">
              <span className="text-gray-400">HEALTH</span>
              <span className={p2HpPct > 60 ? 'text-emerald-400' : p2HpPct > 30 ? 'text-gold-400' : 'text-crimson'}>
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
                <div key={s.label} className="bg-black/50 border border-gold-500/10 rounded-lg py-1.5">
                  <p className="text-[10px] text-gray-400 font-mono">{s.label}</p>
                  <p className="text-sm font-display font-bold text-white">{s.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Battle Log */}
        <div className="glass-card p-5 mb-6 border-gold-500/30">
          <div className="flex items-center justify-between mb-3 border-b border-gold-500/20 pb-2">
            <h3 className="font-display text-xs tracking-widest text-gold-400 font-bold">LIVE COMBAT LOG</h3>
            <span className="text-[10px] font-mono text-gray-400">TURN-BASED ENGINE</span>
          </div>
          <div
            ref={logRef}
            className="h-44 overflow-y-auto space-y-2 font-mono text-xs pr-2"
            style={{ scrollBehavior: 'smooth' }}
          >
            <AnimatePresence>
              {visibleRounds.map((round, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2.5 p-1.5 rounded bg-black/30 border border-gold-500/10"
                >
                  <span className="text-base" style={{ color: ACTION_COLORS[round.action] || '#fff' }}>
                    {ACTION_ICONS[round.action]} 
                  </span>
                  <span className={round.isCritical ? 'text-gold-400 font-bold' : round.isDodge ? 'text-chrome font-bold' : 'text-gray-200'}>
                    {round.description}
                  </span>
                  {round.damage > 0 && (
                    <span className={`ml-auto flex-shrink-0 font-bold ${round.isCritical ? 'text-crimson' : 'text-gold-400'}`}>
                      -{round.damage} HP
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {phase === 'fighting' && currentRoundIdx >= 0 && currentRoundIdx < (battleResult?.rounds.length || 0) - 1 && (
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-gold-400 text-xs font-mono font-semibold"
              >
                ▶ {battleResult?.rounds[currentRoundIdx + 1]?.description || '...'}
              </motion.div>
            )}
          </div>
        </div>

        {/* Result Screen */}
        <AnimatePresence>
          {phase === 'result' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 text-center border-gold-500/40 shadow-[0_0_40px_rgba(245,158,11,0.25)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
              
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="text-6xl mb-4">{iAmWinner ? '👑' : '💀'}</div>
                <h2 className="font-display text-5xl sm:text-6xl mb-2 font-extrabold">
                  {iAmWinner
                    ? <span className="gradient-gold">VICTORY</span>
                    : <span className="text-crimson">DEFEATED</span>
                  }
                </h2>
                <p className="text-gray-300 text-lg mb-8 font-medium">
                  {iAmWinner
                    ? `"${p2?.name} HAS FALLEN IN THE ARENA."`
                    : 'YOU GOT SMOKED. The arena demands revenge.'
                  }
                </p>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'XP EARNED', value: `+${iAmWinner ? battleResult.xpAwarded.playerOne : battleResult.xpAwarded.playerTwo}`, color: '#FFD700' },
                  { label: 'TOTAL ROUNDS', value: battleResult.rounds.length, color: '#E2E8F0' },
                  { label: 'DAMAGE DEALT', value: iAmWinner ? battleResult.playerOneDamageDealt : battleResult.playerTwoDamageDealt, color: '#F59E0B' },
                  { label: 'CRITICAL HITS', value: iAmWinner ? battleResult.playerOneCriticalHits : battleResult.playerTwoCriticalHits, color: '#EF4444' },
                ].map(s => (
                  <div key={s.label} className="glass-card p-3.5 text-center border-gold-500/20">
                    <p className="text-2xl sm:text-3xl font-display font-extrabold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[11px] text-gray-400 font-mono mt-1 tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Achievements unlocked */}
              {battleResult.achievementsUnlocked.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-mono text-gold-400 mb-2.5 font-bold">🏅 NEW ACHIEVEMENTS UNLOCKED</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {battleResult.achievementsUnlocked.map(id => (
                      <span key={id} className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-300 font-bold shadow-sm">
                        👑 {id.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={onRematch}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary px-8 py-3.5 text-base"
                >
                  🔄 REMATCH
                </motion.button>
                <button onClick={onNewChallenge} className="btn-secondary px-8 py-3.5 text-base">
                  ⚔️ CHALLENGE SOMEONE ELSE
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
