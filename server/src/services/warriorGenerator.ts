import { WalletAnalysisResult, deterministicHash } from './walletAnalysis';
import { IWarrior } from '../models/Warrior';

export interface ArchetypeDefinition {
  id: string;
  name: string;
  description: string;
  ability: string;
  color: string;
  statModifiers: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    luck: number;
    intelligence: number;
    risk: number;
  };
  personality: string[];
  namePrefixes: string[];
  nameSuffixes: string[];
}

export const ARCHETYPES: Record<string, ArchetypeDefinition> = {
  OPTIONS_DEGEN: {
    id: 'OPTIONS_DEGEN',
    name: '0DTE OPTIONS DEGEN',
    description: 'Trades 0DTE out-of-the-money calls on margin. Pure adrenaline and unpredictable gamma spikes.',
    ability: 'GAMMA SQUEEZE — Unleashes 3 explosive critical strikes with wild volatility multipliers.',
    color: '#00C805',
    statModifiers: { hp: -10, attack: 25, defense: -15, speed: 25, luck: 20, intelligence: -5, risk: 35 },
    personality: ['CHAOTIC', 'GAMMA ADDICT', '0DTE BELIEVER', 'LEVERAGED TO THE HILT'],
    namePrefixes: ['0DTE', 'GAMMA', 'CALL', 'VOLATILITY', 'FOMO'],
    nameSuffixes: ['DEGEN', 'SQUEEZE', 'APE', 'REAPER', 'TITAN'],
  },
  ROBINHOOD_WHALE: {
    id: 'ROBINHOOD_WHALE',
    name: 'ROBINHOOD WHALE',
    description: 'Seven-figure portfolio with massive buying power. Moves the order book with single market buys.',
    ability: 'MARKET IMPACT — Crushes opponent attack by 35% for 2 rounds with sheer liquidity shockwaves.',
    color: '#0077b6',
    statModifiers: { hp: 35, attack: 20, defense: 20, speed: -15, luck: -5, intelligence: 15, risk: -10 },
    personality: ['DOMINANT', 'UNLIMITED BUYING POWER', 'CALCULATED', 'ORDER BOOK CRUSHER'],
    namePrefixes: ['THE', 'MEGA', 'TITAN', 'CAPITAL', 'GOLD'],
    nameSuffixes: ['WHALE', 'LEVIATHAN', 'BARON', 'BILLIONAIRE'],
  },
  DIAMOND_HANDS: {
    id: 'DIAMOND_HANDS',
    name: 'DIAMOND HANDS',
    description: 'Held through every crash, circuit breaker, and bear market. Conviction is unbreakable steel.',
    ability: 'HODL SHIELD — Blocks all incoming damage for one turn and regenerates 25 HP.',
    color: '#00e006',
    statModifiers: { hp: 25, attack: -5, defense: 35, speed: -10, luck: 5, intelligence: 10, risk: -20 },
    personality: ['UNSHAKEABLE', 'NEVER SELLS', 'ZEN', 'INDESTRUCTIBLE'],
    namePrefixes: ['DIAMOND', 'IRON', 'ETERNAL', 'CONVICTION'],
    nameSuffixes: ['HANDS', 'GUARDIAN', 'SENTINEL', 'TITAN'],
  },
  DOGE_KING: {
    id: 'DOGE_KING',
    name: 'DOGE / MEME KING',
    description: 'Rides Robinhood crypto to the moon. Much wow, absurd luck, infinite momentum vibes.',
    ability: 'TO THE MOON — Unhinged attack dealing between 20% to 250% damage.',
    color: '#ffdf00',
    statModifiers: { hp: -5, attack: 10, defense: -10, speed: 15, luck: 45, intelligence: -15, risk: 30 },
    personality: ['MUCH WOW', 'UNHINGED', 'VIBES ONLY', 'MOON BOUND'],
    namePrefixes: ['DOGE', 'SHIB', 'MEME', 'BASED', 'MOON'],
    nameSuffixes: ['KING', 'LORD', 'PUPPER', 'TITAN', 'GOD'],
  },
  INDEX_MAXI: {
    id: 'INDEX_MAXI',
    name: 'INDEX MAXI (BOGLEHEAD)',
    description: 'Buys $SPY & $VOO every single week. Unshakable compounding mathematical engine.',
    ability: 'COMPOUND INTEREST — Regenerates 15 HP every turn and passive defense scaling.',
    color: '#10b981',
    statModifiers: { hp: 20, attack: 5, defense: 25, speed: -5, luck: 5, intelligence: 30, risk: -25 },
    personality: ['COMPOUNDER', 'STEADY', 'DISCIPLINED', 'LONG-TERM HORIZON'],
    namePrefixes: ['INDEX', 'BOGLE', 'COMPOUND', 'DIVIDEND'],
    nameSuffixes: ['MAXI', 'COMPOUNDER', 'SAGE', 'ANCHOR'],
  },
  MARGIN_SURVIVOR: {
    id: 'MARGIN_SURVIVOR',
    name: 'MARGIN CALL SURVIVOR',
    description: 'Survived 95% portfolio drawdowns and instant margin calls. Scar tissue is heavy armor.',
    ability: 'LIQUIDATION RAGE — When HP dips below 35%, attack power surges by +60%.',
    color: '#ff5000',
    statModifiers: { hp: 15, attack: 20, defense: 0, speed: 5, luck: 15, intelligence: 15, risk: 20 },
    personality: ['SCARRED', 'RESILIENT', 'RUTHLESS', 'UNKILLABLE'],
    namePrefixes: ['MARGIN', 'REBORN', 'SURVIVOR', 'PHOENIX'],
    nameSuffixes: ['SURVIVOR', 'BERSERKER', 'GLADIATOR', 'REAPER'],
  },
  ROBINHOOD_GOLD: {
    id: 'ROBINHOOD_GOLD',
    name: 'ROBINHOOD GOLD TITAN',
    description: 'Robinhood Gold tier elite. 5% APY cash sweep with boosted margin leverage.',
    ability: 'CASH SWEEP — Siphons 20 HP from opponent while boosting own attack power.',
    color: '#ffd700',
    statModifiers: { hp: 15, attack: 20, defense: 15, speed: 10, luck: 10, intelligence: 20, risk: -5 },
    personality: ['PREMIUM', 'GOLD TIER', 'HIGH YIELD', 'ROYALTY'],
    namePrefixes: ['GOLD', 'VIP', 'PREMIUM', 'ROYAL'],
    nameSuffixes: ['TITAN', 'ARCHON', 'EMPEROR', 'SOVEREIGN'],
  },
  DAY_TRADER: {
    id: 'DAY_TRADER',
    name: 'PATTERN DAY TRADER',
    description: 'Charts 1-minute candles. First to strike on market open at 9:30 AM with lightning reflexes.',
    ability: 'BELL RINGER — Takes turn 1 initiative with a guaranteed double strike.',
    color: '#06d6a0',
    statModifiers: { hp: -10, attack: 15, defense: -10, speed: 35, luck: 15, intelligence: 10, risk: 15 },
    personality: ['BLAZING FAST', '9:30 AM WARRIOR', 'CANDLE SNIPER', 'NEVER OVERNIGHT'],
    namePrefixes: ['DAY', 'SCALP', 'SWIFT', 'MOMENTUM'],
    nameSuffixes: ['TRADER', 'SNIPER', 'BLADE', 'SURGE'],
  },
  PAPER_HANDS: {
    id: 'PAPER_HANDS',
    name: 'PAPER HANDS',
    description: 'Sells at the first red 1-minute candle. Extremely evasive, dodging fatal blows.',
    ability: 'STOP LOSS — 40% chance to completely evade an incoming attack.',
    color: '#ffd60a',
    statModifiers: { hp: -20, attack: 5, defense: -20, speed: 30, luck: 25, intelligence: 5, risk: -15 },
    personality: ['ANXIOUS', 'QUICK TO SELL', 'LUCKY', 'SURPRISINGLY ALIVE'],
    namePrefixes: ['PAPER', 'QUICK', 'PANIC', 'EVASIVE'],
    nameSuffixes: ['HANDS', 'RUNNER', 'GHOST', 'SHADOW'],
  },
  ALGO_QUANT: {
    id: 'ALGO_QUANT',
    name: 'ALGO QUANT',
    description: 'Automated limit order strategies and quantitative models. Precision through math.',
    ability: 'LIMIT ARBITRAGE — Ignores 50% of opponent armor with calculated mathematical execution.',
    color: '#9945ff',
    statModifiers: { hp: 0, attack: 15, defense: 10, speed: 10, luck: 5, intelligence: 40, risk: -10 },
    personality: ['ANALYTICAL', 'QUANTITATIVE', 'SYSTEMATIC', 'COLD CALCULATOR'],
    namePrefixes: ['ALGO', 'QUANT', 'DELTA', 'CYBER'],
    nameSuffixes: ['BOT', 'ORACLE', 'MATRIX', 'VECTOR'],
  },
};

