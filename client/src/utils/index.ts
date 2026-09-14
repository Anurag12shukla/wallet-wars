import type { Archetype, Rarity } from '../types';

export const ARCHETYPE_META: Record<string, {
  color: string;
  gradient: string;
  emoji: string;
  description: string;
  ability: string;
  bgColor: string;
}> = {
  OPTIONS_DEGEN: {
    color: '#00C805',
    gradient: 'from-green-500 to-emerald-700',
    emoji: '📈',
    description: '0DTE options caller with unpredictable gamma spikes.',
    ability: 'GAMMA SQUEEZE',
    bgColor: 'rgba(0, 200, 5, 0.12)',
  },
  ROBINHOOD_WHALE: {
    color: '#0077b6',
    gradient: 'from-blue-600 to-cyan-800',
    emoji: '🐋',
    description: 'Seven-figure portfolio with massive buying power.',
    ability: 'MARKET IMPACT',
    bgColor: 'rgba(0, 119, 182, 0.12)',
  },
  DIAMOND_HANDS: {
    color: '#00e006',
    gradient: 'from-emerald-400 to-teal-700',
    emoji: '💎',
    description: 'Held through every crash. Unbreakable conviction.',
    ability: 'HODL SHIELD',
    bgColor: 'rgba(0, 224, 6, 0.12)',
  },
  DOGE_KING: {
    color: '#ffdf00',
    gradient: 'from-yellow-400 to-amber-600',
    emoji: '🐕',
    description: 'Rides Robinhood crypto to the moon. Much wow.',
    ability: 'TO THE MOON',
    bgColor: 'rgba(255, 223, 0, 0.12)',
  },
  INDEX_MAXI: {
    color: '#10b981',
    gradient: 'from-emerald-500 to-green-700',
    emoji: '📊',
    description: 'Buys $SPY & $VOO every week. Compounding machine.',
    ability: 'COMPOUND INTEREST',
    bgColor: 'rgba(16, 185, 129, 0.12)',
  },
  MARGIN_SURVIVOR: {
    color: '#ff5000',
    gradient: 'from-red-500 to-orange-700',
    emoji: '🩸',
    description: 'Survived 95% drawdown & instant margin calls.',
    ability: 'LIQUIDATION RAGE',
    bgColor: 'rgba(255, 80, 0, 0.12)',
  },
  ROBINHOOD_GOLD: {
    color: '#ffd700',
    gradient: 'from-yellow-300 to-amber-500',
    emoji: '👑',
    description: '5% APY cash sweep with boosted margin tier.',
    ability: 'CASH SWEEP',
    bgColor: 'rgba(255, 215, 0, 0.12)',
  },
  DAY_TRADER: {
    color: '#06d6a0',
    gradient: 'from-teal-400 to-emerald-600',
    emoji: '⚡',
    description: 'Charts 1-minute candles. First to strike at 9:30 AM.',
    ability: 'BELL RINGER',
    bgColor: 'rgba(6, 214, 160, 0.12)',
  },
  PAPER_HANDS: {
    color: '#ffd60a',
    gradient: 'from-amber-300 to-yellow-500',
    emoji: '📄',
    description: 'Quick exits, quick attacks.',
    ability: 'STOP LOSS',
    bgColor: 'rgba(255, 214, 10, 0.12)',
  },
  ALGO_QUANT: {
    color: '#9945ff',
    gradient: 'from-purple-500 to-indigo-700',
    emoji: '🤖',
    description: 'Automated quantitative limits. Precision math.',
    ability: 'LIMIT ARBITRAGE',
    bgColor: 'rgba(153, 69, 255, 0.12)',
  },
  // Compatibility fallbacks
  DEGEN: {
    color: '#00C805',
    gradient: 'from-green-500 to-emerald-700',
    emoji: '📈',
    description: '0DTE options caller with unpredictable gamma spikes.',
    ability: 'GAMMA SQUEEZE',
    bgColor: 'rgba(0, 200, 5, 0.12)',
  },
  WHALE: {
    color: '#0077b6',
    gradient: 'from-blue-600 to-cyan-800',
    emoji: '🐋',
    description: 'Massive portfolio. Moves markets.',
    ability: 'MARKET IMPACT',
    bgColor: 'rgba(0, 119, 182, 0.12)',
  },
  NFT_HUNTER: {
    color: '#ffdf00',
    gradient: 'from-yellow-400 to-amber-600',
    emoji: '🐕',
    description: 'Rides Robinhood crypto to the moon.',
    ability: 'TO THE MOON',
    bgColor: 'rgba(255, 223, 0, 0.12)',
  },
  DEFI_MAGE: {
    color: '#9945ff',
    gradient: 'from-purple-500 to-indigo-700',
    emoji: '🤖',
    description: 'Automated quantitative limits.',
    ability: 'LIMIT ARBITRAGE',
    bgColor: 'rgba(153, 69, 255, 0.12)',
  },
  MEME_LORD: {
    color: '#ffdf00',
    gradient: 'from-yellow-400 to-amber-600',
    emoji: '🐕',
    description: 'Rides meme coins to the moon.',
    ability: 'TO THE MOON',
    bgColor: 'rgba(255, 223, 0, 0.12)',
  },
  RUG_SURVIVOR: {
    color: '#ff5000',
    gradient: 'from-red-500 to-orange-700',
    emoji: '🩸',
    description: 'Survived multiple margin wipeouts.',
    ability: 'LIQUIDATION RAGE',
    bgColor: 'rgba(255, 80, 0, 0.12)',
  },
  SOLANA_SAMURAI: {
    color: '#ffd700',
    gradient: 'from-yellow-300 to-amber-500',
    emoji: '👑',
    description: '5% APY cash sweep with boosted margin tier.',
    ability: 'CASH SWEEP',
    bgColor: 'rgba(255, 215, 0, 0.12)',
  },
  ON_CHAIN_ORACLE: {
    color: '#10b981',
    gradient: 'from-emerald-500 to-green-700',
    emoji: '📊',
    description: 'Buys $SPY & $VOO every week.',
    ability: 'COMPOUND INTEREST',
    bgColor: 'rgba(16, 185, 129, 0.12)',
  },
  SHADOW_TRADER: {
    color: '#9945ff',
    gradient: 'from-purple-500 to-indigo-700',
    emoji: '🤖',
    description: 'Moves in darkness. Never announces.',
    ability: 'LIMIT ARBITRAGE',
    bgColor: 'rgba(153, 69, 255, 0.12)',
  },
  SPEED_DEMON: {
    color: '#06d6a0',
    gradient: 'from-teal-400 to-emerald-600',
    emoji: '⚡',
    description: 'Charts 1-minute candles.',
    ability: 'BELL RINGER',
    bgColor: 'rgba(6, 214, 160, 0.12)',
  },
};

