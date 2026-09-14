import { Request, Response, NextFunction } from 'express';
import { Warrior } from '../models/Warrior';
import { formatSuccess, formatError } from '../utils/helpers';

const LEADERBOARD_LIMIT = 50;

export const getLeaderboardController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = (req.query.category as string) || 'overall';
    const limit = Math.min(parseInt(req.query.limit as string) || 50, LEADERBOARD_LIMIT);

    let sortField: Record<string, 1 | -1> = { wins: -1, xp: -1 };

    switch (category) {
      case 'wins':
        sortField = { wins: -1 };
        break;
      case 'xp':
        sortField = { xp: -1 };
        break;
      case 'level':
        sortField = { level: -1, xp: -1 };
        break;
      case 'winStreak':
        sortField = { bestWinStreak: -1 };
        break;
      case 'whaleSlayers':
        sortField = { wins: -1 };
        break;
      case 'degens':
        sortField = { wins: -1 };
        break;
      case 'rugSurvivors':
        sortField = { wins: -1 };
        break;
      default:
        sortField = { wins: -1, xp: -1 };
    }

    const query: Record<string, unknown> = {};
    if (category === 'degens') query.archetype = 'DEGEN';
    if (category === 'rugSurvivors') query.archetype = 'RUG_SURVIVOR';

    const warriors = await Warrior.find(query)
      .sort(sortField)
      .limit(limit)
      .select('walletAddress name archetype level xp wins losses winStreak bestWinStreak rarity power isDemo');

    const leaderboard = warriors.map((w, index) => ({
      rank: index + 1,
      walletAddress: w.walletAddress,
      name: w.name,
      archetype: w.archetype,
      level: w.level,
      xp: w.xp,
      wins: w.wins,
      losses: w.losses,
      winStreak: w.winStreak,
      bestWinStreak: w.bestWinStreak,
      rarity: w.rarity,
      power: w.power,
      winRate: w.wins + w.losses > 0
        ? Math.round((w.wins / (w.wins + w.losses)) * 100)
        : 0,
      isDemo: w.isDemo,
    }));

    return res.status(200).json(formatSuccess({ leaderboard, category, total: leaderboard.length }));
  } catch (error) {
    next(error);
  }
};
