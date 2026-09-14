import { IWarrior } from '../models/Warrior';
import { IRound } from '../models/Battle';

// Simple deterministic seeded random number generator (mulberry32)
function createSeededRng(seed: number) {
  let state = seed;
  return function () {
    state |= 0;
    state = Math.imul(state ^ (state >>> 15), 1 | state);
    state ^= state + Math.imul(state ^ (state >>> 7), 61 | state);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
}

function stringToSeed(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export interface BattleInput {
  playerOneWallet: string;
  playerTwoWallet: string;
  playerOne: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    luck: number;
    intelligence: number;
    risk: number;
    archetype: string;
    name: string;
  };
  playerTwo: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    luck: number;
    intelligence: number;
    risk: number;
    archetype: string;
    name: string;
  };
  battleSeed: string;
}

export interface BattleResult {
  rounds: IRound[];
  winner: 'playerOne' | 'playerTwo';
  battleLog: string[];
  playerOneScore: number;
  playerTwoScore: number;
  playerOneDamageDealt: number;
  playerTwoDamageDealt: number;
  playerOneCriticalHits: number;
  playerTwoCriticalHits: number;
  duration: number;
}

const ACTION_DESCRIPTIONS: Record<string, (attacker: string, defender: string, damage: number) => string> = {
  ATTACK: (a, d, dmg) => `${a} strikes ${d} for ${dmg} damage!`,
  CRITICAL_HIT: (a, d, dmg) => `💥 CRITICAL! ${a} DEVASTATES ${d} for ${dmg} damage!`,
  DODGE: (a, d) => `${d} dodges ${a}'s attack! No damage!`,
  COUNTER: (a, d, dmg) => `⚡ ${d} COUNTERS ${a}'s attack for ${dmg} damage!`,
  BLOCK: (a, d) => `🛡️ ${d} BLOCKS ${a}'s strike! Reduced damage!`,
  SPECIAL_ATTACK: (a, d, dmg) => `✨ SPECIAL! ${a} unleashes a devastating ability on ${d} for ${dmg} damage!`,
};

