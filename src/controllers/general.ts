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
    const searchedArtist: string = req.body.query;

    const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
      headers: generateSpotifyHeaders(req),
      params: {
        q: searchedArtist,
        type: 'artist',
        limit: 10,
      },
    });

    const data = await response.data;

    const artists: string[] = data.artists.items
      .map((artist: any) => artist.name)
      .filter((name: string) =>
        name.toLowerCase().includes(searchedArtist.toLowerCase())
      );

    return res.json(artists);
  } catch (error) {
    console.error('Error searching artists:', error);
    res.status(500).json({
      error: `Error searching artist: ${error.response?.statusText || error}`,
    });
  }
};

export const getGenres = async (req: Request, res: Response): Promise<void> => {
  try {
    const searchedGenre: string = encodeURIComponent(req.body.query);

    const filteredGenres = GENRE_SEEDS.filter((genre: string) =>
      genre.toLocaleLowerCase().startsWith(searchedGenre.toLocaleLowerCase())
    ).slice(0, 14);

    return res.json(filteredGenres);
  } catch (error) {
    console.error('Error searching genres:', error);

    res.status(500).json({
      error: `Error getting genres: ${error.response?.statusText || error}`,
    });
  }
};

export const getSongOptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const searchedTrack: string = req.body.query;

  if (!searchedTrack) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  try {
    const tracks: SpotifyTrack[] = await searchTracks(req, searchedTrack);

    const results: string[] = Array.from(
      new Set(tracks.map((track: SpotifyTrack) => track.name))
    );

    res.json(results);
  } catch (error) {
    console.error('Error searching songs:', error);

    res.status(500).json({
      error: `Error getting songs: ${error.response?.statusText || error}`,
    });
  }
};
