import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Battle } from '../models/Battle';
import { Warrior } from '../models/Warrior';
import { runBattleEngine, generateBattleSeed, calculateXpReward, calculateLevel } from '../services/battleEngine';
import { checkAndUnlockAchievements } from '../services/achievementService';
import { isValidRobinhoodOrWalletAddress, formatSuccess, formatError } from '../utils/helpers';
import { findOrCreateWarrior } from '../utils/demoWarriors';

export const createBattleController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { playerOneWallet, playerTwoWallet } = req.body;

    if (!playerOneWallet || !playerTwoWallet) {
      return res.status(400).json(formatError('MISSING_WALLETS', 'Both wallet addresses are required.'));
    }

    // Handle demo battles
    const isDemo = playerOneWallet.startsWith('demo_') || playerTwoWallet.startsWith('demo_');

    if (!isValidRobinhoodOrWalletAddress(playerOneWallet) || !isValidRobinhoodOrWalletAddress(playerTwoWallet)) {
      return res.status(400).json(formatError('INVALID_WALLET', 'One or both wallet addresses are invalid.'));
    }

    const p1Normalized = playerOneWallet.toLowerCase();
    const p2Normalized = playerTwoWallet.toLowerCase();

    if (p1Normalized === p2Normalized) {
      return res.status(400).json(formatError('SAME_WALLET', 'Cannot battle yourself.'));
    }

    // Load or generate warriors
    const [p1Warrior, p2Warrior] = await Promise.all([
      findOrCreateWarrior(playerOneWallet),
      findOrCreateWarrior(playerTwoWallet),
    ]);

    if (!p1Warrior || !p2Warrior) {
      return res.status(404).json(formatError('WARRIOR_NOT_FOUND', 'Could not find or create warriors for the given wallets.'));
    }

    // Run the battle
    const battleSeed = generateBattleSeed(p1Normalized, p2Normalized);
    const battleInput = {
      playerOneWallet: p1Normalized,
      playerTwoWallet: p2Normalized,
      playerOne: {
        hp: p1Warrior.hp,
        attack: p1Warrior.attack,
        defense: p1Warrior.defense,
        speed: p1Warrior.speed,
        luck: p1Warrior.luck,
        intelligence: p1Warrior.intelligence,
        risk: p1Warrior.risk,
        archetype: p1Warrior.archetype,
        name: p1Warrior.name,
      },
      playerTwo: {
        hp: p2Warrior.hp,
        attack: p2Warrior.attack,
        defense: p2Warrior.defense,
        speed: p2Warrior.speed,
        luck: p2Warrior.luck,
        intelligence: p2Warrior.intelligence,
        risk: p2Warrior.risk,
        archetype: p2Warrior.archetype,
        name: p2Warrior.name,
      },
      battleSeed,
    };

    const battleResult = runBattleEngine(battleInput);

    const winnerWallet = battleResult.winner === 'playerOne' ? p1Normalized : p2Normalized;
    const loserWallet = battleResult.winner === 'playerOne' ? p2Normalized : p1Normalized;

    const battleId = uuidv4();

    // Save battle
    const battle = await Battle.create({
      battleId,
      playerOneWallet: p1Normalized,
      playerTwoWallet: p2Normalized,
      playerOneWarrior: p1Warrior._id,
      playerTwoWarrior: p2Warrior._id,
      winner: winnerWallet,
      loser: loserWallet,
      rounds: battleResult.rounds,
      battleSeed,
      battleLog: battleResult.battleLog,
      playerOneScore: battleResult.playerOneScore,
      playerTwoScore: battleResult.playerTwoScore,
      playerOneDamageDealt: battleResult.playerOneDamageDealt,
      playerTwoDamageDealt: battleResult.playerTwoDamageDealt,
      playerOneCriticalHits: battleResult.playerOneCriticalHits,
      playerTwoCriticalHits: battleResult.playerTwoCriticalHits,
      duration: battleResult.duration,
      isDemo,
    });

    const p1Won = battleResult.winner === 'playerOne';
    const p2Won = !p1Won;
    const levelDiff1 = p1Warrior.level - p2Warrior.level;
    const levelDiff2 = p2Warrior.level - p1Warrior.level;

    const p1Xp = calculateXpReward(battleResult, p1Won, levelDiff1);
    const p2Xp = calculateXpReward(battleResult, p2Won, levelDiff2);

    // Update warrior stats
    const p1NewXp = p1Warrior.xp + p1Xp;
    const p2NewXp = p2Warrior.xp + p2Xp;

    const p1UpdateDoc: Record<string, any> = {
      $inc: {
        wins: p1Won ? 1 : 0,
        losses: p1Won ? 0 : 1,
        xp: p1Xp,
        ...(p1Won ? { winStreak: 1 } : {}),
      },
      $set: {
        level: calculateLevel(p1NewXp),
        ...(!p1Won ? { winStreak: 0 } : {}),
      },
      $max: { bestWinStreak: p1Won ? p1Warrior.winStreak + 1 : p1Warrior.bestWinStreak },
    };

    const p2UpdateDoc: Record<string, any> = {
      $inc: {
        wins: p2Won ? 1 : 0,
        losses: p2Won ? 0 : 1,
        xp: p2Xp,
        ...(p2Won ? { winStreak: 1 } : {}),
      },
      $set: {
        level: calculateLevel(p2NewXp),
        ...(!p2Won ? { winStreak: 0 } : {}),
      },
      $max: { bestWinStreak: p2Won ? p2Warrior.winStreak + 1 : p2Warrior.bestWinStreak },
    };

    await Warrior.updateOne({ walletAddress: p1Normalized }, p1UpdateDoc);
    await Warrior.updateOne({ walletAddress: p2Normalized }, p2UpdateDoc);

    // Fetch updated warriors for achievement check
    const p1Updated = await Warrior.findOne({ walletAddress: p1Normalized });
    const p2Updated = await Warrior.findOne({ walletAddress: p2Normalized });

    // Check achievements (non-blocking)
    const achievementsUnlocked: string[] = [];
    if (p1Updated && !isDemo) {
      const p1Achievements = await checkAndUnlockAchievements(p1Normalized, p1Updated, {
        isWinner: p1Won,
        criticalHits: battleResult.playerOneCriticalHits,
        rounds: battleResult.rounds.length,
        opponentArchetype: p2Warrior.archetype,
        isRoundsPerfect: p2Warrior.hp > 0 && battleResult.playerTwoDamageDealt === 0,
      });
      achievementsUnlocked.push(...p1Achievements);
    }

    return res.status(201).json(formatSuccess({
      battleId,
      winner: winnerWallet,
      loser: loserWallet,
      rounds: battleResult.rounds,
      battleLog: battleResult.battleLog,
      playerOneScore: battleResult.playerOneScore,
      playerTwoScore: battleResult.playerTwoScore,
      playerOneDamageDealt: battleResult.playerOneDamageDealt,
      playerTwoDamageDealt: battleResult.playerTwoDamageDealt,
      playerOneCriticalHits: battleResult.playerOneCriticalHits,
      playerTwoCriticalHits: battleResult.playerTwoCriticalHits,
      xpAwarded: {
        playerOne: p1Xp,
        playerTwo: p2Xp,
      },
      achievementsUnlocked,
      playerOneWarrior: p1Updated,
      playerTwoWarrior: p2Updated,
    }));
  } catch (error) {
    next(error);
  }
};

export const getBattleController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { battleId } = req.params;

    const battle = await Battle.findOne({ battleId })
      .populate('playerOneWarrior')
      .populate('playerTwoWarrior');

    if (!battle) {
      return res.status(404).json(formatError('BATTLE_NOT_FOUND', 'Battle not found.'));
    }

    return res.status(200).json(formatSuccess(battle));
  } catch (error) {
    next(error);
  }
};

export const getBattleShareController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { battleId } = req.params;

    const battle = await Battle.findOne({ battleId })
      .populate('playerOneWarrior', 'name archetype level rarity')
      .populate('playerTwoWarrior', 'name archetype level rarity');

    if (!battle) {
      return res.status(404).json(formatError('BATTLE_NOT_FOUND', 'Battle not found.'));
    }

    // Return a share-friendly summary
    return res.status(200).json(formatSuccess({
      battleId: battle.battleId,
      winner: battle.winner,
      loser: battle.loser,
      rounds: battle.rounds.length,
      playerOneWarrior: battle.playerOneWarrior,
      playerTwoWarrior: battle.playerTwoWarrior,
      battleLog: battle.battleLog,
      createdAt: battle.createdAt,
    }));
  } catch (error) {
    next(error);
  }
};
