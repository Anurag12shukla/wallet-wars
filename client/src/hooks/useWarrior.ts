import { useState, useCallback } from 'react';
import type { Warrior } from '../types';
import { getWarrior, generateWarrior } from '../services/api';

export function useWarrior(initialWallet?: string) {
  const [warrior, setWarrior] = useState<Warrior | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWarrior = useCallback(async (wallet: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWarrior(wallet);
      if (res.success && res.data) {
        setWarrior(res.data);
        return res.data;
      }
      return null;
    } catch (err: unknown) {
      const apiError = err as { error?: { message: string } };
      setError(apiError?.error?.message || 'Warrior not found.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrGenerate = useCallback(async (wallet: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await generateWarrior(wallet);
      if (res.success && res.data) {
        setWarrior(res.data.warrior);
        return res.data;
      }
      return null;
    } catch (err: unknown) {
      const apiError = err as { error?: { message: string } };
      setError(apiError?.error?.message || 'Failed to generate warrior.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { warrior, setWarrior, loading, error, fetchWarrior, fetchOrGenerate };
}
