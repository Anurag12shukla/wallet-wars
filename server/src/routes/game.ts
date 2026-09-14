import { Router } from 'express';
import {
  getDailyChallengeController,
  updateChallengeProgressController,
  getAchievementsController,
  getStatsController,
} from '../controllers/gameController';

const router = Router();

router.get('/daily-challenge', getDailyChallengeController);
router.post('/daily-challenge/progress', updateChallengeProgressController);
router.get('/achievements', getAchievementsController);
router.get('/stats', getStatsController);

export default router;
