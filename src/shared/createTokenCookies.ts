import { Response } from 'express';
import { HOUR, MONTH } from '../consts/general';

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
