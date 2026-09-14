import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useEVMWallet } from '../context/EVMWalletContext';
import RobinhoodWalletButton from '../components/layout/RobinhoodWalletButton';
import { useGame } from '../context/GameContext';
import { useWarrior } from '../hooks/useWarrior';
import { useBattle } from '../hooks/useBattle';
import WarriorCard from '../components/warrior/WarriorCard';
import WarriorReveal from '../components/warrior/WarriorReveal';
import BattleScreen from '../components/battle/BattleScreen';
import { isValidRobinhoodOrWalletAddress, DEMO_WARRIORS } from '../utils';
import type { Warrior } from '../types';

type ArenaPhase = 'hub' | 'revealing' | 'opponent-select' | 'fighting' | 'result';

export default function ArenaPage() {
  const location = useLocation();
  const { account } = useEVMWallet();
  const { warrior: myWarrior, isGenerating } = useGame();
  const [phase, setPhase] = useState<ArenaPhase>('hub');
  const [opponentWallet, setOpponentWallet] = useState('');
  const [opponentWarrior, setOpponentWarrior] = useState<Warrior | null>(null);
  const [walletError, setWalletError] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [demoP1, setDemoP1] = useState(DEMO_WARRIORS.options[0]);
  const [demoP2, setDemoP2] = useState(DEMO_WARRIORS.options[1]);

  const { loading: opponentLoading, fetchOrGenerate } = useWarrior();
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
      setWalletError('INVALID TRADING HANDLE OR WALLET ADDRESS.');
      return;
    }

    const result = await fetchOrGenerate(opponentWallet);
    if (result?.warrior) {
      setOpponentWarrior(result.warrior);
    }
  };

  const handleStartBattle = async () => {
    const p1 = isDemo ? demoP1.wallet : (myWarrior?.walletAddress || account || '');
    const p2 = isDemo ? demoP2.wallet : opponentWarrior?.walletAddress;

    if (!p1 || !p2) return;

    setPhase('fighting');
    await startBattle(p1, p2);
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
        playerOneWallet={isDemo ? demoP1.wallet : account || ''}
        playerTwoWallet={isDemo ? demoP2.wallet : opponentWarrior?.walletAddress || ''}
      />
    );
  }

  return (
    <div className="min-h-screen py-12 bg-obsidian-deepest relative">
      {/* Ambient Halo Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300 text-xs font-mono mb-4">
            👑 THE GRAND COLISEUM
          </div>
          <h1 className="text-section text-white mb-2">THE <span className="gradient-gold">ARENA</span></h1>
          <p className="text-gray-400">Choose your challenger. Enter the battlefield for on-chain supremacy.</p>
        </motion.div>

        {/* Demo mode toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-2xl border border-gold-500/30 bg-obsidian-dark p-1.5 shadow-lg">
            <button
              onClick={() => setIsDemo(false)}
              className={`px-6 py-2.5 rounded-xl font-display text-sm tracking-wider transition-all font-bold ${
                !isDemo ? 'btn-primary text-black shadow-none' : 'text-gray-400 hover:text-white'
              }`}
            >
              ⚔️ WALLET BATTLE
            </button>
            <button
              onClick={() => setIsDemo(true)}
              className={`px-6 py-2.5 rounded-xl font-display text-sm tracking-wider transition-all font-bold ${
                isDemo ? 'btn-primary text-black shadow-none' : 'text-gray-400 hover:text-white'
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
            <div className="glass-card p-6 sm:p-8 mb-6 border-gold-500/30">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-pulse" />
                <span className="text-gold-400 font-mono text-xs font-bold">DEMO COMBAT — NO WALLET REQUIRED</span>
              </div>
              <p className="text-gray-300 text-sm mb-6">Select two demo warriors and watch the combat engine simulate the battle in real-time.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Player 1 */}
                <div>
                  <label className="text-xs font-display text-gold-400 mb-3 block tracking-widest uppercase font-bold">CHAMPION ONE</label>
                  <div className="space-y-2">
                    {DEMO_WARRIORS.options.slice(0, 4).map(w => {
                      return (
                        <button
                          key={w.wallet}
                          onClick={() => setDemoP1(w)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                            demoP1.wallet === w.wallet
                              ? 'border-gold-400 bg-gold-500/15 text-white shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                              : 'border-gold-500/20 text-gray-400 hover:border-gold-500/40 bg-black/40'
                          }`}
                        >
                          <span className="text-2xl">{w.emoji}</span>
                          <div>
                            <p className="text-xs font-display font-bold text-white">{w.name}</p>
                            <p className="text-[11px] font-mono text-gold-400/80">{w.archetype}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Player 2 */}
                <div>
                  <label className="text-xs font-display text-gold-400 mb-3 block tracking-widest uppercase font-bold">CHAMPION TWO</label>
                  <div className="space-y-2">
                    {DEMO_WARRIORS.options.slice(0, 4).map(w => {
                      return (
                        <button
                          key={w.wallet}
                          onClick={() => setDemoP2(w)}
                          disabled={w.wallet === demoP1.wallet}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                            demoP2.wallet === w.wallet
                              ? 'border-gold-400 bg-gold-500/15 text-white shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                              : w.wallet === demoP1.wallet
                              ? 'border-gold-500/10 text-gray-600 opacity-40 cursor-not-allowed bg-black/20'
                              : 'border-gold-500/20 text-gray-400 hover:border-gold-500/40 bg-black/40'
                          }`}
                        >
                          <span className="text-2xl">{w.emoji}</span>
                          <div>
                            <p className="text-xs font-display font-bold text-white">{w.name}</p>
                            <p className="text-[11px] font-mono text-gold-400/80">{w.archetype}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* VS banner */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 p-4 glass-card text-center border-gold-500/30">
                <span className="text-3xl">{demoP1.emoji}</span>
                <p className="font-display text-sm text-white font-bold mt-1">{demoP1.name}</p>
              </div>
              <div className="font-display text-3xl sm:text-4xl gradient-gold font-extrabold px-3">VS</div>
              <div className="flex-1 p-4 glass-card text-center border-gold-500/30">
                <span className="text-3xl">{demoP2.emoji}</span>
                <p className="font-display text-sm text-white font-bold mt-1">{demoP2.name}</p>
              </div>
            </div>

            <motion.button
              onClick={handleDemoBattle}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
              <h2 className="font-display text-xs text-gold-400 tracking-widest mb-4 uppercase font-bold">YOUR GLADIATOR</h2>
              {!myWarrior && !account ? (
                <div className="bg-obsidian-card border border-gold-500/30 rounded-2xl p-8 text-center shadow-2xl">
                  <p className="text-5xl mb-4">👑</p>
                  <p className="text-white font-display text-xl font-bold mb-2">LINK YOUR GLADIATOR</p>
                  <p className="text-gray-300 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                    Connect your Web3 EVM wallet or link your Robinhood trading handle to generate your fighter.
                  </p>
                  <div className="flex justify-center">
                    <RobinhoodWalletButton />
                  </div>
                </div>
              ) : isGenerating ? (
                <div className="bg-obsidian-card border border-gold-500/30 rounded-2xl p-8 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="font-display text-gold-400 font-bold tracking-wider animate-pulse">SYNTHESIZING GLADIATOR...</p>
                </div>
              ) : myWarrior ? (
                <WarriorCard warrior={myWarrior} showStats={true} glowing />
              ) : (
                <div className="bg-obsidian-card border border-gold-500/20 rounded-2xl p-8 text-center">
                  <p className="text-gray-400">Gladiator profile not found.</p>
                </div>
              )}
            </div>

            {/* Right: Opponent */}
            <div>
              <h2 className="font-display text-xs text-gold-400 tracking-widest mb-4 uppercase font-bold">ARENA OPPONENT</h2>

              {/* Search input */}
              <div className="bg-obsidian-card border border-gold-500/30 rounded-2xl p-4 mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={opponentWallet}
                    onChange={e => { setOpponentWallet(e.target.value); setWalletError(''); }}
                    placeholder="ENTER HANDLE OR WALLET ADDRESS..."
                    className="flex-1 bg-black/70 border border-gold-500/30 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-gold-400 placeholder-gray-500 transition-colors shadow-inner"
                    onKeyDown={e => e.key === 'Enter' && handleOpponentSearch()}
                    id="opponent-wallet-input"
                  />
                  <button
                    onClick={handleOpponentSearch}
                    disabled={opponentLoading}
                    className="px-6 py-3 rounded-xl btn-primary text-xs"
                  >
                    {opponentLoading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                    ) : 'SCAN'}
                  </button>
                </div>
                {walletError && (
                  <p className="text-crimson text-xs font-mono mt-2">{walletError}</p>
                )}
              </div>

              {/* Quick select demo opponents */}
              {!opponentWarrior && (
                <div className="mb-4">
                  <p className="text-[11px] text-gold-400/80 font-mono mb-2">QUICK SELECT RIVALS:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {DEMO_WARRIORS.options.slice(0, 4).map(w => {
                      return (
                        <button
                          key={w.wallet}
                          onClick={() => { setOpponentWallet(w.wallet); setOpponentWarrior(null); }}
                          className="text-left p-2.5 rounded-xl border border-gold-500/20 hover:border-gold-400 hover:bg-gold-500/10 transition-all text-sm flex items-center gap-2 bg-black/40"
                        >
                          <span>{w.emoji}</span>
                          <span className="text-gray-300 truncate text-xs font-semibold">{w.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {opponentWarrior ? (
                <WarriorCard warrior={opponentWarrior} showStats glowing />
              ) : (
                <div className="glass-card p-8 text-center border-dashed border-gold-500/20">
                  <p className="text-4xl mb-3">🎯</p>
                  <p className="text-gray-400 text-sm">Search for an opponent or select a rival gladiator above.</p>
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
            className="mt-10 text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
              <span className="font-display text-4xl gradient-gold font-extrabold">VS</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
            </div>
            <motion.button
              onClick={handleStartBattle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-xl px-14 py-5"
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
