import express from 'express';
import {
  addSongs,
  createPlaylist,
  validatePlaylist,
  getPlaylists,
  getPlaylist,
  updatePlaylist,
  deletePlaylist,
} from '../controllers/playlist';

const router = express.Router();

router.post('/createPlaylist', createPlaylist);
router.post('/addSongs', addSongs);
router.get('/:playlistId', getPlaylist);
router.get('/', getPlaylists);
router.post('/validatePlaylist', validatePlaylist);
router.post('/updatePlaylist', updatePlaylist);
router.post('/deletePlaylist', deletePlaylist);

export default router;
