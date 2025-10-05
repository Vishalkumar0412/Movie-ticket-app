import { Router } from 'express';
import { getMovies, getTheaters } from '../controllers/common.controller';

const router = Router();

router.get('/movies', getMovies);
router.get('/theaters', getTheaters);

export default router;