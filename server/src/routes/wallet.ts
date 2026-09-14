import { Router } from 'express';
import { analyzeWalletController, getWarriorController, generateWarriorController } from '../controllers/walletController';

const router = Router();

router.post('/analyze', analyzeWalletController);
router.get('/:wallet', getWarriorController);

export default router;
