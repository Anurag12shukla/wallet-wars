import { Request, Response, NextFunction } from 'express';
import { analyzeWallet } from '../services/walletAnalysis';
import { Warrior } from '../models/Warrior';
import { isValidRobinhoodOrWalletAddress, formatSuccess, formatError } from '../utils/helpers';
import { findOrCreateWarrior, DEMO_WARRIORS_DATA } from '../utils/demoWarriors';

export const analyzeWalletController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json(formatError('MISSING_WALLET', 'Wallet address is required.'));
    }

    if (!isValidRobinhoodOrWalletAddress(walletAddress)) {
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

    const normalized = wallet.trim().toLowerCase();
    let warrior = await Warrior.findOne({ walletAddress: normalized });

    if (!warrior) {
      const demoPreset = DEMO_WARRIORS_DATA.find(d => d.walletAddress.toLowerCase() === normalized);
      if (demoPreset) {
        try {
          warrior = await Warrior.create({ ...demoPreset, walletAddress: normalized });
        } catch {
          warrior = await Warrior.findOne({ walletAddress: normalized });
        }
      }
    }

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

    if (!isValidRobinhoodOrWalletAddress(walletAddress)) {
      return res.status(400).json(formatError('INVALID_WALLET', 'The wallet address is invalid.'));
    }

    const normalized = walletAddress.trim().toLowerCase();
    const existing = await Warrior.findOne({ walletAddress: normalized });
    if (existing) {
      return res.status(200).json(formatSuccess({ warrior: existing, isNew: false }));
    }

    const warrior = await findOrCreateWarrior(walletAddress);
    return res.status(201).json(formatSuccess({ warrior, isNew: true }));
  } catch (error) {
    next(error);
  }
};
