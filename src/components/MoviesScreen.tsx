import React, { useState } from 'react';
import { 
  Play, 
  Info, 
  Plus, 
  Check, 
  Star, 
  Sparkles, 
  Film, 
  Filter, 
  ArrowUpDown,
  Search
} from 'lucide-react';
import { Movie, PlayableItem } from '../types';

interface MoviesScreenProps {
  movies: Movie[];
  onPlayItem: (item: PlayableItem) => void;
  onOpenMovieDetails: (movie: Movie) => void;
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
}

export const MoviesScreen: React.FC<MoviesScreenProps> = ({
  movies,
  onPlayItem,
  onOpenMovieDetails,
  watchlist,
  onToggleWatchlist,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'year' | 'title'>('rating');
  const [filter4kOnly, setFilter4kOnly] = useState<boolean>(false);
  const [localSearch, setLocalSearch] = useState<string>('');

  const genres = [
    'All',
    'Favorites',
    'Sci-Fi',
    'Action',
    'Thriller',
    'Drama',
    'Animation',
    'Crime',
    'Comedy',
  ];

  // Filtering
  const filteredMovies = movies
    .filter((movie) => {
      if (filter4kOnly && movie.quality !== '4K UHD') return false;
      if (selectedGenre === 'Favorites') return watchlist.includes(movie.id);
      if (selectedGenre !== 'All' && !movie.genre.includes(selectedGenre)) return false;
      if (localSearch) {
        const query = localSearch.toLowerCase();
        const matchesTitle = movie.title.toLowerCase().includes(query);
        const matchesCast = movie.cast.some(c => c.toLowerCase().includes(query));
        const matchesPlot = movie.plot.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCast && !matchesPlot) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'year') return b.year - a.year;
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0e1124] p-4 rounded-2xl border border-purple-900/40">
        {/* Genre Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {genres.map((genre) => {
            const isActive = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'bg-[#141830] text-gray-300 hover:text-white hover:bg-purple-950/40 border border-purple-900/30'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>

        {/* Secondary filters & Sort */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* 4K Toggle */}
          <button
            onClick={() => setFilter4kOnly(!filter4kOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              filter4kOnly
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-[#141830] text-gray-400 border-purple-900/40 hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>4K UHD Only</span>
          </button>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 bg-[#141830] border border-purple-900/40 rounded-xl px-2.5 py-1.5 text-xs text-gray-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-gray-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              <option value="rating" className="bg-[#0e1124]">Highest Rated</option>
              <option value="year" className="bg-[#0e1124]">Latest Releases</option>
              <option value="title" className="bg-[#0e1124]">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      {filteredMovies.length === 0 ? (
        <div className="p-16 text-center bg-[#0e1124] rounded-2xl border border-purple-900/40 text-gray-400">
          <Film className="w-12 h-12 text-purple-500/40 mx-auto mb-3" />
          <h3 className="font-display font-bold text-base text-white">No Movies Found</h3>
          <p className="text-xs text-gray-400 mt-1">Try switching categories or clearing search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMovies.map((movie) => {
            const isWatchlisted = watchlist.includes(movie.id);

            return (
              <div
                key={movie.id}
                onClick={() => onOpenMovieDetails(movie)}
                className="group relative rounded-xl overflow-hidden bg-[#12162d] border border-purple-900/30 hover:border-purple-500/60 transition-all duration-300 hover:shadow-[0_8px_25px_rgba(147,51,234,0.25)] hover:-translate-y-1 cursor-pointer flex flex-col"
              >
                {/* Poster Frame */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-black">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-xs text-amber-400 text-[10px] font-bold">
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    <span>{movie.rating.toFixed(1)}</span>
                  </div>

                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-purple-950/90 text-purple-200 border border-purple-700/50 text-[9px] font-black">
                    {movie.quality}
                  </span>

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayItem({ type: 'movie', data: movie });
                      }}
                      className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
                      title="Play Immediately"
                    >
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </button>

                    <span className="text-[11px] font-bold text-white tracking-wide">
                      WATCH NOW
                    </span>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenMovieDetails(movie);
                        }}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                        title="Synopsis & Details"
                      >
                        <Info className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(movie.id);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isWatchlisted ? 'bg-purple-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                        title={isWatchlisted ? 'Remove from My List' : 'Add to My List'}
                      >
                        {isWatchlisted ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info Text */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-xs text-white truncate group-hover:text-purple-300 transition-colors">
                      {movie.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                      {movie.genre.join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 mt-2 border-t border-purple-950/40">
                    <span>{movie.year}</span>
                    <span>{movie.duration}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
