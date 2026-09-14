import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  achievementId: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  xpReward: number;
  requirements: {
    type: string;
    value: number;
    description: string;
  };
  category: string;
}

const AchievementSchema = new Schema<IAchievement>({
  achievementId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: '🏆' },
  rarity: {
    type: String,
    enum: ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'],
    default: 'COMMON',
  },
  xpReward: { type: Number, default: 100 },
  requirements: {
    type: { type: String, required: true },
    value: { type: Number, required: true },
    description: { type: String, required: true },
  },
  category: { type: String, default: 'general' },
});

export const Achievement = mongoose.model<IAchievement>('Achievement', AchievementSchema);

export interface IUserAchievement extends Document {
  walletAddress: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number;
}

const UserAchievementSchema = new Schema<IUserAchievement>({
  walletAddress: { type: String, required: true, lowercase: true, index: true },
  achievementId: { type: String, required: true },
  unlockedAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 },
});

UserAchievementSchema.index({ walletAddress: 1, achievementId: 1 }, { unique: true });

export const UserAchievement = mongoose.model<IUserAchievement>('UserAchievement', UserAchievementSchema);
