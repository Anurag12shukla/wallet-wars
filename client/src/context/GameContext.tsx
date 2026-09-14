import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import type { Warrior } from '../types';
import { generateWarrior } from '../services/api';

interface GameContextState {
  warrior: Warrior | null;
  setWarrior: (warrior: Warrior | null) => void;
  isGenerating: boolean;
  generateCurrentWarrior: () => Promise<void>;
  generateForAccount: (account: string) => Promise<Warrior | null>;
  activeAccount: string | null;
  setActiveAccount: (acc: string | null) => void;
  error: string | null;
  clearError: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const GameContext = createContext<GameContextState | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { publicKey } = useSolanaWallet();
  const [activeAccount, setActiveAccountState] = useState<string | null>(() => {
    return localStorage.getItem('robinhood_active_account') || null;
  });
  const [warrior, setWarrior] = useState<Warrior | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const setActiveAccount = useCallback((acc: string | null) => {
    setActiveAccountState(acc);
    if (acc) {
      localStorage.setItem('robinhood_active_account', acc);
    } else {
      localStorage.removeItem('robinhood_active_account');
    }
  }, []);

  const generateForAccount = useCallback(async (account: string): Promise<Warrior | null> => {
    if (!account) return null;
    setIsGenerating(true);
    setError(null);
    try {
      const res = await generateWarrior(account.trim());
      if (res.success && res.data) {
        setWarrior(res.data.warrior);
        setActiveAccount(account.trim());
        return res.data.warrior;
      }
      return null;
    } catch (err: unknown) {
      const apiError = err as { error?: { message: string } };
      setError(apiError?.error?.message || 'Failed to generate warrior.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [setActiveAccount]);

  const generateCurrentWarrior = useCallback(async () => {
    const target = publicKey?.toString() || activeAccount;
    if (!target) return;
    await generateForAccount(target);
  }, [publicKey, activeAccount, generateForAccount]);

  // Auto-load warrior on mount if activeAccount or publicKey exists
  useEffect(() => {
    if (publicKey) {
      generateForAccount(publicKey.toString());
    } else if (activeAccount && !warrior) {
      generateForAccount(activeAccount);
    }
  }, [publicKey]);

  const clearError = useCallback(() => setError(null), []);
  const toggleSound = useCallback(() => setSoundEnabled(prev => !prev), []);

  return (
    <GameContext.Provider value={{
      warrior,
      setWarrior,
      isGenerating,
      generateCurrentWarrior,
      generateForAccount,
      activeAccount,
      setActiveAccount,
      error,
      clearError,
      soundEnabled,
      toggleSound,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
