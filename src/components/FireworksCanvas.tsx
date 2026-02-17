import { useRef, useEffect, useCallback, useState } from 'react';
import {
  Firework,
  createFirework,
  updateFirework,
  drawFireworks,
} from '../utils/fireworks';
import {
  initAudio,
  playExplosionSound,
  playLaunchSound,
  playFirecrackerSound,
  startBackgroundMusic,
} from '../utils/audio';

interface FireworksCanvasProps {
  onExplosion?: () => void;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

export default function FireworksCanvas({ onExplosion, canvasRef: externalRef }: FireworksCanvasProps) {
  const internalRef = useRef<HTMLCanvasElement>(null);
  const ref = externalRef || internalRef;
  const fireworksRef = useRef<Firework[]>([]);
  const animFrameRef = useRef<number>(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const autoFireInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const textFireCount = useRef(0);

  const launchFirework = useCallback((clientX: number, clientY?: number) => {
    const canvas = ref.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;

    // Every 2nd click is a text firework (more blessings for 晓玟)
    textFireCount.current++;
    const isText = textFireCount.current % 2 === 0;

    const fw = createFirework(
      x,
      canvas.height,
      isText ? 'text' : undefined,
    );
    fireworksRef.current.push(fw);
    playLaunchSound();

    // Add some extra random fireworks nearby
    if (Math.random() > 0.5) {
      const extra = createFirework(
        x + (Math.random() - 0.5) * 200,
        canvas.height,
      );
      setTimeout(() => {
        fireworksRef.current.push(extra);
        playLaunchSound();
      }, 200 + Math.random() * 300);
    }
  }, [ref]);

  const handleClick = useCallback((e: MouseEvent | TouchEvent) => {
    if (!hasInteracted) {
      setHasInteracted(true);
      initAudio();
      startBackgroundMusic();
      // Play initial firecracker
      setTimeout(playFirecrackerSound, 200);
    }

    if ('touches' in e) {
      e.preventDefault();
      for (let i = 0; i < e.touches.length; i++) {
        launchFirework(e.touches[i].clientX);
      }
    } else {
      launchFirework(e.clientX);
    }
  }, [hasInteracted, launchFirework]);

  // Animation loop
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initial dark fill
    ctx.fillStyle = 'rgba(10, 5, 15, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const loop = () => {
      const prevExploded = fireworksRef.current.filter(f => !f.exploded).length;

      fireworksRef.current = fireworksRef.current.filter(fw =>
        updateFirework(fw, canvas.width)
      );

      const nowExploded = fireworksRef.current.filter(f => !f.exploded).length;
      if (nowExploded < prevExploded) {
        playExplosionSound();
        onExplosion?.();
        if (Math.random() > 0.6) {
          setTimeout(playFirecrackerSound, 100);
        }
      }

      drawFireworks(ctx, fireworksRef.current, canvas.width, canvas.height);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [ref, onExplosion]);

  // Event listeners
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleClick, { passive: false });

    return () => {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleClick);
    };
  }, [ref, handleClick]);

  // Auto-fire some fireworks periodically for ambience
  useEffect(() => {
    autoFireInterval.current = setInterval(() => {
      const canvas = ref.current;
      if (!canvas || !hasInteracted) return;

      if (Math.random() > 0.5) {
        const x = Math.random() * canvas.width;
        const fw = createFirework(x, canvas.height);
        fireworksRef.current.push(fw);
      }
    }, 3000);

    return () => {
      if (autoFireInterval.current) clearInterval(autoFireInterval.current);
    };
  }, [ref, hasInteracted]);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 w-full h-full z-10 cursor-crosshair"
      style={{ touchAction: 'none' }}
    />
  );
}
