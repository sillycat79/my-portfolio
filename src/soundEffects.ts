export type SoundEffect = 'click' | 'open' | 'close' | 'menu' | 'error' | 'flap';

let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

const playTone = (
  ctx: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType,
  volume = 0.035
) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration);
};

export const playSound = (effect: SoundEffect) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  switch (effect) {
    case 'open':
      playTone(ctx, 360, now, 0.055, 'square');
      playTone(ctx, 560, now + 0.045, 0.07, 'square');
      break;
    case 'close':
      playTone(ctx, 440, now, 0.055, 'triangle');
      playTone(ctx, 220, now + 0.045, 0.075, 'triangle');
      break;
    case 'menu':
      playTone(ctx, 520, now, 0.045, 'square');
      playTone(ctx, 720, now + 0.035, 0.05, 'square');
      break;
    case 'error':
      playTone(ctx, 150, now, 0.16, 'sawtooth', 0.028);
      break;
    case 'flap':
      playTone(ctx, 620, now, 0.045, 'triangle', 0.025);
      playTone(ctx, 760, now + 0.03, 0.045, 'triangle', 0.022);
      break;
    case 'click':
    default:
      playTone(ctx, 340, now, 0.025, 'triangle', 0.009);
      break;
  }
};
