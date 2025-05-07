import { Response, NextFunction, Request } from 'express';
import { refreshToken } from '../controllers/login';
import { SPOTIFY_UNAUTHORIZED } from '../consts/auth';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const spotifyAccessToken = req.cookies.spotify_access_token;
    const spotifyRefreshToken = req.cookies.spotify_refresh_token;

    if (!spotifyAccessToken && !spotifyRefreshToken) {
      return res
        .status(SPOTIFY_UNAUTHORIZED)
        .json({ message: 'Spotify tokens missing or expired' });
    }

    if (!spotifyAccessToken) {
      await refreshToken(req, res);
    }

    next();
  } catch (error) {
    return res
      .status(SPOTIFY_UNAUTHORIZED)
      .json({ message: 'Error while spotify auth proccess', error });
  }
};
