import { Request, Response, NextFunction } from 'express';
import { analyzeWallet } from '../services/walletAnalysis';
import { generateWarriorFromAnalysis } from '../services/warriorGenerator';
import { Warrior } from '../models/Warrior';
import { isValidSolanaAddress, formatSuccess, formatError } from '../utils/helpers';

export const analyzeWalletController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json(formatError('MISSING_WALLET', 'Wallet address is required.'));
    }

    if (!isValidSolanaAddress(walletAddress)) {
      return res.status(400).json(formatError('INVALID_WALLET', 'The wallet address is invalid.'));
    }

    const analysis = await analyzeWallet(walletAddress);
    return res.status(200).json(formatSuccess(analysis));
  } catch (error) {
    next(error);
  }
};

export const getWarriorController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { wallet } = req.params;

    if (!wallet) {
      return res.status(400).json(formatError('MISSING_WALLET', 'Wallet address is required.'));
    }

    const warrior = await Warrior.findOne({ walletAddress: wallet.toLowerCase() });

    if (!warrior) {
      return res.status(404).json(formatError('WARRIOR_NOT_FOUND', 'Warrior not found for this wallet.'));
    }

    return res.status(200).json(formatSuccess(warrior));
  } catch (error) {
    next(error);
  }
};

export const generateWarriorController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json(formatError('MISSING_WALLET', 'Wallet address is required.'));
    }

    if (!isValidSolanaAddress(walletAddress)) {
      return res.status(400).json(formatError('INVALID_WALLET', 'The wallet address is invalid.'));
    }

    const normalized = walletAddress.trim().toLowerCase();

    // Return existing warrior if already generated
    const existing = await Warrior.findOne({ walletAddress: normalized });
    if (existing) {
      return res.status(200).json(formatSuccess({ warrior: existing, isNew: false }));
    }

    // Analyze wallet and generate warrior
    const analysis = await analyzeWallet(walletAddress);
    const warriorData = generateWarriorFromAnalysis(analysis);

    const warrior = await Warrior.create(warriorData);

    return res.status(201).json(formatSuccess({ warrior, isNew: true }));
  } catch (error) {
    next(error);
  }
};
