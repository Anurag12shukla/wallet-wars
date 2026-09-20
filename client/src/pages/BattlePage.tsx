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
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8F5] p-4">
        <div className="bg-white border border-stone-200 rounded-3xl p-8 text-center max-w-md shadow-soft-sm">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="text-slate-900 font-display text-xl font-bold mb-4">BATTLE NOT FOUND</p>
          <Link to="/arena" className="btn-primary">⚔️ GO TO ARENA</Link>
        </div>
      </div>
    );
  }

  const p1 = battle.playerOneWarrior;
  const p2 = battle.playerTwoWarrior;
  const p1Meta = getArchetypeMeta(p1.archetype);
  const p2Meta = getArchetypeMeta(p2.archetype);
  const p1Won = battle.winner?.toLowerCase() === battle.playerOneWallet?.toLowerCase();

  return (
    <div className="min-h-screen py-12 bg-[#F7F8F5] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <p className="text-xs font-mono text-amber-600 mb-2 font-bold">MATCH RECORD #{battleId?.slice(0, 8)}</p>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Arena Replay
          </h1>
        </motion.div>

        {/* VS card */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 mb-6 shadow-soft-sm">
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className={`text-center ${p1Won ? 'opacity-100' : 'opacity-60'}`}>
              <div className="text-5xl sm:text-6xl mb-2">{p1Meta.emoji}</div>
              <p className="font-display text-slate-900 text-sm sm:text-base font-bold truncate">{p1.name}</p>
              <p className="text-xs text-slate-500 font-mono">{shortenAddress(battle.playerOneWallet)}</p>
              {p1Won && <span className="text-xs text-emerald-700 bg-pastel-sage-100 border border-pastel-sage-200 px-2 py-0.5 rounded-full font-mono mt-1.5 inline-block font-bold">👑 VICTOR</span>}
            </div>
            <div className="text-center">
              <div className="font-display text-3xl sm:text-4xl text-amber-600 font-extrabold">VS</div>
              <p className="text-xs text-slate-500 mt-1 font-mono">{battle.rounds.length} ROUNDS</p>
            </div>
            <div className={`text-center ${!p1Won ? 'opacity-100' : 'opacity-60'}`}>
              <div className="text-5xl sm:text-6xl mb-2">{p2Meta.emoji}</div>
              <p className="font-display text-slate-900 text-sm sm:text-base font-bold truncate">{p2.name}</p>
              <p className="text-xs text-slate-500 font-mono">{shortenAddress(battle.playerTwoWallet)}</p>
              {!p1Won && <span className="text-xs text-emerald-700 bg-pastel-sage-100 border border-pastel-sage-200 px-2 py-0.5 rounded-full font-mono mt-1.5 inline-block font-bold">👑 VICTOR</span>}
            </div>
          </div>
        </div>

        {/* Battle log */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 mb-6 shadow-soft-sm">
          <h2 className="font-display text-xs text-slate-500 tracking-widest uppercase font-bold mb-4">COMBAT TELEMETRY LOG</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto font-mono text-xs pr-2">
            {battle.battleLog.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="text-slate-700 py-1.5 px-2.5 rounded-lg bg-slate-50 border border-stone-200/60 flex items-center gap-2"
              >
                <span className="text-amber-500 font-bold">⚔️</span>
                <span>{line}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Battle stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-8">
          {[
            { label: 'TOTAL ROUNDS', value: battle.rounds.length, color: '#0F172A' },
            { label: 'P1 DAMAGE', value: battle.playerOneDamageDealt, color: '#D97706' },
            { label: 'P2 DAMAGE', value: battle.playerTwoDamageDealt, color: '#D97706' },
            { label: 'CRITICAL HITS', value: battle.playerOneCriticalHits + battle.playerTwoCriticalHits, color: '#E11D48' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-stone-200 rounded-2xl p-4 text-center shadow-soft-xs">
              <p className="text-2xl font-display font-extrabold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-1 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
          <Link to="/arena" className="btn-primary px-8 py-3 text-center text-sm shadow-soft-xs">⚔️ START A NEW BATTLE</Link>
          <Link to="/leaderboard" className="btn-secondary px-8 py-3 text-center text-sm shadow-soft-xs">VIEW LEADERBOARD</Link>
        </div>
      </div>
    </div>
  );
}
