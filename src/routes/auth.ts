import express from 'express';
import { login, refreshToken } from '../controllers/auth';

const router = express.Router();

router.get('/login', login);
router.post('/resfreshToken', refreshToken);

export default router;
