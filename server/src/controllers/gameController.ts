import { Request, Response, NextFunction } from 'express';
import { DailyChallenge, ChallengeProgress } from '../models/DailyChallenge';
import { Achievement, UserAchievement } from '../models/Achievement';
import { Warrior } from '../models/Warrior';
import { ACHIEVEMENTS_DATA } from '../utils/achievementsData';
import { formatSuccess, formatError } from '../utils/helpers';

const DAILY_CHALLENGES_POOL = [
  { type: 'win_battles', title: 'WIN 3 BATTLES', description: 'Defeat 3 opponents in the arena today.', requirement: { type: 'wins', value: 3 }, xpReward: 500 },
  { type: 'win_consecutive', title: 'WIN STREAK', description: 'Win 2 battles in a row.', requirement: { type: 'consecutive_wins', value: 2 }, xpReward: 400 },
  { type: 'critical_hits', title: 'CRITICAL MASTER', description: 'Land 5 critical hits across all battles.', requirement: { type: 'critical_hits', value: 5 }, xpReward: 450 },
  { type: 'battle_count', title: 'ARENA WARRIOR', description: 'Fight 5 battles today.', requirement: { type: 'battles', value: 5 }, xpReward: 350 },
  { type: 'win_high_level', title: 'GIANT SLAYER', description: 'Defeat a warrior 5 levels above you.', requirement: { type: 'level_diff_win', value: 5 }, xpReward: 750 },
];

function getDailyIndex(): number {
  const now = new Date();
  const daysSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
  return daysSinceEpoch % DAILY_CHALLENGES_POOL.length;
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export const getDailyChallengeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = getTodayDate();
    const { wallet } = req.query;

    let challenge = await DailyChallenge.findOne({ date: today });

    if (!challenge) {
      const idx = getDailyIndex();
      const pool = DAILY_CHALLENGES_POOL[idx];
      challenge = await DailyChallenge.create({
        date: today,
        type: pool.type,
        title: pool.title,
        description: pool.description,
        requirement: pool.requirement,
        xpReward: pool.xpReward,
      });
    }

    let progress = null;
    if (wallet) {
      progress = await ChallengeProgress.findOne({ walletAddress: (wallet as string).toLowerCase(), date: today });
    }

    return res.status(200).json(formatSuccess({ challenge, progress }));
  } catch (error) {
    next(error);
  }
};

export const updateChallengeProgressController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { walletAddress, progressAmount } = req.body;
    const today = getTodayDate();

    const challenge = await DailyChallenge.findOne({ date: today });
    if (!challenge) {
      return res.status(404).json(formatError('CHALLENGE_NOT_FOUND', 'No challenge for today.'));
    }

    const normalized = walletAddress.toLowerCase();
    let progress = await ChallengeProgress.findOne({ walletAddress: normalized, date: today });

    if (!progress) {
      progress = await ChallengeProgress.create({
        walletAddress: normalized,
        date: today,
        challengeType: challenge.type,
        progress: progressAmount || 1,
        completed: false,
      });
    } else if (!progress.completed) {
      progress.progress += progressAmount || 1;
      if (progress.progress >= challenge.requirement.value) {
        progress.completed = true;
        progress.completedAt = new Date();
        // Award XP
        await Warrior.updateOne({ walletAddress: normalized }, { $inc: { xp: challenge.xpReward } });
      }
      await progress.save();
    }

    return res.status(200).json(formatSuccess({ progress, challenge }));
  } catch (error) {
    next(error);
  }
};

export const getAchievementsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { wallet } = req.query;

    const allAchievements = ACHIEVEMENTS_DATA;

    if (wallet) {
      const normalized = (wallet as string).toLowerCase();
      const userAchievements = await UserAchievement.find({ walletAddress: normalized });
      const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));

      const achievementsWithStatus = allAchievements.map(a => ({
        ...a,
        unlocked: unlockedIds.has(a.achievementId),
        unlockedAt: userAchievements.find(ua => ua.achievementId === a.achievementId)?.unlockedAt,
      }));

      return res.status(200).json(formatSuccess(achievementsWithStatus));
    }

    return res.status(200).json(formatSuccess(allAchievements));
  } catch (error) {
    next(error);
  }
};

export const getStatsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalWarriors, totalBattles] = await Promise.all([
      Warrior.countDocuments(),
      (await import('../models/Battle.js')).Battle.countDocuments(),
    ]);

    const topWarrior = await Warrior.findOne().sort({ wins: -1 }).select('name archetype wins walletAddress');

    return res.status(200).json(formatSuccess({
      totalWarriors,
      totalBattles,
      topWarrior,
    }));
  } catch (error) {
    next(error);
  }
};
