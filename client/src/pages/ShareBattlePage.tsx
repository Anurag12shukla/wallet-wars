import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBattleShare } from '../services/api';
import { getArchetypeMeta } from '../utils';
import LoadingScreen from '../components/shared/LoadingScreen';

export default function ShareBattlePage() {
  const { battleId } = useParams<{ battleId: string }>();
  const [battle, setBattle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!battleId) return;
    getBattleShare(battleId)
      .then(res => { if (res.success && res.data) setBattle(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [battleId]);

  if (loading) return <LoadingScreen message="LOADING BATTLE CERTIFICATE..." />;

  if (!battle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8F5] p-4">
        <div className="bg-white border border-stone-200 rounded-3xl p-8 text-center max-w-md shadow-soft-sm">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="text-slate-900 font-display text-xl font-bold mb-4">BATTLE NOT FOUND</p>
          <Link to="/arena" className="btn-primary">⚔️ ENTER THE ARENA</Link>
        </div>
      </div>
    );
  }

  const p1 = battle.playerOneWarrior;
  const p2 = battle.playerTwoWarrior;
  const p1Meta = p1 ? getArchetypeMeta(p1.archetype) : null;
  const p2Meta = p2 ? getArchetypeMeta(p2.archetype) : null;
  const p1Won = battle.winner?.toLowerCase() === battle.playerOneWallet?.toLowerCase();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-[#F7F8F5] relative">
      <div className="max-w-lg w-full relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Share card */}
          <div className="bg-white border border-stone-200 rounded-3xl p-8 text-center mb-6 shadow-soft-md relative">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 overflow-hidden border border-stone-200 bg-white p-0.5 shadow-soft-xs flex items-center justify-center">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-[10px]" />
              </div>
              <p className="text-xs font-mono text-amber-600 font-bold tracking-widest mb-1">WALLET WARS OFFICIAL BATTLE</p>
              <p className="text-xs text-slate-500 font-mono">ID: #{battleId?.slice(0, 8)}</p>
            </div>

            <div className="flex items-center justify-around mb-8 bg-slate-50 p-4 rounded-2xl border border-stone-200/80">
              <div className={p1Won ? '' : 'opacity-40'}>
                <div className="text-4xl mb-1.5">{p1Meta?.emoji}</div>
                <p className="font-display text-xs sm:text-sm text-slate-900 font-bold truncate max-w-[110px]">{p1?.name || 'GLADIATOR'}</p>
                {p1Won && <p className="text-[11px] text-emerald-700 font-bold mt-0.5">👑 WINNER</p>}
              </div>
              <div>
                <p className="font-display text-2xl font-extrabold text-amber-600">VS</p>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">{battle.rounds} ROUNDS</p>
              </div>
              <div className={!p1Won ? '' : 'opacity-40'}>
                <div className="text-4xl mb-1.5">{p2Meta?.emoji}</div>
                <p className="font-display text-xs sm:text-sm text-slate-900 font-bold truncate max-w-[110px]">{p2?.name || 'GLADIATOR'}</p>
                {!p1Won && <p className="text-[11px] text-emerald-700 font-bold mt-0.5">👑 WINNER</p>}
              </div>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
              Your Robinhood wallet & trading telemetry is your combat weapon. Enter the arena to fight for glory.
            </p>

            <div className="flex flex-col gap-2.5">
              <Link to="/arena" className="btn-primary justify-center py-3 text-sm shadow-soft-xs">
                ⚔️ ENTER THE ARENA
              </Link>
              <Link to={`/battles/${battleId}`} className="btn-secondary justify-center py-3 text-sm shadow-soft-xs">
                VIEW FULL BATTLE REPLAY
              </Link>
            </div>
          </div>

          <div className="text-center text-slate-500 text-xs font-mono">
            Built on Robinhood Chain (Chain ID 4663) • walletwars.online
          </div>
        </motion.div>
      </div>
    </div>
  );
}
