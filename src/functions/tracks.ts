import axios from 'axios';
import { SPOTIFY_API_URL } from '../consts/spotify';
import {
  SpotifySearchResponse,
  SpotifyTrack,
} from '../models/interfaces/SpotifySearch';
import { generateSpotifyHeaders } from '../consts/auth';

export const searchTracks = async (
  req: Request,
  query: string,
  limit = 15
): Promise<SpotifyTrack[]> => {
  try {
    const response = await axios.get<SpotifySearchResponse>(
      `${SPOTIFY_API_URL}/search?q=${encodeURIComponent(
        query
      )}&type=track&limit=${limit}`,
      { headers: generateSpotifyHeaders(req) }
    );

    return response.data.tracks.items;
  } catch (error) {
    throw new Error(`Error searching tracks: ${error.response?.data || error}`);
  }
};
