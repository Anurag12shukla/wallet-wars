import { useState, useCallback } from 'react';
import type { BattleResult } from '../types';
import { createBattle } from '../services/api';

export function useBattle() {
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startBattle = useCallback(async (p1Wallet: string, p2Wallet: string) => {
    setLoading(true);
    setError(null);
    setBattleResult(null);
    try {
      const res = await createBattle(p1Wallet, p2Wallet);
      if (res.success && res.data) {
        setBattleResult(res.data);
        return res.data;
      }
      return null;
    } catch (err: unknown) {
      const apiError = err as { error?: { message: string } };
      setError(apiError?.error?.message || 'Battle failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setBattleResult(null);
    setError(null);
  }, []);

  return { battleResult, loading, error, startBattle, reset };
}
