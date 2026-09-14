import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBattleShare } from '../services/api';
import { getArchetypeMeta, shortenAddress } from '../utils';
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

  if (loading) return <LoadingScreen message="LOADING BATTLE..." />;

  if (!battle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <p className="text-white font-display text-xl mb-4">BATTLE NOT FOUND</p>
          <Link to="/arena" className="btn-primary">ENTER THE ARENA</Link>
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          {/* Share card */}
          <div className="glass-card p-8 text-center mb-6 glow-purple">
            <div className="mb-4">
              <p className="text-xs font-mono text-brand-purple tracking-widest mb-2">WALLET WARS BATTLE</p>
              <p className="text-xs text-gray-500 font-mono">#{battleId?.slice(0, 8)}</p>
            </div>

            <div className="flex items-center justify-around mb-6">
              <div className={p1Won ? '' : 'opacity-50'}>
                <div className="text-5xl mb-2">{p1Meta?.emoji}</div>
                <p className="font-display text-sm text-white">{p1?.name || 'WARRIOR'}</p>
                {p1Won && <p className="text-xs text-green-400 mt-1">🏆 WINNER</p>}
              </div>
              <div>
                <p className="font-display text-3xl gradient-text">VS</p>
                <p className="text-xs text-gray-500 mt-1">{battle.rounds} ROUNDS</p>
              </div>
              <div className={!p1Won ? '' : 'opacity-50'}>
                <div className="text-5xl mb-2">{p2Meta?.emoji}</div>
                <p className="font-display text-sm text-white">{p2?.name || 'WARRIOR'}</p>
                {!p1Won && <p className="text-xs text-green-400 mt-1">🏆 WINNER</p>}
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-6">
              Your Solana wallet is your warrior. Join the arena.
            </p>

            <div className="flex flex-col gap-3">
              <Link to="/arena" className="btn-primary justify-center py-3">
                ⚔️ ENTER THE ARENA
              </Link>
              <Link to={`/battles/${battleId}`} className="btn-secondary justify-center py-3">
                VIEW FULL BATTLE
              </Link>
            </div>
          </div>

          <div className="text-center text-gray-600 text-xs font-mono">
            Built on Solana · wallet-wars.io
          </div>
        </motion.div>
      </div>
    </div>
  );
}
