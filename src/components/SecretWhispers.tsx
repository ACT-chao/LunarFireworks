import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOVE_WHISPERS } from '../utils/fireworks';

export default function SecretWhispers({ onClose }: { onClose: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const nextCard = useCallback(() => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIdx(prev => (prev + 1) % LOVE_WHISPERS.length);
    }, 300);
  }, []);

  const whisper = LOVE_WHISPERS[currentIdx];

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 rounded-full flex items-center justify-center text-amber-400/60 hover:text-amber-400 transition-colors z-10"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          ✕
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <h2
            className="text-2xl font-bold"
            style={{
              color: '#FFD700',
              fontFamily: '"SimHei", "Microsoft YaHei", sans-serif',
              filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))',
            }}
          >
            💌 悄悄话
          </h2>
          <p className="text-amber-200/40 text-sm mt-1" style={{ fontFamily: '"SimSun", serif' }}>
            翻开每一张，都是想对你说的话
          </p>
        </div>

        {/* Card */}
        <div
          className="relative cursor-pointer mx-auto"
          style={{
            perspective: '1000px',
            width: '320px',
            height: '420px',
          }}
          onClick={() => setFlipped(!flipped)}
        >
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front - envelope */}
            <div
              className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8"
              style={{
                backfaceVisibility: 'hidden',
                background: 'linear-gradient(135deg, #2a0a0e, #1a0508, #200a15)',
                border: '2px solid rgba(255, 215, 0, 0.2)',
                boxShadow: '0 20px 60px rgba(232, 54, 59, 0.2), inset 0 0 80px rgba(232, 54, 59, 0.05)',
              }}
            >
              {/* Decorative seal */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{
                  background: 'linear-gradient(135deg, #E8363B, #c41e22)',
                  boxShadow: '0 4px 20px rgba(232, 54, 59, 0.4)',
                  border: '2px solid rgba(255, 215, 0, 0.3)',
                }}
              >
                <span
                  className="text-3xl"
                  style={{
                    color: '#FFD700',
                    fontFamily: '"SimSun", "STSong", serif',
                    fontWeight: 'bold',
                  }}
                >
                  密
                </span>
              </div>

              <p className="text-amber-200/50 text-sm" style={{ fontFamily: '"SimSun", serif' }}>
                点击翻开这封信
              </p>

              <div className="absolute bottom-6 text-center">
                <p className="text-amber-200/30 text-xs">{currentIdx + 1} / {LOVE_WHISPERS.length}</p>
              </div>

              {/* Corner ornaments */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-amber-600/30 rounded-tl" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-amber-600/30 rounded-tr" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-amber-600/30 rounded-bl" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-amber-600/30 rounded-br" />
            </div>

            {/* Back - message */}
            <div
              className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: 'linear-gradient(135deg, #1a0508, #200a15, #150510)',
                border: '2px solid rgba(255, 215, 0, 0.25)',
                boxShadow: '0 20px 60px rgba(255, 215, 0, 0.1), inset 0 0 80px rgba(255, 215, 0, 0.03)',
              }}
            >
              <p
                className="text-xl leading-relaxed text-center mb-4"
                style={{
                  color: '#FFD700',
                  fontFamily: '"SimSun", "STSong", serif',
                  filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.2))',
                  lineHeight: '1.8',
                }}
              >
                「{whisper.text}」
              </p>
              {whisper.sub && (
                <p
                  className="text-sm text-center"
                  style={{ color: 'rgba(255, 180, 180, 0.6)', fontFamily: '"SimSun", serif' }}
                >
                  {whisper.sub}
                </p>
              )}

              <div
                className="mt-8 w-16 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.4), transparent)' }}
              />
              <p className="text-amber-200/30 text-xs mt-3" style={{ fontFamily: '"SimSun", serif' }}>
                写给晓玟的第 {currentIdx + 1} 封信
              </p>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); nextCard(); }}
            className="px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #E8363B, #B8860B)',
              color: '#fff',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              boxShadow: '0 4px 15px rgba(232, 54, 59, 0.3)',
            }}
          >
            💌 下一封信
          </button>
        </div>

        {/* Floating hearts decoration */}
        {[...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-lg pointer-events-none"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              opacity: 0.15,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            {i % 2 === 0 ? '❤️' : '✨'}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}
