import express from 'express';
import {
  addSong,
  createPlaylist,
  validatePlaylist,
} from '../controllers/playlist';

const router = express.Router();

router.post('/createPlaylist', createPlaylist);
router.post('/addSong', addSong);
router.post('/validatePlaylist', validatePlaylist);

export default router;
