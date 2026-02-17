import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SilkBackground from './components/SilkBackground';
import FireworksCanvas from './components/FireworksCanvas';
import InkTransition from './components/InkTransition';
import CardGenerator from './components/CardGenerator';
import SecretWhispers from './components/SecretWhispers';
import WishPage from './components/WishPage';
import { toggleBackgroundMusic, stopBackgroundMusic } from './utils/audio';

type Page = 'fireworks' | 'whispers' | 'card' | 'wish';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('fireworks');
  const [showInk, setShowInk] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [explosionCount, setExplosionCount] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [easterEggCount, setEasterEggCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const eggTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleExplosion = useCallback(() => {
    setExplosionCount(prev => {
      const next = prev + 1;
      if (next > 0 && next % 15 === 0) {
        setShowInk(true);
        if (inkTimerRef.current) clearTimeout(inkTimerRef.current);
        inkTimerRef.current = setTimeout(() => setShowInk(false), 4500);
      }
      return next;
    });
    if (!hasInteracted) {
      setHasInteracted(true);
      setMusicOn(true);
    }
  }, [hasInteracted]);

  const handleToggleMusic = useCallback(() => {
    const playing = toggleBackgroundMusic();
    setMusicOn(playing);
  }, []);

  // Easter egg: tap the title 5 times
  const handleEasterEgg = useCallback(() => {
    setEasterEggCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setShowEasterEgg(true);
        if (eggTimerRef.current) clearTimeout(eggTimerRef.current);
        eggTimerRef.current = setTimeout(() => setShowEasterEgg(false), 6000);
        return 0;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    return () => {
      stopBackgroundMusic();
      if (inkTimerRef.current) clearTimeout(inkTimerRef.current);
      if (eggTimerRef.current) clearTimeout(eggTimerRef.current);
    };
  }, []);

  const menuItems: { id: Page; icon: string; label: string; sub: string }[] = [
    { id: 'fireworks', icon: '🎆', label: '烟花盛典', sub: '点击屏幕放烟花' },
    { id: 'whispers', icon: '💌', label: '悄悄话', sub: '翻开每一封信' },
    { id: 'card', icon: '🎴', label: '贺卡定制', sub: '生成专属贺卡' },
    { id: 'wish', icon: '🌙', label: '新年许愿', sub: '对月亮许个愿' },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden select-none">
      {/* Layer 1: Silk background */}
      <SilkBackground />

      {/* Layer 2: Fireworks canvas (always running) */}
      <FireworksCanvas onExplosion={handleExplosion} canvasRef={canvasRef} />

      {/* Layer 3: UI Overlay */}
      <div className="fixed inset-0 z-20 pointer-events-none">

        {/* Welcome hint - personalized for 晓玟 */}
        <AnimatePresence>
          {!hasInteracted && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center px-6">
                <motion.p
                  className="text-4xl sm:text-6xl font-bold mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #E8363B, #FFD700)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontFamily: '"SimHei", "Microsoft YaHei", "Noto Sans SC", sans-serif',
                    filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.3))',
                  }}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  新年快乐
                </motion.p>
                <motion.p
                  className="text-xl sm:text-2xl mb-1"
                  style={{
                    color: 'rgba(255, 215, 0, 0.7)',
                    fontFamily: '"SimSun", "STSong", serif',
                    filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.2))',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  晓玟 ✨
                </motion.p>
                <motion.p
                  className="text-sm text-amber-200/40 mb-8"
                  style={{ fontFamily: '"SimSun", "STSong", serif' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  这是专门为你准备的小小惊喜
                </motion.p>
                <motion.div
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-amber-200/80 text-sm pointer-events-auto cursor-pointer"
                  style={{
                    background: 'rgba(232, 54, 59, 0.15)',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                  }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span>👆</span>
                  <span>点击屏幕放一朵烟花给你</span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top bar */}
        <AnimatePresence>
          {hasInteracted && (
            <motion.div
              className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 pointer-events-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: 'rgba(10, 5, 15, 0.6)',
                  border: '1px solid rgba(255, 215, 0, 0.15)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <span className="text-amber-400/70 text-sm">{menuOpen ? '✕' : '☰'}</span>
              </button>

              {/* Center: title with easter egg */}
              <button
                onClick={handleEasterEgg}
                className="px-4 py-1.5 rounded-full text-sm"
                style={{
                  background: 'rgba(10, 5, 15, 0.6)',
                  border: '1px solid rgba(255, 215, 0, 0.15)',
                  color: 'rgba(255, 215, 0, 0.6)',
                  backdropFilter: 'blur(10px)',
                  fontFamily: '"SimHei", sans-serif',
                }}
              >
                🎆 × {explosionCount}
              </button>

              {/* Music toggle */}
              <button
                onClick={handleToggleMusic}
                className="w-10 h-10 rounded-full flex items-center justify-center text-base transition-all hover:scale-110"
                style={{
                  background: musicOn
                    ? 'linear-gradient(135deg, rgba(232, 54, 59, 0.3), rgba(184, 134, 11, 0.3))'
                    : 'rgba(10, 5, 15, 0.6)',
                  border: `1px solid ${musicOn ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 215, 0, 0.15)'}`,
                  backdropFilter: 'blur(10px)',
                }}
              >
                {musicOn ? '🔊' : '🔇'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Side menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="absolute top-14 left-3 w-56 rounded-2xl overflow-hidden pointer-events-auto"
              style={{
                background: 'rgba(10, 5, 15, 0.9)',
                border: '1px solid rgba(255, 215, 0, 0.15)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Menu header */}
              <div
                className="px-4 py-3"
                style={{
                  background: 'linear-gradient(135deg, rgba(232, 54, 59, 0.15), rgba(184, 134, 11, 0.1))',
                  borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
                }}
              >
                <p className="text-sm" style={{ color: '#FFD700', fontFamily: '"SimHei", sans-serif' }}>
                  ✨ 晓玟的新年惊喜
                </p>
              </div>

              {menuItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'fireworks') {
                      setCurrentPage('fireworks');
                    } else {
                      setCurrentPage(item.id);
                    }
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 flex items-start gap-3 transition-all hover:bg-white/5 text-left"
                  style={{
                    borderBottom: idx < menuItems.length - 1 ? '1px solid rgba(255, 215, 0, 0.05)' : 'none',
                  }}
                >
                  <span className="text-lg mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-sm" style={{
                      color: currentPage === item.id ? '#FFD700' : 'rgba(255, 215, 0, 0.6)',
                      fontFamily: '"SimHei", sans-serif',
                    }}>
                      {item.label}
                    </p>
                    <p className="text-xs" style={{ color: 'rgba(255, 215, 0, 0.3)' }}>
                      {item.sub}
                    </p>
                  </div>
                </button>
              ))}

              {/* Menu footer - subtle hint */}
              <div
                className="px-4 py-2 text-center"
                style={{
                  borderTop: '1px solid rgba(255, 215, 0, 0.05)',
                }}
              >
                <p className="text-xs" style={{ color: 'rgba(255, 180, 180, 0.3)', fontFamily: '"SimSun", serif' }}>
                  每一处都藏着小心思 ❤️
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom subtle text - rotating love notes */}
        <AnimatePresence>
          {hasInteracted && currentPage === 'fireworks' && (
            <BottomLoveNote />
          )}
        </AnimatePresence>
      </div>

      {/* Layer 4: Ink transition overlay */}
      <InkTransition show={showInk} />

      {/* Layer 5: Page modals */}
      <AnimatePresence>
        {currentPage === 'whispers' && <SecretWhispers onClose={() => setCurrentPage('fireworks')} />}
      </AnimatePresence>
      <AnimatePresence>
        {currentPage === 'card' && <CardGenerator onClose={() => setCurrentPage('fireworks')} />}
      </AnimatePresence>
      <AnimatePresence>
        {currentPage === 'wish' && <WishPage onClose={() => setCurrentPage('fireworks')} />}
      </AnimatePresence>

      {/* Easter egg overlay */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center px-8 py-10 rounded-3xl"
              style={{
                background: 'rgba(10, 5, 15, 0.95)',
                border: '2px solid rgba(255, 215, 0, 0.3)',
                boxShadow: '0 0 60px rgba(232, 54, 59, 0.2), 0 0 120px rgba(255, 215, 0, 0.1)',
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <motion.p
                className="text-4xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                💝
              </motion.p>
              <p
                className="text-lg mb-2"
                style={{
                  color: '#FFD700',
                  fontFamily: '"SimSun", "STSong", serif',
                  lineHeight: '2',
                }}
              >
                你发现了一个秘密彩蛋！
              </p>
              <p
                className="text-base"
                style={{
                  color: 'rgba(255, 180, 180, 0.8)',
                  fontFamily: '"SimSun", "STSong", serif',
                  lineHeight: '2',
                }}
              >
                「晓玟，新年的每一颗星星
              </p>
              <p
                className="text-base"
                style={{
                  color: 'rgba(255, 180, 180, 0.8)',
                  fontFamily: '"SimSun", "STSong", serif',
                  lineHeight: '2',
                }}
              >
                都不及你眼中的光亮」
              </p>
              <p
                className="text-base mt-2"
                style={{
                  color: 'rgba(255, 215, 0, 0.9)',
                  fontFamily: '"SimSun", "STSong", serif',
                  lineHeight: '2',
                }}
              >
                爱你~ ❤️
              </p>
              <motion.div
                className="mt-4 flex justify-center gap-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {['✨', '💫', '⭐', '💫', '✨'].map((s, i) => (
                  <span key={i} className="text-sm">{s}</span>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Bottom floating love notes that rotate
function BottomLoveNote() {
  const notes = [
    '每一朵烟花绽放，都在替我说想你',
    '今晚的月色真美',
    '你是新年里最好的惊喜',
    '愿你的每一个愿望都成真',
    '有些话，只敢藏在烟花里',
  ];

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(prev => (prev + 1) % notes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="absolute bottom-6 left-0 right-0 flex justify-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          className="px-5 py-2 rounded-full text-xs"
          style={{
            color: 'rgba(255, 180, 180, 0.4)',
            background: 'rgba(10, 5, 15, 0.4)',
            backdropFilter: 'blur(8px)',
            fontFamily: '"SimSun", "STSong", serif',
            border: '1px solid rgba(255, 180, 180, 0.08)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.8 }}
        >
          「{notes[idx]}」
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

export default App;