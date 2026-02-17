// 红金交织丝绸纹理背景
export default function SilkBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Base dark gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1a0a0a 0%, #0d0508 30%, #150a12 60%, #0a0510 100%)',
        }}
      />

      {/* Silk texture overlay using CSS patterns */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(232, 54, 59, 0.08) 2px,
              rgba(232, 54, 59, 0.08) 4px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 2px,
              rgba(255, 215, 0, 0.06) 2px,
              rgba(255, 215, 0, 0.06) 4px
            )
          `,
        }}
      />

      {/* Red glow corners */}
      <div
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(232, 54, 59, 0.6) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(232, 54, 59, 0.6) 0%, transparent 70%)',
        }}
      />

      {/* Gold shimmer accents */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-40"
        style={{
          background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-40"
        style={{
          background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
        }}
      />

      {/* Animated silk wave */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="silkWave" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <path
              d="M0 100 Q50 80 100 100 T200 100"
              stroke="#FFD700"
              strokeWidth="0.5"
              fill="none"
            />
            <path
              d="M0 120 Q50 100 100 120 T200 120"
              stroke="#E8363B"
              strokeWidth="0.5"
              fill="none"
            />
            <path
              d="M0 140 Q50 120 100 140 T200 140"
              stroke="#FFD700"
              strokeWidth="0.3"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#silkWave)" />
      </svg>

      {/* Corner decorative elements - Chinese style */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-amber-600/30 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-amber-600/30 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-amber-600/30 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-amber-600/30 rounded-br-lg" />
    </div>
  );
}
