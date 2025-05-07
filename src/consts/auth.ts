import { Request, Response } from 'express';
import { HOUR, MONTH } from './general';

export const generateSpotifyHeaders = (req: Request) => {
  const tokens = getTokens(req);
  if (tokens.accessToken) {
    return {
      Authorization: `Bearer ${tokens.accessToken}`,
    };
  }
  return {};
};

export const getTokens = (req: Request) => {
  const accessToken = req.cookies.spotify_access_token;
  const refreshToken = req.cookies.spotify_refresh_token;

  return {
    accessToken,
    refreshToken,
  };
};

export const createTokenCookies = (
  res: Response,
  accessToken: string,
  refreshToken?: string
) => {
  res.cookie('spotify_access_token', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: HOUR,
  });

  if (refreshToken) {
    res.cookie('spotify_refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: MONTH,
    });
  }
};

export const SPOTIFY_UNAUTHORIZED = 498;