export const RARITY_META: Record<Rarity, { color: string; glow: string; label: string }> = {
  COMMON: { color: '#8b8b8b', glow: 'rgba(139, 139, 139, 0.3)', label: 'Common' },
  UNCOMMON: { color: '#00C805', glow: 'rgba(0, 200, 5, 0.4)', label: 'Uncommon' },
  RARE: { color: '#4A90D9', glow: 'rgba(74, 144, 217, 0.4)', label: 'Rare' },
  EPIC: { color: '#9945FF', glow: 'rgba(153, 69, 255, 0.5)', label: 'Epic' },
  LEGENDARY: { color: '#FFD700', glow: 'rgba(255, 215, 0, 0.5)', label: 'Robinhood Gold' },
};

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.startsWith('@') || (!address.startsWith('0x') && address.length < 24)) {
    return address.startsWith('@') ? address : `@${address}`;
  }
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function getArchetypeMeta(archetype: string) {
  return ARCHETYPE_META[archetype] || ARCHETYPE_META['OPTIONS_DEGEN'] || ARCHETYPE_META['DEGEN'];
}

export function getRarityMeta(rarity: Rarity) {
  return RARITY_META[rarity] || RARITY_META['COMMON'];
}

export function getStatColor(value: number): string {
  if (value >= 80) return '#14F195';
  if (value >= 60) return '#9945FF';
  if (value >= 40) return '#ffd60a';
  return '#ff4500';
}

export function getHpColor(currentHp: number, maxHp: number): string {
  const pct = currentHp / maxHp;
  if (pct > 0.6) return 'high';
  if (pct > 0.3) return 'medium';
  return 'low';
}

export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function xpProgressPercent(xp: number, level: number): number {
  let accumulated = 0;
  for (let i = 1; i < level; i++) {
    accumulated += Math.floor(100 * Math.pow(1.5, i - 1));
  }
  const needed = Math.floor(100 * Math.pow(1.5, level - 1));
  const progress = xp - accumulated;
  return Math.min(100, Math.max(0, (progress / needed) * 100));
}

export function isValidRobinhoodOrWalletAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  const trimmed = address.trim();
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) return true;
  if (/^@?[a-zA-Z0-9_\-\.]{3,44}$/.test(trimmed)) return true;
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(trimmed);
}

export const isValidSolanaAddress = isValidRobinhoodOrWalletAddress;

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function formatWinRate(wins: number, losses: number): string {
  const total = wins + losses;
  if (total === 0) return '0%';
  return `${Math.round((wins / total) * 100)}%`;
}

// Demo warriors for demo mode
export const DEMO_WARRIORS = {
  playerOne: 'demo_options_001',
  playerTwo: 'demo_whale_001',
  options: [
    { wallet: 'demo_options_001', name: '0DTE GAMMA TITAN', archetype: 'OPTIONS_DEGEN', emoji: '📈' },
    { wallet: 'demo_whale_001', name: 'THE ROBINHOOD LEVIATHAN', archetype: 'ROBINHOOD_WHALE', emoji: '🐋' },
    { wallet: 'demo_diamond_001', name: 'DIAMOND WRAITH', archetype: 'DIAMOND_HANDS', emoji: '💎' },
    { wallet: 'demo_doge_001', name: 'DOGE MOON LORD', archetype: 'DOGE_KING', emoji: '🐕' },
    { wallet: 'demo_bogle_001', name: 'BOGLE COMPOUND SAGE', archetype: 'INDEX_MAXI', emoji: '📊' },
    { wallet: 'demo_margin_001', name: 'THE MARGIN REAPER', archetype: 'MARGIN_SURVIVOR', emoji: '🩸' },
    { wallet: 'demo_gold_001', name: 'ROBINHOOD GOLD TITAN', archetype: 'ROBINHOOD_GOLD', emoji: '👑' },
    { wallet: 'demo_day_001', name: '9:30 AM CANDLE SNIPER', archetype: 'DAY_TRADER', emoji: '⚡' },
    { wallet: 'demo_paper_001', name: 'PAPER DASH GHOST', archetype: 'PAPER_HANDS', emoji: '📄' },
    { wallet: 'demo_quant_001', name: 'DELTA QUANT MATRIX', archetype: 'ALGO_QUANT', emoji: '🤖' },
  ],
};
