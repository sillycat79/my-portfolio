import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Power, Terminal, RotateCcw, Calendar, Folder, FileText, User, Briefcase, GraduationCap, Github, Play } from 'lucide-react';
import DesktopIntro from './components/DesktopIntro';
import RetroWindow from './components/RetroWindow';
import FileFinder from './components/FileFinder';
import PaintApp from './components/PaintApp';
import MusicApp from './components/MusicApp';
import CatFlapApp from './components/CatFlapApp';
import { AppWindow, Project } from './types';

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

export default function App() {
  const [bootState, setBootState] = useState<'intro' | 'loading' | 'desktop'>('intro');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeId, setActiveId] = useState<string>('read_me');
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCompactViewport, setIsCompactViewport] = useState(false);

  const lastClickRef = useRef<{ [key: string]: number }>({});
  const handleDoubleTap = (id: string, action: () => void) => {
    const now = Date.now();
    const lastClick = lastClickRef.current[id] || 0;
    if (now - lastClick < 300) {
      action();
      lastClickRef.current[id] = 0;
    } else {
      lastClickRef.current[id] = now;
    }
  };

  // Initial Window Setup Configs
  const [windows, setWindows] = useState<AppWindow[]>([
    {
      id: 'finder',
      title: 'Portfolio Explorer',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      x: 60,
      y: 60,
      width: 720,
      height: 480,
      type: 'projects',
    },
    {
      id: 'paint',
      title: 'Paint 95 Widget',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      x: 100,
      y: 100,
      width: 580,
      height: 440,
      type: 'paint',
    },
    {
      id: 'music',
      title: '8-Bit Synth',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      x: 130,
      y: 90,
      width: 620,
      height: 500,
      type: 'music',
    },
    {
      id: 'cat_flap',
      title: 'Cat Flap',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      x: 150,
      y: 70,
      width: 620,
      height: 520,
      type: 'cat_flap',
    },
    {
      id: 'read_me',
      title: 'ReadMe.txt',
      isOpen: true, // open initially
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      x: 40,
      y: 40,
      width: 460,
      height: 380,
      type: 'read_me',
    },
    {
      id: 'project_details',
      title: 'Project Details.doc',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      x: 160,
      y: 80,
      width: 600,
      height: 450,
      type: 'project_details',
    }
  ]);

  // Sync System Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncViewport = () => {
      setIsCompactViewport(window.innerWidth < 900);
    };

    syncViewport();
    window.addEventListener('resize', syncViewport);

    return () => window.removeEventListener('resize', syncViewport);
  }, []);

  // Set initial desktop widths responsively based on monitor width on startup
  useEffect(() => {
    if (bootState === 'desktop') {
      if (typeof window !== 'undefined') {
        if (isCompactViewport) {
          setWindows((prev) =>
            prev.map((w) => ({
              ...w,
              isMaximized: true,
              width: window.innerWidth - 10,
              height: window.innerHeight - 80,
            }))
          );
        }
      }
    }
  }, [bootState, isCompactViewport]);

  const handleOpenWindow = (id: string, customMeta?: any) => {
    const nextZ = Math.max(...windows.map((w) => w.zIndex), 0) + 1;
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return {
            ...w,
            isOpen: true,
            isMinimized: false,
            isMaximized: isCompactViewport ? true : w.isMaximized,
            zIndex: nextZ,
            meta: customMeta || w.meta,
          };
        }
        return w;
      })
    );
    setActiveId(id);
    setStartMenuOpen(false);
  };

  const handleCloseWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return { ...w, isOpen: false };
        }
        return w;
      })
    );
  };

  const handleMinimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return { ...w, isMinimized: true };
        }
        return w;
      })
    );
  };

  const handleMaximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return { ...w, isMaximized: !w.isMaximized };
        }
        return w;
      })
    );
  };

  const handleFocusWindow = (id: string) => {
    const nextZ = Math.max(...windows.map((w) => w.zIndex), 0) + 1;
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return { ...w, zIndex: nextZ };
        }
        return w;
      })
    );
    setActiveId(id);
  };

  const handleOpenProjectDetails = (project: Project) => {
    setSelectedProject(project);
    handleOpenWindow('project_details', project);
  };

  const currentActiveProject = selectedProject || (windows.find(w => w.id === 'project_details')?.meta as Project);

  return (
    <div className="w-full h-screen relative select-none">
      <AnimatePresence mode="wait">
        {bootState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            className="w-full h-full"
          >
            <DesktopIntro onEnterDesktop={() => setBootState('desktop')} />
          </motion.div>
        )}

        {bootState === 'desktop' && (
          <motion.div
            key="desktop"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            className="w-full h-full bg-[#87ceeb] overflow-hidden flex flex-col relative scanlines"
            style={{ imageRendering: 'pixelated' }}
          >
            {/* Elegant Minecraft clouds and hills background integration */}
            <div className="absolute top-4 left-0 w-full h-full pointer-events-none z-0">
              <MinecraftCloud className="absolute top-8 left-[10%] w-32 opacity-80 cloud-anim-left" style={{ animationDelay: '0s' }} />
              <MinecraftCloud className="absolute top-24 left-[45%] w-40 opacity-70 cloud-anim-right" style={{ animationDelay: '-15s' }} />
              <MinecraftCloud className="absolute top-40 left-[75%] w-28 opacity-60 cloud-anim-left" style={{ animationDelay: '-30s' }} />
            </div>

            {/* Backdrop hills behind windows, above desktop base height */}
            <div className="absolute bottom-12 left-0 w-full h-24 bg-[#4ade80] rounded-t-[100%] scale-x-125 translate-y-12 z-0 pointer-events-none" />
            <div className="absolute bottom-12 left-0 w-full h-16 bg-[#22c55e] rounded-t-[100%] scale-x-110 translate-y-6 z-0 pointer-events-none" style={{ transformOrigin: 'right' }} />

            {/* Desktop Shortcuts Workspace Grid */}
            <div className="flex-1 p-4 md:p-6 grid grid-cols-[repeat(auto-fill,minmax(78px,1fr))] lg:grid-flow-col lg:auto-cols-[82px] lg:grid-rows-[repeat(auto-fill,88px)] gap-y-4 gap-x-2 content-start justify-items-center relative z-10 overflow-y-auto">
              {/* Shortcut: Finder */}
              <button
                id="sh-finder"
                onDoubleClick={() => handleOpenWindow('finder')}
                onClick={() => handleDoubleTap('finder', () => handleOpenWindow('finder'))}
                className="w-[78px] flex flex-col items-center gap-1 text-center group cursor-pointer focus:outline-none"
              >
                <div className="text-4xl filter drop-shadow group-hover:scale-105 transition-transform">📁</div>
                <span className="text-[10px] text-white font-bold leading-tight font-mono tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] px-1 truncate w-full group-focus:bg-[#000080] group-focus:text-white rounded-sm">
                  My Profile Explorer
                </span>
              </button>

              {/* Shortcut: Paint */}
              <button
                id="sh-paint"
                onDoubleClick={() => handleOpenWindow('paint')}
                onClick={() => handleDoubleTap('paint', () => handleOpenWindow('paint'))}
                className="w-[78px] flex flex-col items-center gap-1 text-center group cursor-pointer focus:outline-none"
              >
                <div className="text-4xl filter drop-shadow group-hover:scale-105 transition-transform">🎨</div>
                <span className="text-[10px] text-white font-bold leading-tight font-mono tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] px-1 truncate w-full group-focus:bg-[#000080] group-focus:text-white rounded-sm">
                  Paint 95 Tool
                </span>
              </button>

              {/* Shortcut: Music */}
              <button
                id="sh-music"
                onDoubleClick={() => handleOpenWindow('music')}
                onClick={() => handleDoubleTap('music', () => handleOpenWindow('music'))}
                className="w-[78px] flex flex-col items-center gap-1 text-center group cursor-pointer focus:outline-none"
              >
                <div className="text-4xl filter drop-shadow group-hover:scale-105 transition-transform">📻</div>
                <span className="text-[10px] text-white font-bold leading-tight font-mono tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] px-1 truncate w-full group-focus:bg-[#000080] group-focus:text-white rounded-sm">
                  8-Bit Synth
                </span>
              </button>

              {/* Shortcut: Cat Flap */}
              <button
                id="sh-cat-flap"
                onDoubleClick={() => handleOpenWindow('cat_flap')}
                onClick={() => handleDoubleTap('cat_flap', () => handleOpenWindow('cat_flap'))}
                className="w-[78px] flex flex-col items-center gap-1 text-center group cursor-pointer focus:outline-none"
              >
                <div className="text-4xl filter drop-shadow group-hover:scale-105 transition-transform">🐱</div>
                <span className="text-[10px] text-white font-bold leading-tight font-mono tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] px-1 truncate w-full group-focus:bg-[#000080] group-focus:text-white rounded-sm">
                  Cat Flap
                </span>
              </button>

              {/* Shortcut: ReadMe File */}
              <button
                id="sh-readme"
                onDoubleClick={() => handleOpenWindow('read_me')}
                onClick={() => handleDoubleTap('read_me', () => handleOpenWindow('read_me'))}
                className="w-[78px] flex flex-col items-center gap-1 text-center group cursor-pointer focus:outline-none"
              >
                <div className="text-4xl filter drop-shadow group-hover:scale-105 transition-transform">📝</div>
                <span className="text-[10px] text-white font-bold leading-tight font-mono tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] px-1 truncate w-full group-focus:bg-[#000080] group-focus:text-white rounded-sm">
                  ReadMe.txt
                </span>
              </button>
            </div>

            {/* DYNAMIC OS APP WINDOWS DISPLAY */}
            <div className="absolute inset-0 pointer-events-none z-20">
              <div className="relative w-full h-full pointer-events-none">
                
                {/* 1. Main Finder / Projects Explorer window */}
                <RetroWindow
                  windowState={windows.find((w) => w.id === 'finder')!}
                  onClose={handleCloseWindow}
                  onMinimize={handleMinimizeWindow}
                  onMaximize={handleMaximizeWindow}
                  onFocus={handleFocusWindow}
                  activeId={activeId}
                >
                  <FileFinder
                    onOpenProjectDetails={handleOpenProjectDetails}
                    onOpenPaint={() => handleOpenWindow('paint')}
                    onOpenMusic={() => handleOpenWindow('music')}
                    onOpenCatFlap={() => handleOpenWindow('cat_flap')}
                  />
                </RetroWindow>

                {/* 2. Paint Canvas App window */}
                <RetroWindow
                  windowState={windows.find((w) => w.id === 'paint')!}
                  onClose={handleCloseWindow}
                  onMinimize={handleMinimizeWindow}
                  onMaximize={handleMaximizeWindow}
                  onFocus={handleFocusWindow}
                  activeId={activeId}
                >
                  <PaintApp />
                </RetroWindow>

                {/* 4. Reading text File window */}
                <RetroWindow
                  windowState={windows.find((w) => w.id === 'read_me')!}
                  onClose={handleCloseWindow}
                  onMinimize={handleMinimizeWindow}
                  onMaximize={handleMaximizeWindow}
                  onFocus={handleFocusWindow}
                  activeId={activeId}
                >
                  <div className="flex-1 bg-[#fffdf0] text-black font-mono p-4 text-xs overflow-y-auto leading-relaxed select-text shadow-inner">
                    <div className="border-b border-gray-400 pb-2 mb-3">
                      <h3 className="font-press-start text-[#000080] text-[9px] m-0">start here</h3>
                    </div>

                    <p className="mb-2"><strong>hi, i'm reb :)</strong></p>
                    <p className="mb-3">
                      this is my portfolio, built like a little old-school desktop because a plain scroll page felt too boring. you can drag the windows around, open folders, and click through the pieces i'm working on. on phones and tablets, windows open full-screen so everything is easier to read.
                    </p>

                    <p className="mb-2"><strong>what to open:</strong></p>
                    <ul className="list-inside list-disc flex flex-col gap-1 mb-4">
                      <li>open <strong>my profile explorer</strong> for projects, experience, education, and contact links.</li>
                      <li>open <strong>paint 95 tool</strong> if you want to doodle on the tiny canvas.</li>
                      <li>open <strong>8-bit synth</strong> to make tiny arcade sounds.</li>
                      <li>open <strong>cat flap</strong> to play a tiny cat game.</li>
                      <li>use the start button for quick links or to restart the intro screen.</li>
                    </ul>
                  </div>
                </RetroWindow>

                {/* 4. Music synth window */}
                <RetroWindow
                  windowState={windows.find((w) => w.id === 'music')!}
                  onClose={handleCloseWindow}
                  onMinimize={handleMinimizeWindow}
                  onMaximize={handleMaximizeWindow}
                  onFocus={handleFocusWindow}
                  activeId={activeId}
                >
                  <MusicApp />
                </RetroWindow>

                {/* Cat Flap game window */}
                <RetroWindow
                  windowState={windows.find((w) => w.id === 'cat_flap')!}
                  onClose={handleCloseWindow}
                  onMinimize={handleMinimizeWindow}
                  onMaximize={handleMaximizeWindow}
                  onFocus={handleFocusWindow}
                  activeId={activeId}
                >
                  <CatFlapApp />
                </RetroWindow>

                {/* 5. Project Details (Full Window Portal launcher) */}
                <RetroWindow
                  windowState={windows.find((w) => w.id === 'project_details')!}
                  onClose={handleCloseWindow}
                  onMinimize={handleMinimizeWindow}
                  onMaximize={handleMaximizeWindow}
                  onFocus={handleFocusWindow}
                  activeId={activeId}
                >
                  {currentActiveProject ? (
                    <div className="flex-1 bg-gray-100 p-4 font-mono text-xs overflow-y-auto select-text flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-gray-400 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl">🛠️</span>
                          <div>
                            <h3 className="font-press-start text-[10px] m-0 text-[#000080]">{currentActiveProject.name}</h3>
                            <span className="text-[9px] text-gray-500">
                              {currentActiveProject.difficulty === 'beginner' && 'Featured'}
                              {currentActiveProject.difficulty === 'intermediate' && 'Portfolio Feature'}
                              {currentActiveProject.difficulty === 'advanced' && 'Coming Soon'}
                            </span>
                          </div>
                        </div>
                        <button
                          id="btn-detail-close-back"
                          onClick={() => handleCloseWindow('project_details')}
                          className="retro-button px-2 py-1 text-[10px] font-bold"
                        >
                          CLOSE
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 flex flex-col gap-3">
                          <div>
                            <span className="font-bold block text-gray-700 text-[10px] mb-1">SUMMARY</span>
                            <div className="bg-white p-3 border border-gray-300 rounded leading-relaxed text-gray-700">
                              {currentActiveProject.description}
                            </div>
                          </div>

                          <div>
                            <span className="font-bold block text-gray-700 text-[10px] mb-1">DETAILS</span>
                            <div className="bg-white p-3 border border-gray-300 rounded text-gray-600 leading-relaxed">
                              {currentActiveProject.details}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <div className="border border-gray-300 p-3 bg-white rounded">
                            <span className="font-bold block text-gray-700 text-[10px] mb-1.5">STACK</span>
                            <div className="flex flex-wrap gap-1">
                              {currentActiveProject.stack.map((s, idx) => (
                                <span key={idx} className="bg-blue-50 border border-blue-300 text-[9px] text-blue-900 rounded font-mono px-2 py-0.5 font-bold">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="border border-gray-300 p-3 bg-gray-50 rounded">
                            <span className="font-bold block text-gray-700 text-[9px] mb-1">STATUS</span>
                            <span className="text-[10px] text-gray-500 block">
                              {currentActiveProject.difficulty === 'advanced' ? 'Placeholder' : 'In progress'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {currentActiveProject.codeSnippet && (
                        <div>
                          <span className="font-bold block text-gray-700 text-[10px] mb-1">CODE</span>
                          <pre className="bg-slate-900 text-yellow-200 p-3 rounded font-mono text-[10px] overflow-x-auto border border-gray-400 shadow-inner">
                            <code>{currentActiveProject.codeSnippet}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center p-8 text-gray-400">
                      <span>Select a project to preview it.</span>
                    </div>
                  )}
                </RetroWindow>

              </div>
            </div>

            {/* CLASSIC 95 TASKBAR (BOTTOM FOOTER) */}
            <div className="h-12 bg-[#dfdfdf] border-t-4 border-black w-full flex items-center justify-between px-2 select-none shrink-0 relative z-40">
              <div className="flex items-center gap-2 h-full">
                
                {/* START MENU TOGGLE BUTTON */}
                <button
                  id="start-button"
                  onClick={() => setStartMenuOpen(!startMenuOpen)}
                  className={`flex items-center gap-1.5 px-3 h-8 font-bold font-press-start text-[9px] rounded-none bg-[#fff200] border-2 border-black shadow-[2px_2px_0_0_#000000] text-black ${
                    startMenuOpen ? 'translate-x-[2px] translate-y-[2px] shadow-none bg-[#ffe100]' : ''
                  }`}
                >
                  <span className="text-[14px]">🖥️</span>
                  <span>HOME</span>
                </button>

                {/* START MENU OVERLAY DRAWER */}
                <AnimatePresence>
                  {startMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-12 left-1.5 w-72 bg-white retro-outset p-1.5 flex z-50 text-black font-mono border-4 border-black shadow-[6px_6px_0_0_#000000]"
                    >
                      {/* Left Sidebar Accent Graphics strip */}
                      <div className="w-10 bg-gradient-to-b from-[#ff4d4d] via-[#fff200] to-[#3fb5f7] border-2 border-black text-black flex flex-col justify-end p-1 rounded-none select-none">
                        <span className="transform -rotate-90 origin-bottom-left translate-x-2.5 -translate-y-2.5 font-bold font-press-start text-[10px] tracking-widest leading-none text-black flex select-none uppercase italic font-black">
                          sillycat79
                        </span>
                      </div>

                      {/* Right Action Options Links */}
                      <div className="flex-1 flex flex-col gap-1 pl-2 py-1 text-xs">
                        <button
                          id="menu-explorer"
                          onClick={() => handleOpenWindow('finder')}
                          className="w-full text-left px-2 py-2 hover:bg-[#ff4d4d] hover:text-black hover:font-bold hover:border-l-4 hover:border-black flex items-center gap-2 rounded-none transition-all"
                        >
                          <span className="text-sm">📁</span>
                          <span className="font-bold">Portfolio Explorer</span>
                        </button>

                        <button
                          id="menu-paint"
                          onClick={() => handleOpenWindow('paint')}
                          className="w-full text-left px-2 py-2 hover:bg-[#fff200] hover:text-black hover:font-bold hover:border-l-4 hover:border-black flex items-center gap-2 rounded-none transition-all"
                        >
                          <span className="text-sm">🎨</span>
                          <span className="font-bold">Paint 95 Drawing Tool</span>
                        </button>

                        <button
                          id="menu-music"
                          onClick={() => handleOpenWindow('music')}
                          className="w-full text-left px-2 py-2 hover:bg-cyan-300 hover:text-black hover:font-bold hover:border-l-4 hover:border-black flex items-center gap-2 rounded-none transition-all"
                        >
                          <span className="text-sm">📻</span>
                          <span className="font-bold">8-Bit Synth</span>
                        </button>

                        <button
                          id="menu-cat-flap"
                          onClick={() => handleOpenWindow('cat_flap')}
                          className="w-full text-left px-2 py-2 hover:bg-pink-200 hover:text-black hover:font-bold hover:border-l-4 hover:border-black flex items-center gap-2 rounded-none transition-all"
                        >
                          <span className="text-sm">🐱</span>
                          <span className="font-bold">Cat Flap</span>
                        </button>

                        <button
                          id="menu-guide"
                          onClick={() => handleOpenWindow('read_me')}
                          className="w-full text-left px-2 py-2 hover:bg-emerald-300 hover:text-black hover:font-bold hover:border-l-4 hover:border-black flex items-center gap-2 rounded-none transition-all"
                        >
                          <span className="text-sm">📝</span>
                          <span className="font-bold">ReadMe</span>
                        </button>

                        <div className="h-0.5 bg-black my-1 pb-px" />

                        {/* Power Off (Back to first loading screen!) */}
                        <button
                          id="menu-power-off"
                          onClick={() => {
                            setStartMenuOpen(false);
                            setBootState('intro');
                          }}
                          className="w-full text-left px-2 py-2 hover:bg-black hover:text-white text-red-600 flex items-center gap-2 rounded-none font-bold italic"
                        >
                          <Power size={13} className="shrink-0 stroke-[3]" />
                          <span>SHUT DOWN (BACK)</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Vertical Separator */}
                <div className="w-0.5 bg-black h-8 mx-1.5" />

                {/* Active instances tab indicators */}
                <div className="flex gap-1.5 overflow-x-auto max-w-[200px] md:max-w-md bg-transparent whitespace-nowrap scrollbar-none">
                  {windows
                    .filter((w) => w.isOpen)
                    .map((w) => {
                      const isFocused = activeId === w.id && !w.isMinimized;
                      return (
                        <button
                          key={w.id}
                          id={`taskbar-tab-${w.id}`}
                          onClick={() => {
                            if (w.isMinimized) {
                              setWindows((prev) =>
                                prev.map((item) => (item.id === w.id ? { ...item, isMinimized: false } : item))
                              );
                              handleFocusWindow(w.id);
                            } else if (activeId === w.id) {
                              handleMinimizeWindow(w.id);
                            } else {
                              handleFocusWindow(w.id);
                            }
                          }}
                          className={`px-3 h-8 flex items-center gap-2 text-[10px] select-none max-w-[140px] truncate border-2 border-black font-mono transition-all ${
                            isFocused
                              ? 'bg-[#ffe100] text-black font-bold shadow-none translate-x-[1px] translate-y-[1px]'
                              : 'bg-white text-black font-bold shadow-[2px_2px_0_0_#000000] hover:bg-yellow-50'
                          }`}
                        >
                          <span className="text-xs">🖳</span>
                          <span className="truncate">{w.title}</span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* SYSTEM TRAY CLOCK (BOTTOM RIGHT PANEL) */}
              <div className="px-3 h-8 flex items-center gap-2 text-[10px] font-mono bg-white font-bold border-2 border-black shadow-[2px_2px_0_0_#000000] text-black">
                <Calendar size={11} className="text-black stroke-[2.5]" />
                <span className="whitespace-nowrap tabular-nums">
                  {currentTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