// Aliases for compatibility
ARCHETYPES.DEGEN = ARCHETYPES.OPTIONS_DEGEN;
ARCHETYPES.WHALE = ARCHETYPES.ROBINHOOD_WHALE;
ARCHETYPES.MEME_LORD = ARCHETYPES.DOGE_KING;
ARCHETYPES.DEFI_MAGE = ARCHETYPES.ALGO_QUANT;
ARCHETYPES.NFT_HUNTER = ARCHETYPES.DOGE_KING;
ARCHETYPES.RUG_SURVIVOR = ARCHETYPES.MARGIN_SURVIVOR;
ARCHETYPES.SOLANA_SAMURAI = ARCHETYPES.ROBINHOOD_GOLD;
ARCHETYPES.SPEED_DEMON = ARCHETYPES.DAY_TRADER;
ARCHETYPES.ON_CHAIN_ORACLE = ARCHETYPES.INDEX_MAXI;
ARCHETYPES.SHADOW_TRADER = ARCHETYPES.ALGO_QUANT;

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function deterministicVariance(seed: string, statName: string): number {
  const hash = deterministicHash(seed + statName);
  return (hash % 21) - 10; // -10 to +10
}

export function determineArchetype(analysis: WalletAnalysisResult): string {
  const scores: Record<string, number> = {
    OPTIONS_DEGEN: analysis.tradingActivity * 0.5 + analysis.riskScore * 0.4 + analysis.activityScore * 0.1,
    ROBINHOOD_WHALE: analysis.holdingScore * 0.3 + (analysis.estimatedPortfolioTier === 'whale' ? 90 : analysis.estimatedPortfolioTier === 'large' ? 60 : 15),
    DIAMOND_HANDS: analysis.holdingScore * 0.75 - analysis.tradingActivity * 0.25,
    DOGE_KING: analysis.riskScore * 0.4 + analysis.tradingActivity * 0.3 + (100 - analysis.holdingScore) * 0.3,
    INDEX_MAXI: analysis.holdingScore * 0.5 + (analysis.walletAge > 365 ? 40 : 15) + (100 - analysis.riskScore) * 0.3,
    MARGIN_SURVIVOR: analysis.riskScore * 0.6 + (analysis.walletAge > 300 ? 35 : 10),
    ROBINHOOD_GOLD: (analysis.estimatedPortfolioTier === 'whale' || analysis.estimatedPortfolioTier === 'large' ? 50 : 20) + analysis.activityScore * 0.4,
    DAY_TRADER: analysis.transactionFrequency * 6 + analysis.tradingActivity * 0.4,
    PAPER_HANDS: (100 - analysis.holdingScore) * 0.6 + analysis.tradingActivity * 0.4,
    ALGO_QUANT: analysis.defiActivity * 0.6 + analysis.tokenActivity * 0.4,
  };

  let best = 'OPTIONS_DEGEN';
  let bestScore = 0;
  for (const [arch, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      best = arch;
    }
  }
  return best;
}

