import axios from 'axios';
import { Request, Response } from 'express';
import { SPOTIFY_API_URL } from '../consts/spotify';
import { generateSpotifyHeaders } from '../consts/auth';
import { GENRE_SEEDS } from '../consts/general';
import { SpotifyTrack } from '../models/interfaces/SpotifySearch';
import { searchTracks } from '../functions/tracks';

export const getArtists = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const artist: string = encodeURIComponent(req.body.query);
    const response = await axios.get(
      `${SPOTIFY_API_URL}/search?q=${artist}&type=artist&limit=15`,
      { headers: generateSpotifyHeaders(req) }
    );

    const data = await response.data;

    const artists: string[] = data.artists.items
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

export const getGenres = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: string = encodeURIComponent(
      req.body.query
    ).toLocaleLowerCase();

    const filteredGenres = GENRE_SEEDS.filter((genre: string) =>
      genre.toLocaleLowerCase().startsWith(query)
    ).slice(0, 14);

    res.json(filteredGenres);
  } catch (error) {
    console.error('Error searching genres:', error);

    res.status(500).json({
      error: `Error getting genres: ${error.message || error}`,
    });
  }
};

export const getSongOptions = async (req: Request, res: Response) => {
  const query: string = req.body.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  try {
    const tracks: SpotifyTrack[] = await searchTracks(req, query);

    const results = tracks.map((track: SpotifyTrack) => track.name);

    res.json(results);
  } catch (error) {
    console.error('Error searching songs:', error);

    res.status(500).json({ error: 'Failed to search for songs' });
  }
};
