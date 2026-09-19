import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Film, 
  Clapperboard, 
  CalendarClock, 
  FolderPlus, 
  Settings, 
  Search, 
  Maximize, 
  Minimize,
  Radio,
  SlidersHorizontal,
  Layers
} from 'lucide-react';
import { ViewScreen, Playlist } from '../types';
import { PurpleLogo } from './PurpleLogo';

interface NavbarProps {
  currentScreen: ViewScreen;
  onNavigate: (screen: ViewScreen) => void;
  activePlaylist: Playlist;
  onOpenPlaylistModal: () => void;
  onOpenSettingsModal: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  activePlaylist,
  onOpenPlaylistModal,
  onOpenSettingsModal,
  searchQuery,
  onSearchChange,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const navItems: { id: ViewScreen; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Layers className="w-4 h-4" /> },
    { id: 'live', label: 'Live TV', icon: <Radio className="w-4 h-4 text-cyan-400" />, badge: 'LIVE' },
    { id: 'movies', label: 'Movies', icon: <Film className="w-4 h-4" /> },
    { id: 'series', label: 'Series', icon: <Clapperboard className="w-4 h-4" /> },
    { id: 'catchup', label: 'EPG Guide', icon: <CalendarClock className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d1021]/95 backdrop-blur-md border-b border-purple-900/30 px-4 lg:px-6 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            title="Purple Smart Player Home"
          >
            <PurpleLogo size={36} animated={true} />
            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-display font-black text-lg tracking-tight text-white group-hover:text-purple-300 transition-colors">
                  PURPLE
                </span>
                <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-purple-400 via-violet-300 to-cyan-400 bg-clip-text text-transparent">
                  PLAYER
                </span>
              </div>
              <span className="text-[9px] font-semibold tracking-wider text-purple-400/80 uppercase">
                SMART STREAMING IPTV
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#13172e] p-1 rounded-xl border border-purple-900/40">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.4)]'
                      : 'text-gray-300 hover:text-white hover:bg-purple-950/40'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-red-500 text-white rounded-sm animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Universal Search Input */}
          <div className={`relative transition-all duration-200 ${searchFocused ? 'w-48 sm:w-64' : 'w-36 sm:w-52'}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/70 pointer-events-none" />
            <input
              type="text"
              placeholder="Search channels, movies..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[#141830] border border-purple-900/40 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Active Playlist Chip */}
          <button
            onClick={onOpenPlaylistModal}
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[#141830] hover:bg-[#1c2242] border border-purple-800/40 rounded-xl text-xs font-medium text-gray-200 transition-colors"
            title="Manage and Switch Playlists"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="max-w-[120px] truncate text-purple-200 font-semibold">{activePlaylist.name}</span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-purple-950 text-purple-300 rounded border border-purple-700/50">
              {(activePlaylist.channelsCount + activePlaylist.moviesCount).toLocaleString()}
            </span>
          </button>

          {/* Clock & Date */}
          <div className="hidden lg:flex flex-col text-right px-2 border-l border-purple-900/40">
            <span className="text-xs font-bold text-white tracking-wider">{currentTime}</span>
            <span className="text-[10px] text-purple-300/80 uppercase font-medium">{currentDate}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenPlaylistModal}
              className="p-2 rounded-xl bg-[#141830] hover:bg-purple-900/40 border border-purple-900/40 text-gray-300 hover:text-white transition-colors"
              title="Playlist Manager"
            >
              <FolderPlus className="w-4 h-4 text-purple-400" />
            </button>

            <button
              onClick={onOpenSettingsModal}
              className="p-2 rounded-xl bg-[#141830] hover:bg-purple-900/40 border border-purple-900/40 text-gray-300 hover:text-white transition-colors"
              title="Player Settings"
            >
              <Settings className="w-4 h-4 text-purple-400" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-[#141830] hover:bg-purple-900/40 border border-purple-900/40 text-gray-300 hover:text-white transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4 text-purple-300" /> : <Maximize className="w-4 h-4 text-purple-300" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="flex md:hidden items-center justify-between gap-1 mt-2.5 pt-2 border-t border-purple-900/30 overflow-x-auto pb-0.5">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-purple-950/30'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
