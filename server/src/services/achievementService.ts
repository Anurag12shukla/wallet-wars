import { Warrior, IWarrior } from '../models/Warrior';
import { UserAchievement } from '../models/Achievement';
import { ACHIEVEMENTS_DATA } from '../utils/achievementsData';

export async function checkAndUnlockAchievements(
  walletAddress: string,
  warrior: IWarrior,
  battleResult?: {
    isWinner: boolean;
    criticalHits: number;
    rounds: number;
    opponentArchetype: string;
    isRoundsPerfect: boolean;
  }
): Promise<string[]> {
  const unlocked: string[] = [];

  for (const achievement of ACHIEVEMENTS_DATA) {
    // Skip already unlocked
    const existing = await UserAchievement.findOne({ walletAddress, achievementId: achievement.achievementId });
    if (existing) continue;

    let shouldUnlock = false;

    switch (achievement.requirements.type) {
      case 'wins':
        shouldUnlock = warrior.wins >= achievement.requirements.value;
        break;
      case 'level':
        shouldUnlock = warrior.level >= achievement.requirements.value;
        break;
      case 'winStreak':
        shouldUnlock = warrior.winStreak >= achievement.requirements.value;
        break;
      case 'bestWinStreak':
        shouldUnlock = warrior.bestWinStreak >= achievement.requirements.value;
        break;
      case 'firstWin':
        shouldUnlock = warrior.wins >= 1;
        break;
      case 'defeat_whale':
        shouldUnlock = battleResult?.isWinner && battleResult?.opponentArchetype === 'WHALE' ? true : false;
        break;
      case 'critical_hits_battle':
        shouldUnlock = battleResult ? battleResult.criticalHits >= achievement.requirements.value : false;
        break;
      case 'perfect_win':
        shouldUnlock = battleResult?.isRoundsPerfect && battleResult?.isWinner ? true : false;
        break;
      case 'archetype':
        shouldUnlock = warrior.archetype === achievement.requirements.type;
        break;
      case 'total_battles':
        shouldUnlock = warrior.wins + warrior.losses >= achievement.requirements.value;
        break;
    }

    if (shouldUnlock) {
      await UserAchievement.create({
        walletAddress,
        achievementId: achievement.achievementId,
        unlockedAt: new Date(),
        progress: achievement.requirements.value,
      });

      // Add XP for achievement
      await Warrior.updateOne(
        { walletAddress },
        { $addToSet: { achievements: achievement.achievementId }, $inc: { xp: achievement.xpReward } }
      );

      unlocked.push(achievement.achievementId);
    }
  }

  return unlocked;
}
