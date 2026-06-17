import React from 'react';
import { motion } from 'motion/react';
import { X, Minus, Square } from 'lucide-react';
import { AppWindow } from '../types';

interface RetroWindowProps {
  windowState: AppWindow;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  activeId: string;
  children: React.ReactNode;
}

export default function RetroWindow({
  windowState,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  activeId,
  children,
}: RetroWindowProps) {
  const { id, title, isMaximized, isOpen, zIndex, x, y, width, height } = windowState;
  const [isDragging, setIsDragging] = React.useState(false);
  const cleanupDragRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    return () => {
      cleanupDragRef.current?.();
    };
  }, []);

  if (!isOpen) return null;

  const isActive = activeId === id;

  const handleMouseDown = () => {
    onFocus(id);
  };

  const handleTitlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isMaximized || e.button !== 0) return;

    e.preventDefault();
    onFocus(id);
    setIsDragging(true);

    const startPointerX = e.clientX;
    const startPointerY = e.clientY;
    const startX = x;
    const startY = y;

    const handlePointerMove = (event: PointerEvent) => {
      onMove(id, startX + event.clientX - startPointerX, startY + event.clientY - startPointerY);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      cleanupDragRef.current = null;
    };

    cleanupDragRef.current?.();
    cleanupDragRef.current = handlePointerUp;

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  return (
    <motion.div
      id={`window-${id}`}
      onMouseDown={handleMouseDown}
      initial={isMaximized ? { x: 0, y: 0, width: '100%', height: '100%' } : { x, y, width, height }}
      animate={
        isMaximized
          ? {
              x: 0,
              y: 0,
              width: '100%',
              height: '100%',
              transition: { duration: 0.1 },
            }
          : {
              x,
              y,
              width,
              height,
              transition: { duration: isDragging ? 0 : 0.1 },
            }
      }
      style={{
        zIndex,
        position: 'absolute',
        display: windowState.isMinimized ? 'none' : 'flex',
        flexDirection: 'column',
      }}
      className={`retro-outset desktop-window-frame p-[4px] select-text cursor-default pointer-events-auto ${
        isActive ? 'ring-4 ring-[#fff200] z-30' : 'opacity-95'
      }`}
    >
      {/* Title bar */}
      <div
        className={`window-titlebar h-10 px-3 flex items-center justify-between font-mono text-sm cursor-move select-none border-b-4 border-black ${
          isActive ? 'bg-[#ff4d4d] text-black font-black' : 'bg-[#c3c3c3] text-gray-600'
        }`}
        onPointerDown={handleTitlePointerDown}
        onDoubleClick={() => onMaximize(id)}
      >
        <div className="flex items-center gap-2 font-bold truncate pr-3">
          {/* Classic folder / app bullet icon */}
          <span className="text-base select-none">🖳</span>
          <span className="font-press-start text-[10px] select-none tracking-tight truncate uppercase italic">{title}</span>
        </div>

        {/* Action Window Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id={`btn-minimize-${id}`}
            title="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize(id);
            }}
            className="retro-button w-6 h-6 bg-white flex items-center justify-center p-0 hover:bg-yellow-300 text-black font-bold"
          >
            <Minus size={11} className="stroke-[3]" />
          </button>
          <button
            id={`btn-maximize-${id}`}
            title="Maximize"
            onClick={(e) => {
              e.stopPropagation();
              onMaximize(id);
            }}
            className="retro-button w-6 h-6 bg-white flex items-center justify-center p-0 hover:bg-yellow-300 text-black font-bold"
          >
            <Square size={11} className="stroke-[3]" />
          </button>
          <button
            id={`btn-close-${id}`}
            title="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose(id);
            }}
            className="retro-button w-6 h-6 bg-[#ff4d4d] hover:bg-red-400 flex items-center justify-center p-0 text-black font-bold ml-1"
          >
            <X size={12} className="stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Retro Inner Content body */}
      <div className="flex-1 min-h-0 overflow-hidden m-[1px] bg-white retro-inset flex flex-col relative text-black">
        {children}
      </div>
    </motion.div>
  );
}
