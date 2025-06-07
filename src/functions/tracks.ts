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

    const tracks = response.data.tracks.items;
    console.log('Found tracks:', tracks.length);

    const matchingTracks = tracks.filter((track: SpotifyTrack) => {
      const trackNameMatches = track.name.toLowerCase().includes(name.toLowerCase());

      const artistMatches = track.artists.some((artistObj: SpotifyArtist) =>
          artistObj.name.toLowerCase().includes(artist.toLowerCase())
      );

      return trackNameMatches && artistMatches;
    });

    console.log('Matching tracks:', matchingTracks.length);

    if (matchingTracks.length > 0) {
      return matchingTracks[0].uri;
    }

    return null;
  } catch (error) {
    console.error('Error searching song:', error.response?.data || error);
    throw new Error(`Error searching song: ${error.response?.data || error}`);
  }
};
