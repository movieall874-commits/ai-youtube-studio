import React, { useState } from 'react';
import { 
  mockChannels, 
  mockMovies, 
  mockSeries, 
  initialPlaylists 
} from './data/mockData';
import { 
  ViewScreen, 
  Playlist, 
  Movie, 
  Series, 
  Channel, 
  PlayableItem 
} from './types';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { LiveTvScreen } from './components/LiveTvScreen';
import { MoviesScreen } from './components/MoviesScreen';
import { SeriesScreen } from './components/SeriesScreen';
import { CatchupEpgScreen } from './components/CatchupEpgScreen';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { PlaylistModal } from './components/PlaylistModal';
import { SettingsModal } from './components/SettingsModal';
import { 
  Search, 
  Play, 
  Star, 
  Radio, 
  Film, 
  Clapperboard, 
  X 
} from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ViewScreen>('home');
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);
  const [activePlaylist, setActivePlaylist] = useState<Playlist>(initialPlaylists[0]);
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [movies, setMovies] = useState<Movie[]>(mockMovies);
  const [seriesList, setSeriesList] = useState<Series[]>(mockSeries);

  const [watchlist, setWatchlist] = useState<string[]>(['mov-1', 'ser-1']);
  const [favorites, setFavorites] = useState<string[]>(['ch-1', 'ch-3', 'ch-5']);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Player State
  const [activePlayItem, setActivePlayItem] = useState<PlayableItem | null>(null);
  const [inspectedMovie, setInspectedMovie] = useState<Movie | null>(null);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Watchlist & Favorites toggles
  const toggleWatchlist = (id: string) => {
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleFavoriteChannel = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Switch Playlist
  const handleSelectPlaylist = (pl: Playlist) => {
    setPlaylists((prev) =>
      prev.map((p) => ({
        ...p,
        isActive: p.id === pl.id,
      }))
    );
    setActivePlaylist(pl);
    setIsPlaylistModalOpen(false);
  };

  // Add Playlist
  const handleAddPlaylist = (newPl: Playlist) => {
    setPlaylists((prev) => [
      ...prev.map((p) => ({ ...p, isActive: false })),
      newPl,
    ]);
    setActivePlaylist(newPl);
  };

  // Universal Search filtering
  const matchingChannels = searchQuery
    ? channels.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.currentShow.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const matchingMovies = searchQuery
    ? movies.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genre.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.cast.some((actor) => actor.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const matchingSeries = searchQuery
    ? seriesList.filter((s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.genre.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const hasSearchResults =
    matchingChannels.length > 0 || matchingMovies.length > 0 || matchingSeries.length > 0;

  return (
    <div className="min-h-screen bg-[#0a0c16] text-[#e2e8f0] flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Global Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          setSearchQuery('');
        }}
        activePlaylist={activePlaylist}
        onOpenPlaylistModal={() => setIsPlaylistModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Universal Search Results Overlay / View */}
        {searchQuery.trim() ? (
          <div className="flex flex-col gap-6 pb-16">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-400" />
                <h2 className="font-display font-bold text-lg text-white">
                  Search Results for "{searchQuery}"
                </h2>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                <span>Clear Search</span>
              </button>
            </div>

            {!hasSearchResults ? (
              <div className="p-16 text-center bg-[#0e1124] rounded-2xl border border-purple-900/40 text-gray-400">
                <Search className="w-10 h-10 text-purple-500/40 mx-auto mb-3" />
                <h3 className="font-display font-bold text-white text-base">No Matches Found</h3>
                <p className="text-xs text-gray-400 mt-1">Try searching for "Football", "Cosmic", "Cyber", or "4K".</p>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {/* Live Channels Matches */}
                {matchingChannels.length > 0 && (
                  <div>
                    <h3 className="font-display font-bold text-sm text-cyan-300 flex items-center gap-2 mb-3">
                      <Radio className="w-4 h-4" />
                      Live TV Channels ({matchingChannels.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {matchingChannels.map((channel) => (
                        <div
                          key={channel.id}
                          onClick={() => setActivePlayItem({ type: 'channel', data: channel })}
                          className="flex items-center gap-3 p-3 rounded-xl bg-[#0e1124] border border-purple-900/40 hover:border-cyan-500/50 cursor-pointer transition-all"
                        >
                          <img
                            src={channel.logo}
                            alt={channel.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-lg object-cover bg-black"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-white truncate block">
                              {channel.name}
                            </span>
                            <span className="text-[11px] text-gray-400 truncate block">
                              {channel.currentShow}
                            </span>
                          </div>
                          <div className="p-2 rounded-lg bg-purple-950 text-cyan-300">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Movies Matches */}
                {matchingMovies.length > 0 && (
                  <div>
                    <h3 className="font-display font-bold text-sm text-purple-300 flex items-center gap-2 mb-3">
                      <Film className="w-4 h-4" />
                      Movies ({matchingMovies.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                      {matchingMovies.map((movie) => (
                        <div
                          key={movie.id}
                          onClick={() => setInspectedMovie(movie)}
                          className="group rounded-xl overflow-hidden bg-[#0e1124] border border-purple-900/40 hover:border-purple-500/50 cursor-pointer flex flex-col"
                        >
                          <div className="aspect-[2/3] w-full relative overflow-hidden">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-purple-200 text-[9px] font-bold">
                              {movie.quality}
                            </div>
                          </div>
                          <div className="p-2.5">
                            <h4 className="text-xs font-bold text-white truncate">{movie.title}</h4>
                            <p className="text-[10px] text-gray-400 mt-0.5">{movie.year} • ⭐ {movie.rating}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Series Matches */}
                {matchingSeries.length > 0 && (
                  <div>
                    <h3 className="font-display font-bold text-sm text-indigo-300 flex items-center gap-2 mb-3">
                      <Clapperboard className="w-4 h-4" />
                      TV Series ({matchingSeries.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {matchingSeries.map((series) => (
                        <div
                          key={series.id}
                          onClick={() => {
                            setCurrentScreen('series');
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-[#0e1124] border border-purple-900/40 hover:border-indigo-500/50 cursor-pointer"
                        >
                          <img
                            src={series.poster}
                            alt={series.title}
                            referrerPolicy="no-referrer"
                            className="w-12 h-16 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-white truncate block">{series.title}</span>
                            <span className="text-[10px] text-gray-400">{series.seasonsCount} Seasons • {series.genre[0]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Normal Screen Routing */
          <>
            {currentScreen === 'home' && (
              <HomeScreen
                channels={channels}
                movies={movies}
                series={seriesList}
                onNavigate={setCurrentScreen}
                onPlayItem={setActivePlayItem}
                onOpenMovieDetails={setInspectedMovie}
                onOpenSeriesDetails={() => setCurrentScreen('series')}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
              />
            )}

            {currentScreen === 'live' && (
              <LiveTvScreen
                channels={channels}
                onPlayFullscreen={setActivePlayItem}
                favorites={favorites}
                onToggleFavorite={toggleFavoriteChannel}
              />
            )}

            {currentScreen === 'movies' && (
              <MoviesScreen
                movies={movies}
                onPlayItem={setActivePlayItem}
                onOpenMovieDetails={setInspectedMovie}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
              />
            )}

            {currentScreen === 'series' && (
              <SeriesScreen
                seriesList={seriesList}
                onPlayItem={setActivePlayItem}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
              />
            )}

            {currentScreen === 'catchup' && (
              <CatchupEpgScreen
                channels={channels}
                onPlayItem={setActivePlayItem}
              />
            )}
          </>
        )}
      </main>

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movie={inspectedMovie}
        onClose={() => setInspectedMovie(null)}
        onPlayMovie={setActivePlayItem}
        watchlist={watchlist}
        onToggleWatchlist={toggleWatchlist}
      />

      {/* High-Performance OTT Video Player Modal */}
      {activePlayItem && (
        <VideoPlayerModal
          item={activePlayItem}
          onClose={() => setActivePlayItem(null)}
        />
      )}

      {/* Playlist Manager Modal */}
      {isPlaylistModalOpen && (
        <PlaylistModal
          playlists={playlists}
          activePlaylist={activePlaylist}
          onSelectPlaylist={handleSelectPlaylist}
          onAddPlaylist={handleAddPlaylist}
          onClose={() => setIsPlaylistModalOpen(false)}
        />
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <SettingsModal
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}
    </div>
  );
}
