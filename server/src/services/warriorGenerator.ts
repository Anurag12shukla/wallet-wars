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
  DEGEN: {
    id: 'DEGEN',
    name: 'DEGEN',
    description: 'A high-frequency trader who lives on the edge. Never sleeps, always in the market.',
    ability: 'CHAOS STRIKE — Attacks three times in one turn with random bonus damage.',
    color: '#ff4500',
    statModifiers: { hp: -10, attack: 20, defense: -15, speed: 25, luck: 15, intelligence: -5, risk: 30 },
    personality: ['CHAOTIC', 'FEARLESS', 'ADDICTED TO VOLATILITY', 'NEVER STOPS'],
    namePrefixes: ['DEGEN', 'CHAOS', 'FOMO', 'APE'],
    nameSuffixes: ['PRIME', 'LORD', 'KING', 'REAPER'],
  },
  WHALE: {
    id: 'WHALE',
    name: 'WHALE',
    description: 'Massive wallet. Moves markets with a single trade. Feared by all.',
    ability: 'MARKET CRASH — Reduces opponent\'s attack by 30% for 2 rounds.',
    color: '#0077b6',
    statModifiers: { hp: 30, attack: 15, defense: 20, speed: -20, luck: -5, intelligence: 15, risk: -10 },
    personality: ['DOMINANT', 'PATIENT', 'CALCULATED', 'MARKET MOVER'],
    namePrefixes: ['THE', 'GREAT', 'MEGA', 'TITAN'],
    nameSuffixes: ['WHALE', 'LEVIATHAN', 'BEAST', 'GIANT'],
  },
  DIAMOND_HANDS: {
    id: 'DIAMOND_HANDS',
    name: 'DIAMOND HANDS',
    description: 'Holds through every crash. Unbreakable conviction. Built different.',
    ability: 'DIAMOND SHIELD — Blocks all damage for one round. Regenerates 20 HP.',
    color: '#00d4ff',
    statModifiers: { hp: 25, attack: -10, defense: 30, speed: -10, luck: 5, intelligence: 10, risk: -20 },
    personality: ['UNSHAKEABLE', 'PATIENT', 'ZEN', 'INDESTRUCTIBLE'],
    namePrefixes: ['DIAMOND', 'CRYSTAL', 'IRON', 'ETERNAL'],
    nameSuffixes: ['WRAITH', 'TITAN', 'GUARDIAN', 'SENTINEL'],
  },
  PAPER_HANDS: {
    id: 'PAPER_HANDS',
    name: 'PAPER HANDS',
    description: 'Sells at every dip. But quick reflexes can turn fear into survival.',
    ability: 'PAPER CUT — Ultra-fast attack that ignores 20% of opponent\'s defense.',
    color: '#ffd60a',
    statModifiers: { hp: -20, attack: 5, defense: -20, speed: 30, luck: 20, intelligence: 5, risk: -15 },
    personality: ['ANXIOUS', 'QUICK', 'LUCKY', 'SURPRISINGLY ALIVE'],
    namePrefixes: ['SWIFT', 'QUICK', 'PAPER', 'GHOST'],
    nameSuffixes: ['PHANTOM', 'RUNNER', 'SHADOW', 'DASH'],
  },
  NFT_HUNTER: {
    id: 'NFT_HUNTER',
    name: 'NFT HUNTER',
    description: 'Collects rare digital art across chains. Each NFT is a weapon.',
    ability: 'RARE DROP — 30% chance to deal 3x damage. "It\'s a 1-of-1."',
    color: '#9b5de5',
    statModifiers: { hp: 5, attack: 10, defense: 5, speed: 5, luck: 30, intelligence: 15, risk: 10 },
    personality: ['COLLECTOR', 'ARTISTIC', 'SPECULATIVE', 'COMMUNITY-DRIVEN'],
    namePrefixes: ['NFT', 'RARE', 'LEGENDARY', 'ALPHA'],
    nameSuffixes: ['HUNTER', 'COLLECTOR', 'SEEKER', 'CURATOR'],
  },
  DEFI_MAGE: {
    id: 'DEFI_MAGE',
    name: 'DEFI MAGE',
    description: 'Masters liquidity pools, yields, and protocols. Magic through math.',
    ability: 'YIELD DRAIN — Steals 15 HP from opponent and adds it to own HP each round.',
    color: '#7400b8',
    statModifiers: { hp: 0, attack: 5, defense: 10, speed: -5, luck: 5, intelligence: 35, risk: 0 },
    personality: ['ANALYTICAL', 'PATIENT', 'PROTOCOL-NATIVE', 'COMPOSABLE'],
    namePrefixes: ['DEFI', 'PROTOCOL', 'YIELD', 'LIQUIDITY'],
    nameSuffixes: ['MAGE', 'ORACLE', 'WIZARD', 'SAGE'],
  },
  MEME_LORD: {
    id: 'MEME_LORD',
    name: 'MEME LORD',
    description: 'Rides every meme coin to the moon. Absurd luck. No strategy. Pure energy.',
    ability: 'TO THE MOON — Random massive attack between 1-200% of normal damage.',
    color: '#ff006e',
    statModifiers: { hp: -5, attack: 0, defense: -10, speed: 10, luck: 40, intelligence: -20, risk: 25 },
    personality: ['CHAOTIC', 'UNHINGED', 'VIBES ONLY', 'INEXPLICABLY ALIVE'],
    namePrefixes: ['MEME', 'MOON', 'WEN', 'BASED'],
    nameSuffixes: ['LORD', 'KING', 'TITAN', 'GOD'],
  },
  RUG_SURVIVOR: {
    id: 'RUG_SURVIVOR',
    name: 'RUG SURVIVOR',
    description: 'Survived multiple rug pulls and came back stronger. Scar tissue is armor.',
    ability: 'BATTLE SCAR — When HP drops below 30%, gains 50% attack bonus.',
    color: '#fb8500',
    statModifiers: { hp: 15, attack: 15, defense: -5, speed: 5, luck: 10, intelligence: 20, risk: -5 },
    personality: ['SCARRED', 'RESILIENT', 'PARANOID', 'UNKILLABLE'],
    namePrefixes: ['RUG', 'SCAR', 'REBORN', 'LAST'],
    nameSuffixes: ['SURVIVOR', 'REAPER', 'GHOST', 'WARRIOR'],
  },
  SOLANA_SAMURAI: {
    id: 'SOLANA_SAMURAI',
    name: 'SOLANA SAMURAI',
    description: 'Native to Solana from genesis. Master of the chain. Honor above all.',
    ability: 'BUSHIDO SLASH — Guaranteed critical hit once per battle.',
    color: '#9945ff',
    statModifiers: { hp: 10, attack: 20, defense: 15, speed: 10, luck: 0, intelligence: 15, risk: -10 },
    personality: ['HONORABLE', 'DISCIPLINED', 'SWIFT', 'NATIVE'],
    namePrefixes: ['SOL', 'CHAIN', 'GENESIS', 'BLADE'],
    nameSuffixes: ['SAMURAI', 'WARRIOR', 'SWORD', 'MASTER'],
  },
  ON_CHAIN_ORACLE: {
    id: 'ON_CHAIN_ORACLE',
    name: 'ON-CHAIN ORACLE',
    description: 'Reads the blockchain like a crystal ball. Knows every move before it happens.',
    ability: 'FORESIGHT — Dodges the next attack with 80% probability.',
    color: '#4cc9f0',
    statModifiers: { hp: 0, attack: 10, defense: 5, speed: 15, luck: 15, intelligence: 40, risk: -15 },
    personality: ['PRESCIENT', 'CALM', 'ANALYTICAL', 'ANCIENT'],
    namePrefixes: ['CHAIN', 'ON-CHAIN', 'ORACLE', 'DATA'],
    nameSuffixes: ['ORACLE', 'PROPHET', 'SEER', 'PHANTOM'],
  },
  SHADOW_TRADER: {
    id: 'SHADOW_TRADER',
    name: 'SHADOW TRADER',
    description: 'Moves in darkness. Never announces trades. Profits silently.',
    ability: 'SHADOW STRIKE — Next attack is invisible (cannot be blocked or dodged).',
    color: '#6c757d',
    statModifiers: { hp: -5, attack: 25, defense: 0, speed: 20, luck: 5, intelligence: 10, risk: 5 },
    personality: ['MYSTERIOUS', 'STEALTHY', 'PRECISE', 'RUTHLESS'],
    namePrefixes: ['SHADOW', 'DARK', 'GHOST', 'PHANTOM'],
    nameSuffixes: ['TRADER', 'PHANTOM', 'ASSASSIN', 'BLADE'],
  },
  SPEED_DEMON: {
    id: 'SPEED_DEMON',
    name: 'SPEED DEMON',
    description: 'Exploits every millisecond on Solana. First in every trade. Fastest fingers.',
    ability: 'SPEED BURST — Takes two turns in a row.',
    color: '#06d6a0',
    statModifiers: { hp: -15, attack: 10, defense: -10, speed: 40, luck: 10, intelligence: 5, risk: 20 },
    personality: ['BLAZING FAST', 'IMPATIENT', 'RELENTLESS', 'ALWAYS FIRST'],
    namePrefixes: ['SPEED', 'TURBO', 'HYPER', 'SONIC'],
    nameSuffixes: ['DEMON', 'FLASH', 'BOLT', 'BLITZ'],
  },
};

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function deterministicVariance(seed: string, statName: string): number {
  const hash = deterministicHash(seed + statName);
  return (hash % 21) - 10; // -10 to +10
}

