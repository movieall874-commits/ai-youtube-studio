import React, { useState } from 'react';
import { 
  Play, 
  Clapperboard, 
  Star, 
  Layers, 
  Clock, 
  ChevronRight, 
  Check, 
  Plus, 
  ArrowLeft 
} from 'lucide-react';
import { Series, Episode, PlayableItem } from '../types';

interface SeriesScreenProps {
  seriesList: Series[];
  onPlayItem: (item: PlayableItem) => void;
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
}

export const SeriesScreen: React.FC<SeriesScreenProps> = ({
  seriesList,
  onPlayItem,
  watchlist,
  onToggleWatchlist,
}) => {
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(1);

  const activeSeries = selectedSeries || seriesList[0];
  const activeSeason = activeSeries.seasons.find(s => s.seasonNumber === selectedSeasonNumber) || activeSeries.seasons[0];

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Series Showcase Details Banner if active */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-[#0e1124] border border-purple-900/40 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start shadow-xl">
        <img
          src={activeSeries.backdrop}
          alt={activeSeries.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c16] via-[#0a0c16]/90 to-transparent" />

        {/* Series Poster */}
        <div className="relative z-10 w-36 sm:w-44 aspect-[2/3] rounded-xl overflow-hidden border border-purple-700/40 shadow-2xl flex-shrink-0">
          <img
            src={activeSeries.poster}
            alt={activeSeries.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Series Info */}
        <div className="relative z-10 flex-1 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              TV SERIES
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-black/60 px-2 py-0.5 rounded">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{activeSeries.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-300">{activeSeries.year}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-purple-300 font-medium">{activeSeries.seasonsCount} Seasons</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-300">{activeSeries.episodesCount} Episodes</span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            {activeSeries.title}
          </h2>

          <div className="flex flex-wrap gap-1.5">
            {activeSeries.genre.map((g) => (
              <span key={g} className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40 text-[10px] font-medium">
                {g}
              </span>
            ))}
          </div>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl mt-1">
            {activeSeries.synopsis}
          </p>

          {/* Quick Play S1:E1 */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                const firstEp = activeSeason?.episodes[0];
                if (firstEp) {
                  onPlayItem({
                    type: 'episode',
                    data: firstEp,
                    seriesTitle: activeSeries.title,
                    seasonNumber: activeSeason.seasonNumber,
                  });
                }
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>PLAY S{activeSeason?.seasonNumber}:E1</span>
            </button>

            <button
              onClick={() => onToggleWatchlist(activeSeries.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141830] border border-purple-800/40 text-purple-200 text-xs font-semibold hover:bg-purple-900/30 transition-all"
            >
              {watchlist.includes(activeSeries.id) ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
              <span>{watchlist.includes(activeSeries.id) ? 'In My List' : 'Add to List'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Series Selector Carousel / Switcher */}
      <div className="flex flex-col gap-3">
        <h3 className="font-display font-bold text-base text-white">
          Select TV Show
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {seriesList.map((item) => {
            const isSelected = item.id === activeSeries.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedSeries(item);
                  setSelectedSeasonNumber(1);
                }}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : 'bg-[#0e1124] border-purple-900/30 hover:border-purple-700/50 hover:bg-[#141830]'
                }`}
              >
                <img
                  src={item.poster}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{item.year} • {item.seasonsCount} Seasons</p>
                  <div className="flex items-center gap-1 text-amber-400 text-[10px] font-bold mt-1">
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    <span>{item.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seasons & Episodes Explorer */}
      <div className="flex flex-col gap-4 bg-[#0e1124] rounded-2xl border border-purple-900/40 p-5">
        {/* Season Tabs */}
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-300">Season:</span>
            <div className="flex items-center gap-1">
              {activeSeries.seasons.map((season) => {
                const isActive = season.seasonNumber === activeSeason.seasonNumber;
                return (
                  <button
                    key={season.seasonNumber}
                    onClick={() => setSelectedSeasonNumber(season.seasonNumber)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white shadow'
                        : 'bg-[#141830] text-gray-400 hover:text-white border border-purple-900/40'
                    }`}
                  >
                    Season {season.seasonNumber}
                  </button>
                );
              })}
            </div>
          </div>

          <span className="text-xs text-gray-400">
            {activeSeason?.episodes.length} Episodes Available
          </span>
        </div>

        {/* Episodes List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeSeason?.episodes.map((ep) => (
            <div
              key={ep.id}
              onClick={() =>
                onPlayItem({
                  type: 'episode',
                  data: ep,
                  seriesTitle: activeSeries.title,
                  seasonNumber: activeSeason.seasonNumber,
                })
              }
              className="group flex gap-3.5 p-3 rounded-xl bg-[#121630] border border-purple-950/60 hover:border-purple-500/50 hover:bg-[#161c3c] transition-all cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative w-32 aspect-video rounded-lg overflow-hidden bg-black flex-shrink-0 border border-purple-800/40">
                <img
                  src={ep.thumbnail}
                  alt={ep.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 text-gray-300 text-[9px] font-mono">
                  {ep.duration}
                </span>
              </div>

              {/* Episode Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-purple-400">
                      EP {ep.episodeNumber}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                      {ep.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                    {ep.plot}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-cyan-400 font-semibold">
                    Watch Episode
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
