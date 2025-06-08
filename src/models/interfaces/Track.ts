export interface TrackDetails {
  name: string;
  artist: string;
}

export interface TrackSpotifyDetails extends TrackDetails {
  trackUri: string;
}
