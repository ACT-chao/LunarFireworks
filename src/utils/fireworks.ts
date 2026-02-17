// Fireworks Particle Engine - 烟花粒子引擎

// 国潮配色方案
export const GUOCHAO_COLORS = [
  '#E8363B', // 中国红
  '#FFD700', // 金色
  '#FF6B35', // 橘红
  '#FF4D6A', // 桃红
  '#FFA500', // 橙色
  '#FF1744', // 朱砂红
  '#FFAB00', // 琥珀金
  '#FF8A65', // 珊瑚橘
  '#FFE082', // 淡金
  '#FFFFFF', // 白色点缀
];

// 祝福语列表 (混入了一些小心思 💕)
export const BLESSINGS = [
  '新年快乐',
  '恭喜发财',
  '万事如意',
  '心想事成',
  '吉祥如意',
  '大吉大利',
  '年年有余',
  '晓玟快乐',
  '想你了',
  '月色真美',
  '你好特别',
  '遇见你真好',
  '一起跨年',
];

// 情话列表
export const LOVE_WHISPERS = [
  { text: '今晚月色真美', sub: '— 夏目漱石说这是「我爱你」的意思' },
  { text: '遇见你之后，我就开始计较月亮的圆缺了', sub: '' },
  { text: '你笑起来的时候，全世界都亮了', sub: '' },
  { text: '我想把整个新年的烟花都放给你看', sub: '' },
  { text: '每一朵烟花绽放，都在替我说想你', sub: '' },
  { text: '风有时很大，但你别害怕，我一直都在', sub: '' },
  { text: '想和你一起看第一场雪，也想和你一起数最后一颗星', sub: '' },
  { text: '遇见你，是今年最好的运气', sub: '' },
  { text: '人间忽晚，山河已秋，而你是人间的温柔', sub: '' },
  { text: '世间万物不及你眼中星河万顷', sub: '' },
  { text: '我见众生皆草木，唯你是青山', sub: '' },
  { text: '往后余生，风雪是你，平淡是你', sub: '' },
  { text: '新的一年，最想见的人还是你', sub: '' },
  { text: '你是我眼里最美的风景，比烟花还耀眼', sub: '（真的，我说认真的）' },
  { text: '如果你也刚好在看烟花，那这朵是我放给你的', sub: '' },
];

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX?: number;
  targetY?: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  size: number;
  decay: number;
  gravity: number;
  isText: boolean;
  settling: boolean;
  trail: { x: number; y: number; alpha: number }[];
}

export interface Firework {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
  exploded: boolean;
  particles: Particle[];
  trail: { x: number; y: number; alpha: number }[];
  shape: 'circle' | 'heart' | 'star' | 'ring' | 'chrysanthemum' | 'text';
  blessing?: string;
}

// Generate points for different shapes
function getHeartPoints(count: number, radius: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const x = radius * 16 * Math.pow(Math.sin(t), 3) / 16;
    const y = -radius * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16;
    points.push({ x, y });
  }
  return points;
}

function getStarPoints(count: number, radius: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const spikes = 5;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const spike = i % Math.floor(count / spikes) < Math.floor(count / spikes / 2);
    const r = spike ? radius : radius * 0.4;
    points.push({
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
    });
  }
  return points;
}

function getCirclePoints(count: number, radius: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const r = radius * (0.8 + Math.random() * 0.4);
    points.push({
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
    });
  }
  return points;
}

function getRingPoints(count: number, radius: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  for (let ring = 0; ring < 3; ring++) {
    const r = radius * (0.5 + ring * 0.25);
    const ringCount = Math.floor(count / 3);
    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      points.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
      });
    }
  }
  return points;
}

function getChrysanthemumPoints(count: number, radius: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const petals = 12;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const petalAngle = angle * petals;
    const r = radius * (0.3 + 0.7 * Math.abs(Math.cos(petalAngle / 2)));
    const spread = (i / count);
    points.push({
      x: Math.cos(angle) * r * spread,
      y: Math.sin(angle) * r * spread,
    });
  }
  return points;
}

