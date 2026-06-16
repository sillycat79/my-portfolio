import React, { useRef } from 'react';
import { motion, useDragControls } from 'motion/react';
import { X, Minus, Square } from 'lucide-react';
import { AppWindow } from '../types';

interface RetroWindowProps {
  windowState: AppWindow;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  activeId: string;
  children: React.ReactNode;
}

export default function RetroWindow({
  windowState,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  activeId,
  children,
}: RetroWindowProps) {
  const { id, title, isMaximized, isOpen, zIndex, x, y, width, height } = windowState;
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  if (!isOpen) return null;

  const isActive = activeId === id;

  const handleMouseDown = () => {
    onFocus(id);
  };

  return (
    <motion.div
      id={`window-${id}`}
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{ left: 0, top: 0, right: 800, bottom: 500 }} // fallback, we can leverage dynamic layouts
      onMouseDown={handleMouseDown}
      initial={isMaximized ? { x: 0, y: 0, width: '100%', height: '100%' } : { x, y, width, height }}
      animate={
        isMaximized
          ? {
              x: 0,
              y: 0,
              width: '100%',
              height: 'calc(100% - 40px)', // adjust for bottom taskbar
              transition: { duration: 0.1 },
            }
          : {
              x,
              y,
              width,
              height,
              transition: { duration: 0.1 },
            }
      }
      style={{
        zIndex,
        position: 'absolute',
        display: windowState.isMinimized ? 'none' : 'flex',
        flexDirection: 'column',
      }}
      className={`retro-outset p-[4px] select-text cursor-default pointer-events-auto ${
        isActive ? 'ring-4 ring-[#fff200] z-30' : 'opacity-95'
      }`}
    >
      {/* Title bar */}
      <div
        className={`window-titlebar h-10 px-3 flex items-center justify-between font-mono text-sm cursor-move select-none border-b-4 border-black ${
          isActive ? 'bg-[#ff4d4d] text-black font-black' : 'bg-[#c3c3c3] text-gray-600'
        }`}
        onPointerDown={(e) => {
          onFocus(id);
          dragControls.start(e);
        }}
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
      <div className="flex-1 overflow-hidden m-[1px] bg-white retro-inset flex flex-col relative text-black">
        {children}
      </div>
    </motion.div>
  );
}
