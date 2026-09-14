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
      <div className="min-h-screen flex items-center justify-center bg-obsidian-deepest p-4">
        <div className="glass-card p-8 text-center border-gold-500/30 max-w-md">
          <p className="text-5xl mb-4">⚠️</p>
          <p className="text-white font-display text-2xl font-bold mb-4">BATTLE NOT FOUND</p>
          <Link to="/arena" className="btn-primary">⚔️ ENTER THE ARENA</Link>
        </div>
      </div>
    );
  }

  const p1 = battle.playerOneWarrior;
  const p2 = battle.playerTwoWarrior;
  const p1Meta = p1 ? getArchetypeMeta(p1.archetype) : null;
  const p2Meta = p2 ? getArchetypeMeta(p2.archetype) : null;
  const p1Won = battle.winner === battle.playerOneWallet;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-obsidian-deepest relative">
      {/* Ambient Halo Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-gold-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-lg w-full relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          {/* Share card */}
          <div className="glass-card p-8 text-center mb-6 border-gold-500/40 shadow-[0_0_40px_rgba(245,158,11,0.25)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
            
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 overflow-hidden border border-gold-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs font-mono text-gold-400 font-bold tracking-widest mb-1">WALLET WARS OFFICIAL BATTLE</p>
              <p className="text-xs text-gray-500 font-mono">ID: #{battleId?.slice(0, 8)}</p>
            </div>

            <div className="flex items-center justify-around mb-8 bg-black/40 p-4 rounded-2xl border border-gold-500/15">
              <div className={p1Won ? '' : 'opacity-40'}>
                <div className="text-5xl mb-2">{p1Meta?.emoji}</div>
                <p className="font-display text-sm text-white font-bold truncate max-w-[110px]">{p1?.name || 'GLADIATOR'}</p>
                {p1Won && <p className="text-xs text-gold-400 font-bold mt-1">👑 WINNER</p>}
              </div>
              <div>
                <p className="font-display text-3xl gradient-gold font-extrabold">VS</p>
                <p className="text-[11px] text-gray-400 mt-1 font-mono">{battle.rounds} ROUNDS</p>
              </div>
              <div className={!p1Won ? '' : 'opacity-40'}>
                <div className="text-5xl mb-2">{p2Meta?.emoji}</div>
                <p className="font-display text-sm text-white font-bold truncate max-w-[110px]">{p2?.name || 'GLADIATOR'}</p>
                {!p1Won && <p className="text-xs text-gold-400 font-bold mt-1">👑 WINNER</p>}
              </div>
            </div>

            <p className="text-gray-300 text-xs sm:text-sm mb-6 leading-relaxed">
              Your Robinhood wallet & trading telemetry is your combat weapon. Enter the arena to fight for glory.
            </p>

            <div className="flex flex-col gap-3">
              <Link to="/arena" className="btn-primary justify-center py-3.5 text-base">
                ⚔️ ENTER THE ARENA
              </Link>
              <Link to={`/battles/${battleId}`} className="btn-secondary justify-center py-3">
                VIEW FULL BATTLE REPLAY
              </Link>
            </div>
          </div>

          <div className="text-center text-gray-500 text-xs font-mono">
            Built on Robinhood Network (Chain ID 46630) • walletwars.online
          </div>
        </motion.div>
      </div>
    </div>
  );
}
