import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../../.env') });

import mongoose from 'mongoose';
import { Warrior } from '../models/Warrior';
import { Battle } from '../models/Battle';
import { Achievement } from '../models/Achievement';
import { DailyChallenge } from '../models/DailyChallenge';
import { ACHIEVEMENTS_DATA } from '../utils/achievementsData';
import { runBattleEngine, generateBattleSeed } from '../services/battleEngine';
import { v4 as uuidv4 } from 'uuid';

const DEMO_WARRIORS = [
  {
    walletAddress: 'demo_degen_001',
    name: 'DEGEN PRIME',
    archetype: 'DEGEN',
    level: 8,
    xp: 4200,
    rarity: 'RARE',
    hp: 45, attack: 85, defense: 35, speed: 92, luck: 68, intelligence: 42, risk: 95, power: 80,
    wins: 24, losses: 12, winStreak: 3, bestWinStreak: 7,
    personality: ['CHAOTIC', 'FEARLESS', 'ADDICTED TO VOLATILITY', 'NEVER STOPS', 'VETERAN'],
    isDemo: true,
  },
  {
    walletAddress: 'demo_whale_001',
    name: 'THE GREAT LEVIATHAN',
    archetype: 'WHALE',
    level: 15,
    xp: 18500,
    rarity: 'LEGENDARY',
    hp: 180, attack: 72, defense: 95, speed: 28, luck: 42, intelligence: 88, risk: 35, power: 85,
    wins: 67, losses: 8, winStreak: 12, bestWinStreak: 12,
    personality: ['DOMINANT', 'PATIENT', 'CALCULATED', 'MARKET MOVER', 'LEGEND'],
    isDemo: true,
  },
  {
    walletAddress: 'demo_diamond_001',
    name: 'DIAMOND WRAITH',
    archetype: 'DIAMOND_HANDS',
    level: 11,
    xp: 8800,
    rarity: 'EPIC',
    hp: 145, attack: 55, defense: 115, speed: 38, luck: 58, intelligence: 72, risk: 28, power: 75,
    wins: 38, losses: 22, winStreak: 2, bestWinStreak: 8,
    personality: ['UNSHAKEABLE', 'PATIENT', 'ZEN', 'INDESTRUCTIBLE'],
    isDemo: true,
  },
  {
    walletAddress: 'demo_rug_001',
    name: 'THE RUG REAPER',
    archetype: 'RUG_SURVIVOR',
    level: 9,
    xp: 5600,
    rarity: 'RARE',
    hp: 95, attack: 78, defense: 62, speed: 55, luck: 72, intelligence: 82, risk: 45, power: 74,
    wins: 31, losses: 18, winStreak: 1, bestWinStreak: 6,
    personality: ['SCARRED', 'RESILIENT', 'PARANOID', 'UNKILLABLE'],
    isDemo: true,
  },
  {
    walletAddress: 'demo_nft_001',
    name: 'LEGENDARY NFT HUNTER',
    archetype: 'NFT_HUNTER',
    level: 7,
    xp: 3200,
    rarity: 'UNCOMMON',
    hp: 68, attack: 72, defense: 62, speed: 58, luck: 95, intelligence: 68, risk: 62, power: 70,
    wins: 18, losses: 14, winStreak: 0, bestWinStreak: 4,
    personality: ['COLLECTOR', 'ARTISTIC', 'SPECULATIVE', 'COMMUNITY-DRIVEN'],
    isDemo: true,
  },
  {
    walletAddress: 'demo_defi_001',
    name: 'YIELD ORACLE',
    archetype: 'DEFI_MAGE',
    level: 12,
    xp: 11200,
    rarity: 'EPIC',
    hp: 78, attack: 68, defense: 82, speed: 48, luck: 58, intelligence: 125, risk: 48, power: 78,
    wins: 45, losses: 20, winStreak: 4, bestWinStreak: 9,
    personality: ['ANALYTICAL', 'PATIENT', 'PROTOCOL-NATIVE', 'COMPOSABLE', 'VETERAN'],
    isDemo: true,
  },
  {
    walletAddress: 'demo_meme_001',
    name: 'MEME TITAN',
    archetype: 'MEME_LORD',
    level: 5,
    xp: 1800,
    rarity: 'COMMON',
    hp: 52, attack: 58, defense: 38, speed: 72, luck: 120, intelligence: 28, risk: 88, power: 62,
    wins: 12, losses: 20, winStreak: 0, bestWinStreak: 3,
    personality: ['CHAOTIC', 'UNHINGED', 'VIBES ONLY', 'INEXPLICABLY ALIVE'],
    isDemo: true,
  },
  {
    walletAddress: 'demo_samurai_001',
    name: 'THE SOL SAMURAI',
    archetype: 'SOLANA_SAMURAI',
    level: 14,
    xp: 16000,
    rarity: 'LEGENDARY',
    hp: 108, attack: 98, defense: 92, speed: 78, luck: 48, intelligence: 92, risk: 38, power: 92,
    wins: 58, losses: 12, winStreak: 8, bestWinStreak: 11,
    personality: ['HONORABLE', 'DISCIPLINED', 'SWIFT', 'NATIVE', 'VETERAN'],
    isDemo: true,
  },
  {
    walletAddress: 'demo_shadow_001',
    name: 'CHAIN PHANTOM',
    archetype: 'SHADOW_TRADER',
    level: 10,
    xp: 7200,
    rarity: 'RARE',
    hp: 58, attack: 102, defense: 55, speed: 88, luck: 58, intelligence: 72, risk: 58, power: 82,
    wins: 35, losses: 16, winStreak: 5, bestWinStreak: 10,
    personality: ['MYSTERIOUS', 'STEALTHY', 'PRECISE', 'RUTHLESS'],
    isDemo: true,
  },
  {
    walletAddress: 'demo_speed_001',
    name: 'TURBO BLITZ',
    archetype: 'SPEED_DEMON',
    level: 6,
    xp: 2400,
    rarity: 'UNCOMMON',
    hp: 38, attack: 72, defense: 38, speed: 135, luck: 68, intelligence: 58, risk: 82, power: 76,
    wins: 16, losses: 18, winStreak: 0, bestWinStreak: 4,
    personality: ['BLAZING FAST', 'IMPATIENT', 'RELENTLESS', 'ALWAYS FIRST'],
    isDemo: true,
  },
];

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wallet-wars');
    console.log('✅ Connected to MongoDB\n');

    // Seed achievements
    console.log('🏆 Seeding achievements...');
    for (const achievement of ACHIEVEMENTS_DATA) {
      await Achievement.findOneAndUpdate(
        { achievementId: achievement.achievementId },
        achievement,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Seeded ${ACHIEVEMENTS_DATA.length} achievements\n`);

    // Seed demo warriors
    console.log('⚔️  Seeding demo warriors...');
    const createdWarriors = [];
    for (const warrior of DEMO_WARRIORS) {
      const created = await Warrior.findOneAndUpdate(
        { walletAddress: warrior.walletAddress },
        {
          ...warrior,
          walletAnalysis: {
            walletAge: 200 + Math.floor(Math.random() * 500),
            transactionCount: 100 + Math.floor(Math.random() * 900),
            transactionFrequency: 1 + Math.random() * 9,
            tokenActivity: 30 + Math.floor(Math.random() * 70),
            nftActivity: 10 + Math.floor(Math.random() * 80),
            defiActivity: 20 + Math.floor(Math.random() * 70),
            tradingActivity: 20 + Math.floor(Math.random() * 80),
            holdingScore: 20 + Math.floor(Math.random() * 80),
            riskScore: 20 + Math.floor(Math.random() * 80),
            activityScore: 30 + Math.floor(Math.random() * 70),
            calculatedAt: new Date(),
          },
          achievements: [],
        },
        { upsert: true, new: true }
      );
      createdWarriors.push(created);
    }
    console.log(`✅ Seeded ${DEMO_WARRIORS.length} demo warriors\n`);

    // Seed demo battles
    console.log('⚡ Seeding demo battles...');
    let battleCount = 0;
    const battlePairs = [
      [0, 1], [2, 3], [4, 5], [6, 7], [8, 9],
      [0, 5], [1, 2], [3, 7], [4, 8], [6, 9],
      [0, 7], [1, 4], [2, 8], [3, 5], [6, 9],
    ];

    for (const [i, j] of battlePairs) {
      const p1 = createdWarriors[i];
      const p2 = createdWarriors[j];
      if (!p1 || !p2) continue;

      const battleSeed = generateBattleSeed(p1.walletAddress, p2.walletAddress);
      const battleInput = {
        playerOneWallet: p1.walletAddress,
        playerTwoWallet: p2.walletAddress,
        playerOne: { hp: p1.hp, attack: p1.attack, defense: p1.defense, speed: p1.speed, luck: p1.luck, intelligence: p1.intelligence, risk: p1.risk, archetype: p1.archetype, name: p1.name },
        playerTwo: { hp: p2.hp, attack: p2.attack, defense: p2.defense, speed: p2.speed, luck: p2.luck, intelligence: p2.intelligence, risk: p2.risk, archetype: p2.archetype, name: p2.name },
        battleSeed,
      };

      const result = runBattleEngine(battleInput);
      const winnerWallet = result.winner === 'playerOne' ? p1.walletAddress : p2.walletAddress;
      const loserWallet = result.winner === 'playerOne' ? p2.walletAddress : p1.walletAddress;

      const existingBattle = await Battle.findOne({ playerOneWallet: p1.walletAddress, playerTwoWallet: p2.walletAddress });
      if (!existingBattle) {
        await Battle.create({
          battleId: uuidv4(),
          playerOneWallet: p1.walletAddress,
          playerTwoWallet: p2.walletAddress,
          playerOneWarrior: p1._id,
          playerTwoWarrior: p2._id,
          winner: winnerWallet,
          loser: loserWallet,
          rounds: result.rounds,
          battleSeed,
          battleLog: result.battleLog,
          playerOneScore: result.playerOneScore,
          playerTwoScore: result.playerTwoScore,
          playerOneDamageDealt: result.playerOneDamageDealt,
          playerTwoDamageDealt: result.playerTwoDamageDealt,
          playerOneCriticalHits: result.playerOneCriticalHits,
          playerTwoCriticalHits: result.playerTwoCriticalHits,
          duration: result.duration,
          isDemo: true,
        });
        battleCount++;
      }
    }
    console.log(`✅ Seeded ${battleCount} demo battles\n`);

    // Seed today's daily challenge
    const today = new Date().toISOString().split('T')[0];
    await DailyChallenge.findOneAndUpdate(
      { date: today },
      {
        date: today,
        type: 'win_battles',
        title: 'WIN 3 BATTLES',
        description: 'Defeat 3 opponents in the arena today.',
        requirement: { type: 'wins', value: 3 },
        xpReward: 500,
      },
      { upsert: true }
    );
    console.log('✅ Seeded daily challenge\n');

    console.log('🎉 Seed complete! Database is ready.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
