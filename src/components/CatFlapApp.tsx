import React, { useCallback, useEffect, useRef, useState } from 'react';
import { playSound } from '../soundEffects';

type GameState = 'ready' | 'playing' | 'gameover';

interface Pipe {
  x: number;
  gapY: number;
  passed: boolean;
}

const WIDTH = 520;
const HEIGHT = 360;
const CAT_X = 112;
const CAT_SIZE = 28;
const GRAVITY = 0.18;
const FLAP = -4.1;
const PIPE_WIDTH = 48;
const PIPE_GAP = 190;
const PIPE_SPACING = 270;
const PIPE_SPEED = 0.95;

const makePipe = (x: number): Pipe => ({
  x,
  gapY: 54 + Math.random() * 96,
  passed: false,
});

const initialPipes = () => [makePipe(WIDTH + 90), makePipe(WIDTH + 90 + PIPE_SPACING), makePipe(WIDTH + 90 + PIPE_SPACING * 2)];

export default function CatFlapApp() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const stateRef = useRef<GameState>('ready');
  const velocityRef = useRef(0);
  const catYRef = useRef(HEIGHT / 2);
  const pipesRef = useRef<Pipe[]>(initialPipes());
  const scoreRef = useRef(0);

  const [gameState, setGameState] = useState<GameState>('ready');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('cat-flap-best') || 0));

  const syncState = (nextState: GameState) => {
    stateRef.current = nextState;
    setGameState(nextState);
  };

  const resetGame = useCallback(() => {
    catYRef.current = HEIGHT / 2;
    velocityRef.current = 0;
    scoreRef.current = 0;
    pipesRef.current = initialPipes();
    setScore(0);
    syncState('ready');
  }, []);

  const finishGame = useCallback(() => {
    playSound('error');
    const nextBest = Math.max(bestScore, scoreRef.current);
    localStorage.setItem('cat-flap-best', String(nextBest));
    setBestScore(nextBest);
    syncState('gameover');
  }, [bestScore]);

  const flap = useCallback(() => {
    playSound('flap');
    if (stateRef.current === 'gameover') {
      resetGame();
      syncState('playing');
    } else if (stateRef.current === 'ready') {
      syncState('playing');
    }
    velocityRef.current = FLAP;
  }, [resetGame]);

  const drawPixelCat = (ctx: CanvasRenderingContext2D, y: number) => {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(CAT_X + 5, y + 6, 20, 18);
    ctx.fillRect(CAT_X + 8, y + 2, 5, 6);
    ctx.fillRect(CAT_X + 18, y + 2, 5, 6);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(CAT_X + 9, y + 3, 2, 2);
    ctx.fillRect(CAT_X + 20, y + 3, 2, 2);
    ctx.fillStyle = '#111827';
    ctx.fillRect(CAT_X + 10, y + 12, 3, 3);
    ctx.fillRect(CAT_X + 18, y + 12, 3, 3);
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(CAT_X + 13, y + 16, 5, 4);
    ctx.fillStyle = '#be123c';
    ctx.fillRect(CAT_X + 15, y + 18, 2, 1);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(CAT_X + 25, y + 12, 8, 4);
    ctx.fillRect(CAT_X + 30, y + 8, 4, 4);
  };

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = '#bae6fd';
    for (let x = 0; x < WIDTH; x += 24) {
      ctx.fillRect(x, 0, 1, HEIGHT);
    }

    ctx.fillStyle = '#86efac';
    ctx.fillRect(0, HEIGHT - 42, WIDTH, 42);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, HEIGHT - 42, WIDTH, 8);

    pipesRef.current.forEach((pipe) => {
      const topHeight = pipe.gapY;
      const bottomY = pipe.gapY + PIPE_GAP;
      ctx.fillStyle = '#15803d';
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, topHeight);
      ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, HEIGHT - 42 - bottomY);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(pipe.x - 4, topHeight - 16, PIPE_WIDTH + 8, 16);
      ctx.fillRect(pipe.x - 4, bottomY, PIPE_WIDTH + 8, 16);
    });

    drawPixelCat(ctx, catYRef.current);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`score ${scoreRef.current}`, 16, 28);
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`best ${bestScore}`, 18, 48);

    if (stateRef.current !== 'playing') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.86)';
      ctx.fillRect(72, 110, WIDTH - 144, 102);
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 4;
      ctx.strokeRect(72, 110, WIDTH - 144, 102);
      ctx.fillStyle = '#111827';
      ctx.textAlign = 'center';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(stateRef.current === 'ready' ? 'click or press space' : 'game over', WIDTH / 2, 148);
      ctx.font = 'bold 12px monospace';
      ctx.fillText(stateRef.current === 'ready' ? 'help the cat dodge the pipes' : 'click to try again', WIDTH / 2, 176);
      ctx.textAlign = 'left';
    }
  }, [bestScore]);

  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    if (stateRef.current === 'playing') {
      velocityRef.current += GRAVITY;
      catYRef.current += velocityRef.current;

      pipesRef.current = pipesRef.current.map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }));
      if (pipesRef.current[0].x + PIPE_WIDTH < -10) {
        pipesRef.current = [...pipesRef.current.slice(1), makePipe(pipesRef.current[pipesRef.current.length - 1].x + PIPE_SPACING)];
      }

      pipesRef.current.forEach((pipe) => {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < CAT_X) {
          pipe.passed = true;
          scoreRef.current += 1;
          setScore(scoreRef.current);
        }
      });

      const catTop = catYRef.current;
      const catBottom = catYRef.current + CAT_SIZE;
      const catLeft = CAT_X + 4;
      const catRight = CAT_X + CAT_SIZE;
      const hitGround = catBottom >= HEIGHT - 42;
      const hitCeiling = catTop <= 0;
      const hitPipe = pipesRef.current.some((pipe) => {
        const overlapsX = catRight > pipe.x && catLeft < pipe.x + PIPE_WIDTH;
        const inGap = catTop > pipe.gapY && catBottom < pipe.gapY + PIPE_GAP;
        return overlapsX && !inGap;
      });

      if (hitGround || hitCeiling || hitPipe) {
        finishGame();
      }
    }

    draw(ctx);
    animationRef.current = requestAnimationFrame(tick);
  }, [draw, finishGame]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [tick]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        flap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flap]);

  return (
    <div className="flex h-full flex-col gap-2 bg-[#dfdfdf] p-3 font-mono text-xs text-black select-none">
      <div className="flex items-center justify-between gap-2 border-b border-gray-400 pb-2">
        <div>
          <h4 className="m-0 font-press-start text-[10px] text-gray-900">cat flap</h4>
          <span className="text-[10px] text-gray-600">click the canvas or press space</span>
        </div>
        <button onClick={resetGame} className="retro-button px-2 py-1 font-bold text-[10px]">
          reset
        </button>
      </div>

      <button
        type="button"
        onClick={flap}
        className="mx-auto block w-full max-w-[520px] cursor-pointer border-4 border-black bg-white p-0 shadow-[4px_4px_0_0_#000] focus:outline-none focus:ring-4 focus:ring-yellow-300"
      >
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="block h-auto w-full"
          style={{ imageRendering: 'pixelated' }}
        />
      </button>

      <div className="flex justify-center gap-4 text-[10px] font-bold">
        <span>score: {score}</span>
        <span>best: {bestScore}</span>
        <span>{gameState}</span>
      </div>
    </div>
  );
}
