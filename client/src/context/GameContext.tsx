import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import type { Warrior } from '../types';
import { generateWarrior } from '../services/api';

interface GameContextState {
  warrior: Warrior | null;
  setWarrior: (warrior: Warrior | null) => void;
  isGenerating: boolean;
  generateCurrentWarrior: () => Promise<void>;
  error: string | null;
  clearError: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const GameContext = createContext<GameContextState | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { publicKey } = useSolanaWallet();
  const [warrior, setWarrior] = useState<Warrior | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const generateCurrentWarrior = useCallback(async () => {
    if (!publicKey) return;
    setIsGenerating(true);
    setError(null);
    try {
      const res = await generateWarrior(publicKey.toString());
      if (res.success && res.data) {
        setWarrior(res.data.warrior);
      }
    } catch (err: unknown) {
      const apiError = err as { error?: { message: string } };
      setError(apiError?.error?.message || 'Failed to generate warrior.');
    } finally {
      setIsGenerating(false);
    }
  }, [publicKey]);

  // Auto-load warrior when wallet connects
  useEffect(() => {
    if (publicKey && !warrior) {
      generateCurrentWarrior();
    }
    if (!publicKey) {
      setWarrior(null);
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
