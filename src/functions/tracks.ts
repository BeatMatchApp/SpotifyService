import axios from 'axios';
import { Request } from 'express';
import { SPOTIFY_API_URL } from '../consts/spotify';
import {
  SpotifyArtist,
  SpotifySearchResponse,
  SpotifyTrack,
} from '../models/interfaces/SpotifySearch';
import { generateSpotifyHeaders } from '../consts/auth';
import { TrackDetails } from '../models/interfaces/Track';

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

export const getTrackUri = async (
  req: Request,
  trackDetails: TrackDetails
): Promise<string | null> => {
  const { name, artist } = trackDetails;

  try {
    const response = await axios.get<SpotifySearchResponse>(
      `${SPOTIFY_API_URL}/search?q=${encodeURIComponent(
        `track:${name} artist:${artist}`
      )}&type=track&limit=5`,
      { headers: generateSpotifyHeaders(req) }
    );
    const possibleSongsResponse: SpotifySearchResponse = response.data;

    const chosenTrackUri: SpotifyTrack[] =
      possibleSongsResponse.tracks.items.filter(
        (item: SpotifyTrack) =>
          item.name.toLowerCase().includes(name.toLowerCase()) &&
          item.artists
            .map((artist: SpotifyArtist) => artist.name.toLowerCase())
            .includes(artist.toLowerCase())
      );

    return chosenTrackUri?.[0]?.uri;
  } catch (error) {
    console.error('Error searching song:', error.response?.data || error);
    throw new Error(`Error searching song: ${error.response?.data || error}`);
  }
};
