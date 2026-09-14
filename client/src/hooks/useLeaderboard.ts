import { useState, useEffect } from 'react';
import type { LeaderboardEntry } from '../types';
import { getLeaderboard } from '../services/api';

export function useLeaderboard(category = 'overall', limit = 50) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getLeaderboard(category, limit)
      .then(res => {
        if (!cancelled && res.success && res.data) {
          setEntries(res.data.leaderboard);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load leaderboard.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [category, limit]);

  return { entries, loading, error };
}
