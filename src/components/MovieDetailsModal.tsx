import React from 'react';
import { 
  X, 
  Play, 
  Plus, 
  Check, 
  Star, 
  Clock, 
  Volume2, 
  Subtitles, 
  Sparkles, 
  Share2 
} from 'lucide-react';
import { Movie, PlayableItem } from '../types';

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  onPlayMovie: (item: PlayableItem) => void;
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onClose,
  onPlayMovie,
  watchlist,
  onToggleWatchlist,
}) => {
  if (!movie) return null;

  const isWatchlisted = watchlist.includes(movie.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0d1022] border border-purple-900/50 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-purple-600 text-white transition-colors"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Backdrop Banner */}
        <div className="relative w-full h-64 sm:h-80 overflow-hidden flex-shrink-0">
          <img
            src={movie.backdrop}
            alt={movie.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1022] via-[#0d1022]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1022] via-[#0d1022]/70 to-transparent" />

          {/* Banner Details Overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-purple-950 text-cyan-300 border border-purple-700/50 text-[10px] font-bold">
                  {movie.quality}
                </span>
                <div className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-black/70 px-2 py-0.5 rounded">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{movie.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-gray-300">{movie.year}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-300">{movie.duration}</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
                {movie.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex flex-col gap-6">
          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                onPlayMovie({ type: 'movie', data: movie });
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white ml-0.5" />
              <span>PLAY MOVIE</span>
            </button>

            {movie.trailerUrl && (
              <button
                onClick={() => {
                  onPlayMovie({
                    type: 'movie',
                    data: {
                      ...movie,
                      title: `${movie.title} (Official Trailer)`,
                      streamUrl: movie.trailerUrl!,
                    },
                  });
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a1f3c] hover:bg-[#252b52] border border-purple-800/40 text-purple-200 text-xs font-semibold transition-all"
              >
                <span>Watch Trailer</span>
              </button>
            )}

            <button
              onClick={() => onToggleWatchlist(movie.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a1f3c] hover:bg-[#252b52] border border-purple-800/40 text-purple-200 text-xs font-semibold transition-all"
            >
              {isWatchlisted ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
              <span>{isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}</span>
            </button>
          </div>

          {/* Synopsis */}
          <div className="flex flex-col gap-2">
            <h3 className="font-display font-bold text-sm text-purple-300 uppercase tracking-wider">
              Storyline
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {movie.plot}
            </p>
          </div>

          {/* Cast & Specs 2-column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-purple-900/30">
            {/* Cast & Crew */}
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-[11px] font-bold text-purple-400 uppercase">Director</span>
                <p className="text-xs text-white mt-0.5">{movie.director}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-purple-400 uppercase">Starring Cast</span>
                <p className="text-xs text-gray-300 mt-0.5">{movie.cast.join(', ')}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-purple-400 uppercase">Genres</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {movie.genre.map(g => (
                    <span key={g} className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 text-[10px] font-medium border border-purple-800/40">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Audio & Subtitles Specs */}
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-[11px] font-bold text-purple-400 uppercase flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  Audio Tracks Available
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {movie.audioTracks.map(track => (
                    <span key={track} className="px-2 py-0.5 rounded bg-[#141830] text-gray-300 text-[10px] border border-purple-900/40">
                      {track}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-purple-400 uppercase flex items-center gap-1.5">
                  <Subtitles className="w-3.5 h-3.5 text-cyan-400" />
                  Subtitle Languages
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {movie.subtitleTracks.map(sub => (
                    <span key={sub} className="px-2 py-0.5 rounded bg-[#141830] text-gray-300 text-[10px] border border-purple-900/40">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
