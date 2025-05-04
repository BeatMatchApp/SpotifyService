import axios from 'axios';
import { Request, Response } from 'express';
import { SPOTIFY_API_URL } from '../consts/spotify';
import { generateSpotifyHeaders } from '../consts/auth';

export const getArtists = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const artist: string = encodeURIComponent(req.body.query);
    const response = await axios.get(
      `${SPOTIFY_API_URL}/search?q=${artist}&type=artist&limit=10`,
      { headers: generateSpotifyHeaders(req) }
    );

    const data = await response.data;

    const artists = data.artists.items
      .map((artist: any) => artist.name)
      .filter((name: string) =>
        name.toLowerCase().includes(artist.toLowerCase())
      );

    res.json(artists);
  } catch (error) {
    res.status(500).json({
      error: `Error searching artist: ${error.response?.data || error}`,
    });
  }
};
