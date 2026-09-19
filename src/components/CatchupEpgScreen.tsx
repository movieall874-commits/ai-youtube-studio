import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Play, 
  Tv, 
  Radio, 
  Search, 
  Info, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Channel, EpgProgram, PlayableItem } from '../types';

interface CatchupEpgScreenProps {
  channels: Channel[];
  onPlayItem: (item: PlayableItem) => void;
}

export const CatchupEpgScreen: React.FC<CatchupEpgScreenProps> = ({
  channels,
  onPlayItem,
}) => {
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const [selectedChannelId, setSelectedChannelId] = useState<string>(channels[0]?.id || '');
  const [selectedProgram, setSelectedProgram] = useState<EpgProgram | null>(null);

  const days = [
    { offset: -2, label: 'Thu, 17 Sep' },
    { offset: -1, label: 'Yesterday (Fri)' },
    { offset: 0, label: 'Today (Sat)' },
    { offset: 1, label: 'Tomorrow (Sun)' },
    { offset: 2, label: 'Mon, 21 Sep' },
  ];

  const currentChannel = channels.find(c => c.id === selectedChannelId) || channels[0];

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Header & Date Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0e1124] p-4 rounded-2xl border border-purple-900/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-900/40 text-purple-300 border border-purple-700/40">
            <Calendar className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-white">
              7-Day EPG Guide & Catch-up
            </h2>
            <p className="text-xs text-gray-400">
              Browse schedules and replay past broadcast recordings
            </p>
          </div>
        </div>

        {/* Day Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {days.map((d) => {
            const isSelected = selectedDayOffset === d.offset;
            return (
              <button
                key={d.offset}
                onClick={() => setSelectedDayOffset(d.offset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md'
                    : 'bg-[#141830] text-gray-300 hover:text-white border border-purple-900/40'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main EPG Layout: Channels column + Timeline grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Channels column */}
        <div className="lg:col-span-4 bg-[#0e1124] rounded-2xl border border-purple-900/40 overflow-hidden flex flex-col">
          <div className="p-3 bg-[#121630] border-b border-purple-900/30 font-display font-bold text-xs text-purple-300">
            Select Channel
          </div>
          <div className="divide-y divide-purple-950/40 max-h-[560px] overflow-y-auto">
            {channels.map((ch) => {
              const isSelected = ch.id === selectedChannelId;
              return (
                <div
                  key={ch.id}
                  onClick={() => {
                    setSelectedChannelId(ch.id);
                    setSelectedProgram(null);
                  }}
                  className={`flex items-center gap-3 p-3 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-purple-950/50 border-l-4 border-cyan-400 text-white'
                      : 'hover:bg-purple-950/20 text-gray-300'
                  }`}
                >
                  <img
                    src={ch.logo}
                    alt={ch.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover bg-black flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{ch.name}</span>
                      <span className="text-[10px] text-purple-400 font-mono">CH {ch.channelNumber}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 block truncate mt-0.5">{ch.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Programs Timeline column */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-[#0e1124] rounded-2xl border border-purple-900/40 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={currentChannel.logo}
                  alt={currentChannel.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover border border-purple-700/50"
                />
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    {currentChannel.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Showing timeline schedule for {days.find(d => d.offset === selectedDayOffset)?.label}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onPlayItem({ type: 'channel', data: currentChannel })}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow hover:scale-105 transition-transform"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>WATCH LIVE</span>
              </button>
            </div>

            {/* Program listings */}
            <div className="flex flex-col gap-3">
              {currentChannel.epg.map((prog, idx) => {
                const isNow = idx === 1;
                const isPast = idx < 1;

                return (
                  <div
                    key={prog.id}
                    onClick={() => setSelectedProgram(prog)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isNow
                        ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                        : 'bg-[#121630] border-purple-950/50 hover:bg-[#161c3c] hover:border-purple-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-purple-400" />
                          {prog.startTime} - {prog.endTime}
                        </span>

                        {isNow && (
                          <span className="px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-red-600 text-white animate-pulse">
                            ON AIR NOW
                          </span>
                        )}
                        {isPast && (
                          <span className="px-2 py-0.2 rounded text-[9px] font-semibold bg-[#1a2040] text-purple-300">
                            CATCH-UP READY
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlayItem({ type: 'channel', data: currentChannel });
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition-all"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>{isPast ? 'REPLAY' : isNow ? 'WATCH' : 'RECORD'}</span>
                      </button>
                    </div>

                    <h4 className="font-display font-bold text-sm text-white mt-2">
                      {prog.title}
                    </h4>

                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      {prog.synopsis}
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
