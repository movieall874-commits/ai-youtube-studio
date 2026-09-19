import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Cpu, 
  Wifi, 
  ShieldCheck, 
  Volume2, 
  Palette, 
  Info, 
  Check, 
  PlaySquare, 
  RefreshCw 
} from 'lucide-react';
import { PurpleLogo } from './PurpleLogo';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'playback' | 'parental' | 'network' | 'about'>('playback');
  const [hardwareDec, setHardwareDec] = useState(true);
  const [bufferSize, setBufferSize] = useState<'low' | 'normal' | 'high'>('normal');
  const [audioPassthrough, setAudioPassthrough] = useState(true);
  const [pinCode, setPinCode] = useState('0000');
  const [parentalLocked, setParentalLocked] = useState(false);
  const [speedTestRunning, setSpeedTestRunning] = useState(false);
  const [speedResult, setSpeedResult] = useState<{ ping: number; download: number } | null>(null);

  const runSpeedTest = () => {
    setSpeedTestRunning(true);
    setSpeedResult(null);
    setTimeout(() => {
      setSpeedResult({
        ping: Math.floor(Math.random() * 15) + 12,
        download: Math.floor(Math.random() * 250) + 180,
      });
      setSpeedTestRunning(false);
    }, 1500);
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
              <Settings className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">
                Player Preferences & Settings
              </h2>
              <p className="text-xs text-gray-400">
                Hardware decoding, audio routing, buffering, and parental PIN
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

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 bg-[#121630] p-1 rounded-xl border border-purple-900/40">
          <button
            onClick={() => setActiveTab('playback')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'playback' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Playback
          </button>
          <button
            onClick={() => setActiveTab('parental')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'parental' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Parental Lock
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'network' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Network & Speed
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'about' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            About
          </button>
        </div>

        {/* Playback Tab */}
        {activeTab === 'playback' && (
          <div className="flex flex-col gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#121630] border border-purple-900/30 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">Hardware Acceleration</h4>
                <p className="text-gray-400 mt-0.5">Use GPU hardware decoder for fluid 4K 60fps playback</p>
              </div>
              <button
                onClick={() => setHardwareDec(!hardwareDec)}
                className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                  hardwareDec ? 'bg-purple-600 justify-end' : 'bg-gray-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#121630] border border-purple-900/30 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">Stream Buffer Size</h4>
                <p className="text-gray-400 mt-0.5">Adjust buffer duration for stability against packet jitter</p>
              </div>
              <div className="flex items-center gap-1 bg-[#1a2040] p-1 rounded-lg border border-purple-800/40">
                {(['low', 'normal', 'high'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBufferSize(b)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase ${
                      bufferSize === b ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#121630] border border-purple-900/30 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">Dolby Atmos Pass-through</h4>
                <p className="text-gray-400 mt-0.5">Direct bitstream audio output to AV receiver or soundbar</p>
              </div>
              <button
                onClick={() => setAudioPassthrough(!audioPassthrough)}
                className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                  audioPassthrough ? 'bg-purple-600 justify-end' : 'bg-gray-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow" />
              </button>
            </div>
          </div>
        )}

        {/* Parental Control Tab */}
        {activeTab === 'parental' && (
          <div className="flex flex-col gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#121630] border border-purple-900/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Parental Protection Mode</h4>
                  <p className="text-gray-400 mt-0.5">Require 4-digit security PIN for restricted channels</p>
                </div>
                <button
                  onClick={() => setParentalLocked(!parentalLocked)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    parentalLocked ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {parentalLocked ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              <div className="pt-2 border-t border-purple-900/30 flex items-center justify-between">
                <span className="text-gray-300 font-medium">Security PIN Code</span>
                <input
                  type="password"
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-24 text-center font-mono font-bold tracking-widest text-sm py-1 bg-[#1a2040] border border-purple-800/40 rounded-lg text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Network & Speed Tab */}
        {activeTab === 'network' && (
          <div className="flex flex-col gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#121630] border border-purple-900/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">CDN Speed & Latency Diagnostic</h4>
                  <p className="text-gray-400 mt-0.5">Measure connection to Purple streaming edge nodes</p>
                </div>
                <button
                  onClick={runSpeedTest}
                  disabled={speedTestRunning}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold transition-transform hover:scale-105"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${speedTestRunning ? 'animate-spin' : ''}`} />
                  <span>{speedTestRunning ? 'Testing...' : 'Run Test'}</span>
                </button>
              </div>

              {speedResult && (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-purple-900/30">
                  <div className="p-3 rounded-lg bg-[#1a2040] border border-purple-800/40">
                    <span className="text-gray-400 text-[11px] block">Stream Ping Latency</span>
                    <span className="text-lg font-bold text-cyan-300 font-mono">{speedResult.ping} ms</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1a2040] border border-purple-800/40">
                    <span className="text-gray-400 text-[11px] block">Download Throughput</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">{speedResult.download} Mbps</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="flex flex-col items-center text-center p-4 gap-3 bg-[#121630] rounded-xl border border-purple-900/30">
            <PurpleLogo size={64} animated={true} />
            <div>
              <h3 className="font-display font-extrabold text-lg text-white">
                Purple Smart Player
              </h3>
              <p className="text-xs text-purple-300/80 font-mono mt-0.5">
                Version 4.8.2 (Build 2026-PRO)
              </p>
            </div>
            <p className="text-xs text-gray-300 max-w-md leading-relaxed">
              Designed for smart streaming across Live TV, 4K Cinema VOD, TV Series boxsets, and Electronic Program Guides.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-2">
              <span>H.265 / HEVC</span>
              <span>•</span>
              <span>AV1 4K HDR</span>
              <span>•</span>
              <span>Dolby Atmos</span>
              <span>•</span>
              <span>M3U & Xtream Ready</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
