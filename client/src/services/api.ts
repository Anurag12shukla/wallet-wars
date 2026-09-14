import axios from 'axios';
import type {
  ApiResponse, Warrior, BattleResult, Battle, LeaderboardEntry,
  Achievement, DailyChallenge, ChallengeProgress, AppStats
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ success: false, error: { code: 'NETWORK_ERROR', message: 'Network error. Check your connection.' } });
  }
);

// Wallet API
export const analyzeWallet = async (walletAddress: string): Promise<ApiResponse<unknown>> => {
  const res = await api.post('/wallet/analyze', { walletAddress });
  return res.data;
};

// Warrior API
export const getWarrior = async (wallet: string): Promise<ApiResponse<Warrior>> => {
  const res = await api.get(`/warriors/${wallet}`);
  return res.data;
};

export const generateWarrior = async (walletAddress: string): Promise<ApiResponse<{ warrior: Warrior; isNew: boolean }>> => {
  const res = await api.post('/warriors/generate', { walletAddress });
  return res.data;
};

// Battle API
export const createBattle = async (
  playerOneWallet: string,
  playerTwoWallet: string
): Promise<ApiResponse<BattleResult>> => {
  const res = await api.post('/battles', { playerOneWallet, playerTwoWallet });
  return res.data;
};

export const getBattle = async (battleId: string): Promise<ApiResponse<Battle>> => {
  const res = await api.get(`/battles/${battleId}`);
  return res.data;
};

export const getBattleShare = async (battleId: string): Promise<ApiResponse<Partial<Battle>>> => {
  const res = await api.get(`/battles/${battleId}/share`);
  return res.data;
};

// Leaderboard API
export const getLeaderboard = async (category = 'overall', limit = 50): Promise<ApiResponse<{ leaderboard: LeaderboardEntry[] }>> => {
  const res = await api.get(`/leaderboard?category=${category}&limit=${limit}`);
  return res.data;
};

// Achievements API
export const getAchievements = async (wallet?: string): Promise<ApiResponse<Achievement[]>> => {
  const url = wallet ? `/achievements?wallet=${wallet}` : '/achievements';
  const res = await api.get(url);
  return res.data;
};

// Daily Challenge API
export const getDailyChallenge = async (wallet?: string): Promise<ApiResponse<{ challenge: DailyChallenge; progress: ChallengeProgress | null }>> => {
  const url = wallet ? `/daily-challenge?wallet=${wallet}` : '/daily-challenge';
  const res = await api.get(url);
  return res.data;
};

export const updateChallengeProgress = async (walletAddress: string, progressAmount = 1): Promise<ApiResponse<unknown>> => {
  const res = await api.post('/daily-challenge/progress', { walletAddress, progressAmount });
  return res.data;
};

// Stats API
export const getStats = async (): Promise<ApiResponse<AppStats>> => {
  const res = await api.get('/stats');
  return res.data;
};

// Health check
export const checkHealth = async (): Promise<boolean> => {
  try {
    await api.get('/health');
    return true;
  } catch {
    return false;
  }
};

export default api;
