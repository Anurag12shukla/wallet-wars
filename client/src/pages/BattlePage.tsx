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

  if (loading) return <LoadingScreen message="LOADING BATTLE..." />;
  if (error || !battle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <p className="text-white font-display text-xl mb-4">BATTLE NOT FOUND</p>
          <Link to="/arena" className="btn-primary">GO TO ARENA</Link>
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
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <p className="text-xs font-mono text-gray-500 mb-2">BATTLE #{battleId?.slice(0, 8)}</p>
          <h1 className="text-section text-white">BATTLE <span className="gradient-text">REPLAY</span></h1>
        </motion.div>

        {/* VS card */}
        <div className="glass-card p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className={`text-center ${p1Won ? 'opacity-100' : 'opacity-60'}`}>
              <div className="text-5xl mb-2">{p1Meta.emoji}</div>
              <p className="font-display text-white text-sm">{p1.name}</p>
              <p className="text-xs text-gray-500">{shortenAddress(battle.playerOneWallet)}</p>
              {p1Won && <span className="text-xs text-green-400 font-mono mt-1 block">🏆 WINNER</span>}
            </div>
            <div className="text-center">
              <div className="font-display text-4xl gradient-text">VS</div>
              <p className="text-xs text-gray-500 mt-2 font-mono">{battle.rounds.length} ROUNDS</p>
            </div>
            <div className={`text-center ${!p1Won ? 'opacity-100' : 'opacity-60'}`}>
              <div className="text-5xl mb-2">{p2Meta.emoji}</div>
              <p className="font-display text-white text-sm">{p2.name}</p>
              <p className="text-xs text-gray-500">{shortenAddress(battle.playerTwoWallet)}</p>
              {!p1Won && <span className="text-xs text-green-400 font-mono mt-1 block">🏆 WINNER</span>}
            </div>
          </div>
        </div>

        {/* Battle log */}
        <div className="glass-card p-6 mb-6">
          <h2 className="font-display text-sm text-gray-400 tracking-widest mb-4">BATTLE LOG</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto font-mono text-xs">
            {battle.battleLog.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="text-gray-300 py-1 border-b border-white/5"
              >
                {line}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Battle stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { label: 'TOTAL ROUNDS', value: battle.rounds.length, color: '#9945FF' },
            { label: 'P1 DAMAGE', value: battle.playerOneDamageDealt, color: p1Meta.color },
            { label: 'P2 DAMAGE', value: battle.playerTwoDamageDealt, color: p2Meta.color },
            { label: 'CRITICAL HITS', value: battle.playerOneCriticalHits + battle.playerTwoCriticalHits, color: '#ff4500' },
          ].map(s => (
            <div key={s.label} className="glass-card p-4 text-center">
              <p className="text-2xl font-display" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-500 font-mono">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <Link to="/arena" className="btn-primary">⚔️ START A BATTLE</Link>
          <Link to="/leaderboard" className="btn-secondary">VIEW LEADERBOARD</Link>
        </div>
      </div>
    </div>
  );
}
