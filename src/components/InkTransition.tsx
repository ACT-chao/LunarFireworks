import { motion, AnimatePresence } from 'framer-motion';

interface InkTransitionProps {
  show: boolean;
  onComplete?: () => void;
}

// 水墨风格动画转场
export default function InkTransition({ show, onComplete }: InkTransitionProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          {/* Ink splatter circles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${10 + (i % 4) * 25}%`,
                top: `${15 + Math.floor(i / 4) * 40}%`,
                background: `radial-gradient(ellipse, 
                  rgba(20, 20, 30, 0.9) 0%, 
                  rgba(30, 25, 35, 0.6) 40%, 
                  rgba(40, 35, 45, 0.2) 70%, 
                  transparent 100%)`,
                filter: 'blur(20px)',
              }}
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{
                width: ['0px', '400px', '500px'],
                height: ['0px', '400px', '500px'],
                opacity: [0, 0.8, 0.4],
              }}
              transition={{
                duration: 2.5,
                delay: i * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          ))}

          {/* Ink drip effect */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`drip-${i}`}
              className="absolute w-1"
              style={{
                left: `${20 + i * 15}%`,
                top: '10%',
                background: 'linear-gradient(180deg, rgba(30, 25, 35, 0.8), transparent)',
                filter: 'blur(3px)',
              }}
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: ['0vh', '60vh', '80vh'],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3,
                delay: 0.5 + i * 0.2,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* Central ink wash text */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 1.1] }}
            transition={{ duration: 4, times: [0, 0.3, 0.7, 1] }}
          >
            <div className="text-center">
              <p
                className="text-5xl sm:text-7xl font-bold"
                style={{
                  color: 'transparent',
                  backgroundImage: 'linear-gradient(135deg, #1a1a2e, #4a3f5c, #1a1a2e)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  filter: 'blur(0.5px)',
                  fontFamily: '"SimSun", "STSong", serif',
                }}
              >
                福
              </p>
              <motion.div
                className="mt-4 h-0.5 mx-auto"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(100, 80, 120, 0.5), transparent)',
                }}
                initial={{ width: 0 }}
                animate={{ width: '200px' }}
                transition={{ duration: 1.5, delay: 1 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
