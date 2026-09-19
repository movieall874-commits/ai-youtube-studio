import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Subtitles, 
  Volume1, 
  Sliders, 
  ArrowLeft, 
  Lock, 
  Unlock, 
  Settings, 
  Layers,
  Sparkles,
  Gauge
} from 'lucide-react';
import { PlayableItem } from '../types';
import { PurpleLogo } from './PurpleLogo';

interface VideoPlayerModalProps {
  item: PlayableItem | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  item,
  onClose,
}) => {
  if (!item) return null;

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [aspectRatio, setAspectRatio] = useState<'contain' | 'cover'>('contain');
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('Off');
  const [selectedAudio, setSelectedAudio] = useState<string>('Dolby Atmos / Original');
  const [activeMenu, setActiveMenu] = useState<'none' | 'audio' | 'subtitles' | 'speed' | 'quality'>('none');
  const [isLiveStream, setIsLiveStream] = useState(item.type === 'channel');

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extract title and stream url
  let title = '';
  let subtitle = '';
  let streamUrl = '';

  if (item.type === 'channel') {
    title = item.data.name;
    subtitle = `CH ${item.data.channelNumber} • ${item.data.currentShow}`;
    streamUrl = item.data.streamUrl;
  } else if (item.type === 'movie') {
    title = item.data.title;
    subtitle = `${item.data.year} • ${item.data.quality} • ${item.data.duration}`;
    streamUrl = item.data.streamUrl;
  } else if (item.type === 'episode') {
    title = `${item.seriesTitle} - S${item.seasonNumber}:E${item.data.episodeNumber}`;
    subtitle = item.data.title;
    streamUrl = item.data.streamUrl;
  }

  // Auto-hide controls
  const handleMouseMove = () => {
    if (isLocked) return;
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setActiveMenu('none');
      }
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked && e.key !== 'l') return;

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'arrowleft':
          e.preventDefault();
          skip(-10);
          break;
        case 'arrowright':
          e.preventDefault();
          skip(10);
          break;
        case 'arrowup':
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case 'arrowdown':
          e.preventDefault();
          adjustVolume(-0.1);
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'escape':
          if (activeMenu !== 'none') {
            setActiveMenu('none');
          } else {
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, volume, isMuted, isLocked, activeMenu]);

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

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
    }
  };

  const adjustVolume = (delta: number) => {
    const newVol = Math.max(0, Math.min(1, volume + delta));
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      if (newVol === 0) setIsMuted(true);
      else setIsMuted(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      videoRef.current.volume = volume;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setActiveMenu('none');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === Infinity) return '00:00';
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = Math.floor(secs % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={streamUrl}
        autoPlay
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
        className={`w-full h-full object-${aspectRatio} cursor-pointer`}
      />

      {/* Center Watermark Logo when paused */}
      {!isPlaying && !isLocked && (
        <div 
          onClick={togglePlay}
          className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer pointer-events-auto"
        >
          <div className="w-20 h-20 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.7)] hover:scale-110 transition-transform">
            <Play className="w-8 h-8 fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Screen Lock Toggle Button (always accessible) */}
      <button
        onClick={() => setIsLocked(!isLocked)}
        className={`absolute top-6 right-6 z-40 p-2.5 rounded-full transition-all ${
          isLocked
            ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.8)] scale-110'
            : showControls
            ? 'bg-black/60 text-gray-300 hover:text-white hover:bg-purple-900/60'
            : 'opacity-0 pointer-events-none'
        }`}
        title={isLocked ? 'Unlock Screen Controls' : 'Lock Screen Controls'}
      >
        {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
      </button>

      {/* TOP OSD BAR */}
      <div
        className={`absolute top-0 inset-x-0 p-5 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between transition-opacity duration-300 z-30 ${
          showControls && !isLocked ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Return to Catalog"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-base sm:text-lg text-white tracking-tight">
                {title}
              </h2>
              {isLiveStream && (
                <span className="flex items-center gap-1 px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-red-600 text-white animate-pulse">
                  LIVE
                </span>
              )}
            </div>
            <p className="text-xs text-purple-300/80 font-medium">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <PurpleLogo size={28} />
          <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-purple-950/80 text-cyan-300 border border-purple-800/40">
            PURPLE ENGINE 4K
          </span>
        </div>
      </div>

      {/* POPUP SUBMENUS (Audio / Subtitles / Speed / Quality) */}
      {activeMenu !== 'none' && !isLocked && (
        <div 
          className="absolute bottom-24 right-6 z-40 w-64 bg-[#10142b]/95 border border-purple-800/60 backdrop-blur-md rounded-2xl p-4 shadow-2xl text-xs flex flex-col gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {activeMenu === 'speed' && (
            <>
              <h4 className="font-bold text-white text-xs border-b border-purple-900/40 pb-2">
                Playback Speed
              </h4>
              {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                <button
                  key={spd}
                  onClick={() => changeSpeed(spd)}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                    playbackSpeed === spd ? 'bg-purple-600 text-white font-bold' : 'text-gray-300 hover:bg-purple-950/40'
                  }`}
                >
                  <span>{spd === 1.0 ? 'Normal (1.0x)' : `${spd}x`}</span>
                  {playbackSpeed === spd && <span>✓</span>}
                </button>
              ))}
            </>
          )}

          {activeMenu === 'subtitles' && (
            <>
              <h4 className="font-bold text-white text-xs border-b border-purple-900/40 pb-2">
                Subtitle Tracks
              </h4>
              {['Off', 'English [CC]', 'Spanish', 'French', 'German'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    setSelectedSubtitle(sub);
                    setActiveMenu('none');
                  }}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                    selectedSubtitle === sub ? 'bg-purple-600 text-white font-bold' : 'text-gray-300 hover:bg-purple-950/40'
                  }`}
                >
                  <span>{sub}</span>
                  {selectedSubtitle === sub && <span>✓</span>}
                </button>
              ))}
            </>
          )}

          {activeMenu === 'audio' && (
            <>
              <h4 className="font-bold text-white text-xs border-b border-purple-900/40 pb-2">
                Audio Stream
              </h4>
              {['Dolby Atmos TrueHD 7.1', 'English Surround 5.1', 'Stereo 2.0'].map((aud) => (
                <button
                  key={aud}
                  onClick={() => {
                    setSelectedAudio(aud);
                    setActiveMenu('none');
                  }}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                    selectedAudio === aud ? 'bg-purple-600 text-white font-bold' : 'text-gray-300 hover:bg-purple-950/40'
                  }`}
                >
                  <span>{aud}</span>
                  {selectedAudio === aud && <span>✓</span>}
                </button>
              ))}
            </>
          )}

          {activeMenu === 'quality' && (
            <>
              <h4 className="font-bold text-white text-xs border-b border-purple-900/40 pb-2">
                Video Stream Quality
              </h4>
              {['Auto (Optimized 4K)', '2160p 4K UHD (60fps)', '1080p FHD (Direct)', '720p HD'].map((q) => (
                <button
                  key={q}
                  onClick={() => setActiveMenu('none')}
                  className="flex items-center justify-between p-2 rounded-lg text-gray-300 hover:bg-purple-950/40"
                >
                  <span>{q}</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* BOTTOM OSD CONTROLS */}
      <div
        className={`absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-3 transition-opacity duration-300 z-30 ${
          showControls && !isLocked ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Seek Bar (for VOD/recorded content) */}
        {!isLiveStream ? (
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-purple-200 font-bold min-w-[45px]">
              {formatTime(currentTime)}
            </span>
            <div className="relative flex-1 group/bar py-2 cursor-pointer">
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.5"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 rounded-full bg-gray-700/80 cursor-pointer appearance-none transition-all focus:outline-none"
              />
            </div>
            <span className="text-[11px] font-mono text-gray-400 min-w-[45px] text-right">
              {formatTime(duration)}
            </span>
          </div>
        ) : (
          /* Live Stream progress indicator */
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-red-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              LIVE BROADCAST • LOW LATENCY PURPLE OTT
            </span>
            <span className="text-[11px] font-mono text-cyan-300">
              BUFFER: 100% HEALTHY
            </span>
          </div>
        )}

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          {/* Play, Skip, Volume */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-lg transition-transform"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>

            {!isLiveStream && (
              <>
                <button
                  onClick={() => skip(-10)}
                  className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Rewind 10 seconds"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => skip(10)}
                  className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Forward 10 seconds"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Mute / Unmute (M)"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (videoRef.current) {
                    videoRef.current.volume = val;
                    if (val === 0) setIsMuted(true);
                    else setIsMuted(false);
                  }
                }}
                className="w-16 sm:w-24 h-1 bg-gray-600 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Right Controls: Subtitles, Audio, Speed, Aspect, Fullscreen */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Audio Track Selector */}
            <button
              onClick={() => setActiveMenu(activeMenu === 'audio' ? 'none' : 'audio')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                activeMenu === 'audio' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-white/10'
              }`}
              title="Audio Tracks"
            >
              <Volume1 className="w-4 h-4" />
              <span className="hidden md:inline text-[11px]">Audio</span>
            </button>

            {/* Subtitles Selector */}
            <button
              onClick={() => setActiveMenu(activeMenu === 'subtitles' ? 'none' : 'subtitles')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                activeMenu === 'subtitles' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-white/10'
              }`}
              title="Subtitles"
            >
              <Subtitles className="w-4 h-4" />
              <span className="hidden md:inline text-[11px]">Subtitles</span>
            </button>

            {/* Speed Selector */}
            {!isLiveStream && (
              <button
                onClick={() => setActiveMenu(activeMenu === 'speed' ? 'none' : 'speed')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  activeMenu === 'speed' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-white/10'
                }`}
                title="Playback Speed"
              >
                <Gauge className="w-4 h-4" />
                <span className="hidden md:inline text-[11px]">{playbackSpeed}x</span>
              </button>
            )}

            {/* Aspect Ratio Toggle */}
            <button
              onClick={() => setAspectRatio(aspectRatio === 'contain' ? 'cover' : 'contain')}
              className="px-2 py-1 rounded text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20"
              title="Toggle Fit / Fill"
            >
              {aspectRatio === 'contain' ? 'FIT' : 'FILL'}
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Fullscreen (F)"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