export function runBattleEngine(input: BattleInput): BattleResult {
  const seed = stringToSeed(input.battleSeed + input.playerOneWallet + input.playerTwoWallet);
  const rng = createSeededRng(seed);

  let p1Hp = input.playerOne.hp;
  let p2Hp = input.playerTwo.hp;

  const rounds: IRound[] = [];
  const battleLog: string[] = [];

  let p1DamageDealt = 0;
  let p2DamageDealt = 0;
  let p1CriticalHits = 0;
  let p2CriticalHits = 0;
  let p1Score = 0;
  let p2Score = 0;

  const maxRounds = 4 + Math.floor(rng() * 4); // 4-7 rounds
  const startTime = Date.now();

  // Determine turn order based on speed
  const p1SpeedAdvantage = input.playerOne.speed > input.playerTwo.speed;

  battleLog.push(`⚔️  ${input.playerOne.name} vs ${input.playerTwo.name}`);
  battleLog.push(`🎲 Battle Seed: ${input.battleSeed.substring(0, 8)}...`);

  for (let roundNum = 1; roundNum <= maxRounds; roundNum++) {
    if (p1Hp <= 0 || p2Hp <= 0) break;

    // Determine attacker for this round
    const p1GoesFirst = p1SpeedAdvantage ? rng() > 0.3 : rng() > 0.7;

    for (const firstMover of p1GoesFirst ? ['playerOne', 'playerTwo'] : ['playerTwo', 'playerOne']) {
      if (p1Hp <= 0 || p2Hp <= 0) break;

      const isP1 = firstMover === 'playerOne';
      const attacker = isP1 ? input.playerOne : input.playerTwo;
      const defender = isP1 ? input.playerTwo : input.playerOne;
      const attackerName = attacker.name;
      const defenderName = defender.name;

      const roll = rng();

      // Action determination
      let action: IRound['action'];
      let damage = 0;
      let isCritical = false;
      let isDodge = false;
      let isSpecial = false;

      const critChance = 0.05 + (attacker.luck / 200);
      const dodgeChance = 0.05 + (defender.speed / 400);
      const specialChance = 0.08 + (attacker.intelligence / 500);
      const counterChance = 0.04 + (defender.intelligence / 400);
      const blockChance = 0.1 + (defender.defense / 400);

      if (roll < dodgeChance) {
        action = 'DODGE';
        isDodge = true;
        damage = 0;
      } else if (roll < dodgeChance + counterChance) {
        action = 'COUNTER';
        damage = Math.round(defender.attack * (0.7 + rng() * 0.4));
        damage = Math.max(1, damage - Math.round(attacker.defense * 0.3));
      } else if (roll < dodgeChance + counterChance + blockChance) {
        action = 'BLOCK';
        damage = Math.round(attacker.attack * (0.1 + rng() * 0.2));
        damage = Math.max(0, damage);
      } else if (roll < dodgeChance + counterChance + blockChance + specialChance) {
        action = 'SPECIAL_ATTACK';
        isSpecial = true;
        damage = Math.round(attacker.attack * (1.5 + rng() * 1.0));
        damage = Math.max(1, damage - Math.round(defender.defense * 0.2));
      } else if (rng() < critChance) {
        action = 'CRITICAL_HIT';
        isCritical = true;
        damage = Math.round(attacker.attack * (1.8 + rng() * 0.7));
        damage = Math.max(1, damage - Math.round(defender.defense * 0.1));
      } else {
        action = 'ATTACK';
        damage = Math.round(attacker.attack * (0.7 + rng() * 0.6));
        damage = Math.max(1, damage - Math.round(defender.defense * 0.3));
      }

      // Apply damage to correct player
      let counterDamage = 0;
      if (action === 'COUNTER') {
        // Counter: defender attacks attacker
        if (isP1) {
          p1Hp -= damage;
          counterDamage = damage;
        } else {
          p2Hp -= damage;
          counterDamage = damage;
        }
      } else if (!isDodge) {
        if (isP1) {
          p2Hp -= damage;
        } else {
          p1Hp -= damage;
        }
      }

      // Track stats
      if (isP1 && !isDodge && action !== 'COUNTER') {
        p1DamageDealt += damage;
        if (isCritical) p1CriticalHits++;
        p1Score++;
      } else if (!isP1 && !isDodge && action !== 'COUNTER') {
        p2DamageDealt += damage;
        if (isCritical) p2CriticalHits++;
        p2Score++;
      } else if (action === 'COUNTER') {
        if (!isP1) {
          p2DamageDealt += counterDamage;
          p2Score++;
        } else {
          p1DamageDealt += counterDamage;
          p1Score++;
        }
      }

      const finalP1Hp = Math.max(0, p1Hp);
      const finalP2Hp = Math.max(0, p2Hp);

      const descFn = ACTION_DESCRIPTIONS[action];
      const roundDescription = descFn(attackerName, defenderName, damage);

      const round: IRound = {
        roundNumber: roundNum,
        action,
        attacker: firstMover as 'playerOne' | 'playerTwo',
        damage,
        playerOneHp: finalP1Hp,
        playerTwoHp: finalP2Hp,
        description: roundDescription,
        isCritical,
        isDodge,
        isSpecial,
      };

      rounds.push(round);
      battleLog.push(`Round ${roundNum}: ${roundDescription} | HP: ${attackerName}=${isP1 ? finalP1Hp : finalP2Hp} | ${defenderName}=${isP1 ? finalP2Hp : finalP1Hp}`);
    }
  }

  // Determine winner
  let winner: 'playerOne' | 'playerTwo';
  if (p1Hp <= 0 && p2Hp <= 0) {
    // Both KO'd — speed determines winner
    winner = input.playerOne.speed >= input.playerTwo.speed ? 'playerOne' : 'playerTwo';
  } else if (p1Hp <= 0) {
    winner = 'playerTwo';
  } else if (p2Hp <= 0) {
    winner = 'playerOne';
  } else {
    // No KO — who has more HP remaining?
    winner = p1Hp >= p2Hp ? 'playerOne' : 'playerTwo';
    if (p1Hp === p2Hp) {
      winner = p1Score >= p2Score ? 'playerOne' : 'playerTwo';
    }
  }

  const victoryMsg = winner === 'playerOne'
    ? `🏆 ${input.playerOne.name} WINS!`
    : `🏆 ${input.playerTwo.name} WINS!`;
  battleLog.push(victoryMsg);

  return {
    rounds,
    winner,
    battleLog,
    playerOneScore: p1Score,
    playerTwoScore: p2Score,
    playerOneDamageDealt: p1DamageDealt,
    playerTwoDamageDealt: p2DamageDealt,
    playerOneCriticalHits: p1CriticalHits,
    playerTwoCriticalHits: p2CriticalHits,
    duration: Date.now() - startTime,
  };
}

export function generateBattleSeed(p1Wallet: string, p2Wallet: string): string {
  const timestamp = Date.now().toString(36);
  const combined = `${p1Wallet}-${p2Wallet}-${timestamp}`;
  return Buffer.from(combined).toString('base64').substring(0, 32);
}

export function calculateXpReward(result: BattleResult, isWinner: boolean, levelDiff: number): number {
  if (isWinner) {
    let base = 250;
    if (levelDiff > 0) base += levelDiff * 25; // Beating higher level = bonus XP
    if (result.rounds.length <= 2) base += 50; // Fast win bonus
    return base;
  } else {
    let base = 50;
    if (levelDiff < 0) base += Math.abs(levelDiff) * 10; // Lost to higher level = some bonus
    return base;
  }
}

export function calculateLevel(xp: number): number {
  // Level curve: each level requires 100 * 1.5^(level-1) XP
  let level = 1;
  let totalXpNeeded = 0;
  while (true) {
    const xpForLevel = Math.floor(100 * Math.pow(1.5, level - 1));
    totalXpNeeded += xpForLevel;
    if (xp < totalXpNeeded) break;
    level++;
    if (level > 100) break;
  }
  return level;
}