export function generateWarriorName(archetype: string, walletAddress: string): string {
  const def = ARCHETYPES[archetype];
  if (!def) return 'THE UNKNOWN WARRIOR';

  const hash = deterministicHash(walletAddress);
  const prefix = def.namePrefixes[hash % def.namePrefixes.length];
  const suffix = def.nameSuffixes[(hash * 7) % def.nameSuffixes.length];

  const formats = [
    `THE ${prefix} ${suffix}`,
    `${prefix} ${suffix}`,
    `${prefix} THE ${suffix}`,
  ];

  return formats[hash % formats.length];
}

export function determineRarity(analysis: WalletAnalysisResult): IWarrior['rarity'] {
  const power = (analysis.activityScore + analysis.holdingScore + analysis.transactionCount) / 3;
  if (power >= 85 || analysis.estimatedPortfolioTier === 'whale') return 'LEGENDARY';
  if (power >= 65 || analysis.estimatedPortfolioTier === 'large') return 'EPIC';
  if (power >= 45 || analysis.estimatedPortfolioTier === 'medium') return 'RARE';
  if (power >= 25) return 'UNCOMMON';
  return 'COMMON';
}

export function generateStats(analysis: WalletAnalysisResult, archetype: string, walletAddress: string) {
  const def = ARCHETYPES[archetype] || ARCHETYPES['DEGEN'];

  // Standardize HP to 100 for all warriors so health is equalized
  const hp = 100;
  const BASE = 50;

  const attack = clamp(
    BASE + def.statModifiers.attack + Math.round(analysis.tradingActivity * 0.3) + deterministicVariance(walletAddress, 'attack'),
    10, 150
  );

  const defense = clamp(
    BASE + def.statModifiers.defense + Math.round(analysis.holdingScore * 0.2) + deterministicVariance(walletAddress, 'defense'),
    5, 150
  );

  const speed = clamp(
    BASE + def.statModifiers.speed + Math.round(analysis.transactionFrequency * 2) + deterministicVariance(walletAddress, 'speed'),
    5, 150
  );

  const luck = clamp(
    BASE + def.statModifiers.luck + Math.round(analysis.nftActivity * 0.2) + deterministicVariance(walletAddress, 'luck'),
    1, 100
  );

  const intelligence = clamp(
    BASE + def.statModifiers.intelligence + Math.round(analysis.defiActivity * 0.3) + deterministicVariance(walletAddress, 'intelligence'),
    10, 150
  );

  const risk = clamp(
    BASE + def.statModifiers.risk + Math.round(analysis.riskScore * 0.3) + deterministicVariance(walletAddress, 'risk'),
    1, 150
  );

  const power = Math.round((attack + defense + speed + intelligence) / 4);

  return { hp, attack, defense, speed, luck, intelligence, risk, power };
}

