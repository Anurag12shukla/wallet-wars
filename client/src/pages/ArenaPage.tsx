import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEVMWallet } from '../context/EVMWalletContext';
import RobinhoodWalletButton from '../components/layout/RobinhoodWalletButton';
import { useGame } from '../context/GameContext';
import { useWarrior } from '../hooks/useWarrior';
import { useBattle } from '../hooks/useBattle';
import WarriorCard from '../components/warrior/WarriorCard';
import WarriorReveal from '../components/warrior/WarriorReveal';
import BattleScreen from '../components/battle/BattleScreen';
import { isValidRobinhoodOrWalletAddress, DEMO_WARRIORS, getArchetypeMeta } from '../utils';
import type { Warrior, BattleResult } from '../types';

type ArenaPhase = 'hub' | 'revealing' | 'opponent-select' | 'fighting' | 'result';

export default function ArenaPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { account } = useEVMWallet();
  const { warrior: myWarrior, isGenerating } = useGame();
  const [phase, setPhase] = useState<ArenaPhase>('hub');
  const [opponentWallet, setOpponentWallet] = useState('');
  const [opponentWarrior, setOpponentWarrior] = useState<Warrior | null>(null);
  const [walletError, setWalletError] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [demoP1, setDemoP1] = useState(DEMO_WARRIORS.options[0]);
  const [demoP2, setDemoP2] = useState(DEMO_WARRIORS.options[1]);

  const { warrior: opponentData, loading: opponentLoading, fetchOrGenerate } = useWarrior();
  const { battleResult, loading: battleLoading, error: battleError, startBattle, reset: resetBattle } = useBattle();

  // Check if demo mode was requested
  useEffect(() => {
    if (location.state?.demo) {
      setIsDemo(true);
      setPhase('opponent-select');
    }
  }, [location.state]);

  // When wallet connects, show reveal if no warrior yet
  useEffect(() => {
    if (account && !myWarrior && !isGenerating) {
      setPhase('revealing');
    } else if (account && myWarrior && phase === 'hub') {
      // do nothing, let user choose opponent
    }
  }, [account, myWarrior, isGenerating]);

  const handleOpponentSearch = async () => {
    if (!opponentWallet) return;
    setWalletError('');

    if (!isValidRobinhoodOrWalletAddress(opponentWallet) && !opponentWallet.startsWith('demo_')) {
      setWalletError('INVALID ROBINHOOD WALLET OR HANDLE.');
      return;
    }

    const result = await fetchOrGenerate(opponentWallet);
    if (result?.warrior) {
      setOpponentWarrior(result.warrior);
    }
  };

  const handleStartBattle = async () => {
    const p1 = isDemo ? demoP1.wallet : (myWarrior?.walletAddress || publicKey?.toString());
    const p2 = isDemo ? demoP2.wallet : opponentWarrior?.walletAddress;

    if (!p1 || !p2) return;

    setPhase('fighting');
    const result = await startBattle(p1, p2);
    if (result) {
      // result is shown in BattleScreen
    }
  };

  const handleDemoBattle = async () => {
    setPhase('fighting');
    await startBattle(demoP1.wallet, demoP2.wallet);
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
        isDemo={isDemo}
        onRematch={handleRematch}
        onNewChallenge={handleNewChallenge}
        playerOneWallet={isDemo ? demoP1.wallet : publicKey?.toString() || ''}
        playerTwoWallet={isDemo ? demoP2.wallet : opponentWarrior?.walletAddress || ''}
      />
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-section text-white mb-2">THE <span className="gradient-text">ARENA</span></h1>
          <p className="text-gray-400">Choose your opponent. Enter the battlefield.</p>
        </motion.div>

        {/* Demo mode toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-brand-border overflow-hidden">
            <button
              onClick={() => setIsDemo(false)}
              className={`px-6 py-2 font-display text-sm tracking-wider transition-all ${
                !isDemo ? 'bg-brand-purple text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              WALLET BATTLE
            </button>
            <button
              onClick={() => setIsDemo(true)}
              className={`px-6 py-2 font-display text-sm tracking-wider transition-all ${
                isDemo ? 'bg-brand-cyan text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              🎮 DEMO MODE
            </button>
          </div>
        </div>

        {isDemo ? (
          /* DEMO MODE */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="glass-card p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-yellow-400 font-mono text-xs">DEMO MODE — NO WALLET REQUIRED</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">Select two demo warriors and watch them battle.</p>

              <div className="grid grid-cols-2 gap-6">
                {/* Player 1 */}
                <div>
                  <label className="text-xs font-display text-gray-400 mb-3 block tracking-wider">PLAYER ONE</label>
                  <div className="space-y-2">
                    {DEMO_WARRIORS.options.slice(0, 4).map(w => {
                      const meta = getArchetypeMeta(w.archetype);
                      return (
                        <button
                          key={w.wallet}
                          onClick={() => setDemoP1(w)}
                          className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-2 ${
                            demoP1.wallet === w.wallet
                              ? 'border-brand-purple bg-brand-purple/10 text-white'
                              : 'border-brand-border text-gray-400 hover:border-gray-500'
                          }`}
                        >
                          <span>{w.emoji}</span>
                          <div>
                            <p className="text-xs font-display">{w.name}</p>
                            <p className="text-xs text-gray-600">{w.archetype}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Player 2 */}
                <div>
                  <label className="text-xs font-display text-gray-400 mb-3 block tracking-wider">PLAYER TWO</label>
                  <div className="space-y-2">
                    {DEMO_WARRIORS.options.slice(0, 4).map(w => {
                      const meta = getArchetypeMeta(w.archetype);
                      return (
                        <button
                          key={w.wallet}
                          onClick={() => setDemoP2(w)}
                          disabled={w.wallet === demoP1.wallet}
                          className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-2 ${
                            demoP2.wallet === w.wallet
                              ? 'border-brand-cyan bg-brand-cyan/10 text-white'
                              : w.wallet === demoP1.wallet
                              ? 'border-brand-border text-gray-600 opacity-40 cursor-not-allowed'
                              : 'border-brand-border text-gray-400 hover:border-gray-500'
                          }`}
                        >
                          <span>{w.emoji}</span>
                          <div>
                            <p className="text-xs font-display">{w.name}</p>
                            <p className="text-xs text-gray-600">{w.archetype}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* VS banner */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 p-3 glass-card text-center">
                <span className="text-2xl">{demoP1.emoji}</span>
                <p className="font-display text-sm text-white mt-1">{demoP1.name}</p>
              </div>
              <div className="font-display text-3xl gradient-text">VS</div>
              <div className="flex-1 p-3 glass-card text-center">
                <span className="text-2xl">{demoP2.emoji}</span>
                <p className="font-display text-sm text-white mt-1">{demoP2.name}</p>
              </div>
            </div>

            <motion.button
              onClick={handleDemoBattle}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary w-full py-4 text-xl justify-center"
              disabled={demoP1.wallet === demoP2.wallet}
            >
              ⚔️ START DEMO BATTLE
            </motion.button>
          </motion.div>
        ) : (
          /* WALLET / ROBINHOOD BATTLE MODE */
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: My Warrior */}
            <div>
              <h2 className="font-display text-sm text-gray-400 tracking-widest mb-4">YOUR GLADIATOR</h2>
              {!myWarrior && !account ? (
                <div className="bg-robinhood-card border border-robinhood-border rounded-2xl p-8 text-center shadow-lg">
                  <p className="text-4xl mb-4">🏹</p>
                  <p className="text-white font-display text-lg mb-2">LINK YOUR ROBINHOOD PROFILE</p>
                  <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
                    Connect your EVM wallet or link your Robinhood trading handle to generate your combat gladiator on Robinhood Testnet.
                  </p>
                  <div className="flex justify-center">
                    <RobinhoodWalletButton />
                  </div>
                </div>
              ) : isGenerating ? (
                <div className="bg-robinhood-card border border-robinhood-border rounded-2xl p-8 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-2 border-robinhood-green border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="font-display text-robinhood-green animate-pulse">SYNTHESIZING GLADIATOR...</p>
                </div>
              ) : myWarrior ? (
                <WarriorCard warrior={myWarrior} showStats={true} glowing />
              ) : (
                <div className="bg-robinhood-card border border-robinhood-border rounded-2xl p-8 text-center">
                  <p className="text-gray-400">Gladiator profile not found.</p>
                </div>
              )}
            </div>

            {/* Right: Opponent */}
            <div>
              <h2 className="font-display text-sm text-gray-400 tracking-widest mb-4">ARENA OPPONENT</h2>

              {/* Search input */}
              <div className="bg-robinhood-card border border-robinhood-border rounded-2xl p-4 mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={opponentWallet}
                    onChange={e => { setOpponentWallet(e.target.value); setWalletError(''); }}
                    placeholder="ENTER ROBINHOOD HANDLE OR WALLET..."
                    className="flex-1 bg-black/60 border border-robinhood-border rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-robinhood-green placeholder-gray-500 transition-colors"
                    onKeyDown={e => e.key === 'Enter' && handleOpponentSearch()}
                    id="opponent-wallet-input"
                  />
                  <button
                    onClick={handleOpponentSearch}
                    disabled={opponentLoading}
                    className="px-5 py-3 rounded-lg bg-robinhood-green text-black font-display font-bold text-sm tracking-wider hover:bg-robinhood-green-light transition-all shadow-[0_0_12px_rgba(0,200,5,0.25)]"
                  >
                    {opponentLoading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                    ) : 'SCAN'}
                  </button>
                </div>
                {walletError && (
                  <p className="text-robinhood-red text-xs font-mono mt-2">{walletError}</p>
                )}
              </div>

              {/* Quick select demo opponents */}
              {!opponentWarrior && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 font-mono mb-2">QUICK SELECT:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {DEMO_WARRIORS.options.slice(0, 4).map(w => {
                      const meta = getArchetypeMeta(w.archetype);
                      return (
                        <button
                          key={w.wallet}
                          onClick={() => { setOpponentWallet(w.wallet); setOpponentWarrior(null); }}
                          className="text-left p-2 rounded-lg border border-brand-border hover:border-brand-purple/40 transition-all text-sm flex items-center gap-2"
                        >
                          <span>{w.emoji}</span>
                          <span className="text-gray-300 truncate text-xs">{w.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {opponentWarrior ? (
                <WarriorCard warrior={opponentWarrior} showStats glowing />
              ) : (
                <div className="glass-card p-8 text-center border-dashed">
                  <p className="text-4xl mb-3">🎯</p>
                  <p className="text-gray-400 text-sm">Search for an opponent or select a demo warrior above.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Battle button (wallet mode) */}
        {!isDemo && myWarrior && opponentWarrior && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-brand-purple/40" />
              <span className="font-display text-4xl gradient-text">VS</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-brand-purple/40" />
            </div>
            <motion.button
              onClick={handleStartBattle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-xl px-12 py-5"
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