export function determineArchetype(analysis: WalletAnalysisResult): string {
  const scores: Record<string, number> = {
    DEGEN: analysis.tradingActivity * 0.5 + analysis.riskScore * 0.3 + analysis.activityScore * 0.2,
    WHALE: analysis.holdingScore * 0.3 + (analysis.estimatedPortfolioTier === 'whale' ? 80 : analysis.estimatedPortfolioTier === 'large' ? 50 : 10),
    DIAMOND_HANDS: analysis.holdingScore * 0.7 - analysis.tradingActivity * 0.3,
    PAPER_HANDS: (100 - analysis.holdingScore) * 0.6 + analysis.tradingActivity * 0.4,
    NFT_HUNTER: analysis.nftActivity * 0.8 + analysis.tokenActivity * 0.2,
    DEFI_MAGE: analysis.defiActivity * 0.7 + analysis.tokenActivity * 0.3,
    MEME_LORD: analysis.riskScore * 0.4 + analysis.tradingActivity * 0.3 + (100 - analysis.holdingScore) * 0.3,
    RUG_SURVIVOR: analysis.riskScore * 0.5 + (analysis.walletAge > 365 ? 40 : 10),
    SOLANA_SAMURAI: analysis.walletAge > 730 ? 70 + analysis.activityScore * 0.3 : analysis.activityScore * 0.5,
    ON_CHAIN_ORACLE: analysis.walletAge * 0.05 + analysis.transactionCount * 0.05,
    SHADOW_TRADER: (100 - analysis.tokenActivity) * 0.4 + analysis.tradingActivity * 0.3 + analysis.riskScore * 0.3,
    SPEED_DEMON: analysis.transactionFrequency * 5 + analysis.tradingActivity * 0.4,
  };

  let best = 'DEGEN';
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

  const BASE = 50;

  const hp = clamp(
    BASE + def.statModifiers.hp + Math.round(analysis.holdingScore * 0.3) + deterministicVariance(walletAddress, 'hp'),
    20, 200
  );

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
