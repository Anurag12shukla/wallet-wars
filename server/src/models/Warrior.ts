import mongoose, { Schema, Document } from 'mongoose';

export interface IWarrior extends Document {
  walletAddress: string;
  name: string;
  archetype: string;
  level: number;
  xp: number;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
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
  walletAnalysis: {
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
    calculatedAt: Date;
  };
  achievements: string[];
  isDemo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WarriorSchema = new Schema<IWarrior>(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, required: true },
    archetype: { type: String, required: true },
    level: { type: Number, default: 1, min: 1 },
    xp: { type: Number, default: 0, min: 0 },
    rarity: {
      type: String,
      enum: ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'],
      default: 'COMMON',
    },
    hp: { type: Number, required: true, min: 1 },
    attack: { type: Number, required: true, min: 1 },
    defense: { type: Number, required: true, min: 1 },
    speed: { type: Number, required: true, min: 1 },
    luck: { type: Number, required: true, min: 1 },
    intelligence: { type: Number, required: true, min: 1 },
    risk: { type: Number, required: true, min: 1 },
    power: { type: Number, required: true, min: 1 },
    wins: { type: Number, default: 0, min: 0 },
    losses: { type: Number, default: 0, min: 0 },
    winStreak: { type: Number, default: 0, min: 0 },
    bestWinStreak: { type: Number, default: 0, min: 0 },
    personality: [{ type: String }],
    walletAnalysis: {
      walletAge: { type: Number, default: 0 },
      transactionCount: { type: Number, default: 0 },
      transactionFrequency: { type: Number, default: 0 },
      tokenActivity: { type: Number, default: 0 },
      nftActivity: { type: Number, default: 0 },
      defiActivity: { type: Number, default: 0 },
      tradingActivity: { type: Number, default: 0 },
      holdingScore: { type: Number, default: 0 },
      riskScore: { type: Number, default: 0 },
      activityScore: { type: Number, default: 0 },
      calculatedAt: { type: Date, default: Date.now },
    },
    achievements: [{ type: String }],
    isDemo: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for leaderboard queries
WarriorSchema.index({ wins: -1 });
WarriorSchema.index({ xp: -1 });
WarriorSchema.index({ level: -1 });
WarriorSchema.index({ winStreak: -1 });
WarriorSchema.index({ archetype: 1 });

// Virtual: win rate
WarriorSchema.virtual('winRate').get(function () {
  const total = this.wins + this.losses;
  return total === 0 ? 0 : Math.round((this.wins / total) * 100);
});

// Virtual: XP needed for next level
WarriorSchema.virtual('xpForNextLevel').get(function () {
  return Math.floor(100 * Math.pow(1.5, this.level - 1));
});

export const Warrior = mongoose.model<IWarrior>('Warrior', WarriorSchema);
