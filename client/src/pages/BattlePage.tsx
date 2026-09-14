import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBattle } from '../services/api';
import type { Battle } from '../types';
import { getArchetypeMeta, shortenAddress } from '../utils';
import LoadingScreen from '../components/shared/LoadingScreen';

export default function BattlePage() {
  const { battleId } = useParams<{ battleId: string }>();
  const [battle, setBattle] = useState<Battle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!battleId) return;
    getBattle(battleId)
      .then(res => { if (res.success && res.data) setBattle(res.data); else setError('Battle not found.'); })
      .catch(() => setError('Failed to load battle.'))
      .finally(() => setLoading(false));
  }, [battleId]);

  if (loading) return <LoadingScreen message="LOADING BATTLE REPLAY..." />;
  if (error || !battle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-deepest p-4">
        <div className="glass-card p-8 text-center border-gold-500/30 max-w-md">
          <p className="text-5xl mb-4">⚠️</p>
          <p className="text-white font-display text-2xl font-bold mb-4">BATTLE NOT FOUND</p>
          <Link to="/arena" className="btn-primary">⚔️ GO TO ARENA</Link>
        </div>
      </div>
    );
  }

  const p1 = battle.playerOneWarrior;
  const p2 = battle.playerTwoWarrior;
  const p1Meta = getArchetypeMeta(p1.archetype);
  const p2Meta = getArchetypeMeta(p2.archetype);
  const p1Won = battle.winner === battle.playerOneWallet;

  return (
    <div className="min-h-screen py-12 bg-obsidian-deepest relative">
      {/* Ambient Halo Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <p className="text-xs font-mono text-gold-400 mb-2 font-bold">MATCH RECORD #{battleId?.slice(0, 8)}</p>
          <h1 className="text-section text-white">ARENA <span className="gradient-gold">REPLAY</span></h1>
        </motion.div>

        {/* VS card */}
        <div className="glass-card p-6 sm:p-8 mb-6 border-gold-500/30 shadow-2xl">
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className={`text-center ${p1Won ? 'opacity-100' : 'opacity-50'}`}>
              <div className="text-5xl sm:text-6xl mb-2">{p1Meta.emoji}</div>
              <p className="font-display text-white text-base font-bold truncate">{p1.name}</p>
              <p className="text-xs text-gray-400 font-mono">{shortenAddress(battle.playerOneWallet)}</p>
              {p1Won && <span className="text-xs text-gold-400 font-mono mt-1 block font-bold">👑 VICTOR</span>}
            </div>
            <div className="text-center">
              <div className="font-display text-4xl sm:text-5xl gradient-gold font-extrabold">VS</div>
              <p className="text-xs text-gray-400 mt-2 font-mono">{battle.rounds.length} ROUNDS</p>
            </div>
            <div className={`text-center ${!p1Won ? 'opacity-100' : 'opacity-50'}`}>
              <div className="text-5xl sm:text-6xl mb-2">{p2Meta.emoji}</div>
              <p className="font-display text-white text-base font-bold truncate">{p2.name}</p>
              <p className="text-xs text-gray-400 font-mono">{shortenAddress(battle.playerTwoWallet)}</p>
              {!p1Won && <span className="text-xs text-gold-400 font-mono mt-1 block font-bold">👑 VICTOR</span>}
            </div>
          </div>
        </div>

        {/* Battle log */}
        <div className="glass-card p-6 mb-6 border-gold-500/25">
          <h2 className="font-display text-xs text-gold-400 tracking-widest uppercase font-bold mb-4">COMBAT TELEMETRY LOG</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto font-mono text-xs pr-2">
            {battle.battleLog.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="text-gray-300 py-1.5 border-b border-gold-500/10 flex items-center gap-2"
              >
                <span className="text-gold-400 font-bold">⚔️</span>
                <span>{line}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Battle stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'TOTAL ROUNDS', value: battle.rounds.length, color: '#E2E8F0' },
            { label: 'P1 DAMAGE', value: battle.playerOneDamageDealt, color: '#F59E0B' },
            { label: 'P2 DAMAGE', value: battle.playerTwoDamageDealt, color: '#F59E0B' },
            { label: 'CRITICAL HITS', value: battle.playerOneCriticalHits + battle.playerTwoCriticalHits, color: '#EF4444' },
          ].map(s => (
            <div key={s.label} className="glass-card p-4 text-center border-gold-500/20">
              <p className="text-2xl font-display font-extrabold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[11px] text-gray-400 font-mono mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/arena" className="btn-primary px-8 py-3.5 text-center">⚔️ START A NEW BATTLE</Link>
          <Link to="/leaderboard" className="btn-secondary px-8 py-3.5 text-center">VIEW LEADERBOARD</Link>
        </div>
      </div>
    </div>
  );
}
