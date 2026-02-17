import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function WishPage({ onClose }: { onClose: () => void }) {
  const [wish, setWish] = useState('');
  const [sent, setSent] = useState(false);
  const [stars, setStars] = useState<{ id: number; x: number; y: number }[]>([]);

  const makeWish = useCallback(() => {
    if (!wish.trim()) return;
    setSent(true);
    // Create shooting stars effect
    const newStars = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60,
    }));
    setStars(newStars);
  }, [wish]);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.88)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-md rounded-2xl p-8 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a0515, #150820, #0d0518)',
          border: '1px solid rgba(255, 215, 0, 0.15)',
          boxShadow: '0 20px 60px rgba(100, 50, 150, 0.15)',
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-amber-400/60 hover:text-amber-400 transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          ✕
        </button>

        {/* Stars background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.3,
              }}
              animate={{ opacity: [0.1, 0.5, 0.1] }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Shooting stars on wish */}
        {stars.map(s => (
          <motion.div
            key={s.id}
            className="absolute w-0.5 h-8 pointer-events-none"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              background: 'linear-gradient(180deg, rgba(255,215,0,0.8), transparent)',
              transformOrigin: 'top',
              transform: 'rotate(30deg)',
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: [0, 1, 0], y: [0, 200] }}
            transition={{ duration: 1, delay: s.id * 0.1 }}
          />
        ))}

        {!sent ? (
          <div className="relative z-10">
            <div className="text-center mb-8">
              <motion.span
                className="text-5xl block mb-4"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🌙
              </motion.span>
              <h2
                className="text-2xl font-bold"
                style={{
                  color: '#FFD700',
                  fontFamily: '"SimHei", "Microsoft YaHei", sans-serif',
                }}
              >
                新年许愿
              </h2>
              <p className="text-amber-200/40 text-sm mt-2" style={{ fontFamily: '"SimSun", serif' }}>
                对着月亮许个愿，说不定会实现哦
              </p>
            </div>

            <textarea
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="写下你的新年愿望..."
              className="w-full h-32 px-4 py-3 rounded-xl text-amber-100 placeholder-amber-100/20 outline-none resize-none mb-4"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255, 215, 0, 0.15)',
                fontFamily: '"SimSun", serif',
                fontSize: '15px',
                lineHeight: '1.8',
              }}
            />

            <button
              onClick={makeWish}
              className="w-full py-3 rounded-xl font-bold transition-all hover:brightness-110 active:scale-98"
              style={{
                background: wish.trim()
                  ? 'linear-gradient(135deg, #6B2FA0, #9B59B6)'
                  : 'rgba(255,255,255,0.05)',
                color: wish.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
                boxShadow: wish.trim() ? '0 4px 20px rgba(107, 47, 160, 0.3)' : 'none',
                fontFamily: '"SimHei", sans-serif',
              }}
            >
              🌟 许愿
            </button>
          </div>
        ) : (
          <motion.div
            className="relative z-10 text-center py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.span
              className="text-6xl block mb-6"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>
            <h3
              className="text-xl font-bold mb-3"
              style={{
                color: '#FFD700',
                fontFamily: '"SimHei", sans-serif',
              }}
            >
              愿望已送出
            </h3>
            <p
              className="text-amber-200/50 text-sm mb-2 px-4"
              style={{
                fontFamily: '"SimSun", serif',
                lineHeight: '1.8',
              }}
            >
              「{wish}」
            </p>
            <p className="text-amber-200/30 text-xs mt-4" style={{ fontFamily: '"SimSun", serif' }}>
              和晓玟一起许的愿望，一定会实现的 ✨
            </p>

            <button
              onClick={() => { setSent(false); setWish(''); setStars([]); }}
              className="mt-6 px-5 py-2 rounded-full text-sm text-amber-200/60 hover:text-amber-200 transition-colors"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,215,0,0.15)',
              }}
            >
              再许一个
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}