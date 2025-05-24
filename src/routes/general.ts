import express from 'express';
import { getArtists, getGenres, getSongOptions } from '../controllers/general';

const router = express.Router();

router.post('/getArtists', getArtists);
router.post('/getGenres', getGenres);
router.post('/getSongs', getSongOptions);

export default router;
