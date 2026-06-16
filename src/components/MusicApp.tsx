import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';

interface SeqStep {
  pitch: number;
  noteName: string;
  active: boolean;
}

export default function MusicApp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(130);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [pressedNote, setPressedNote] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sound FX matrix frequencies
  const FX_PRESETS = {
    laser: [800, 300, 100],
    jump: [150, 300, 600],
    powerup: [100, 200, 400, 800],
    explosion: [400, 240, 100, 40],
    coin: [523.25, 659.25], // C5 then E5
  };

  // Keyboard notes frequencies
  const ENUM_NOTES = [
    { name: 'C4', freq: 261.63, key: 'A', color: 'bg-white' },
    { name: 'C#4', freq: 277.18, key: 'W', color: 'bg-black text-white w-6 h-12 -mx-3 z-10' },
    { name: 'D4', freq: 293.66, key: 'S', color: 'bg-white' },
    { name: 'D#4', freq: 311.13, key: 'E', color: 'bg-black text-white w-6 h-12 -mx-3 z-10' },
    { name: 'E4', freq: 329.63, key: 'D', color: 'bg-white' },
    { name: 'F4', freq: 349.23, key: 'F', color: 'bg-white' },
    { name: 'F#4', freq: 369.99, key: 'T', color: 'bg-black text-white w-6 h-12 -mx-3 z-10' },
    { name: 'G4', freq: 392.00, key: 'G', color: 'bg-white' },
    { name: 'G#4', freq: 415.30, key: 'Y', color: 'bg-black text-white w-6 h-12 -mx-3 z-10' },
    { name: 'A4', freq: 440.00, key: 'H', color: 'bg-white' },
    { name: 'A#4', freq: 466.16, key: 'U', color: 'bg-black text-white w-6 h-12 -mx-3 z-10' },
    { name: 'B4', freq: 493.88, key: 'J', color: 'bg-white' },
    { name: 'C5', freq: 523.25, key: 'K', color: 'bg-white' }
  ];

  // 8 step sequencer grid
  const [sequencer, setSequencer] = useState<SeqStep[]>([
    { pitch: 261.63, noteName: 'C4', active: true },
    { pitch: 293.66, noteName: 'D4', active: false },
    { pitch: 329.63, noteName: 'E4', active: true },
    { pitch: 349.23, noteName: 'F4', active: false },
    { pitch: 392.00, noteName: 'G4', active: true },
    { pitch: 440.00, noteName: 'A4', active: false },
    { pitch: 493.88, noteName: 'B4', active: true },
    { pitch: 523.25, noteName: 'C5', active: false }
  ]);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playCustomFreq = useCallback((freq: number, duration: number = 0.2, type: OscillatorType = 'square') => {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Retro volume envelope
    gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [initAudio]);

  const triggerFX = (fxName: keyof typeof FX_PRESETS) => {
    const ctx = initAudio();
    const now = ctx.currentTime;
    const freqs = FX_PRESETS[fxName];
    const duration = 0.15;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = fxName === 'explosion' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gainNode.gain.setValueAtTime(0.15, now + idx * 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + duration);
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      const note = ENUM_NOTES.find((item) => item.key.toLowerCase() === event.key.toLowerCase());
      if (!note) return;

      event.preventDefault();
      setPressedNote(note.name);
      playCustomFreq(note.freq, 0.25, 'square');
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const note = ENUM_NOTES.find((item) => item.key.toLowerCase() === event.key.toLowerCase());
      if (note) {
        setPressedNote((current) => (current === note.name ? null : current));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playCustomFreq]);

  // Toggle step
  const toggleStep = (idx: number) => {
    setSequencer(prev => prev.map((step, sIdx) => 
      sIdx === idx ? { ...step, active: !step.active } : step
    ));
  };

  // Run Sequencer loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = (60 / tempo) * 1000 / 2; // eighth notes
      let step = 0;

      intervalRef.current = setInterval(() => {
        setActiveStep(step);
        const currentNote = sequencer[step];
        if (currentNote.active) {
          playCustomFreq(currentNote.pitch, 0.15, 'triangle');
        }
        step = (step + 1) % 8;
      }, intervalMs);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setActiveStep(-1);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playCustomFreq, sequencer, tempo]);

  return (
    <div className="flex flex-col h-full bg-[#dfdfdf] font-mono text-xs select-none p-3 gap-3 overflow-y-auto retro-scroll">
      {/* Device Body Grid Banner */}
      <div className="flex items-center justify-between border-b border-gray-400 pb-2 flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xl">📻</span>
          <div>
            <h4 className="font-press-start text-[10px] m-0 text-gray-800">8-BIT CHIP SYNTH</h4>
            <span className="text-[10px] text-gray-500">Audio Synth Console v1.0</span>
          </div>
        </div>

        {/* Play control buttons */}
        <div className="flex items-center gap-1">
          <button
            id="music-play"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`retro-button px-2.5 py-1 flex items-center gap-1 font-bold ${isPlaying ? 'bg-yellow-200' : ''}`}
          >
            {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
            {isPlaying ? 'PAUSE' : 'PLAY LOOP'}
          </button>
          <div className="flex items-center gap-1 px-1 bg-white border border-gray-400">
            <span className="text-[9px] text-gray-600">TEMPO</span>
            <input
              id="music-tempo-slider"
              type="range"
              min="60"
              max="240"
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
              className="w-16 h-1 bg-blue-200 accent-blue-700 cursor-pointer"
            />
            <span className="text-[10px] text-gray-800 font-bold min-w-[24px] text-right">{tempo}</span>
          </div>
        </div>
      </div>

      {/* Sequencer Matrix */}
      <div className="retro-outset p-2 text-gray-700">
        <div className="font-press-start text-[8px] mb-1.5 text-gray-800">8-STEP RHYTHM CHIP</div>
        <div className="grid grid-cols-8 gap-1 p-1 bg-gray-300 rounded border border-gray-400 shadow-inner">
          {sequencer.map((step, idx) => (
            <button
              key={idx}
              id={`synth-step-${idx}`}
              onClick={() => toggleStep(idx)}
              className={`h-10 rounded border-2 flex flex-col items-center justify-center relative cursor-cell ${
                step.active 
                  ? 'bg-amber-400 border-yellow-200 text-yellow-950 font-bold' 
                  : 'bg-gray-100 border-gray-300 text-gray-400'
              } ${activeStep === idx ? 'ring-2 ring-red-500' : ''}`}
            >
              <div className={`w-2 h-2 rounded-full absolute top-1 ${step.active ? 'bg-amber-100' : 'bg-gray-300'} ${activeStep === idx ? 'bg-red-500 animate-ping' : ''}`} />
              <span className="text-[9px] mt-2 font-mono">{step.noteName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* sound board FX Box */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5 font-mono text-[10px]">
        <button
          id="fx-coin"
          onClick={() => triggerFX('coin')}
          className="retro-button py-2 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-gray-200"
        >
          <span>🟡</span>
          <span className="font-bold">COIN</span>
        </button>
        <button
          id="fx-laser"
          onClick={() => triggerFX('laser')}
          className="retro-button py-2 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-gray-200"
        >
          <span>⚡</span>
          <span className="font-bold">LASER</span>
        </button>
        <button
          id="fx-jump"
          onClick={() => triggerFX('jump')}
          className="retro-button py-2 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-gray-200"
        >
          <span>🏃</span>
          <span className="font-bold">JUMP</span>
        </button>
        <button
          id="fx-powerup"
          onClick={() => triggerFX('powerup')}
          className="retro-button py-2 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-gray-200"
        >
          <span>🍄</span>
          <span className="font-bold">POWER UP</span>
        </button>
        <button
          id="fx-explosion"
          onClick={() => triggerFX('explosion')}
          className="retro-button py-2 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-gray-200"
        >
          <span>💥</span>
          <span className="font-bold">BOOM</span>
        </button>
      </div>

      {/* Custom chiptune keyboard notes */}
      <div className="retro-outset p-2 mt-1">
        <div className="font-press-start text-[8px] mb-2 text-gray-800">PLAY LIVE KEYBOARD</div>
        <div className="flex justify-center bg-gray-500 p-1 rounded relative select-none">
          {ENUM_NOTES.map((note) => {
            const isWhite = note.color.includes('bg-white');
            const isPressed = pressedNote === note.name;
            return (
              <button
                key={note.name}
                id={`piano-key-${note.name}`}
                title={`press ${note.key}`}
                onClick={() => playCustomFreq(note.freq, 0.4, 'sawtooth')}
                className={`border border-gray-400 select-none hover:opacity-90 active:translate-y-0.5 rounded-sm flex items-end justify-center pb-1 text-[8px] font-bold ${
                  isWhite ? 'w-8 h-16 ' : ''
                } ${note.color} ${isPressed ? 'translate-y-0.5 ring-2 ring-pink-500' : ''}`}
              >
                <span>{note.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
