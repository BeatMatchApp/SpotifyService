import express from 'express';
import { getArtists } from '../controllers/general';

const router = express.Router();

router.post('/getArtists', getArtists);

export default router;
