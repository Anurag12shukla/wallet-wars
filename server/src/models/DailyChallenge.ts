import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyChallenge extends Document {
  date: string;
  type: string;
  title: string;
  description: string;
  requirement: {
    type: string;
    value: number;
  };
  xpReward: number;
}

const DailyChallengeSchema = new Schema<IDailyChallenge>({
  date: { type: String, required: true, unique: true, index: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirement: {
    type: { type: String, required: true },
    value: { type: Number, required: true },
  },
  xpReward: { type: Number, default: 500 },
});

export const DailyChallenge = mongoose.model<IDailyChallenge>('DailyChallenge', DailyChallengeSchema);

export interface IChallengeProgress extends Document {
  walletAddress: string;
  date: string;
  challengeType: string;
  progress: number;
  completed: boolean;
  completedAt?: Date;
}

const ChallengeProgressSchema = new Schema<IChallengeProgress>({
  walletAddress: { type: String, required: true, lowercase: true },
  date: { type: String, required: true },
  challengeType: { type: String, required: true },
  progress: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
});

ChallengeProgressSchema.index({ walletAddress: 1, date: 1 }, { unique: true });

export const ChallengeProgress = mongoose.model<IChallengeProgress>('ChallengeProgress', ChallengeProgressSchema);
