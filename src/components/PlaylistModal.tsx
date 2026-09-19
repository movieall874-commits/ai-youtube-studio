import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  FolderPlus, 
  Check, 
  Server, 
  Link, 
  Sparkles, 
  RefreshCw, 
  Trash2,
  Tv,
  Film
} from 'lucide-react';
import { Playlist } from '../types';

interface PlaylistModalProps {
  playlists: Playlist[];
  activePlaylist: Playlist;
  onSelectPlaylist: (playlist: Playlist) => void;
  onAddPlaylist: (playlist: Playlist) => void;
  onClose: () => void;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({
  playlists,
  activePlaylist,
  onSelectPlaylist,
  onAddPlaylist,
  onClose,
}) => {
  const [tab, setTab] = useState<'manage' | 'add-m3u' | 'add-xtream'>('manage');
  const [playlistName, setPlaylistName] = useState('');
  const [m3uUrl, setM3uUrl] = useState('');
  const [xtreamServer, setXtreamServer] = useState('');
  const [xtreamUser, setXtreamUser] = useState('');
  const [xtreamPass, setXtreamPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddM3U = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistName || !m3uUrl) return;

    setIsLoading(true);
    setTimeout(() => {
      const newPl: Playlist = {
        id: `pl-${Date.now()}`,
        name: playlistName,
        type: 'm3u',
        url: m3uUrl,
        channelsCount: Math.floor(Math.random() * 2000) + 800,
        moviesCount: Math.floor(Math.random() * 5000) + 1500,
        seriesCount: Math.floor(Math.random() * 800) + 200,
        lastUpdated: 'Just now',
        isActive: true,
      };

      onAddPlaylist(newPl);
      setIsLoading(false);
      setSuccessMsg('Playlist loaded successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        setTab('manage');
      }, 1200);
    }, 800);
  };

  const handleAddXtream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistName || !xtreamServer || !xtreamUser) return;

    setIsLoading(true);
    setTimeout(() => {
      const newPl: Playlist = {
        id: `pl-${Date.now()}`,
        name: playlistName,
        type: 'xtream',
        serverUrl: xtreamServer,
        username: xtreamUser,
        url: `${xtreamServer}/get.php`,
        channelsCount: 4200,
        moviesCount: 11500,
        seriesCount: 2800,
        lastUpdated: 'Just now',
        isActive: true,
      };

      onAddPlaylist(newPl);
      setIsLoading(false);
      setSuccessMsg('Xtream Codes verified & connected!');
      setTimeout(() => {
        setSuccessMsg('');
        setTab('manage');
      }, 1200);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#0d1022] border border-purple-900/50 rounded-2xl shadow-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-900/40 text-purple-300 border border-purple-700/40">
              <FolderPlus className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">
                Playlist Manager
              </h2>
              <p className="text-xs text-gray-400">
                Manage your M3U playlists and Xtream Codes API accounts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-black/60 hover:bg-purple-600 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-[#121630] p-1 rounded-xl border border-purple-900/40">
          <button
            onClick={() => setTab('manage')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'manage' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Active Playlists ({playlists.length})
          </button>
          <button
            onClick={() => setTab('add-m3u')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'add-m3u' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            + M3U Playlist URL
          </button>
          <button
            onClick={() => setTab('add-xtream')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'add-xtream' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            + Xtream Codes API
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Manage Playlists Tab */}
        {tab === 'manage' && (
          <div className="flex flex-col gap-3">
            {playlists.map((pl) => {
              const isActive = pl.id === activePlaylist.id;
              return (
                <div
                  key={pl.id}
                  onClick={() => onSelectPlaylist(pl)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'bg-[#121630] border-purple-950/50 hover:border-purple-800/50 hover:bg-[#161c3c]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${
                      isActive ? 'bg-purple-600 text-white border-purple-400' : 'bg-black/50 text-gray-400 border-purple-900/40'
                    }`}>
                      {pl.type === 'xtream' ? <Server className="w-5 h-5" /> : <Link className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-sm text-white">{pl.name}</h4>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-purple-950 text-cyan-300 border border-purple-800/40">
                          {pl.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {pl.channelsCount.toLocaleString()} Live Channels • {pl.moviesCount.toLocaleString()} Movies • Updated {pl.lastUpdated}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isActive ? (
                      <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        ACTIVE
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPlaylist(pl);
                        }}
                        className="px-3 py-1 rounded-lg bg-[#1a2040] hover:bg-purple-600 text-gray-300 hover:text-white text-xs font-bold transition-colors"
                      >
                        SWITCH
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add M3U URL Tab */}
        {tab === 'add-m3u' && (
          <form onSubmit={handleAddM3U} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Playlist Name</label>
              <input
                type="text"
                placeholder="e.g. My Home Premium IPTV"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#121630] border border-purple-900/40 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">M3U or M3U8 Playlist URL</label>
              <input
                type="url"
                placeholder="https://example.com/playlist.m3u8"
                value={m3uUrl}
                onChange={(e) => setM3uUrl(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#121630] border border-purple-900/40 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>{isLoading ? 'Fetching and Parsing Streams...' : 'Add and Sync M3U Playlist'}</span>
            </button>
          </form>
        )}

        {/* Add Xtream Codes Tab */}
        {tab === 'add-xtream' && (
          <form onSubmit={handleAddXtream} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Account / Provider Name</label>
              <input
                type="text"
                placeholder="e.g. Xtream VIP Service"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#121630] border border-purple-900/40 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Server URL (with port)</label>
              <input
                type="text"
                placeholder="http://iptv-server.net:8080"
                value={xtreamServer}
                onChange={(e) => setXtreamServer(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#121630] border border-purple-900/40 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  value={xtreamUser}
                  onChange={(e) => setXtreamUser(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#121630] border border-purple-900/40 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={xtreamPass}
                  onChange={(e) => setXtreamPass(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#121630] border border-purple-900/40 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Server className="w-4 h-4" />}
              <span>{isLoading ? 'Verifying Xtream Credentials...' : 'Connect Xtream Codes API'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