export function generatePersonality(analysis: WalletAnalysisResult, archetype: string): string[] {
  const def = ARCHETYPES[archetype];
  const traits = [...def.personality];

  // Add dynamic traits based on analysis
  if (analysis.walletAge > 365) traits.push('VETERAN');
  if (analysis.transactionCount > 1000) traits.push('HYPERACTIVE');
  if (analysis.holdingScore > 80) traits.push('LONG-TERM THINKER');
  if (analysis.riskScore > 80) traits.push('RISK ADDICT');
  if (analysis.nftActivity > 70) traits.push('NFT CONNOISSEUR');
  if (analysis.defiActivity > 70) traits.push('PROTOCOL NATIVE');
  if (analysis.estimatedPortfolioTier === 'whale') traits.push('MARKET MOVER');

  return traits.slice(0, 6);
}

export function generateWarriorFromAnalysis(analysis: WalletAnalysisResult) {
  const archetype = determineArchetype(analysis);
  const name = generateWarriorName(archetype, analysis.walletAddress);
  const rarity = determineRarity(analysis);
  const stats = generateStats(analysis, archetype, analysis.walletAddress);
  const personality = generatePersonality(analysis, archetype);

  return {
    walletAddress: analysis.walletAddress,
    name,
    archetype,
    rarity,
    level: 1,
    xp: 0,
    ...stats,
    wins: 0,
    losses: 0,
    winStreak: 0,
    bestWinStreak: 0,
    personality,
    walletAnalysis: {
      walletAge: analysis.walletAge,
      transactionCount: analysis.transactionCount,
      transactionFrequency: analysis.transactionFrequency,
      tokenActivity: analysis.tokenActivity,
      nftActivity: analysis.nftActivity,
      defiActivity: analysis.defiActivity,
      tradingActivity: analysis.tradingActivity,
      holdingScore: analysis.holdingScore,
      riskScore: analysis.riskScore,
      activityScore: analysis.activityScore,
      calculatedAt: analysis.calculatedAt,
    },
    achievements: [],
    isDemo: false,
  };
}
