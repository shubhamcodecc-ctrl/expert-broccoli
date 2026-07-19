import { Router } from 'express';
import { VideoController } from '../controllers/videoController';
import { authenticate } from '../middleware/auth';
import { validateWatchLog, handleValidationErrors } from '../middleware/validation';

const router = Router();

router.use(authenticate);

router.get('/recommendations', VideoController.getRecommendations);
router.get('/:youtubeId', VideoController.getVideoDetails);
router.get('/:youtubeId/reliability-score', VideoController.getReliabilityScore);
router.post('/watch-history', validateWatchLog, handleValidationErrors, VideoController.logWatch);
router.get('/watch-history', VideoController.getWatchHistory);

export default router;
