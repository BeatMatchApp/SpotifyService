import express from 'express';
import { getAuthTokens, login, refreshToken } from '../controllers/auth';

const router = express.Router();

router.get('/login', login);
router.post('/resfreshToken', refreshToken);
router.post('/getTokens', getAuthTokens);

export default router;
