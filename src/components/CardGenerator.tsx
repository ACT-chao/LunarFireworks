import { useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { GUOCHAO_COLORS, BLESSINGS } from '../utils/fireworks';

interface CardGeneratorProps {
  onClose: () => void;
}

export default function CardGenerator({ onClose }: CardGeneratorProps) {
  const cardRef = useRef<HTMLCanvasElement>(null);
  const [blessing, setBlessing] = useState('晓玟快乐');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('李晓玟');
  const [generated, setGenerated] = useState(false);

  const generateCard = useCallback(() => {
    const canvas = cardRef.current;
    if (!canvas) return;

    const w = 800;
    const h = 1200;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#1a0a0a');
    bg.addColorStop(0.5, '#200d15');
    bg.addColorStop(1, '#0d0510');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Silk texture pattern
    ctx.strokeStyle = 'rgba(232, 54, 59, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w + h; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(0, i);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.04)';
    for (let i = 0; i < w + h; i += 8) {
      ctx.beginPath();
      ctx.moveTo(w - i, 0);
      ctx.lineTo(w, i);
      ctx.stroke();
    }

    // Gold border
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 4;
    const margin = 30;
    ctx.strokeRect(margin, margin, w - margin * 2, h - margin * 2);

    // Inner border
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(margin + 10, margin + 10, w - (margin + 10) * 2, h - (margin + 10) * 2);

    // Corner decorations
    const cornerSize = 40;
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(margin, margin + cornerSize);
    ctx.lineTo(margin, margin);
    ctx.lineTo(margin + cornerSize, margin);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(w - margin - cornerSize, margin);
    ctx.lineTo(w - margin, margin);
    ctx.lineTo(w - margin, margin + cornerSize);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(margin, h - margin - cornerSize);
    ctx.lineTo(margin, h - margin);
    ctx.lineTo(margin + cornerSize, h - margin);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(w - margin - cornerSize, h - margin);
    ctx.lineTo(w - margin, h - margin);
    ctx.lineTo(w - margin, h - margin - cornerSize);
    ctx.stroke();

    // Draw firework decorations
    for (let k = 0; k < 20; k++) {
      const fx = 80 + Math.random() * (w - 160);
      const fy = 100 + Math.random() * 300;
      const color = GUOCHAO_COLORS[Math.floor(Math.random() * 6)];
      const rays = 8 + Math.floor(Math.random() * 8);
      const radius = 20 + Math.random() * 40;

      for (let i = 0; i < rays; i++) {
        const angle = (i / rays) * Math.PI * 2;
        const len = radius * (0.5 + Math.random() * 0.5);
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(fx + Math.cos(angle) * len, fy + Math.sin(angle) * len);
        ctx.strokeStyle = color + '80';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Particle dots
        ctx.beginPath();
        ctx.arc(
          fx + Math.cos(angle) * len,
          fy + Math.sin(angle) * len,
          2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = color;
        ctx.fill();
      }

      // Center glow
      const glow = ctx.createRadialGradient(fx, fy, 0, fx, fy, 15);
      glow.addColorStop(0, color + '60');
      glow.addColorStop(1, color + '00');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(fx, fy, 15, 0, Math.PI * 2);
      ctx.fill();
    }

    // Main blessing text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 90px "SimHei", "Microsoft YaHei", "Noto Sans SC", sans-serif';

    // Text shadow/glow
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#FFD700';
    ctx.fillText(blessing, w / 2, h / 2 - 40);
    ctx.shadowBlur = 0;

    // Red outline
    ctx.strokeStyle = '#E8363B';
    ctx.lineWidth = 1.5;
    ctx.strokeText(blessing, w / 2, h / 2 - 40);

    // Sub text
    ctx.font = '36px "SimSun", "STSong", serif';
    ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
    ctx.fillText('🧨 新年大吉 · 万事如意 🧨', w / 2, h / 2 + 60);

    // Hidden love note (small and subtle)
    ctx.font = '18px "SimSun", "STSong", serif';
    ctx.fillStyle = 'rgba(255, 180, 180, 0.35)';
    ctx.fillText('今晚的月色真美…', w / 2, h / 2 + 150);

    // Recipient name
    if (recipientName) {
      ctx.font = '32px "SimSun", "STSong", serif';
      ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
      ctx.fillText(`— 给 ${recipientName}`, w / 2, h - 180);
    }

    // Sender name
    if (senderName) {
      ctx.font = '28px "SimSun", "STSong", serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText(`${senderName} 敬贺`, w / 2, h - 130);
    }

    // Year text at top
    ctx.font = '28px "SimSun", "STSong", serif';
    ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
    ctx.fillText('✦ 新春贺卡 ✦', w / 2, 80);

    // Decorative line
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h / 2 + 110);
    ctx.lineTo(w * 0.8, h / 2 + 110);
    const lineGrad = ctx.createLinearGradient(w * 0.2, 0, w * 0.8, 0);
    lineGrad.addColorStop(0, 'rgba(255, 215, 0, 0)');
    lineGrad.addColorStop(0.5, 'rgba(255, 215, 0, 0.5)');
    lineGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 1;
    ctx.stroke();

    setGenerated(true);
  }, [blessing, senderName, recipientName]);

  const downloadCard = useCallback(() => {
    const canvas = cardRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `新年贺卡-${blessing}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [blessing]);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-lg rounded-2xl p-6 overflow-y-auto max-h-[90vh]"
        style={{
          background: 'linear-gradient(135deg, #1a0a0a, #200d15, #150a12)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-amber-400/60 hover:text-amber-400 transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          ✕
        </button>

        <h2
          className="text-2xl font-bold text-center mb-6"
          style={{ color: '#FFD700', fontFamily: '"SimHei", "Microsoft YaHei", sans-serif' }}
        >
          生成新年贺卡
        </h2>

        {/* Recipient name */}
        <div className="mb-4">
          <label className="text-amber-200/80 text-sm mb-2 block">收件人</label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => { setRecipientName(e.target.value); setGenerated(false); }}
            placeholder="对方的名字"
            className="w-full px-4 py-2 rounded-lg text-amber-100 placeholder-amber-100/30 outline-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,215,0,0.2)',
            }}
          />
        </div>

        {/* Blessing selector */}
        <div className="mb-4">
          <label className="text-amber-200/80 text-sm mb-2 block">选择祝福语</label>
          <div className="flex flex-wrap gap-2">
            {['晓玟快乐', '新年快乐', '心想事成', '万事如意', '大吉大利', '想你了', '遇见你真好', '一起跨年'].map((b) => (
              <button
                key={b}
                onClick={() => { setBlessing(b); setGenerated(false); }}
                className="px-3 py-1.5 rounded-full text-sm transition-all"
                style={{
                  background: blessing === b
                    ? 'linear-gradient(135deg, #E8363B, #B8860B)'
                    : 'rgba(255,255,255,0.05)',
                  color: blessing === b ? '#fff' : 'rgba(255,215,0,0.6)',
                  border: `1px solid ${blessing === b ? '#FFD700' : 'rgba(255,215,0,0.15)'}`,
                }}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Sender name */}
        <div className="mb-6">
          <label className="text-amber-200/80 text-sm mb-2 block">你的署名</label>
          <input
            type="text"
            value={senderName}
            onChange={(e) => { setSenderName(e.target.value); setGenerated(false); }}
            placeholder="输入你的名字"
            className="w-full px-4 py-2 rounded-lg text-amber-100 placeholder-amber-100/30 outline-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,215,0,0.2)',
            }}
          />
        </div>

        {/* Generate & Download buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={generateCard}
            className="flex-1 py-2.5 rounded-lg font-bold text-white transition-all hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #E8363B, #c41e22)',
              boxShadow: '0 4px 15px rgba(232, 54, 59, 0.3)',
            }}
          >
            🎨 生成贺卡
          </button>
          {generated && (
            <button
              onClick={downloadCard}
              className="flex-1 py-2.5 rounded-lg font-bold text-white transition-all hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg, #B8860B, #FFD700)',
                boxShadow: '0 4px 15px rgba(184, 134, 11, 0.3)',
              }}
            >
              📥 下载图片
            </button>
          )}
        </div>

        {/* Canvas preview */}
        <div className="flex justify-center">
          <canvas
            ref={cardRef}
            className="rounded-lg max-w-full"
            style={{
              maxHeight: '400px',
              display: generated ? 'block' : 'none',
              border: '1px solid rgba(255,215,0,0.2)',
            }}
          />
          {!generated && (
            <div
              className="w-full h-48 rounded-lg flex items-center justify-center text-amber-200/30 text-sm"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,215,0,0.15)' }}
            >
              点击"生成贺卡"预览效果
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
