import { Router } from 'express';
import { createBattleController, getBattleController, getBattleShareController } from '../controllers/battleController';

const router = Router();

router.post('/', createBattleController);
router.get('/:battleId', getBattleController);
router.get('/:battleId/share', getBattleShareController);

export default router;
