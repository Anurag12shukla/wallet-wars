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
    walletAddress: 'demo_options_001',
    name: '0DTE GAMMA TITAN',
    archetype: 'OPTIONS_DEGEN',
    level: 9,
    xp: 5200,
    rarity: 'RARE',
    hp: 45, attack: 92, defense: 35, speed: 95, luck: 85, intelligence: 42, risk: 95, power: 85,
    wins: 28, losses: 14, winStreak: 4, bestWinStreak: 8,
    personality: ['CHAOTIC', 'GAMMA ADDICT', '0DTE BELIEVER', 'LEVERAGED TO THE HILT', 'VETERAN'],
    isDemo: true,
  },
  {
    walletAddress: 'demo_whale_001',
    name: 'THE ROBINHOOD LEVIATHAN',
    archetype: 'ROBINHOOD_WHALE',
    level: 16,
    xp: 21500,
    rarity: 'LEGENDARY',
    hp: 195, attack: 78, defense: 98, speed: 28, luck: 42, intelligence: 92, risk: 35, power: 92,
    wins: 74, losses: 9, winStreak: 14, bestWinStreak: 14,
    personality: ['DOMINANT', 'UNLIMITED BUYING POWER', 'CALCULATED', 'ORDER BOOK CRUSHER', 'LEGEND'],
    isDemo: true,
  },
  {
    walletAddress: 'demo_diamond_001',
    name: 'DIAMOND WRAITH',
    archetype: 'DIAMOND_HANDS',
    level: 11,
    xp: 8800,
    rarity: 'EPIC',
    hp: 155, attack: 55, defense: 125, speed: 38, luck: 58, intelligence: 72, risk: 25, power: 80,
    wins: 41, losses: 21, winStreak: 3, bestWinStreak: 9,
    personality: ['UNSHAKEABLE', 'NEVER SELLS', 'ZEN', 'INDESTRUCTIBLE'],
    isDemo: true,
  },
  {
    walletAddress: 'demo_margin_001',
    name: 'THE MARGIN REAPER',
    archetype: 'MARGIN_SURVIVOR',
    level: 10,
    xp: 6400,
    rarity: 'RARE',
    hp: 105, attack: 85, defense: 58, speed: 58, luck: 72, intelligence: 78, risk: 65, power: 78,
    wins: 34, losses: 18, winStreak: 2, bestWinStreak: 7,
    personality: ['SCARRED', 'RESILIENT', 'RUTHLESS', 'UNKILLABLE'],
    isDemo: true,
  },
  {
    walletAddress: 'demo_doge_001',
    name: 'DOGE MOON LORD',
    archetype: 'DOGE_KING',
    level: 6,
    xp: 2200,
    rarity: 'UNCOMMON',
    hp: 55, attack: 65, defense: 42, speed: 75, luck: 130, intelligence: 30, risk: 85, power: 68,
    wins: 16, losses: 18, winStreak: 1, bestWinStreak: 5,
    personality: ['MUCH WOW', 'UNHINGED', 'VIBES ONLY', 'MOON BOUND'],
    isDemo: true,
  },
  {
    walletAddress: 'demo_bogle_001',
    name: 'BOGLE COMPOUND SAGE',
    archetype: 'INDEX_MAXI',
    level: 13,
    xp: 12500,
    rarity: 'EPIC',
    hp: 140, attack: 58, defense: 105, speed: 45, luck: 50, intelligence: 115, risk: 20, power: 82,
    wins: 48, losses: 16, winStreak: 5, bestWinStreak: 10,
    personality: ['COMPOUNDER', 'STEADY', 'DISCIPLINED', 'LONG-TERM HORIZON', 'VETERAN'],
    isDemo: true,
  },
  {
    walletAddress: 'demo_gold_001',
    name: 'ROBINHOOD GOLD TITAN',
    archetype: 'ROBINHOOD_GOLD',
    level: 15,
    xp: 17800,
    rarity: 'LEGENDARY',
    hp: 115, attack: 105, defense: 95, speed: 82, luck: 55, intelligence: 95, risk: 35, power: 95,
    wins: 62, losses: 11, winStreak: 9, bestWinStreak: 13,
    personality: ['PREMIUM', 'GOLD TIER', 'HIGH YIELD', 'ROYALTY', 'VETERAN'],
    isDemo: true,
  },
  {
    walletAddress: 'demo_day_001',
    name: '9:30 AM CANDLE SNIPER',
    archetype: 'DAY_TRADER',
    level: 12,
    xp: 9800,
    rarity: 'RARE',
    hp: 65, attack: 108, defense: 52, speed: 110, luck: 65, intelligence: 75, risk: 60, power: 86,
    wins: 42, losses: 19, winStreak: 6, bestWinStreak: 11,
    personality: ['BLAZING FAST', '9:30 AM WARRIOR', 'CANDLE SNIPER', 'NEVER OVERNIGHT'],
    isDemo: true,
  },
  {
    walletAddress: 'demo_paper_001',
    name: 'PAPER DASH GHOST',
    archetype: 'PAPER_HANDS',
    level: 4,
    xp: 1200,
    rarity: 'COMMON',
    hp: 40, attack: 48, defense: 30, speed: 98, luck: 75, intelligence: 45, risk: 25, power: 55,
    wins: 9, losses: 15, winStreak: 0, bestWinStreak: 2,
    personality: ['ANXIOUS', 'QUICK TO SELL', 'LUCKY', 'SURPRISINGLY ALIVE'],
    isDemo: true,
  },
  {
    walletAddress: 'demo_quant_001',
    name: 'DELTA QUANT MATRIX',
    archetype: 'ALGO_QUANT',
    level: 14,
    xp: 15200,
    rarity: 'EPIC',
    hp: 85, attack: 95, defense: 75, speed: 80, luck: 45, intelligence: 135, risk: 30, power: 90,
    wins: 55, losses: 15, winStreak: 7, bestWinStreak: 12,
    personality: ['ANALYTICAL', 'QUANTITATIVE', 'SYSTEMATIC', 'COLD CALCULATOR', 'VETERAN'],
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
