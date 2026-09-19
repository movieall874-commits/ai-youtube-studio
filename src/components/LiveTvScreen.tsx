import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Star, 
  Radio, 
  ChevronUp, 
  ChevronDown, 
  Calendar, 
  Clock, 
  Tv, 
  Sparkles, 
  Sliders, 
  Check,
  Search
} from 'lucide-react';
import { Channel, PlayableItem } from '../types';

interface LiveTvScreenProps {
  channels: Channel[];
  onPlayFullscreen: (item: PlayableItem) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const LiveTvScreen: React.FC<LiveTvScreenProps> = ({
  channels,
  onPlayFullscreen,
  favorites,
  onToggleFavorite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedChannel, setSelectedChannel] = useState<Channel>(channels[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<'contain' | 'cover'>('cover');

  const videoRef = useRef<HTMLVideoElement>(null);

  const categories = [
    'All',
    'Favorites',
    'Sports',
    'Cinema',
    'News',
    'Documentary',
    'Kids',
    'Music',
  ];

  // Filter channels
  const filteredChannels = channels.filter((ch) => {
    const matchesSearch = ch.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ch.currentShow.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ch.channelNumber.toString().includes(searchFilter);
    
    if (!matchesSearch) return false;
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Favorites') return favorites.includes(ch.id);
    return ch.category === selectedCategory;
  });

  // Sync video source when channel changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [selectedChannel.id]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleChannelStep = (direction: 'up' | 'down') => {
    const currentIndex = channels.findIndex(c => c.id === selectedChannel.id);
    if (currentIndex === -1) return;
    let nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (nextIndex < 0) nextIndex = channels.length - 1;
    if (nextIndex >= channels.length) nextIndex = 0;
    setSelectedChannel(channels[nextIndex]);
  };

  return (
    <div className="flex flex-col gap-4 pb-12">
      {/* Category Pills Header */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const count = cat === 'All' 
            ? channels.length 
            : cat === 'Favorites' 
            ? channels.filter(c => favorites.includes(c.id)).length
            : channels.filter(c => c.category === cat).length;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'bg-[#13172e] text-gray-300 hover:text-white hover:bg-purple-950/40 border border-purple-900/30'
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                isActive ? 'bg-black/30 text-white' : 'bg-[#1c2242] text-purple-300'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Live TV Layout: Channels Sidebar + Stage Player & EPG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[640px]">
        {/* Left Column: Channel List (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col bg-[#0e1124] rounded-2xl border border-purple-900/40 overflow-hidden">
          {/* Channel Search Filter */}
          <div className="p-3 border-b border-purple-900/30 bg-[#121630]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type="text"
                placeholder="Search channel or program..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#0a0c16] text-xs rounded-xl border border-purple-900/40 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Channel Scroll List */}
          <div className="flex-1 overflow-y-auto max-h-[580px] divide-y divide-purple-950/40">
            {filteredChannels.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                No channels found in this category.
              </div>
            ) : (
              filteredChannels.map((channel) => {
                const isCurrent = channel.id === selectedChannel.id;
                const isFav = favorites.includes(channel.id);

                return (
                  <div
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={`group flex items-center gap-3 p-3 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-gradient-to-r from-purple-900/40 to-transparent border-l-4 border-purple-500 text-white'
                        : 'hover:bg-purple-950/20 text-gray-300'
                    }`}
                  >
                    {/* Channel Number */}
                    <span className="text-[11px] font-mono font-bold text-purple-400/80 w-7 flex-shrink-0 text-right">
                      {channel.channelNumber}
                    </span>

                    {/* Channel Logo */}
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-black border border-purple-800/40">
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {isCurrent && (
                        <div className="absolute inset-0 bg-purple-600/30 flex items-center justify-center">
                          <Radio className="w-4 h-4 text-cyan-300 animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-bold truncate ${isCurrent ? 'text-white' : 'text-gray-200'}`}>
                          {channel.name}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800/50 flex-shrink-0">
                          {channel.resolution}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-400 truncate mt-0.5">
                        {channel.currentShow}
                      </p>

                      {/* Mini progress */}
                      <div className="w-full h-1 bg-gray-800 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 rounded-full"
                          style={{ width: `${channel.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Favorite star */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(channel.id);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isFav ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'
                      }`}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Stage Live Video & EPG (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Live Video Stage */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-purple-900/40 shadow-xl group">
            <video
              ref={videoRef}
              src={selectedChannel.streamUrl}
              autoPlay
              playsInline
              loop
              muted={isMuted}
              className={`w-full h-full object-${aspectRatio}`}
            />

            {/* OSD Header Overlay */}
            <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] tracking-wider shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  LIVE
                </span>
                <span className="text-xs font-bold text-white drop-shadow">
                  CH {selectedChannel.channelNumber} • {selectedChannel.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950/80 text-cyan-300 border border-purple-700/50">
                  {selectedChannel.resolution}
                </span>
              </div>

              {/* Channel Up / Down Surfing */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleChannelStep('up')}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-purple-600 text-white transition-colors"
                  title="Previous Channel"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleChannelStep('down')}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-purple-600 text-white transition-colors"
                  title="Next Channel"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* OSD Footer Controls (visible on hover) */}
            <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between opacity-90 group-hover:opacity-100 transition-opacity z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow transition-transform hover:scale-105"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                </button>

                {/* Volume slider */}
                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="text-gray-300 hover:text-white">
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 sm:w-24 h-1 bg-gray-600 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Aspect Ratio & Fullscreen */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAspectRatio(aspectRatio === 'cover' ? 'contain' : 'cover')}
                  className="px-2 py-1 rounded text-[10px] font-bold bg-black/60 hover:bg-purple-900/60 border border-purple-800/40 text-purple-200"
                  title="Toggle Aspect Ratio"
                >
                  {aspectRatio === 'cover' ? 'FILL' : 'FIT'}
                </button>

                <button
                  onClick={() => onPlayFullscreen({ type: 'channel', data: selectedChannel })}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-purple-600 text-white transition-colors"
                  title="Open Full Cinema Player"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Channel Live EPG Schedule Details */}
          <div className="p-4 rounded-2xl bg-[#0e1124] border border-purple-900/40 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-900/40 text-purple-300 border border-purple-700/40">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white">
                    Electronic Program Guide (EPG)
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Live schedule for {selectedChannel.name}
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                {selectedChannel.progressPercent}% Elapsed
              </span>
            </div>

            {/* EPG Timeline Cards */}
            <div className="flex flex-col gap-2.5">
              {selectedChannel.epg.map((item, idx) => {
                const isNow = idx === 1; // current show
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isNow
                        ? 'bg-purple-950/40 border-purple-600/60 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                        : 'bg-[#121630] border-purple-950/50 hover:bg-[#161c3c]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isNow ? (
                          <span className="px-2 py-0.2 rounded text-[9px] font-extrabold bg-red-500 text-white animate-pulse">
                            NOW PLAYING
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-purple-400">
                            {idx < 1 ? 'PAST' : 'UPCOMING'}
                          </span>
                        )}
                        <h4 className={`text-xs font-bold ${isNow ? 'text-white' : 'text-gray-300'}`}>
                          {item.title}
                        </h4>
                      </div>

                      <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-400" />
                        {item.startTime} - {item.endTime}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.synopsis}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
