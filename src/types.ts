export type ViewScreen = 'home' | 'live' | 'movies' | 'series' | 'catchup' | 'playlists' | 'settings';

export interface EpgProgram {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  synopsis: string;
  category: string;
}

export interface Channel {
  id: string;
  channelNumber: number;
  name: string;
  logo: string;
  category: 'Sports' | 'News' | 'Cinema' | 'Documentary' | 'Kids' | 'Music' | 'Entertainment' | '4K Ultra';
  currentShow: string;
  nextShow: string;
  progressPercent: number;
  resolution: '4K UHD' | 'FHD 1080p' | 'HD 720p';
  streamUrl: string;
  isFavorite?: boolean;
  epg: EpgProgram[];
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  duration: string;
  durationMinutes: number;
  poster: string;
  backdrop: string;
  genre: string[];
  plot: string;
  director: string;
  cast: string[];
  streamUrl: string;
  trailerUrl?: string;
  quality: '4K UHD' | 'FHD 1080p';
  audioTracks: string[];
  subtitleTracks: string[];
  isFeatured?: boolean;
  isFavorite?: boolean;
  progress?: number; // 0 to 100
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  duration: string;
  thumbnail: string;
  plot: string;
  streamUrl: string;
  progress?: number;
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface Series {
  id: string;
  title: string;
  year: number;
  rating: number;
  seasonsCount: number;
  episodesCount: number;
  poster: string;
  backdrop: string;
  genre: string[];
  synopsis: string;
  seasons: Season[];
  isFeatured?: boolean;
  isFavorite?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  type: 'm3u' | 'xtream' | 'demo';
  url: string;
  channelsCount: number;
  moviesCount: number;
  seriesCount: number;
  lastUpdated: string;
  isActive: boolean;
  serverUrl?: string;
  username?: string;
}

export type PlayableItem = 
  | { type: 'channel'; data: Channel }
  | { type: 'movie'; data: Movie }
  | { type: 'episode'; data: Episode; seriesTitle: string; seasonNumber: number };
