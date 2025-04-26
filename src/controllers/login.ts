import { Request, Response } from 'express';
import querystring from 'querystring';
import {
  SPOTIFY_AUTH_URL,
  SPOTIFY_TOKEN_URL,
  USER_GRANT_PERMISSIONS,
} from '../consts/spotify';
import axios from 'axios';
import { envVariables } from '../config/config';
import { HOUR, MONTH } from '../consts/general';

const CLIENT_ID = envVariables.clientId;
const CLIENT_SECRET = envVariables.clientSecret;
const REDIRECT_URI = envVariables.redirectURI;

export const login = (_req: Request, res: Response) => {
  const authQuery = querystring.stringify({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: USER_GRANT_PERMISSIONS.join(' '),
  });
  res.redirect(`${SPOTIFY_AUTH_URL}?${authQuery}`);
};

export const callback = async (req: Request, res: Response) => {
  const code = req.query.code;

  try {
    const response = await axios.post(
      SPOTIFY_TOKEN_URL,
      querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token, resresh_token } = response.data;

    res.cookie('spotify_access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: HOUR,
    });

    res.cookie('spotify_refresh_token', resresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: MONTH,
    });

    res.redirect(`${envVariables.beatMatchURL}/login`);
  } catch (error) {
    res.status(400).json({ error: "Failed to get spotify's access token" });
  }
};
