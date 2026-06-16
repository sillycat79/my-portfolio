import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Eraser, Trash2, Download, Circle } from 'lucide-react';

export default function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState<'pencil' | 'eraser' | 'spray'>('pencil');
  const [brushSize, setBrushSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);

  const colors = [
    '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#808040', '#004040', '#0080ff', '#004080', '#4000ff', '#804000',
    '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffff80', '#00ff80', '#80ffff', '#8080ff', '#ff8000', '#ff80ff'
  ];

  // Set up and resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 400;
    canvas.height = rect.height || 300;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if ('touches' in e) {
      if (e.cancelable) {
        e.preventDefault();
      }
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);

    if (tool === 'spray') {
      spray(ctx, x, y);
    } else {
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = brushSize;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if ('touches' in e) {
      if (e.cancelable) {
        e.preventDefault();
      }
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (tool === 'spray') {
      spray(ctx, x, y);
    } else {
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = brushSize;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const spray = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = color;
    const density = 40;
    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * brushSize * 2.5;
      const sprayX = x + Math.cos(angle) * radius;
      const sprayY = y + Math.sin(angle) * radius;
      ctx.fillRect(Math.floor(sprayX), Math.floor(sprayY), 1.5, 1.5);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'pixel_masterpiece.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div ref={containerRef} className="flex flex-col h-full bg-[#dfdfdf] font-mono text-xs select-none">
      {/* File Action Top Menu Bar */}
      <div className="flex border-b-4 border-black p-1.5 gap-4 bg-[#c3c3c3] font-mono select-none">
        <button id="btn-paint-clear" onClick={clearCanvas} className="retro-button px-3 py-1 flex items-center gap-1 bg-white hover:bg-yellow-150 font-bold shrink-0">
          <Trash2 size={12} className="stroke-[2.5]" /> Clear
        </button>
        <button id="btn-paint-save" onClick={saveCanvas} className="retro-button px-3 py-1 flex items-center gap-1 bg-white hover:bg-yellow-150 font-bold shrink-0">
          <Download size={12} className="stroke-[2.5]" /> Ex_File
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-[220px]">
        {/* Tool Palette Left Sidebar */}
        <div className="w-[56px] bg-[#dfdfdf] p-1.5 flex flex-col gap-1.5 border-r-4 border-black h-full">
          <button
            id="tool-pencil"
            onClick={() => setTool('pencil')}
            className={`w-10 h-10 flex items-center justify-center border-2 border-black transition-all ${
              tool === 'pencil' ? 'bg-[#fff200] shadow-none translate-x-[1px] translate-y-[1px]' : 'bg-white hover:bg-yellow-50 shadow-[2px_2px_0_0_#000000]'
            }`}
            title="Pencil Tool"
          >
            <Pencil size={18} className="stroke-[2.5]" />
          </button>
          <button
            id="tool-eraser"
            onClick={() => setTool('eraser')}
            className={`w-10 h-10 flex items-center justify-center border-2 border-black transition-all ${
              tool === 'eraser' ? 'bg-[#fff200] shadow-none translate-x-[1px] translate-y-[1px]' : 'bg-white hover:bg-yellow-50 shadow-[2px_2px_0_0_#000000]'
            }`}
            title="Eraser"
          >
            <Eraser size={18} className="stroke-[2.5]" />
          </button>
          <button
            id="tool-spray"
            onClick={() => setTool('spray')}
            className={`w-10 h-10 flex items-center justify-center border-2 border-black transition-all ${
              tool === 'spray' ? 'bg-[#fff200] shadow-none translate-x-[1px] translate-y-[1px]' : 'bg-white hover:bg-yellow-50 shadow-[2px_2px_0_0_#000000]'
            }`}
            title="Spray Can"
          >
            <span className="text-xl">💨</span>
          </button>

          {/* Sizer */}
          <div className="mt-3 border-2 border-black p-1 bg-white flex flex-col items-center gap-2 py-3 shadow-[2px_2px_0_0_#000000]">
            {[2, 4, 8, 14].map((size) => (
              <button
                key={size}
                id={`brush-size-${size}`}
                onClick={() => setBrushSize(size)}
                className={`flex items-center justify-center rounded-full ${brushSize === size ? 'bg-[#ff4d4d]' : 'bg-transparent'}`}
                style={{ width: `${Math.max(14, size + 4)}px`, height: `${Math.max(14, size + 4)}px` }}
              >
                <div
                  className="rounded-full bg-black shrink-0"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: brushSize === size ? '#ffffff' : '#000000'
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-400 p-2 overflow-auto flex items-center justify-center relative touch-none">
          <canvas
            ref={canvasRef}
            onMouseDown={(e) => { e.stopPropagation(); startDrawing(e); }}
            onMouseMove={(e) => { e.stopPropagation(); draw(e); }}
            onMouseUp={(e) => { e.stopPropagation(); stopDrawing(); }}
            onMouseLeave={(e) => { e.stopPropagation(); stopDrawing(); }}
            onTouchStart={(e) => { e.stopPropagation(); startDrawing(e); }}
            onTouchMove={(e) => { e.stopPropagation(); draw(e); }}
            onTouchEnd={(e) => { e.stopPropagation(); stopDrawing(); }}
            className="bg-white border-4 border-black cursor-crosshair shadow-[4px_4px_0_0_#000000] touch-none"
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </div>
      </div>

      {/* Color Palette Footer Swatches */}
      <div className="p-2 border-t-4 border-black bg-[#dfdfdf] flex flex-col gap-1 z-10 select-none">
        <div className="flex items-center gap-3">
          {/* Current selected preview */}
          <div className="w-8 h-8 border-2 border-black bg-white flex items-center justify-center shadow-[2px_2px_0_0_#000000]">
            <div className="w-5 h-5 border border-black shadow-sm" style={{ backgroundColor: color }} />
          </div>
          {/* Palettes */}
          <div className="grid grid-cols-14 gap-1 max-w-full overflow-x-auto select-none p-0.5">
            {colors.map((c, idx) => (
              <button
                key={idx}
                id={`paint-color-${idx}`}
                onClick={() => setColor(c)}
                className="w-4 h-4 border-2 border-black hover:scale-110 hover:z-20 active:scale-95 transition-all cursor-pointer"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
