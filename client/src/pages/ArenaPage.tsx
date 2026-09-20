import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEVMWallet } from '../context/EVMWalletContext';
import RobinhoodWalletButton from '../components/layout/RobinhoodWalletButton';
import { useGame } from '../context/GameContext';
import { useWarrior } from '../hooks/useWarrior';
import { useBattle } from '../hooks/useBattle';
import WarriorCard from '../components/warrior/WarriorCard';
import WarriorReveal from '../components/warrior/WarriorReveal';
import BattleScreen from '../components/battle/BattleScreen';
import { isValidRobinhoodOrWalletAddress } from '../utils';
import type { Warrior } from '../types';

type ArenaPhase = 'hub' | 'revealing' | 'opponent-select' | 'fighting' | 'result';

export default function ArenaPage() {
  const { account } = useEVMWallet();
  const { warrior: myWarrior, isGenerating } = useGame();
  const [phase, setPhase] = useState<ArenaPhase>('hub');
  const [opponentWallet, setOpponentWallet] = useState('');
  const [opponentWarrior, setOpponentWarrior] = useState<Warrior | null>(null);
  const [walletError, setWalletError] = useState('');

  const { loading: opponentLoading, fetchOrGenerate } = useWarrior();
  const { battleResult, loading: battleLoading, error: battleError, startBattle, reset: resetBattle } = useBattle();

  // When wallet connects, show reveal if no warrior yet
  useEffect(() => {
    if (account && !myWarrior && !isGenerating) {
      setPhase('revealing');
    }
  }, [account, myWarrior, isGenerating]);

  const handleOpponentSearch = async () => {
    if (!opponentWallet.trim()) return;
    setWalletError('');

    if (!isValidRobinhoodOrWalletAddress(opponentWallet.trim())) {
      setWalletError('INVALID TRADING HANDLE OR WALLET ADDRESS.');
      return;
    }

    const result = await fetchOrGenerate(opponentWallet.trim());
    if (result?.warrior) {
      setOpponentWarrior(result.warrior);
    }
  };

  const handleStartBattle = async () => {
    const p1 = myWarrior?.walletAddress || account || '';
    const p2 = opponentWarrior?.walletAddress || opponentWallet.trim();

    if (!p1 || !p2) return;

    setPhase('fighting');
    await startBattle(p1, p2);
  };

  const handleRematch = async () => {
    resetBattle();
    await handleStartBattle();
  };

  const handleNewChallenge = () => {
    resetBattle();
    setOpponentWarrior(null);
    setOpponentWallet('');
    setPhase('hub');
  };

  if (phase === 'revealing') {
    return (
      <WarriorReveal
        onComplete={() => setPhase('opponent-select')}
      />
    );
  }

  if (phase === 'fighting' || battleResult) {
    return (
      <BattleScreen
        battleResult={battleResult}
        loading={battleLoading}
        error={battleError}
        onRematch={handleRematch}
        onNewChallenge={handleNewChallenge}
        playerOneWallet={myWarrior?.walletAddress || account || ''}
        playerTwoWallet={opponentWarrior?.walletAddress || opponentWallet || ''}
      />
    );
  }

  return (
    <div className="min-h-screen py-12 bg-[#F7F8F5] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-stone-200 bg-white text-slate-700 text-xs font-mono font-semibold mb-3 shadow-soft-xs">
            👑 ROBINHOOD CHAIN ARENA
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight mb-2">
            The Battle Arena
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
            Choose your challenger. Enter the battlefield for on-chain supremacy.
          </p>
        </motion.div>

        {/* WALLET / ROBINHOOD BATTLE ARENA */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: My Warrior */}
          <div>
            <h2 className="font-display text-xs text-slate-500 tracking-widest mb-4 uppercase font-bold">YOUR GLADIATOR</h2>
            {!myWarrior && !account ? (
              <div className="bg-white border border-stone-200 rounded-3xl p-8 text-center shadow-soft-sm">
                <p className="text-5xl mb-4">👑</p>
                <p className="text-slate-900 font-display text-xl font-bold mb-2">LINK YOUR GLADIATOR</p>
                <p className="text-slate-600 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                  Connect your Web3 EVM wallet or link your Robinhood trading handle to generate your fighter.
                </p>
                <div className="flex justify-center">
                  <RobinhoodWalletButton />
                </div>
              </div>
            ) : isGenerating ? (
              <div className="bg-white border border-stone-200 rounded-3xl p-8 text-center shadow-soft-sm">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="font-display text-slate-800 font-bold tracking-wider">SYNTHESIZING GLADIATOR...</p>
              </div>
            ) : myWarrior ? (
              <WarriorCard warrior={myWarrior} showStats={true} glowing />
            ) : (
              <div className="bg-white border border-stone-200 rounded-3xl p-8 text-center shadow-soft-sm">
                <p className="text-slate-500 text-sm">Gladiator profile not found.</p>
              </div>
            )}
          </div>

          {/* Right: Opponent */}
          <div>
            <h2 className="font-display text-xs text-slate-500 tracking-widest mb-4 uppercase font-bold">ARENA OPPONENT</h2>

            {/* Search input */}
            <div className="bg-white border border-stone-200 rounded-2xl p-3.5 mb-4 shadow-soft-xs">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={opponentWallet}
                  onChange={e => { setOpponentWallet(e.target.value); setWalletError(''); }}
                  placeholder="ENTER HANDLE OR 0X ADDRESS..."
                  className="flex-1 bg-slate-50 border border-stone-200 rounded-xl px-4 py-2.5 text-slate-900 font-mono text-sm focus:outline-none focus:border-slate-400 placeholder-slate-400 transition-colors"
                  onKeyDown={e => e.key === 'Enter' && handleOpponentSearch()}
                  id="opponent-wallet-input"
                />
                <button
                  onClick={handleOpponentSearch}
                  disabled={opponentLoading}
                  className="px-5 py-2.5 rounded-xl btn-primary text-xs"
                >
                  {opponentLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : 'SCAN'}
                </button>
              </div>
              {walletError && (
                <p className="text-rose-600 text-xs font-mono mt-2">{walletError}</p>
              )}
            </div>

            {opponentWarrior ? (
              <WarriorCard warrior={opponentWarrior} showStats glowing />
            ) : (
              <div className="p-12 text-center border border-dashed border-stone-300 rounded-3xl bg-white/50">
                <p className="text-4xl mb-3">🎯</p>
                <p className="text-slate-700 font-semibold text-sm mb-1">Challenge a Rival Gladiator</p>
                <p className="text-slate-500 text-xs max-w-xs mx-auto">
                  Enter any Robinhood trading handle or EVM wallet address above to summon and battle them.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Battle button */}
        {myWarrior && opponentWarrior && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px flex-1 bg-stone-200" />
              <span className="font-display text-3xl font-extrabold text-amber-600">VS</span>
              <div className="h-px flex-1 bg-stone-200" />
            </div>
            <motion.button
              onClick={handleStartBattle}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary text-lg px-12 py-4 shadow-soft-sm"
              disabled={battleLoading}
            >
              ⚔️ INITIATE BATTLE
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
