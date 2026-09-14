import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import type { BattleResult, BattleRound } from '../../types';
import { getArchetypeMeta, getRarityMeta, shortenAddress } from '../../utils';
import { getWarrior } from '../../services/api';
import type { Warrior } from '../../types';

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
  ATTACK: '#ffffff',
  CRITICAL_HIT: '#ff4500',
  DODGE: '#14F195',
  COUNTER: '#ffd60a',
  BLOCK: '#4A90D9',
  SPECIAL_ATTACK: '#9945FF',
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
  const navigate = useNavigate();
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
      // Start countdown
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-2 border-brand-purple border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="font-display text-brand-purple text-lg tracking-widest animate-pulse">
            CALCULATING BATTLE...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <p className="text-4xl mb-4">❌</p>
          <p className="font-display text-xl text-white mb-2">BATTLE FAILED</p>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button onClick={onNewChallenge} className="btn-secondary">TRY AGAIN</button>
        </div>
      </div>
    );
  }

  if (!battleResult) return null;

  return (
    <div className="min-h-screen py-8 relative">
      {/* Battle background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ background: 'radial-gradient(ellipse at center, #9945FF 0%, transparent 60%)', position: 'absolute', inset: 0 }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        {/* Countdown overlay */}
        <AnimatePresence>
          {phase === 'countdown' && countdown > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                key={countdown}
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="font-display text-center"
              >
                {countdown > 0 ? (
                  <>
                    <div className="text-[15rem] leading-none text-white" style={{ textShadow: '0 0 40px #9945FF' }}>
                      {countdown}
                    </div>
                  </>
                ) : (
                  <div className="text-[6rem] gradient-text">FIGHT!</div>
                )}
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
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            >
              <div className="text-[8rem] font-display gradient-text">FIGHT!</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Warriors */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8">
          {/* Player 1 */}
          <motion.div
            animate={shakeP1 ? { x: [-4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`glass-card p-4 md:p-6 ${isP1Winner && phase === 'result' ? 'glow-purple' : ''}`}
          >
            {isDemo && <div className="text-xs text-yellow-400 font-mono mb-2">DEMO</div>}
            {phase === 'result' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-xs font-display tracking-wider mb-2 ${isP1Winner ? 'text-green-400' : 'text-red-400'}`}
              >
                {isP1Winner ? '🏆 WINNER' : '💀 DEFEATED'}
              </motion.div>
            )}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">{p1Meta?.emoji}</span>
              <div>
                <p className="font-display text-sm text-white">{p1?.name}</p>
                <p className="text-xs text-gray-500 font-mono">{shortenAddress(playerOneWallet)}</p>
              </div>
            </div>
            {/* HP Bar */}
            <div className="mb-1 flex justify-between text-xs font-mono">
              <span className="text-gray-500">HP</span>
              <span className={p1HpPct > 60 ? 'text-green-400' : p1HpPct > 30 ? 'text-yellow-400' : 'text-red-400'}>
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
            <div className="mt-3 grid grid-cols-3 gap-1 text-center">
              {[
                { label: 'ATK', value: p1?.attack },
                { label: 'DEF', value: p1?.defense },
                { label: 'SPD', value: p1?.speed },
              ].map(s => (
                <div key={s.label} className="bg-white/5 rounded py-1">
                  <p className="text-xs text-gray-600">{s.label}</p>
                  <p className="text-sm font-display text-white">{s.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* VS */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="font-display text-3xl gradient-text"
            >
              VS
            </motion.div>
          </div>

          {/* Player 2 */}
          <motion.div
            animate={shakeP2 ? { x: [-4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`glass-card p-4 md:p-6 ${!isP1Winner && phase === 'result' ? 'glow-purple' : ''}`}
          >
            {isDemo && <div className="text-xs text-yellow-400 font-mono mb-2">DEMO</div>}
            {phase === 'result' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-xs font-display tracking-wider mb-2 ${!isP1Winner ? 'text-green-400' : 'text-red-400'}`}
              >
                {!isP1Winner ? '🏆 WINNER' : '💀 DEFEATED'}
              </motion.div>
            )}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">{p2Meta?.emoji}</span>
              <div>
                <p className="font-display text-sm text-white">{p2?.name}</p>
                <p className="text-xs text-gray-500 font-mono">{shortenAddress(playerTwoWallet)}</p>
              </div>
            </div>
            <div className="mb-1 flex justify-between text-xs font-mono">
              <span className="text-gray-500">HP</span>
              <span className={p2HpPct > 60 ? 'text-green-400' : p2HpPct > 30 ? 'text-yellow-400' : 'text-red-400'}>
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
            <div className="mt-3 grid grid-cols-3 gap-1 text-center">
              {[
                { label: 'ATK', value: p2?.attack },
                { label: 'DEF', value: p2?.defense },
                { label: 'SPD', value: p2?.speed },
              ].map(s => (
                <div key={s.label} className="bg-white/5 rounded py-1">
                  <p className="text-xs text-gray-600">{s.label}</p>
                  <p className="text-sm font-display text-white">{s.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Battle Log */}
        <div className="glass-card p-4 mb-6">
          <h3 className="font-display text-xs tracking-widest text-gray-400 mb-3">BATTLE LOG</h3>
          <div
            ref={logRef}
            className="h-40 overflow-y-auto space-y-1.5 font-mono text-xs pr-1"
            style={{ scrollBehavior: 'smooth' }}
          >
            <AnimatePresence>
              {visibleRounds.map((round, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2"
                >
                  <span style={{ color: ACTION_COLORS[round.action] || '#fff' }}>
                    {ACTION_ICONS[round.action]} 
                  </span>
                  <span className={round.isCritical ? 'text-orange-400 font-bold' : round.isDodge ? 'text-brand-cyan' : 'text-gray-300'}>
                    {round.description}
                  </span>
                  {round.damage > 0 && (
                    <span className={`ml-auto flex-shrink-0 font-bold ${round.isCritical ? 'text-red-400' : 'text-gray-400'}`}>
                      -{round.damage}
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {phase === 'fighting' && currentRoundIdx >= 0 && currentRoundIdx < (battleResult?.rounds.length || 0) - 1 && (
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-brand-purple text-xs"
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
              className="glass-card p-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="text-5xl mb-4">{iAmWinner ? '🏆' : '💀'}</div>
                <h2 className="font-display text-5xl mb-2">
                  {iAmWinner
                    ? <span className="gradient-text">VICTORY</span>
                    : <span className="text-red-400">DEFEATED</span>
                  }
                </h2>
                <p className="text-gray-300 text-lg mb-6">
                  {iAmWinner
                    ? `"${p2?.name} HAS FALLEN."`
                    : 'YOU GOT COOKED. The arena demands revenge.'
                  }
                </p>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'XP EARNED', value: `+${iAmWinner ? battleResult.xpAwarded.playerOne : battleResult.xpAwarded.playerTwo}`, color: '#14F195' },
                  { label: 'ROUNDS', value: battleResult.rounds.length, color: '#9945FF' },
                  { label: 'DAMAGE DEALT', value: iAmWinner ? battleResult.playerOneDamageDealt : battleResult.playerTwoDamageDealt, color: '#ff4500' },
                  { label: 'CRITICAL HITS', value: iAmWinner ? battleResult.playerOneCriticalHits : battleResult.playerTwoCriticalHits, color: '#ffd60a' },
                ].map(s => (
                  <div key={s.label} className="glass-card p-3 text-center">
                    <p className="text-2xl font-display" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs text-gray-500 font-mono mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Achievements unlocked */}
              {battleResult.achievementsUnlocked.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-mono text-yellow-400 mb-2">🏅 ACHIEVEMENTS UNLOCKED</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {battleResult.achievementsUnlocked.map(id => (
                      <span key={id} className="text-xs font-mono px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                        {id.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  onClick={onRematch}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary px-6 py-3"
                >
                  🔄 REMATCH
                </motion.button>
                <button onClick={onNewChallenge} className="btn-secondary px-6 py-3">
                  ⚔️ CHALLENGE SOMEONE ELSE
                </button>
                {!isDemo && (
                  <button
                    onClick={() => navigator.share?.({
                      title: 'Wallet Wars Battle',
                      text: `${iAmWinner ? 'I WON' : 'Just fought'} in Wallet Wars! Battle #${battleResult.battleId}`,
                      url: `${window.location.origin}/share/battle/${battleResult.battleId}`,
                    }) || navigator.clipboard?.writeText(`${window.location.origin}/share/battle/${battleResult.battleId}`)}
                    className="btn-secondary px-6 py-3 border-yellow-500/30 text-yellow-400"
                  >
                    🔗 SHARE BATTLE
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
