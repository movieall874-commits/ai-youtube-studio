import React from 'react';

interface PurpleLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
  animated?: boolean;
}

export const PurpleLogo: React.FC<PurpleLogoProps> = ({
  size = 40,
  className = '',
  showText = false,
  animated = false,
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div 
        className="relative flex-shrink-0 flex items-center justify-center transition-transform hover:scale-105 duration-300"
        style={{ width: pixelSize, height: pixelSize }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(147,51,234,0.45)]"
        >
          <defs>
            {/* Play Button Gradient: Cyan to Violet */}
            <linearGradient id="purpleLogoPlayGrad" x1="10%" y1="10%" x2="90%" y2="90%">
              <stop offset="0%" stopColor="#00d2ff" />
              <stop offset="45%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>

            {/* Outer Ring Border Gradient */}
            <linearGradient id="purpleLogoRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b458ff" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6d28d9" />
            </linearGradient>

            {/* Background Glow */}
            <radialGradient id="purpleLogoBgGlow" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#0e1224" />
              <stop offset="100%" stopColor="#070913" />
            </radialGradient>
          </defs>

          {/* Outer Border with Vibrant Violet Ring */}
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="url(#purpleLogoBgGlow)"
            stroke="url(#purpleLogoRingGrad)"
            strokeWidth="7"
          />

          {/* Inner Guideline Faint Ring */}
          <circle
            cx="100"
            cy="100"
            r="75"
            fill="none"
            stroke="#212a4a"
            strokeWidth="1.5"
            opacity="0.8"
          />

          {/* Dashed Cyan Progress Arc in top-left */}
          <path
            d="M 54,103 A 54 54 0 0 1 103,46"
            fill="none"
            stroke="#00e5ff"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeDasharray="9.5 13"
            className={animated ? "animate-pulse" : ""}
          />

          {/* Play Triangle Symbol */}
          <polygon
            points="78,63 136,100 78,137"
            fill="url(#purpleLogoPlayGrad)"
          />

          {/* Glowing Apex Node (Cyan) */}
          <circle
            cx="136"
            cy="100"
            r="6"
            fill="#00e5ff"
            className="filter drop-shadow-[0_0_4px_#00e5ff]"
          />

          {/* Purple Curved Sweep under the play button */}
          <path
            d="M 141,100 C 145,134 125,149 97,146"
            fill="none"
            stroke="#9333ea"
            strokeWidth="7.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-display font-bold text-xl tracking-tight text-white">
              PURPLE
            </span>
            <span className="font-display font-semibold text-xl tracking-tight bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              PLAYER
            </span>
          </div>
          <span className="text-[10px] tracking-wider uppercase font-semibold text-purple-300/70 mt-0.5">
            SMART IPTV & VOD
          </span>
        </div>
      )}
    </div>
  );
};
