import { Response, NextFunction, Request } from 'express';
import { refreshToken } from '../controllers/auth';

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
        .status(401)
        .json({ message: 'Spotify tokens missing or expired' });
    }

    if (!spotifyAccessToken) {
      await refreshToken(req, res);
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Error while spotify auth proccess', error });
  }
};
