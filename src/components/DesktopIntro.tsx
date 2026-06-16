import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Monitor, ArrowRight } from 'lucide-react';

const MinecraftCloud = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={`pointer-events-none select-none ${className || ''}`} style={style}>
    <svg width="144" height="48" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }} className="w-full h-full">
      <rect x="2" y="12" width="44" height="4" fill="#a5b9c7" fillOpacity="0.7" />
      <rect x="4" y="4" width="40" height="8" fill="#ffffff" fillOpacity="0.95" />
      <rect x="8" y="2" width="32" height="10" fill="#ffffff" fillOpacity="0.95" />
      <rect x="12" y="0" width="24" height="12" fill="#ffffff" fillOpacity="0.95" />
      <rect x="0" y="8" width="48" height="4" fill="#ffffff" fillOpacity="0.95" />
      <rect x="0" y="10" width="48" height="2" fill="#d1e2ee" fillOpacity="0.95" />
      <rect x="4" y="12" width="40" height="2" fill="#d1e2ee" fillOpacity="0.95" />
    </svg>
  </div>
);

interface DesktopIntroProps {
  onEnterDesktop: () => void;
}

export default function DesktopIntro({ onEnterDesktop }: DesktopIntroProps) {
  const [welcomeText, setWelcomeText] = useState('');
  const [isZooming, setIsZooming] = useState(false);
  const fullMessage = 'welcome to my portfolio <3';

  // State for interactive 3D rotation, translation & drawing
  const [rotation, setRotation] = useState({ x: 12, y: -24 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotStart, setRotStart] = useState({ x: 12, y: -24 });
  const [posStart, setPosStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  // MacPaint Tool Palette State: Default is rotate so dragging rotates
  const [activeTool, setActiveTool] = useState<'rotate' | 'move' | 'draw'>('rotate');
  const [paintColor, setPaintColor] = useState('#111116');
  const [isPainting, setIsPainting] = useState(false);

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const typewriterIntervalRef = React.useRef<any | null>(null);

  // Synthesize realistic typewriter click sound using Web Audio API (reuses cached AudioContext)
  const playClickSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // 1. High-frequency metallic mechanical key impact
      const impulseSize = ctx.sampleRate * 0.015; // 15ms impact burst
      const impulseBuffer = ctx.createBuffer(1, impulseSize, ctx.sampleRate);
      const impulseData = impulseBuffer.getChannelData(0);
      for (let i = 0; i < impulseSize; i++) {
        impulseData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseSize, 3);
      }
      const impulseSource = ctx.createBufferSource();
      impulseSource.buffer = impulseBuffer;

      const impulseFilter = ctx.createBiquadFilter();
      impulseFilter.type = 'bandpass';
      impulseFilter.frequency.value = 3200; // High frequency metal strike
      impulseFilter.Q.value = 8;

      const impulseGain = ctx.createGain();
      // Increase volume significantly so it's clearly heard
      impulseGain.gain.setValueAtTime(0.28, ctx.currentTime);
      impulseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.012);

      impulseSource.connect(impulseFilter);
      impulseFilter.connect(impulseGain);
      impulseGain.connect(ctx.destination);

      // 2. Hollow keyboard body mechanical resonance ("tock" sound)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // resonant frequency
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04); // pitch slide down for mechanical feel

      oscGain.gain.setValueAtTime(0.22, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      // Start both
      impulseSource.start();
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (err) {
      // Audio playback blocked or uninitialized
    }
  };

  const startTypewriter = () => {
    if (typewriterIntervalRef.current) {
      clearInterval(typewriterIntervalRef.current);
    }
    setWelcomeText('');
    let index = 0;

    typewriterIntervalRef.current = setInterval(() => {
      if (index < fullMessage.length) {
        setWelcomeText(fullMessage.substring(0, index + 1));
        // Play click sound on non-whitespace keystrokes for realistic timing
        if (fullMessage[index] !== ' ') {
          playClickSound();
        }
        index++;
      } else {
        if (typewriterIntervalRef.current) {
          clearInterval(typewriterIntervalRef.current);
        }
      }
    }, 70); // typing speed
  };

  // Lowercase typewriter message at the top of the screen - runs once on mount
  useEffect(() => {
    // Attempt to early-init AudioContext so it's ready if the tab is already active
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass && !audioCtxRef.current) {
      audioCtxRef.current = new AudioContextClass();
    }

    startTypewriter();
    return () => {
      if (typewriterIntervalRef.current) {
        clearInterval(typewriterIntervalRef.current);
      }
    };
  }, []);

  // Silent audio context unlocker on the very first user click on the document, without restarting the text
  useEffect(() => {
    const silentUnlock = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
      window.removeEventListener('click', silentUnlock, true);
      window.removeEventListener('pointerdown', silentUnlock, true);
      window.removeEventListener('keydown', silentUnlock, true);
    };

    window.addEventListener('click', silentUnlock, true);
    window.addEventListener('pointerdown', silentUnlock, true);
    window.addEventListener('keydown', silentUnlock, true);

    return () => {
      window.removeEventListener('click', silentUnlock, true);
      window.removeEventListener('pointerdown', silentUnlock, true);
      window.removeEventListener('keydown', silentUnlock, true);
    };
  }, []);



  // Handle responsive 3D computer scaling to occupy a bigger portion of the screen
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Target around 80% screen width and 72% screen height
      const scaleX = (w * 0.85) / 400;
      const scaleY = (h * 0.72) / 430;
      let calculatedScale = Math.min(scaleX, scaleY);

      // Limit to comfortable ranges (between 0.68 and 1.6)
      calculatedScale = Math.max(0.68, Math.min(1.6, calculatedScale));
      setScale(calculatedScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize and redraw initial canvas text/elements
  useEffect(() => {
    if (!canvasRef.current || isZooming) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset base turquoise CRT color
    ctx.fillStyle = '#3db3a7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle raster pixels grids (retro visual guidelines)
    ctx.strokeStyle = '#36a095';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 10) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 10) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Bold title: CLICK ME!
    ctx.fillStyle = '#111116';
    ctx.font = 'bold 12px "Press Start 2P", "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CLICK ME!', canvas.width / 2, canvas.height / 3.2);

    // Subtitle: TO BOOT SYSTEM
    ctx.fillStyle = '#fcfaf6';
    ctx.font = '7px "Press Start 2P", "Courier New", monospace';
    ctx.fillText('TO BOOT?', canvas.width / 2, canvas.height * 0.52);

    // Dynamic bar holder
    const barW = canvas.width * 0.72;
    const barH = 10;
    const barX = (canvas.width - barW) / 2;
    const barY = canvas.height * 0.68;

    ctx.fillStyle = '#111116';
    ctx.fillRect(barX, barY, barW, barH);

    ctx.fillStyle = '#ff4d4d'; // Red
    ctx.fillRect(barX + 2, barY + 2, barW * 0.4 - 2, barH - 4);

    ctx.fillStyle = '#fff200'; // Yellow
    ctx.fillRect(barX + barW * 0.4, barY + 2, barW * 0.55 - 2, barH - 4);
  }, [isZooming]);

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#3db3a7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle raster pixels grids
    ctx.strokeStyle = '#36a095';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 12) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 12) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
  };

  // Screen drawing handlers
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isZooming) return;
    setIsPainting(true);
    drawPixelAtEvent(e);
  };

  const drawPixelAtEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = paintColor;
    const size = 5; // Perfect micro retro brush size
    ctx.fillRect(Math.floor(x / size) * size, Math.floor(y / size) * size, size, size);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPainting || isZooming) return;
    drawPixelAtEvent(e);
  };

  const stopDrawing = () => {
    setIsPainting(false);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isZooming) return;

    // Prevent dragging computer if drawing on canvas
    if (activeTool === 'draw' && (e.target as HTMLElement).tagName === 'CANVAS') {
      return;
    }

    setIsDragging(true);
    setHasMoved(false);
    setDragStart({ x: e.clientX, y: e.clientY });
    setRotStart({ x: rotation.x, y: rotation.y });
    setPosStart({ x: position.x, y: position.y });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isZooming) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
      setHasMoved(true);
    }

    if (activeTool === 'rotate') {
      const nextX = Math.max(-25, Math.min(45, rotStart.x - deltaY * 0.3));
      const nextY = rotStart.y + deltaX * 0.35;
      setRotation({ x: nextX, y: nextY });
    } else if (activeTool === 'move') {
      setPosition({
        x: posStart.x + deltaX,
        y: posStart.y + deltaY,
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    // If mouse didn't move much (and we are not actively drawing), treat as clicking screen to boot
    if (!hasMoved && activeTool !== 'draw') {
      handleStart();
    }
  };

  const handleStart = () => {
    setIsZooming(true);
    // Beep sound on web audio
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'square';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc1.stop(ctx.currentTime + 0.15);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.45);
    } catch (e) {
      // Ignored if sound blocked
    }

    setTimeout(() => {
      onEnterDesktop();
    }, 700); // matching the motion zoom speed
  };

  return (
    <div className="relative w-full h-screen bg-[#87ceeb] overflow-hidden flex flex-col items-center justify-center p-4 md:p-8 scanlines select-none font-mono">
      {/* 2D Scrolling Minecraft-style Pixel-art clouds & hills with transition fade on boot zooming */}
      <motion.div
        animate={isZooming ? { opacity: 0, transition: { duration: 0.3 } } : { opacity: 1 }}
        className="absolute inset-0 pointer-events-none z-0"
      >
        <MinecraftCloud className="absolute top-10 left-0 w-32 opacity-80 cloud-anim-left" />
        <MinecraftCloud className="absolute top-28 left-0 w-40 opacity-70 cloud-anim-right pe-none" style={{ animationDelay: '-15s' }} />
        <MinecraftCloud className="absolute top-48 left-0 w-28 opacity-60 cloud-anim-left pe-none" style={{ animationDelay: '-35s' }} />

        {/* Decorative rolling green hills backdrop */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-[#4ade80] rounded-t-[100%] scale-x-125 translate-y-12" />
        <div className="absolute bottom-0 left-0 w-full h-16 bg-[#22c55e] rounded-t-[100%] scale-x-110 translate-y-6" style={{ transformOrigin: 'right' }} />
      </motion.div>

      {/* 1. TYPEWRITER STYLE HEADER (ALL LOWERCASE) - cleanly fades out on zooming */}
      <motion.div
        animate={isZooming ? { opacity: 0, y: -20, transition: { duration: 0.3 } } : { opacity: 1, y: 0 }}
        className="absolute top-12 sm:top-16 z-20 text-center w-full max-w-xl px-4 flex items-center justify-center pointer-events-none"
      >
        <span className="font-press-start text-xs sm:text-sm md:text-base tracking-wider text-black lowercase leading-relaxed drop-shadow-sm select-none">
          {welcomeText}
        </span>
        <span className="inline-block w-2 sm:w-2.5 h-4 sm:h-5 bg-black ml-1 blink align-middle"></span>
      </motion.div>

      {/* 2. DYNAMIC 3D RETRO PC VIEWPORT (ZOOMING UPON CLICK) */}
      <motion.div
        animate={isZooming ? { scale: scale * 15, y: -75, opacity: 0, transition: { duration: 0.7, ease: 'easeIn' } } : { scale: scale, y: 0 }}
        className="relative z-10 flex items-center justify-center"
      >
        <div
          id="retro-computer-monitor"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleStart();
            }
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="group relative outline-none cursor-grab active:cursor-grabbing transition-transform flex items-center justify-center rounded-none select-none"
          style={{
            width: '400px',
            height: '430px',
            perspective: '1400px',
            transformStyle: 'preserve-3d',
            backgroundColor: 'transparent',
            border: 'none',
          }}
        >


          {/* 3D Rotatable PC container matching the angled reference image */}
          <div
            className="w-full h-full relative"
            style={{
              transform: `rotateY(${rotation.y}deg) rotateX(${rotation.x}deg) translate3d(-35px, -10px, -60px)`,
              transformStyle: 'preserve-3d',
              transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* ========================================================= */}
            {/* 3A. RETRO MONITOR UNIT (W=340, H=280, D=200)               */}
            {/* Centered relative to Parent width of 400px (left: 30px)     */}
            {/* ========================================================= */}
            <div
              className="absolute left-[30px] top-[10px] w-[340px] h-[280px]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* MONITOR FRONT FACE (Highly-Stylized Cream Bezel & CRT Screen) */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-white via-[#fbf4eb] to-[#eedfcb] border-4 border-black p-4 flex flex-col justify-between shadow-[inset_3px_3px_0_rgba(255,255,255,0.9),-4px_-4px_0_rgba(0,0,0,0.15)_inset]"
                style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}
              >


                {/* Real CRT Screen Curved Bezel (Warm grey sand inlay) */}
                <div className="w-full h-[185px] bg-[#e4d2b9] border-4 border-black p-2 flex items-center justify-center relative shadow-[inset_4px_4px_0_rgba(0,0,0,0.3)] rounded-[22px] overflow-visible">

                  {/* Glowing CRT Screen Glass (Rounded, glowing, reflecting) */}
                  <div
                    className="w-full h-full rounded-[14px] relative overflow-hidden flex flex-col items-center justify-center p-2 text-center text-emerald-400 crt-screen border-4 border-black"
                    style={{
                      background: 'radial-gradient(circle at 50% 45%, #184c53 0%, #06191c 100%)',
                      boxShadow: 'inset 0 0 16px rgba(0,0,0,0.95), 0 0 10px rgba(0,255,180,0.15)',
                    }}
                  >

                    {/* Glowing glass diagonal sheen reflection */}
                    <div
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none z-20 mix-blend-overlay"
                    />
                    <div
                      className="absolute -left-[50%] -top-[50%] w-[200%] h-[200%] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-20"
                    />

                    {/* Scanline mesh */}
                    <div
                      className="absolute inset-0 bg-[#00000030] pointer-events-none z-10"
                      style={{
                        backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%)',
                        backgroundSize: '100% 3px',
                      }}
                    />

                    {/* Glowing pixel instructions */}
                    <span className="font-press-start text-[14px] text-[#fff200] blink leading-relaxed tracking-wide drop-shadow-[2.5px_2.5px_0_#000000] select-none z-10">
                      CLICK ME!
                    </span>

                    <span className="font-press-start text-[7px] text-[#3fb5f7] mt-3.5 tracking-tighter opacity-95 uppercase select-none font-extrabold drop-shadow-[1px_1px_0_#000000] z-10">
                      TO BOOT SYSTEM
                    </span>

                    {/* Desktop boot indicator progress bar */}
                    <div className="w-4/5 h-3.5 bg-black border-2 border-white mt-4 p-0.5 rounded-none overflow-hidden flex z-10">
                      <div className="h-full bg-[#ff4d4d] animate-[pulse_1s_infinite] border-r border-black" style={{ width: '45%' }} />
                      <div className="h-full bg-[#3fb5f7]" style={{ width: '55%' }} />
                    </div>
                  </div>
                </div>

                {/* Brand label & dials at bottom of screen bezel */}
                <div className="flex justify-between items-center px-1 mt-0.5">
                  {/* Brand signature + cute icon */}
                  <div className="flex items-center gap-1">
                    <span className="text-red-500 text-[10px] animate-bounce">✿</span>
                    <span className="font-press-start text-[7px] text-black font-black uppercase tracking-wider select-none">sillycat79</span>
                  </div>
                  {/* Physical retro dials & LED indicator */}
                  <div className="flex gap-2.5 items-center">
                    {/* Contrast dial knob */}
                    <div className="w-3.5 h-3.5 bg-[#fbf4eb] border-2 border-black rounded-full shadow-[1px_1px_0_0_rgba(0,0,0,0.5)] flex items-center justify-center relative select-none">
                      <div className="w-0.5 h-1.5 bg-black absolute top-0 rounded-sm" />
                    </div>
                    {/* Brightness dial knob */}
                    <div className="w-3.5 h-3.5 bg-[#fbf4eb] border-2 border-black rounded-full shadow-[1px_1px_0_0_rgba(0,0,0,0.5)] flex items-center justify-center relative select-none">
                      <div className="w-1.5 h-0.5 bg-black absolute left-0 rounded-sm" />
                    </div>
                    {/* Power LED Indicator */}
                    <div className="flex items-center gap-1 select-none">
                      <span className="text-[5px] text-black/50 font-bold uppercase">PWR</span>
                      <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 border border-black bg-[#ff3b30]"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MONITOR BACK FACE */}
              <div
                className="absolute inset-0 bg-[#e5dbcc] border-4 border-black shadow-[inset_-3px_-3px_0_rgba(0,0,0,0.15)]"
                style={{ transform: 'translate3d(0, 0, -130px) rotateY(180deg)', backfaceVisibility: 'hidden' }}
              />

              {/* MONITOR RIGHT FACE (Cream peach shadow with styled vent slots as in image) */}
              <div
                className="absolute top-0 left-0 h-[280px] bg-gradient-to-b from-[#ebdcb9] to-[#cbb893] border-4 border-black p-3 shadow-[inset_1.5px_1.5px_0_rgba(255,255,255,0.3)]"
                style={{
                  width: '130px',
                  transform: 'translate3d(275px, 0, -65px) rotateY(90deg)',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Authentic cooling vent slits from reference images */}
                <div className="absolute top-10 right-4 left-4 flex flex-col gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-full h-2 bg-[#2d2215] border border-black shadow-[1px_1px_0_rgba(255,255,255,0.15)]">
                      <div className="w-full h-[1px] bg-black" />
                    </div>
                  ))}
                </div>
              </div>

              {/* MONITOR LEFT FACE (Deep shaded side face) */}
              <div
                className="absolute top-0 left-0 h-[280px] bg-gradient-to-b from-[#cbbaa2] to-[#a09079] border-4 border-black p-3"
                style={{
                  width: '130px',
                  transform: 'translate3d(-65px, 0, -65px) rotateY(-90deg)',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Mirroring left cooling vents */}
                <div className="absolute top-10 right-4 left-4 flex flex-col gap-2 opacity-80">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-full h-2 bg-[#1f1911] border border-black">
                      <div className="w-full h-[1px] bg-black" />
                    </div>
                  ))}
                </div>
              </div>

              {/* MONITOR TOP FACE (Warm white highlighted top panel receding backward) */}
              <div
                className="absolute left-0 top-0 w-[340px] bg-gradient-to-b from-white to-[#f4ead9] border-4 border-black p-4 flex justify-between shadow-[inset_1.5px_1.5px_0_rgba(255,255,255,0.6)]"
                style={{
                  height: '130px',
                  transform: 'translate3d(0, -65px, -65px) rotateX(90deg)',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Design ridges on top of the screen case */}
                <div className="w-12 h-full border-r-2 border-l-2 border-black/15" />
                <div className="w-12 h-full border-r-2 border-l-2 border-black/15" />
                <div className="w-12 h-full border-r-2 border-l-2 border-black/15" />
              </div>

              {/* MONITOR BOTTOM FACE (Deep shadow underside) */}
              <div
                className="absolute left-0 top-0 w-[340px] bg-gradient-to-b from-[#706454] to-[#473e33] border-4 border-black"
                style={{
                  height: '130px',
                  transform: 'translate3d(0, 215px, -65px) rotateX(-90deg)',
                  backfaceVisibility: 'hidden',
                }}
              />
            </div>

            {/* ========================================================= */}
            {/* 3B. RETRO FLOPPY DISK CHASSIS BASE (W=380, H=65, D=160)     */}
            {/* Centered relative to Parent width of 400px (left: 10px)     */}
            {/* ========================================================= */}
            <div
              className="absolute left-[10px] top-[290px] w-[380px] h-[65px]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* BASE FRONT FACE (Includes Floppy slot, floppy disk, and flip switch) */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-white via-[#fbf4eb] to-[#eedfcb] border-4 border-black p-3.5 flex items-center justify-between shadow-[inset_3px_3px_0_rgba(255,255,255,0.9),-4px_-4px_0_rgba(0,0,0,0.15)_inset]"
                style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}
              >
                {/* Left sector: decorative grooved lines + labels */}
                <div className="flex flex-col gap-1 w-24 select-none">
                  <div className="w-full h-1 border-b-2 border-black/25" />
                  <div className="w-18 h-1 border-b-2 border-black/25" />
                  <span className="text-[5.5px] font-mono text-black/50 tracking-wider uppercase mt-1">c:\sillycat79&gt;_</span>
                </div>

                {/* High fidelity vintage 3.5" Disk slot block */}
                <div className="w-[185px] h-[36px] bg-[#ebdcb9] border-4 border-black relative rounded-sm px-2 flex items-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]">
                  {/* Disk drive outline slot */}
                  <div className="w-[150px] h-4 bg-[#111111] border-2 border-black relative flex items-center overflow-visible">

                    {/* Visual 3.5" Diskette sticking out! (Beautiful Pop Blue) */}
                    <div className="w-[100px] h-4 bg-[#2563eb] border-2 border-black absolute -left-2.5 z-10 flex items-center justify-between px-1.5 shadow-[2px_2px_0_rgba(0,0,0,0.5)] transition-all select-none font-sans font-bold text-[5px]">
                      {/* Diskette sliding metal shutter detail */}
                      <div className="w-5 h-2.5 bg-[#94a3b8] border border-black flex items-center justify-center">
                        <div className="w-[2px] h-1.5 bg-black ml-1" />
                      </div>
                      {/* Little label peeking out */}
                      <div className="bg-white px-[4px] py-[1px] border border-black text-[4.5px] font-sans font-bold leading-none text-black select-none">
                        PORTFOLIO
                      </div>
                    </div>

                    {/* Flashing Activity LED */}
                    <div className="w-1.5 h-1.5 bg-[#4ade80] absolute right-2 rounded-full animate-pulse border border-black shadow-[0_0_4px_#4ade80]" />
                  </div>

                  {/* Manual push eject button bracket */}
                  <div className="w-[20px] h-[10px] bg-white border border-black absolute right-1.5 bottom-1.5 shadow-[1px_1px_0_#000] cursor-pointer active:translate-y-[0.5px] active:shadow-none" />
                </div>

                {/* IBM classic Red chunky toggle power switch as requested */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[5px] text-red-600 font-extrabold leading-none select-none uppercase tracking-widest font-sans">Power</span>
                  <div className="w-7 h-7 bg-[#2d2215] border-2 border-black p-[2px]">
                    <div className="w-full h-full bg-[#ef3b30] border-2 border-black flex items-center justify-center text-center shadow-[1px_1px_0_rgba(255,255,255,0.4)_inset,2px_2px_0_rgba(0,0,0,1)] active:scale-95 cursor-pointer select-none font-semibold">
                      <div className="w-1.5 h-3 bg-black/80" />
                    </div>
                  </div>
                </div>
              </div>

              {/* BASE BACK FACE */}
              <div
                className="absolute inset-0 bg-[#e5dbcc] border-4 border-black"
                style={{ transform: 'translate3d(0, 0, -160px) rotateY(180deg)', backfaceVisibility: 'hidden' }}
              />

              {/* BASE RIGHT FACE (Shaded side panel) */}
              <div
                className="absolute top-0 left-0 h-[65px] bg-gradient-to-b from-[#ebdcb9] to-[#cbb893] border-4 border-black flex items-center justify-center"
                style={{
                  width: '160px',
                  transform: 'translate3d(300px, 0, -80px) rotateY(90deg)',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Secondary expansion vent holes */}
                <div className="grid grid-cols-4 gap-2.5">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-2.5 h-1.5 bg-black/40 border border-black rounded-none" />
                  ))}
                </div>
              </div>

              {/* BASE LEFT FACE */}
              <div
                className="absolute top-0 left-0 h-[65px] bg-gradient-to-b from-[#cbbaa2] to-[#a09079] border-4 border-black"
                style={{
                  width: '160px',
                  transform: 'translate3d(-80px, 0, -80px) rotateY(-90deg)',
                  backfaceVisibility: 'hidden',
                }}
              />

              {/* BASE TOP FACE (Supports the monitor sitting on top of it) */}
              <div
                className="absolute left-0 top-0 w-[380px] bg-gradient-to-b from-[#ffffff] to-[#faefe3] border-4 border-black shadow-[inset_3px_3px_0_rgba(255,255,255,0.7)] overflow-hidden"
                style={{
                  height: '160px',
                  transform: 'translate3d(0, -80px, -80px) rotateX(90deg)',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Footprint contact shadow of the monitor sitting on top of the base */}
                <div className="absolute top-[15px] left-[20px] w-[340px] h-[130px] bg-black/45 rounded-sm filter blur-[3px] pointer-events-none mix-blend-multiply" />
              </div>

              {/* BASE BOTTOM FACE */}
              <div
                className="absolute left-0 top-0 w-[380px] bg-gradient-to-b from-[#706454] to-[#40372b] border-4 border-black"
                style={{
                  height: '160px',
                  transform: 'translate3d(0, -15px, -80px) rotateX(-90deg)',
                  backfaceVisibility: 'hidden',
                }}
              />
            </div>

            {/* ========================================================= */}
            {/* 3C. ISOMETRIC KEYBOARD BLOCK (W=330, H=20, D=80)            */}
            {/* Translated forward in depth (+Z) & sitting lowered on Y   */}
            {/* ========================================================= */}
            <div
              className="absolute left-[35px] top-[365px] w-[330px] h-[20px]"
              style={{
                transform: 'translate3d(0, 0, 95px) rotateX(4deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* KEYBOARD FRONT EDGE */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-white via-[#faefe0] to-[#eedfcb] border-4 border-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.7)]"
                style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}
              />

              {/* KEYBOARD BACK EDGE */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-white via-[#faefe0] to-[#eedfcb] border-4 border-black"
                style={{ transform: 'translate3d(0, 0, -80px) rotateY(180deg)', backfaceVisibility: 'hidden' }}
              />

              {/* KEYBOARD RIGHT SIDE */}
              <div
                className="absolute top-0 left-0 h-[20px] bg-gradient-to-b from-[#e3cfb4] to-[#caa885] border-4 border-black"
                style={{
                  width: '80px',
                  transform: 'translate3d(290px, 0, -40px) rotateY(90deg)',
                  backfaceVisibility: 'hidden',
                }}
              />

              {/* KEYBOARD LEFT SIDE */}
              <div
                className="absolute top-0 left-0 h-[20px] bg-gradient-to-b from-[#c9b79e] to-[#a09079] border-4 border-black"
                style={{
                  width: '80px',
                  transform: 'translate3d(-40px, 0, -40px) rotateY(-90deg)',
                  backfaceVisibility: 'hidden',
                }}
              />

              {/* KEYBOARD TOP FACE (Houses all the individually styled keycaps grid) */}
              <div
                className="absolute left-0 top-0 w-[330px] bg-gradient-to-b from-white via-[#fbf4eb] to-[#eedfcb] border-4 border-black p-1 flex flex-col justify-between shadow-[inset_2px_2px_0_rgba(255,255,255,0.9)]"
                style={{
                  height: '80px',
                  transform: 'translate3d(0, -40px, -40px) rotateX(90deg)',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Authentic 4-row keycaps arrangement */}
                <div className="w-full h-full bg-gradient-to-br from-[#dfcbaf] to-[#caa885] p-1 flex flex-col gap-1 select-none border-2 border-black rounded-sm shadow-[inset_1px_1px_3px_rgba(0,0,0,0.35)]">
                  {/* Top Row: Escape (Red!) & Function keys */}
                  <div className="flex gap-0.5 h-3 w-full">
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); playClickSound(); }}
                      className="flex-1 bg-gradient-to-b from-[#ff6b62] to-[#de291e] border border-black shadow-[1.5px_1.5px_0_0_#99201a] rounded-sm transition-transform active:translate-y-[1px] cursor-pointer relative"
                    /> {/* ESC key */}
                    {[...Array(11)].map((_, i) => (
                      <div
                        key={i}
                        onPointerDown={(e) => { e.stopPropagation(); playClickSound(); }}
                        className="flex-1 bg-gradient-to-b from-white to-[#ebdcb9] border border-black shadow-[1.5px_1.5px_0_0_#9a8b6f] rounded-sm transition-transform active:translate-y-[1px] cursor-pointer relative"
                      />
                    ))}
                  </div>
                  {/* Number keys */}
                  <div className="flex gap-0.5 h-3 w-full">
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); playClickSound(); }}
                      className="w-4 bg-gradient-to-b from-[#ebdcb9] to-[#bca990] border border-black shadow-[1.5px_1.5px_0_0_#7a6a52] rounded-sm transition-transform active:translate-y-[1px] cursor-pointer"
                    />
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        onPointerDown={(e) => { e.stopPropagation(); playClickSound(); }}
                        className="flex-1 bg-gradient-to-b from-white to-[#f4ead9] border border-black shadow-[1.5px_1.5px_0_0_#beb29a] rounded-sm transition-transform active:translate-y-[1px] cursor-pointer"
                      />
                    ))}
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); playClickSound(); }}
                      className="w-6 bg-gradient-to-b from-[#ebdcb9] to-[#bca990] border border-black shadow-[1.5px_1.5px_0_0_#7a6a52] rounded-sm transition-transform active:translate-y-[1px] cursor-pointer"
                    />
                  </div>
                  {/* Letters / Qwerty level with grey tab/enter keys */}
                  <div className="flex gap-0.5 h-3 w-full">
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); playClickSound(); }}
                      className="w-6 bg-gradient-to-b from-[#ebdcb9] to-[#bca990] border border-black shadow-[1.5px_1.5px_0_0_#7a6a52] rounded-sm transition-transform active:translate-y-[1px] cursor-pointer"
                    />
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        onPointerDown={(e) => { e.stopPropagation(); playClickSound(); }}
                        className="flex-1 bg-gradient-to-b from-white to-[#f4ead9] border border-black shadow-[1.5px_1.5px_0_0_#beb29a] rounded-sm transition-transform active:translate-y-[1px] cursor-pointer"
                      />
                    ))}
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); playClickSound(); }}
                      className="w-8 bg-gradient-to-b from-[#ebdcb9] to-[#bca990] border border-black shadow-[1.5px_1.5px_0_0_#7a6a52] rounded-sm transition-transform active:translate-y-[1px] cursor-pointer"
                    />
                  </div>
                  {/* Space / Command rows */}
                  <div className="flex gap-0.5 h-3 w-full">
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); playClickSound(); }}
                      className="w-10 bg-gradient-to-b from-[#ebdcb9] to-[#bca990] border border-black shadow-[1.5px_1.5px_0_0_#7a6a52] rounded-sm transition-transform active:translate-y-[1px] cursor-pointer"
                    />
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); playClickSound(); }}
                      className="flex-1 bg-gradient-to-b from-white to-[#f4ead9] border border-black shadow-[1.5px_1.5px_0_0_#beb29a] rounded-sm transition-transform active:translate-y-[1px] cursor-pointer"
                    /> {/* Long spacebar */}
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); playClickSound(); }}
                      className="w-10 bg-gradient-to-b from-[#ebdcb9] to-[#bca990] border border-black shadow-[1.5px_1.5px_0_0_#7a6a52] rounded-sm transition-transform active:translate-y-[1px] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* KEYBOARD BOTTOM FACE */}
              <div
                className="absolute left-0 top-0 w-[330px] bg-gradient-to-b from-[#a09079] to-[#736551] border-4 border-black"
                style={{
                  height: '80px',
                  transform: 'translate3d(0, -20px, -40px) rotateX(-90deg)',
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer credits and sounds (Translucent accent) */}
      <motion.div
        animate={isZooming ? { opacity: 0, transition: { duration: 0.3 } } : { opacity: 1 }}
        className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 font-mono text-[9px] text-[#00008035] bg-white/20 px-2.5 py-1.5 rounded-none border border-black/10 pointer-events-none"
      >
        <Volume2 size={10} />
        <span>audio enabled</span>
      </motion.div>
    </div>
  );
}
