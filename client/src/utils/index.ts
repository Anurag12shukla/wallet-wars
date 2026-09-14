import type { Archetype, Rarity } from '../types';

export const ARCHETYPE_META: Record<string, {
  color: string;
  gradient: string;
  emoji: string;
  description: string;
  ability: string;
  bgColor: string;
}> = {
  DEGEN: {
    color: '#ff4500',
    gradient: 'from-orange-600 to-red-700',
    emoji: '🦍',
    description: 'High-frequency trader who lives on the edge.',
    ability: 'CHAOS STRIKE',
    bgColor: 'rgba(255, 69, 0, 0.1)',
  },
  WHALE: {
    color: '#0077b6',
    gradient: 'from-blue-600 to-blue-900',
    emoji: '🐋',
    description: 'Massive wallet. Moves markets.',
    ability: 'MARKET CRASH',
    bgColor: 'rgba(0, 119, 182, 0.1)',
  },
  DIAMOND_HANDS: {
    color: '#00d4ff',
    gradient: 'from-cyan-400 to-blue-600',
    emoji: '💎',
    description: 'Holds through every crash.',
    ability: 'DIAMOND SHIELD',
    bgColor: 'rgba(0, 212, 255, 0.1)',
  },
  PAPER_HANDS: {
    color: '#ffd60a',
    gradient: 'from-yellow-400 to-orange-500',
    emoji: '📄',
    description: 'Quick exits, quick attacks.',
    ability: 'PAPER CUT',
    bgColor: 'rgba(255, 214, 10, 0.1)',
  },
  NFT_HUNTER: {
    color: '#9b5de5',
    gradient: 'from-purple-500 to-pink-600',
    emoji: '🎨',
    description: 'Collects rare digital art.',
    ability: 'RARE DROP',
    bgColor: 'rgba(155, 93, 229, 0.1)',
  },
  DEFI_MAGE: {
    color: '#7400b8',
    gradient: 'from-violet-600 to-purple-900',
    emoji: '🔮',
    description: 'Masters liquidity and yields.',
    ability: 'YIELD DRAIN',
    bgColor: 'rgba(116, 0, 184, 0.1)',
  },
  MEME_LORD: {
    color: '#ff006e',
    gradient: 'from-pink-500 to-rose-700',
    emoji: '🚀',
    description: 'Rides meme coins to the moon.',
    ability: 'TO THE MOON',
    bgColor: 'rgba(255, 0, 110, 0.1)',
  },
  RUG_SURVIVOR: {
    color: '#fb8500',
    gradient: 'from-orange-500 to-amber-700',
    emoji: '💀',
    description: 'Survived multiple rug pulls.',
    ability: 'BATTLE SCAR',
    bgColor: 'rgba(251, 133, 0, 0.1)',
  },
  SOLANA_SAMURAI: {
    color: '#9945FF',
    gradient: 'from-purple-500 to-violet-700',
    emoji: '⚔️',
    description: 'Native to Solana from genesis.',
    ability: 'BUSHIDO SLASH',
    bgColor: 'rgba(153, 69, 255, 0.1)',
  },
  ON_CHAIN_ORACLE: {
    color: '#4cc9f0',
    gradient: 'from-sky-400 to-cyan-600',
    emoji: '🔭',
    description: 'Reads the blockchain like a crystal ball.',
    ability: 'FORESIGHT',
    bgColor: 'rgba(76, 201, 240, 0.1)',
  },
  SHADOW_TRADER: {
    color: '#6c757d',
    gradient: 'from-gray-500 to-slate-700',
    emoji: '👤',
    description: 'Moves in darkness. Never announces.',
    ability: 'SHADOW STRIKE',
    bgColor: 'rgba(108, 117, 125, 0.1)',
  },
  SPEED_DEMON: {
    color: '#06d6a0',
    gradient: 'from-emerald-400 to-green-600',
    emoji: '⚡',
    description: 'Exploits every millisecond.',
    ability: 'SPEED BURST',
    bgColor: 'rgba(6, 214, 160, 0.1)',
  },
};

export const RARITY_META: Record<Rarity, { color: string; glow: string; label: string }> = {
  COMMON: { color: '#8b8b8b', glow: 'rgba(139, 139, 139, 0.3)', label: 'Common' },
  UNCOMMON: { color: '#14F195', glow: 'rgba(20, 241, 149, 0.4)', label: 'Uncommon' },
  RARE: { color: '#4A90D9', glow: 'rgba(74, 144, 217, 0.4)', label: 'Rare' },
  EPIC: { color: '#9945FF', glow: 'rgba(153, 69, 255, 0.5)', label: 'Epic' },
  LEGENDARY: { color: '#FFD700', glow: 'rgba(255, 215, 0, 0.5)', label: 'Legendary' },
};

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function getArchetypeMeta(archetype: string) {
  return ARCHETYPE_META[archetype] || ARCHETYPE_META['DEGEN'];
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

export function isValidSolanaAddress(address: string): boolean {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

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
  playerOne: 'demo_degen_001',
  playerTwo: 'demo_whale_001',
  options: [
    { wallet: 'demo_degen_001', name: 'DEGEN PRIME', archetype: 'DEGEN', emoji: '🦍' },
    { wallet: 'demo_whale_001', name: 'THE GREAT LEVIATHAN', archetype: 'WHALE', emoji: '🐋' },
    { wallet: 'demo_diamond_001', name: 'DIAMOND WRAITH', archetype: 'DIAMOND_HANDS', emoji: '💎' },
    { wallet: 'demo_rug_001', name: 'THE RUG REAPER', archetype: 'RUG_SURVIVOR', emoji: '💀' },
    { wallet: 'demo_nft_001', name: 'NFT HUNTER', archetype: 'NFT_HUNTER', emoji: '🎨' },
    { wallet: 'demo_samurai_001', name: 'THE SOL SAMURAI', archetype: 'SOLANA_SAMURAI', emoji: '⚔️' },
    { wallet: 'demo_shadow_001', name: 'CHAIN PHANTOM', archetype: 'SHADOW_TRADER', emoji: '👤' },
    { wallet: 'demo_speed_001', name: 'TURBO BLITZ', archetype: 'SPEED_DEMON', emoji: '⚡' },
  ],
};