// Sample text pixels from offscreen canvas
function getTextPoints(
  text: string,
  centerX: number,
  centerY: number,
  canvasWidth: number
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const offscreen = document.createElement('canvas');
  const fontSize = Math.min(80, canvasWidth * 0.12);
  offscreen.width = text.length * fontSize + 40;
  offscreen.height = fontSize + 40;
  const ctx = offscreen.getContext('2d')!;

  ctx.fillStyle = '#fff';
  ctx.font = `bold ${fontSize}px "SimHei", "Microsoft YaHei", "Noto Sans SC", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, offscreen.width / 2, offscreen.height / 2);

  const imageData = ctx.getImageData(0, 0, offscreen.width, offscreen.height);
  const step = 3;

  for (let y = 0; y < offscreen.height; y += step) {
    for (let x = 0; x < offscreen.width; x += step) {
      const idx = (y * offscreen.width + x) * 4;
      if (imageData.data[idx + 3] > 128) {
        points.push({
          x: x - offscreen.width / 2 + centerX,
          y: y - offscreen.height / 2 + centerY,
        });
      }
    }
  }
  return points;
}

// Create explosion particles
export function createExplosionParticles(
  x: number,
  y: number,
  shape: Firework['shape'],
  color: string,
  blessing?: string,
  canvasWidth: number = 800
): Particle[] {
  const particles: Particle[] = [];
  const baseColor = color;

  if (shape === 'text' && blessing) {
    const textPts = getTextPoints(blessing, x, y, canvasWidth);
    const maxPts = Math.min(textPts.length, 500);
    const step = Math.max(1, Math.floor(textPts.length / maxPts));

    for (let i = 0; i < textPts.length; i += step) {
      const pt = textPts[i];
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        targetX: pt.x,
        targetY: pt.y,
        color: GUOCHAO_COLORS[Math.floor(Math.random() * 4)],
        alpha: 1,
        life: 180,
        maxLife: 180,
        size: 2.5,
        decay: 0.003,
        gravity: 0,
        isText: true,
        settling: false,
        trail: [],
      });
    }
    return particles;
  }

  const count = shape === 'chrysanthemum' ? 200 : 120;
  const radius = 100 + Math.random() * 60;

  let shapePoints: { x: number; y: number }[];
  switch (shape) {
    case 'heart': shapePoints = getHeartPoints(count, radius); break;
    case 'star': shapePoints = getStarPoints(count, radius); break;
    case 'ring': shapePoints = getRingPoints(count, radius); break;
    case 'chrysanthemum': shapePoints = getChrysanthemumPoints(count, radius); break;
    default: shapePoints = getCirclePoints(count, radius); break;
  }

  for (const pt of shapePoints) {
    const angle = Math.atan2(pt.y, pt.x);
    const dist = Math.sqrt(pt.x * pt.x + pt.y * pt.y);
    const speed = dist / 30 + Math.random() * 1;
    const colorIdx = Math.random() > 0.7
      ? Math.floor(Math.random() * GUOCHAO_COLORS.length)
      : GUOCHAO_COLORS.indexOf(baseColor) >= 0
        ? GUOCHAO_COLORS.indexOf(baseColor)
        : 0;

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: GUOCHAO_COLORS[colorIdx],
      alpha: 1,
      life: 60 + Math.random() * 40,
      maxLife: 100,
      size: 2 + Math.random() * 2,
      decay: 0.008 + Math.random() * 0.005,
      gravity: 0.03,
      isText: false,
      settling: false,
      trail: [],
    });
  }

  return particles;
}

// Update a single particle
export function updateParticle(p: Particle): boolean {
  if (p.isText && !p.settling) {
    // Fly outward first, then settle to target
    p.life--;
    if (p.life < 140) {
      p.settling = true;
    }
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.96;
    p.vy *= 0.96;
    p.trail.push({ x: p.x, y: p.y, alpha: p.alpha * 0.5 });
    if (p.trail.length > 5) p.trail.shift();
    return p.life > 0;
  }

  if (p.isText && p.settling) {
    // Move toward target position
    const dx = (p.targetX ?? p.x) - p.x;
    const dy = (p.targetY ?? p.y) - p.y;
    p.x += dx * 0.08;
    p.y += dy * 0.08;
    p.life--;
    p.alpha = Math.max(0, p.life / 60);
    return p.life > 0;
  }

  // Regular particle
  p.trail.push({ x: p.x, y: p.y, alpha: p.alpha * 0.3 });
  if (p.trail.length > 6) p.trail.shift();

  p.x += p.vx;
  p.y += p.vy;
  p.vy += p.gravity;
  p.vx *= 0.98;
  p.vy *= 0.98;
  p.alpha -= p.decay;
  p.life--;
  p.size *= 0.995;

  return p.alpha > 0 && p.life > 0;
}

// Create a new firework
export function createFirework(
  x: number,
  canvasHeight: number,
  forceShape?: Firework['shape'],
  forceBlessing?: string,
): Firework {
  // 提高爱心烟花的出现概率（暗藏心意）
  const shapes: Firework['shape'][] = ['circle', 'heart', 'heart', 'star', 'ring', 'chrysanthemum', 'text', 'heart'];
  const shape = forceShape ?? shapes[Math.floor(Math.random() * shapes.length)];
  const blessing = shape === 'text'
    ? (forceBlessing ?? BLESSINGS[Math.floor(Math.random() * BLESSINGS.length)])
    : undefined;

  return {
    x,
    y: canvasHeight,
    targetY: canvasHeight * 0.15 + Math.random() * canvasHeight * 0.35,
    vy: -(8 + Math.random() * 4),
    color: GUOCHAO_COLORS[Math.floor(Math.random() * 6)],
    exploded: false,
    particles: [],
    trail: [],
    shape,
    blessing,
  };
}

// Update firework state
export function updateFirework(fw: Firework, canvasWidth: number): boolean {
  if (!fw.exploded) {
    fw.trail.push({ x: fw.x, y: fw.y, alpha: 1 });
    if (fw.trail.length > 12) fw.trail.shift();

    fw.y += fw.vy;
    fw.vy *= 0.98;

    if (fw.y <= fw.targetY || fw.vy >= -1) {
      fw.exploded = true;
      fw.particles = createExplosionParticles(
        fw.x, fw.y, fw.shape, fw.color, fw.blessing, canvasWidth
      );
      return true;
    }
    return true;
  }

  // Update particles
  fw.particles = fw.particles.filter(p => updateParticle(p));
  fw.trail = fw.trail.map(t => ({ ...t, alpha: t.alpha * 0.9 })).filter(t => t.alpha > 0.01);

  return fw.particles.length > 0 || fw.trail.length > 0;
}

// Draw everything
export function drawFireworks(
  ctx: CanvasRenderingContext2D,
  fireworks: Firework[],
  width: number,
  height: number
) {
  // Semi-transparent black for trail effect
  ctx.fillStyle = 'rgba(10, 5, 15, 0.15)';
  ctx.fillRect(0, 0, width, height);

  for (const fw of fireworks) {
    // Draw launch trail
    if (!fw.exploded) {
      for (const t of fw.trail) {
        ctx.beginPath();
        ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 220, 150, ${t.alpha * 0.6})`;
        ctx.fill();
      }
      // Draw rocket
      ctx.beginPath();
      ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = fw.color;
      ctx.fill();
      // Glow
      ctx.beginPath();
      ctx.arc(fw.x, fw.y, 8, 0, Math.PI * 2);
      const glow = ctx.createRadialGradient(fw.x, fw.y, 0, fw.x, fw.y, 8);
      glow.addColorStop(0, `rgba(255, 255, 200, 0.8)`);
      glow.addColorStop(1, `rgba(255, 255, 200, 0)`);
      ctx.fillStyle = glow;
      ctx.fill();
    }

    // Draw particles
    for (const p of fw.particles) {
      // Draw trail
      for (const t of p.trail) {
        ctx.beginPath();
        ctx.arc(t.x, t.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.floor(t.alpha * 80).toString(16).padStart(2, '0')}`;
        ctx.fill();
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`;
      ctx.fill();

      // Glow effect for larger particles
      if (p.size > 2) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        pg.addColorStop(0, `${p.color}${Math.floor(p.alpha * 60).toString(16).padStart(2, '0')}`);
        pg.addColorStop(1, `${p.color}00`);
        ctx.fillStyle = pg;
        ctx.fill();
      }
    }
  }
}
