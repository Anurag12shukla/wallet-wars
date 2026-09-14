import { Router } from 'express';
import { getWarriorController, generateWarriorController } from '../controllers/walletController';

const router = Router();

router.get('/:wallet', getWarriorController);
router.post('/generate', generateWarriorController);

export default router;
