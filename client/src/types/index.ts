// Warrior Types
export type Rarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
export type Archetype =
  | 'OPTIONS_DEGEN' | 'ROBINHOOD_WHALE' | 'DIAMOND_HANDS' | 'DOGE_KING'
  | 'INDEX_MAXI' | 'MARGIN_SURVIVOR' | 'ROBINHOOD_GOLD' | 'DAY_TRADER'
  | 'PAPER_HANDS' | 'ALGO_QUANT'
  | 'DEGEN' | 'WHALE' | 'NFT_HUNTER' | 'DEFI_MAGE' | 'MEME_LORD' | 'RUG_SURVIVOR'
  | 'SOLANA_SAMURAI' | 'ON_CHAIN_ORACLE' | 'SHADOW_TRADER' | 'SPEED_DEMON';

export interface WalletAnalysis {
  walletAge: number;
  transactionCount: number;
  transactionFrequency: number;
  tokenActivity: number;
  nftActivity: number;
  defiActivity: number;
  tradingActivity: number;
  holdingScore: number;
  riskScore: number;
  activityScore: number;
  calculatedAt: string;
}

export interface Warrior {
  _id: string;
  walletAddress: string;
  name: string;
  archetype: Archetype;
  level: number;
  xp: number;
  rarity: Rarity;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  luck: number;
  intelligence: number;
  risk: number;
  power: number;
  wins: number;
  losses: number;
  winStreak: number;
  bestWinStreak: number;
  personality: string[];
  walletAnalysis: WalletAnalysis;
  achievements: string[];
  isDemo: boolean;
  winRate?: number;
  xpForNextLevel?: number;
  createdAt: string;
  updatedAt: string;
}

// Battle Types
export type RoundAction = 'ATTACK' | 'CRITICAL_HIT' | 'DODGE' | 'COUNTER' | 'BLOCK' | 'SPECIAL_ATTACK';

export interface BattleRound {
  roundNumber: number;
  action: RoundAction;
  attacker: 'playerOne' | 'playerTwo';
  damage: number;
  playerOneHp: number;
  playerTwoHp: number;
  description: string;
  isCritical: boolean;
  isDodge: boolean;
  isSpecial: boolean;
}

export interface Battle {
  _id: string;
  battleId: string;
  playerOneWallet: string;
  playerTwoWallet: string;
  playerOneWarrior: Warrior;
  playerTwoWarrior: Warrior;
  winner: string;
  loser: string;
  rounds: BattleRound[];
  battleLog: string[];
  playerOneScore: number;
  playerTwoScore: number;
  playerOneDamageDealt: number;
  playerTwoDamageDealt: number;
  playerOneCriticalHits: number;
  playerTwoCriticalHits: number;
  duration: number;
  isDemo: boolean;
  createdAt: string;
}

export interface BattleResult {
  battleId: string;
  winner: string;
  loser: string;
  winnerPlayer?: 'playerOne' | 'playerTwo';
  rounds: BattleRound[];
  battleLog: string[];
  playerOneScore: number;
  playerTwoScore: number;
  playerOneDamageDealt: number;
  playerTwoDamageDealt: number;
  playerOneCriticalHits: number;
  playerTwoCriticalHits: number;
  xpAwarded: { playerOne: number; playerTwo: number };
  achievementsUnlocked: string[];
  playerOneWarrior: Warrior;
  playerTwoWarrior: Warrior;
}

// Achievement Types
export interface Achievement {
  achievementId: string;
  name: string;
  description: string;
  icon: string;
  rarity: Rarity;
  xpReward: number;
  category: string;
  requirements: {
    type: string;
    value: number;
    description: string;
  };
  unlocked?: boolean;
  unlockedAt?: string;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  name: string;
  archetype: Archetype;
  level: number;
  xp: number;
  wins: number;
  losses: number;
  winStreak: number;
  bestWinStreak: number;
  rarity: Rarity;
  power: number;
  winRate: number;
  isDemo: boolean;
}

// Daily Challenge Types
export interface DailyChallenge {
  _id: string;
  date: string;
  type: string;
  title: string;
  description: string;
  requirement: { type: string; value: number };
  xpReward: number;
}

export interface ChallengeProgress {
  walletAddress: string;
  date: string;
  challengeType: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// App Stats
export interface AppStats {
  totalWarriors: number;
  totalBattles: number;
  topWarrior?: Partial<Warrior>;
}
