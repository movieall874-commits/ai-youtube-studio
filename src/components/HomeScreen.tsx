import React from 'react';
import { 
  Play, 
  Info, 
  Plus, 
  Radio, 
  Film, 
  Clapperboard, 
  CalendarClock, 
  Sparkles, 
  Star, 
  Clock, 
  Check, 
  ArrowRight,
  TrendingUp,
  Tv
} from 'lucide-react';
import { Channel, Movie, Series, ViewScreen, PlayableItem } from '../types';

interface HomeScreenProps {
  channels: Channel[];
  movies: Movie[];
  series: Series[];
  onNavigate: (screen: ViewScreen) => void;
  onPlayItem: (item: PlayableItem) => void;
  onOpenMovieDetails: (movie: Movie) => void;
  onOpenSeriesDetails: (series: Series) => void;
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  channels,
  movies,
  series,
  onNavigate,
  onPlayItem,
  onOpenMovieDetails,
  onOpenSeriesDetails,
  watchlist,
  onToggleWatchlist,
}) => {
  // Featured hero movie
  const featuredMovie = movies.find(m => m.isFeatured) || movies[0];
  const continueWatchingList = movies.filter(m => (m.progress || 0) > 0);
  const liveChannels = channels.slice(0, 6);
  const trendingMovies = movies.slice(0, 8);

  const isInWatchlist = watchlist.includes(featuredMovie.id);

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Hero Billboard Banner */}
      <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden border border-purple-900/40 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        {/* Background Backdrop Image */}
        <img
          src={featuredMovie.backdrop}
          alt={featuredMovie.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
        />

        {/* Gradient Scrim Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c16] via-[#0a0c16]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c16] via-[#0a0c16]/80 to-transparent" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-purple-950/20 to-[#0a0c16]" />

        {/* Content Box */}
        <div className="absolute bottom-0 left-0 p-6 sm:p-10 max-w-2xl flex flex-col gap-3.5 z-10">
          {/* Badge & Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold tracking-wider text-[11px] shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-300" />
              FEATURED PREMIERE
            </span>
            <span className="px-2 py-0.5 rounded bg-[#1e2340]/90 text-purple-200 border border-purple-700/50 text-[11px]">
              {featuredMovie.quality}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-bold bg-[#1e2340]/90 px-2 py-0.5 rounded border border-amber-500/30 text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{featuredMovie.rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-300 font-medium text-[11px]">{featuredMovie.year}</span>
            <span className="text-gray-400 text-[11px]">•</span>
            <span className="text-gray-300 font-medium text-[11px]">{featuredMovie.duration}</span>
          </div>

          {/* Title */}
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-none drop-shadow-md">
            {featuredMovie.title}
          </h1>

          {/* Plot Synopsis */}
          <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl">
            {featuredMovie.plot}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onPlayItem({ type: 'movie', data: featuredMovie })}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>WATCH NOW</span>
            </button>

            <button
              onClick={() => onOpenMovieDetails(featuredMovie)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a1e38]/90 hover:bg-[#252b4e] border border-purple-700/50 text-purple-200 font-semibold text-xs sm:text-sm transition-all"
            >
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Details & Trailer</span>
            </button>

            <button
              onClick={() => onToggleWatchlist(featuredMovie.id)}
              className={`p-2.5 rounded-xl border transition-all ${
                isInWatchlist
                  ? 'bg-purple-900/60 border-purple-500 text-purple-300'
                  : 'bg-[#1a1e38]/90 border-purple-800/40 text-gray-300 hover:text-white hover:bg-[#252b4e]'
              }`}
              title={isInWatchlist ? 'Remove from My List' : 'Add to My List'}
            >
              {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* The 4 Core Hub Tiles (Signature Purple Player Interface) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Live TV */}
        <div
          onClick={() => onNavigate('live')}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#161a36] to-[#0f1224] p-5 border border-purple-900/40 hover:border-cyan-500/60 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:-translate-y-1 cursor-pointer"
        >
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-cyan-500/10 blur-2xl group-hover:bg-cyan-500/20 transition-all" />
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <Radio className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              LIVE
            </span>
          </div>
          <div className="mt-4">
            <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
              Live TV
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              3,420+ Global Channels with EPG Guide
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-purple-900/30 flex items-center justify-between text-xs font-semibold text-cyan-400">
            <span>Watch Live Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Tile 2: Movies */}
        <div
          onClick={() => onNavigate('movies')}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#161a36] to-[#0f1224] p-5 border border-purple-900/40 hover:border-purple-500/60 transition-all duration-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] hover:-translate-y-1 cursor-pointer"
        >
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-purple-500/10 blur-2xl group-hover:bg-purple-500/20 transition-all" />
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Film className="w-6 h-6" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              4K VOD
            </span>
          </div>
          <div className="mt-4">
            <h3 className="font-display font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
              Movies
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              9,800+ 4K Cinema Releases & Classics
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-purple-900/30 flex items-center justify-between text-xs font-semibold text-purple-400">
            <span>Browse Library</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Tile 3: Series */}
        <div
          onClick={() => onNavigate('series')}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#161a36] to-[#0f1224] p-5 border border-purple-900/40 hover:border-indigo-500/60 transition-all duration-300 hover:shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:-translate-y-1 cursor-pointer"
        >
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all" />
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <Clapperboard className="w-6 h-6" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              SERIES
            </span>
          </div>
          <div className="mt-4">
            <h3 className="font-display font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
              TV Shows
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              1,450+ Complete Multi-Season Boxsets
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-purple-900/30 flex items-center justify-between text-xs font-semibold text-indigo-400">
            <span>Explore Shows</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Tile 4: Catch-up & EPG */}
        <div
          onClick={() => onNavigate('catchup')}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#161a36] to-[#0f1224] p-5 border border-purple-900/40 hover:border-amber-500/60 transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:-translate-y-1 cursor-pointer"
        >
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-amber-500/10 blur-2xl group-hover:bg-amber-500/20 transition-all" />
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <CalendarClock className="w-6 h-6" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              7-DAYS
            </span>
          </div>
          <div className="mt-4">
            <h3 className="font-display font-bold text-lg text-white group-hover:text-amber-300 transition-colors">
              EPG & Catch-up
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Electronic Program Schedules & Past Airings
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-purple-900/30 flex items-center justify-between text-xs font-semibold text-amber-400">
            <span>View Timeline</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Continue Watching Section */}
      {continueWatchingList.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <h2 className="font-display font-bold text-lg text-white">
                Continue Watching
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {continueWatchingList.map((movie) => (
              <div
                key={movie.id}
                onClick={() => onPlayItem({ type: 'movie', data: movie })}
                className="group relative rounded-xl overflow-hidden bg-[#12162d] border border-purple-900/30 hover:border-purple-500/60 transition-all cursor-pointer"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={movie.backdrop}
                    alt={movie.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    <div className="w-10 h-10 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>
                  {/* Progress Bar at bottom of thumbnail */}
                  <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gray-700/80">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-400" 
                      style={{ width: `${movie.progress}%` }} 
                    />
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="font-semibold text-xs text-white truncate group-hover:text-purple-300 transition-colors">
                    {movie.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                    <span>{movie.duration}</span>
                    <span className="text-purple-300 font-medium">{movie.progress}% watched</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Live TV Channels */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h2 className="font-display font-bold text-lg text-white">
              Trending Live Channels
            </h2>
          </div>
          <button
            onClick={() => onNavigate('live')}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>View All Channels</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {liveChannels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => onPlayItem({ type: 'channel', data: channel })}
              className="group flex items-center gap-3.5 p-3 rounded-xl bg-[#12162d] border border-purple-900/30 hover:border-cyan-500/50 hover:bg-[#181d3a] transition-all cursor-pointer"
            >
              {/* Channel Logo */}
              <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-black border border-purple-800/40">
                <img
                  src={channel.logo}
                  alt={channel.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-0 right-0 px-1 py-0.2 text-[9px] font-black bg-purple-900/90 text-cyan-300 rounded-tl">
                  {channel.resolution === '4K UHD' ? '4K' : 'HD'}
                </span>
              </div>

              {/* Info & Live show */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-purple-400">CH {channel.channelNumber}</span>
                    <span className="text-xs font-bold text-white truncate">{channel.name}</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                </div>

                <p className="text-[11px] text-gray-300 truncate mt-0.5">
                  {channel.currentShow}
                </p>

                {/* Broadcast progress bar */}
                <div className="w-full h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                    style={{ width: `${channel.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Play button */}
              <div className="p-2 rounded-lg bg-purple-950/60 text-purple-300 group-hover:bg-cyan-500 group-hover:text-black transition-colors flex-shrink-0">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Movies Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <h2 className="font-display font-bold text-lg text-white">
              Trending Movies & Premieres
            </h2>
          </div>
          <button
            onClick={() => onNavigate('movies')}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>Explore Movies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {trendingMovies.map((movie, index) => (
            <div
              key={movie.id}
              className="group relative rounded-xl overflow-hidden bg-[#12162d] border border-purple-900/30 hover:border-purple-500/60 transition-all hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] cursor-pointer"
            >
              {/* Poster Image */}
              <div className="relative aspect-[2/3] w-full overflow-hidden">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Rating Badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/80 text-amber-400 text-[10px] font-bold backdrop-blur-xs">
                  <Star className="w-2.5 h-2.5 fill-amber-400" />
                  <span>{movie.rating.toFixed(1)}</span>
                </div>

                {/* 4K Badge */}
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-purple-950/90 text-purple-300 border border-purple-700/50 text-[9px] font-black">
                  {movie.quality}
                </span>

                {/* Quick Hover Action Overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayItem({ type: 'movie', data: movie });
                    }}
                    className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                    title="Play Movie"
                  >
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenMovieDetails(movie);
                    }}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold border border-white/20"
                  >
                    Details
                  </button>
                </div>
              </div>

              {/* Movie Info */}
              <div className="p-2.5">
                <h4 className="font-semibold text-xs text-white truncate group-hover:text-purple-300 transition-colors">
                  {movie.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                  <span>{movie.year}</span>
                  <span>{movie.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
