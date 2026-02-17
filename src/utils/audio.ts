// Audio Manager - 音频管理器 (Web Audio API 合成)

let audioCtx: AudioContext | null = null;
let bgMusicPlaying = false;
let bgMusicInterval: ReturnType<typeof setInterval> | null = null;

function getAudioCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 播放烟花爆炸声
export function playExplosionSound() {
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    // Noise burst for explosion
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800 + Math.random() * 600;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.3);
  } catch {
    // Silent fail for audio
  }
}

// 播放发射声
export function playLaunchSound() {
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.5);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  } catch {
    // Silent fail
  }
}

// 播放爆竹声
export function playFirecrackerSound() {
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    for (let i = 0; i < 6; i++) {
      const delay = i * 0.08 + Math.random() * 0.04;
      const bufferSize = ctx.sampleRate * 0.06;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufferSize * 0.05));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 2000;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.1, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.06);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now + delay);
      noise.stop(now + delay + 0.06);
    }
  } catch {
    // Silent fail
  }
}

// 中国风五声音阶背景音乐
const PENTATONIC = [261.6, 293.7, 329.6, 392.0, 440.0, 523.3, 587.3, 659.3];

function playMelodyNote(ctx: AudioContext, freq: number, startTime: number, duration: number) {
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq;

  const osc2 = ctx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.value = freq * 2;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.04, startTime + 0.05);
  gain.gain.setValueAtTime(0.04, startTime + duration * 0.7);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  const gain2 = ctx.createGain();
  gain2.gain.value = 0.015;

  osc.connect(gain);
  osc2.connect(gain2);
  gain2.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
  osc2.start(startTime);
  osc2.stop(startTime + duration);
}

function playMelodyBar() {
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;
    const bpm = 72;
    const beatDuration = 60 / bpm;

    // Generate a pleasant pentatonic melody
    const pattern = [0, 2, 4, 3, 2, 4, 5, 4, 3, 2, 0, 1, 2, 4, 3, 2];
    const durations = [1, 0.5, 0.5, 1, 1, 0.5, 0.5, 1, 1, 0.5, 0.5, 1, 0.5, 0.5, 1, 1];

    let time = now;
    for (let i = 0; i < pattern.length; i++) {
      const note = PENTATONIC[pattern[i]];
      const dur = durations[i] * beatDuration;
      playMelodyNote(ctx, note, time, dur * 0.9);
      time += dur;
    }
  } catch {
    // Silent fail
  }
}

export function startBackgroundMusic() {
  if (bgMusicPlaying) return;
  bgMusicPlaying = true;

  playMelodyBar();
  const interval = 60 / 72 * 12 * 1000; // roughly one bar
  bgMusicInterval = setInterval(() => {
    if (bgMusicPlaying) {
      playMelodyBar();
    }
  }, interval);
}

export function stopBackgroundMusic() {
  bgMusicPlaying = false;
  if (bgMusicInterval) {
    clearInterval(bgMusicInterval);
    bgMusicInterval = null;
  }
}

export function toggleBackgroundMusic(): boolean {
  if (bgMusicPlaying) {
    stopBackgroundMusic();
    return false;
  } else {
    startBackgroundMusic();
    return true;
  }
}

export function isMusicPlaying(): boolean {
  return bgMusicPlaying;
}

// Initialize audio on user interaction
export function initAudio() {
  getAudioCtx();
}
