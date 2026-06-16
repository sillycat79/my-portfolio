import React, { useState } from 'react';
import { ArrowLeft, Folder, FileText, ChevronRight, CornerDownRight, ExternalLink } from 'lucide-react';
import { PROJECTS, WORK_EXPERIENCE, EDUCATION, LEADERSHIP_EXPERIENCE, ABOUT_ME_BIO, RPG_STATS } from '../data';
import { Project } from '../types';
import { playSound } from '../soundEffects';

interface FileFinderProps {
  onOpenProjectDetails: (project: Project) => void;
  onOpenPaint: () => void;
  onOpenMusic: () => void;
  onOpenCatFlap: () => void;
}

type DirectoryKey = 'root' | 'projects' | 'beginner' | 'intermediate' | 'advanced' | 'about' | 'experience' | 'leadership' | 'education' | 'socials';

export default function FileFinder({ onOpenProjectDetails, onOpenPaint, onOpenMusic, onOpenCatFlap }: FileFinderProps) {
  const [currentDir, setCurrentDir] = useState<DirectoryKey>('root');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const lastClickRef = React.useRef<{ [key: string]: number }>({});

  const handleDoubleTap = (id: string, action: () => void) => {
    playSound('click');
    const now = Date.now();
    const lastClick = lastClickRef.current[id] || 0;
    if (now - lastClick < 300) {
      action();
      lastClickRef.current[id] = 0;
    } else {
      lastClickRef.current[id] = now;
    }
  };

  // Path history for breadcrumbs
  const getPathBreadcrumbs = () => {
    switch (currentDir) {
      case 'root':
        return ['C:', 'Portfolio'];
      case 'projects':
        return ['C:', 'Portfolio', 'Projects'];
      case 'beginner':
        return ['C:', 'Portfolio', 'Projects', 'Featured'];
      case 'intermediate':
        return ['C:', 'Portfolio', 'Projects', 'Portfolio_Features'];
      case 'advanced':
        return ['C:', 'Portfolio', 'Projects', 'Coming_Soon'];
      case 'about':
        return ['C:', 'Portfolio', 'About_Me'];
      case 'experience':
        return ['C:', 'Portfolio', 'Work_Experience'];
      case 'leadership':
        return ['C:', 'Portfolio', 'Leadership'];
      case 'education':
        return ['C:', 'Portfolio', 'Education'];
      case 'socials':
        return ['C:', 'Portfolio', 'My_Socials'];
      default:
        return ['C:', 'Portfolio'];
    }
  };

  const selectedProject = PROJECTS.find((p) => p.id === selectedProjectId);

  // Navigate back to a specific level
  const navigateUp = () => {
    playSound('click');
    if (currentDir === 'beginner' || currentDir === 'intermediate' || currentDir === 'advanced') {
      setCurrentDir('projects');
      setSelectedProjectId(null);
    } else if (currentDir !== 'root') {
      setCurrentDir('root');
      setSelectedProjectId(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full font-mono text-xs text-black bg-gray-200 select-none">
      {/* LEFT SIDEBAR - Fast Access to other Portfolio elements */}
      <div className="w-full md:w-44 bg-[#dfdfdf] border-b md:border-b-0 md:border-r-4 border-black p-2 md:p-3 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible shrink-0 select-none">
        <div className="hidden md:block font-press-start text-[8px] text-gray-700 mb-2 border-b-2 border-black pb-1.5 font-bold uppercase italic shadow-sm">
          FOLDERS
        </div>
        <button
          id="sidebar-desktop"
          onClick={() => {
            playSound('click');
            setCurrentDir('root');
            setSelectedProjectId(null);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 w-max md:w-full text-left border-2 border-black font-bold text-[11px] transition-all ${
            currentDir === 'root' 
              ? 'bg-[#fff200] text-black shadow-[2px_2px_0_0_#000]' 
              : 'bg-white text-black hover:bg-yellow-50 shadow-none'
          }`}
        >
          <span>🖥️</span>
          <span>Desktop</span>
        </button>
        <button
          id="sidebar-projects"
          onClick={() => {
            playSound('click');
            setCurrentDir('projects');
            setSelectedProjectId(null);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 w-max md:w-full text-left border-2 border-black font-bold text-[11px] transition-all ${
            currentDir === 'projects' || ['beginner', 'intermediate', 'advanced'].includes(currentDir)
              ? 'bg-[#fff200] text-black shadow-[2px_2px_0_0_#000]'
              : 'bg-white text-black hover:bg-yellow-50 shadow-none'
          }`}
        >
          <span>📁</span>
          <span>Projects</span>
        </button>
        <button
          id="sidebar-about"
          onClick={() => {
            playSound('click');
            setCurrentDir('about');
            setSelectedProjectId(null);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 w-max md:w-full text-left border-2 border-black font-bold text-[11px] transition-all ${
            currentDir === 'about' 
              ? 'bg-[#fff200] text-black shadow-[2px_2px_0_0_#000]' 
              : 'bg-white text-black hover:bg-yellow-50 shadow-none'
          }`}
        >
          <span>👤</span>
          <span>About Me</span>
        </button>
        <button
          id="sidebar-experience"
          onClick={() => {
            playSound('click');
            setCurrentDir('experience');
            setSelectedProjectId(null);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 w-max md:w-full text-left border-2 border-black font-bold text-[11px] transition-all ${
            currentDir === 'experience' 
              ? 'bg-[#fff200] text-black shadow-[2px_2px_0_0_#000]' 
              : 'bg-white text-black hover:bg-yellow-50 shadow-none'
          }`}
        >
          <span>🏢</span>
          <span>Work Experience</span>
        </button>
        <button
          id="sidebar-school"
          onClick={() => {
            playSound('click');
            setCurrentDir('education');
            setSelectedProjectId(null);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 w-max md:w-full text-left border-2 border-black font-bold text-[11px] transition-all ${
            currentDir === 'education' 
              ? 'bg-[#fff200] text-black shadow-[2px_2px_0_0_#000]' 
              : 'bg-white text-black hover:bg-yellow-50 shadow-none'
          }`}
        >
          <span>🎓</span>
          <span>Education</span>
        </button>
        <button
          id="sidebar-leadership"
          onClick={() => {
            playSound('click');
            setCurrentDir('leadership');
            setSelectedProjectId(null);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 w-max md:w-full text-left border-2 border-black font-bold text-[11px] transition-all ${
            currentDir === 'leadership' 
              ? 'bg-[#fff200] text-black shadow-[2px_2px_0_0_#000]' 
              : 'bg-white text-black hover:bg-yellow-50 shadow-none'
          }`}
        >
          <span>⭐</span>
          <span>Leadership</span>
        </button>
        <button
          id="sidebar-links"
          onClick={() => {
            playSound('click');
            setCurrentDir('socials');
            setSelectedProjectId(null);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 w-max md:w-full text-left border-2 border-black font-bold text-[11px] transition-all ${
            currentDir === 'socials' 
              ? 'bg-[#fff200] text-black shadow-[2px_2px_0_0_#000]' 
              : 'bg-white text-black hover:bg-yellow-50 shadow-none'
          }`}
        >
          <span>🔗</span>
          <span>My Socials</span>
        </button>
      </div>

      {/* RIGHT WORKPLACE FRAME */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navigation & Address Bar */}
        <div className="bg-[#dfdfdf] border-b-4 border-black p-2 flex items-center gap-2.5 select-none">
          <button
            id="btn-nav-up"
            disabled={currentDir === 'root'}
            onClick={navigateUp}
            className={`retro-button p-1.5 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed bg-white text-black active:translate-y-0.5`}
          >
            <ArrowLeft size={14} className="stroke-[3]" />
          </button>
          
          {/* Breadcrumbs */}
          <div className="flex-1 bg-white border-2 border-black px-2.5 py-1.5 flex items-center gap-1.5 font-mono text-[10px] overflow-x-auto whitespace-nowrap retro-scroll shadow-inner">
            {getPathBreadcrumbs().map((crumb, idx, arr) => (
              <React.Fragment key={idx}>
                <span
                  className={`cursor-pointer hover:underline ${idx === arr.length - 1 ? 'font-bold text-[#ff4d4d]' : 'text-gray-700'}`}
                  onClick={() => {
                    playSound('click');
                    if (crumb === 'Projects') {
                      setCurrentDir('projects');
                      setSelectedProjectId(null);
                    } else if (crumb === 'C:' || crumb === 'Portfolio') {
                      setCurrentDir('root');
                      setSelectedProjectId(null);
                    } else if (crumb === 'Beginner') {
                      setCurrentDir('beginner');
                    } else if (crumb === 'Intermediate') {
                      setCurrentDir('intermediate');
                    } else if (crumb === 'Advanced') {
                      setCurrentDir('advanced');
                    }
                  }}
                >
                  {crumb}
                </span>
                {idx < arr.length - 1 && <ChevronRight size={10} className="text-gray-400 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Dynamic Folder Contents */}
        <div className="flex-1 overflow-auto bg-white p-4">
          
          {/* 1. ROOT VIEW */}
          {currentDir === 'root' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 select-none">
              <button
                id="root-projects"
                onClick={() => handleDoubleTap('projects', () => setCurrentDir('projects'))}
                onDoubleClick={() => setCurrentDir('projects')}
                className="flex flex-col items-center gap-2 p-3 bg-white border-2 border-black shadow-[4px_4px_0_0_#000000] hover:bg-[#fff200] hover:scale-[1.02] focus:bg-[#fff200] transition-all rounded-none group cursor-pointer text-black"
              >
                <div className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">📁</div>
                <span className="font-extrabold text-center text-[10px] md:text-xs">Projects</span>
                <span className="text-[9px] text-gray-500 font-bold uppercase">Folder</span>
              </button>

              <button
                id="root-about"
                onClick={() => handleDoubleTap('about', () => setCurrentDir('about'))}
                onDoubleClick={() => setCurrentDir('about')}
                className="flex flex-col items-center gap-2 p-3 bg-white border-2 border-black shadow-[4px_4px_0_0_#000000] hover:bg-[#fff200] hover:scale-[1.02] focus:bg-[#fff200] transition-all rounded-none group cursor-pointer text-black"
              >
                <div className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">👤</div>
                <span className="font-extrabold text-center text-[10px] md:text-xs">About_Me.txt</span>
                <span className="text-[9px] text-gray-500 font-bold uppercase">2.4 KB</span>
              </button>

              <button
                id="root-experience"
                onClick={() => handleDoubleTap('experience', () => setCurrentDir('experience'))}
                onDoubleClick={() => setCurrentDir('experience')}
                className="flex flex-col items-center gap-2 p-3 bg-white border-2 border-black shadow-[4px_4px_0_0_#000000] hover:bg-[#fff200] hover:scale-[1.02] focus:bg-[#fff200] transition-all rounded-none group cursor-pointer text-black"
              >
                <div className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">📄</div>
                <span className="font-extrabold text-center text-[10px] md:text-xs">Work_Exp.doc</span>
                <span className="text-[9px] text-gray-500 font-bold uppercase">4.1 KB</span>
              </button>

              <button
                id="root-school"
                onClick={() => handleDoubleTap('education', () => setCurrentDir('education'))}
                onDoubleClick={() => setCurrentDir('education')}
                className="flex flex-col items-center gap-2 p-3 bg-white border-2 border-black shadow-[4px_4px_0_0_#000000] hover:bg-[#fff200] hover:scale-[1.02] focus:bg-[#fff200] transition-all rounded-none group cursor-pointer text-black"
              >
                <div className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">🎓</div>
                <span className="font-extrabold text-center text-[10px] md:text-xs">Education.wri</span>
                <span className="text-[9px] text-gray-500 font-bold uppercase">1.8 KB</span>
              </button>

              <button
                id="root-leadership"
                onClick={() => handleDoubleTap('leadership', () => setCurrentDir('leadership'))}
                onDoubleClick={() => setCurrentDir('leadership')}
                className="flex flex-col items-center gap-2 p-3 bg-white border-2 border-black shadow-[4px_4px_0_0_#000000] hover:bg-[#fff200] hover:scale-[1.02] focus:bg-[#fff200] transition-all rounded-none group cursor-pointer text-black"
              >
                <div className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">⭐</div>
                <span className="font-extrabold text-center text-[10px] md:text-xs">Leadership.doc</span>
                <span className="text-[9px] text-gray-500 font-bold uppercase">2.7 KB</span>
              </button>

              <button
                id="root-socials"
                onClick={() => handleDoubleTap('socials', () => setCurrentDir('socials'))}
                onDoubleClick={() => setCurrentDir('socials')}
                className="flex flex-col items-center gap-2 p-3 bg-white border-2 border-black shadow-[4px_4px_0_0_#000000] hover:bg-[#fff200] hover:scale-[1.02] focus:bg-[#fff200] transition-all rounded-none group cursor-pointer text-black"
              >
                <div className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">🔗</div>
                <span className="font-extrabold text-center text-[10px] md:text-xs">My_Socials</span>
                <span className="text-[9px] text-gray-500 font-bold uppercase">Folder</span>
              </button>

              {/* Quick links to Paint drawing game */}
              <button
                id="root-paint"
                onClick={() => handleDoubleTap('paint95', onOpenPaint)}
                onDoubleClick={onOpenPaint}
                className="flex flex-col items-center gap-2 p-3 bg-white border-2 border-black shadow-[4px_4px_0_0_#000000] hover:bg-[#fff200] hover:scale-[1.02] focus:bg-[#fff200] transition-all rounded-none group cursor-pointer text-black"
              >
                <div className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">🎨</div>
                <span className="font-extrabold text-center text-[10px] md:text-xs">Paint95.exe</span>
                <span className="text-[9px] text-red-500 font-bold uppercase">APP</span>
              </button>

              <button
                id="root-music"
                onClick={() => handleDoubleTap('synth8bit', onOpenMusic)}
                onDoubleClick={onOpenMusic}
                className="flex flex-col items-center gap-2 p-3 bg-white border-2 border-black shadow-[4px_4px_0_0_#000000] hover:bg-[#fff200] hover:scale-[1.02] focus:bg-[#fff200] transition-all rounded-none group cursor-pointer text-black"
              >
                <div className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">📻</div>
                <span className="font-extrabold text-center text-[10px] md:text-xs">8BitSynth.exe</span>
                <span className="text-[9px] text-red-500 font-bold uppercase">APP</span>
              </button>

              <button
                id="root-cat-flap"
                onClick={() => handleDoubleTap('catflap', onOpenCatFlap)}
                onDoubleClick={onOpenCatFlap}
                className="flex flex-col items-center gap-2 p-3 bg-white border-2 border-black shadow-[4px_4px_0_0_#000000] hover:bg-[#fff200] hover:scale-[1.02] focus:bg-[#fff200] transition-all rounded-none group cursor-pointer text-black"
              >
                <div className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">🐱</div>
                <span className="font-extrabold text-center text-[10px] md:text-xs">CatFlap.exe</span>
                <span className="text-[9px] text-red-500 font-bold uppercase">APP</span>
              </button>
            </div>
          )}

          {/* 2. PROJECTS DIR VIEW */}
          {currentDir === 'projects' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 select-none">
              <button
                id="proj-beginner"
                onClick={() => handleDoubleTap('beginner', () => setCurrentDir('beginner'))}
                onDoubleClick={() => setCurrentDir('beginner')}
                className="flex flex-col items-center gap-2 p-4 bg-white border-2 border-black shadow-[4px_4px_0_0_#000000] hover:bg-[#fff200] hover:scale-[1.02] focus:bg-[#fff200] transition-all rounded-none group cursor-pointer text-black"
              >
                <div className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">📁</div>
                <span className="font-extrabold text-[#ff4d4d] text-xs">FEATURED</span>
                <span className="text-[9px] text-gray-500 uppercase font-bold">Main project</span>
              </button>

              <button
                id="proj-intermediate"
                onClick={() => handleDoubleTap('intermediate', () => setCurrentDir('intermediate'))}
                onDoubleClick={() => setCurrentDir('intermediate')}
                className="flex flex-col items-center gap-2 p-4 bg-white border-2 border-black shadow-[4px_4px_0_0_#000000] hover:bg-[#fff200] hover:scale-[1.02] focus:bg-[#fff200] transition-all rounded-none group cursor-pointer text-black"
              >
                <div className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">📁</div>
                <span className="font-extrabold text-[#3fb5f7] text-xs">PORTFOLIO_FEATURES</span>
                <span className="text-[9px] text-gray-500 uppercase font-bold">Interactive tools</span>
              </button>

              <button
                id="proj-advanced"
                onClick={() => handleDoubleTap('advanced', () => setCurrentDir('advanced'))}
                onDoubleClick={() => setCurrentDir('advanced')}
                className="flex flex-col items-center gap-2 p-4 bg-white border-2 border-black shadow-[4px_4px_0_0_#000000] hover:bg-[#fff200] hover:scale-[1.02] focus:bg-[#fff200] transition-all rounded-none group cursor-pointer text-black"
              >
                <div className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">📁</div>
                <span className="font-extrabold text-[#9d4edd] text-xs">COMING_SOON</span>
                <span className="text-[9px] text-gray-500 uppercase font-bold">Project placeholders</span>
              </button>
            </div>
          )}

          {/* 3. PROJECT CATEGORY PAGES */}
          {['beginner', 'intermediate', 'advanced'].includes(currentDir) && (
            <div className="flex flex-col h-full gap-4">
              <div className="font-bold border-b border-gray-300 pb-1 flex items-center gap-1">
                <span>📁</span>
                <span>
                  {currentDir === 'beginner' && 'Featured'}
                  {currentDir === 'intermediate' && 'Portfolio Features'}
                  {currentDir === 'advanced' && 'Coming Soon'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* List of projects */}
                <div className="md:col-span-1 border border-gray-300 bg-gray-50 p-2 flex flex-col gap-1 rounded-sm overflow-y-auto max-h-[220px] md:max-h-full">
                  {PROJECTS.filter((p) => p.difficulty === currentDir).map((project) => (
                    <button
                      key={project.id}
                      id={`project-item-${project.id}`}
                      onClick={() => {
                        playSound('click');
                        setSelectedProjectId(project.id);
                      }}
                      className={`text-left p-2 rounded-sm border ${
                        selectedProjectId === project.id
                          ? 'bg-[#000080] text-white border-transparent font-bold'
                          : 'bg-white border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>🛠️</span>
                        <span className="truncate">{project.name}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Selected project details (Right panel) */}
                <div className="md:col-span-2 border border-gray-400 rounded bg-white p-3 shadow-inner overflow-y-auto max-h-[300px] md:max-h-full">
                  {selectedProject ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between border-b pb-1.5 border-gray-200 flex-wrap gap-2">
                        <h4 className="font-press-start text-[10px] m-0 text-[#000080]">{selectedProject.name}</h4>
                        <span className="px-2 py-0.5 rounded-sm text-[9px] bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold">
                          {selectedProject.difficulty === 'beginner' && 'featured'}
                          {selectedProject.difficulty === 'intermediate' && 'portfolio feature'}
                          {selectedProject.difficulty === 'advanced' && 'coming soon'}
                        </span>
                      </div>

                      <div>
                        <span className="font-bold block text-gray-700 mb-0.5">📜 SUMMARY:</span>
                        <p className="text-gray-600 leading-relaxed text-[11px]">{selectedProject.description}</p>
                      </div>

                      <div>
                        <span className="font-bold block text-gray-700 mb-1">STACK:</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedProject.stack.map((s, idx) => (
                            <span key={idx} className="bg-gray-100 border border-gray-300 px-1.5 py-0.5 text-[9px] rounded font-mono text-gray-800">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="font-bold block text-gray-700 mb-1">DETAILS:</span>
                        <p className="text-gray-600 text-[11px] leading-relaxed bg-gray-50 border border-gray-200 p-2 rounded-sm">
                          {selectedProject.details}
                        </p>
                      </div>

                      {selectedProject.codeSnippet && (
                        <div>
                          <span className="font-bold block text-gray-700 mb-1">💻 SOURCE PATTERN:</span>
                          <pre className="bg-slate-900 text-cyan-300 p-2.5 rounded font-mono text-[9px] overflow-x-auto border-2 border-inset border-gray-700 shadow-inner select-text">
                            <code>{selectedProject.codeSnippet}</code>
                          </pre>
                        </div>
                      )}

                      <button
                        id={`btn-full-details-${selectedProject.id}`}
                        onClick={() => {
                          playSound('open');
                          onOpenProjectDetails(selectedProject);
                        }}
                        className="retro-button mt-2 py-1.5 text-center font-bold text-[#000080] text-[10px] w-full"
                      >
                        OPEN FULL VIEW
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-1.5">
                      <span className="text-3xl">🖿</span>
                      <span>Select a project to preview it.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. ABOUT ME VIEW */}
          {currentDir === 'about' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b-4 border-black pb-2 text-black bg-[#fff200] p-1.5 border-2 border-black shadow-[2px_2px_0_0_#000]">
                  <span className="text-base select-none">👤</span>
                  <span className="font-press-start text-[9px] font-black uppercase italic">ABOUT ME</span>
                </div>
                
                {/* Profile Portrait Grid */}
                <div className="flex gap-3.5 items-start border-4 border-black p-3 bg-white shadow-[4px_4px_0_0_#000]">
                  <div className="w-16 h-16 border-4 border-black bg-[#ffd56b] flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                    {/* SVG Pixel Portrait */}
                    <svg viewBox="0 0 16 16" width="100%" height="100%" className="image-rendering-pixelated">
                      {/* red hair */}
                      <rect x="3" y="0" width="10" height="3" fill="#991b1b" />
                      <rect x="2" y="2" width="12" height="4" fill="#dc2626" />
                      <rect x="1" y="5" width="4" height="8" fill="#b91c1c" />
                      <rect x="11" y="5" width="4" height="8" fill="#b91c1c" />
                      <rect x="2" y="11" width="2" height="3" fill="#7f1d1d" />
                      <rect x="12" y="11" width="2" height="3" fill="#7f1d1d" />
                      <rect x="5" y="1" width="5" height="1" fill="#f97316" />
                      {/* face skin */}
                      <rect x="4" y="4" width="8" height="8" fill="#ffcca3" />
                      <rect x="5" y="3" width="6" height="1" fill="#ffcca3" />
                      {/* eyes and smile */}
                      <rect x="6" y="7" width="1" height="1" fill="#111827" />
                      <rect x="9" y="7" width="1" height="1" fill="#111827" />
                      <rect x="7" y="10" width="2" height="1" fill="#be123c" />
                      {/* clothes chest */}
                      <rect x="3" y="12" width="10" height="4" fill="#0284c7" />
                      {/* shirt */}
                      <rect x="7" y="12" width="2" height="4" fill="#0369a1" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-black text-[13px] m-0">Rebecca Dagher</h5>
                    <span className="text-[9px] text-[#ff4d4d] font-bold block">Software Engineering Student</span>
                    <span className="text-[9px] text-gray-600 font-mono">Concordia University</span>
                  </div>
                </div>

                <div className="bg-[#1a1a2e] text-green-300 p-3.5 border-4 border-black text-[11px] leading-relaxed select-text shadow-inner">
                  {ABOUT_ME_BIO}
                </div>
              </div>

              {/* Skills */}
              <div className="border-4 border-black p-4 bg-white shadow-[4px_4px_0_0_#000]">
                <div className="font-press-start text-[8px] text-black mb-3 border-b-4 border-black pb-2 font-black uppercase italic">
                  SKILLS
                </div>
                <div className="flex flex-col gap-3">
                  {RPG_STATS.map((stat, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-mono font-bold text-black uppercase">
                        <span>{stat.name}</span>
                        <span>{stat.level}/99</span>
                      </div>
                      <div className="w-full bg-white h-4 border-2 border-black p-0.5 relative overflow-hidden">
                        <div
                          className="h-full border-r-2 border-black"
                          style={{
                            width: `${(stat.level / 99) * 100}%`,
                            backgroundColor: stat.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-[9px] bg-[#fffdf0] border-2 border-black text-black p-2 md:p-3 shadow-[2px_2px_0_0_#000] leading-relaxed font-bold">
                  currently interested in frontend development, automation, cybersecurity, ai, game development, healthtech, and building things that feel useful and personal.
                </div>
              </div>
            </div>
          )}

          {/* 5. WORK EXPERIENCE VIEW */}
          {currentDir === 'experience' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-gray-300 pb-1">
                <span className="text-xl">📄</span>
                <span className="font-press-start text-[10px] text-[#000080]">WORK EXPERIENCE</span>
              </div>

              <div className="relative border-l-2 border-[#000080] pl-4 ml-2 flex flex-col gap-6 select-text">
                {WORK_EXPERIENCE.map((job) => (
                  <div key={job.id} className="relative group">
                    {/* Circle Node on Timeline */}
                    <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-[#000080] ring-4 ring-white group-hover:bg-amber-500 transition-colors" />

                    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] items-start mb-1 gap-2">
                      <h4 className="font-bold text-[12px] text-slate-900 m-0">{job.role}</h4>
                      <span className="text-[10px] font-bold text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded border border-gray-300 shadow-sm justify-self-start sm:justify-self-end whitespace-nowrap">
                        ⏳ {job.period}
                      </span>
                    </div>

                    <div className="text-[10px] font-bold text-amber-800 font-mono mb-2">
                       {job.company} — <span className="text-slate-700 font-normal">{job.location}</span>
                    </div>

                    <ul className="list-inside list-none flex flex-col gap-1.5 text-[11px] text-slate-800 pl-2">
                      {job.achievements.map((ach, idx) => (
                        <li key={idx} className="flex gap-2 items-start leading-relaxed">
                          <span className="text-[#000080] group-hover:text-amber-500 pt-0.5 shrink-0 transition-colors">♦</span>
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. LEADERSHIP VIEW */}
          {currentDir === 'leadership' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-gray-300 pb-1">
                <span className="text-xl">⭐</span>
                <span className="font-press-start text-[10px] text-[#000080]">LEADERSHIP</span>
              </div>

              <div className="grid grid-cols-1 gap-4 select-text">
                {LEADERSHIP_EXPERIENCE.map((item) => (
                  <div key={item.id} className="border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000000]">
                    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] items-start gap-2 border-b border-gray-300 pb-2 mb-3">
                      <div className="min-w-0">
                        <h4 className="font-bold text-[12px] text-slate-900 m-0">{item.role}</h4>
                        <div className="text-[10px] font-bold text-amber-800 mt-1">
                          {item.organization} <span className="text-slate-700 font-normal">- {item.location}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 font-mono bg-gray-100 px-1.5 py-0.5 rounded border border-gray-300 shadow-sm justify-self-start sm:justify-self-end whitespace-nowrap">
                        {item.period}
                      </span>
                    </div>

                    <ul className="list-none flex flex-col gap-1.5 text-[11px] text-slate-800 pl-1">
                      {item.achievements.map((ach, idx) => (
                        <li key={idx} className="flex gap-2 items-start leading-relaxed">
                          <span className="text-[#000080] shrink-0">-</span>
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. EDUCATION VIEW */}
          {currentDir === 'education' && (
            <div className="flex flex-col gap-4 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 border-b border-gray-300 pb-1">
                <span className="text-xl">🎓</span>
                <span className="font-press-start text-[10px] text-[#000080]">EDUCATION</span>
              </div>

              {EDUCATION.map((edu) => (
                <div key={edu.id} className="border-4 border-double border-[#000080] p-4 bg-yellow-50 text-amber-950 font-mono rounded shadow relative select-text">
                  <h3 className="font-press-start text-[#000080] text-[10px] mb-1">{edu.school}</h3>
                  <div className="text-[10px] text-amber-800 font-bold mb-4">{edu.period}</div>

                  <div className="flex flex-col gap-2 border-t border-b border-amber-200 py-3 my-2 text-[11px]">
                    <div>
                      <span className="font-bold opacity-75">PROGRAM:</span>
                      <span className="font-bold text-gray-800 ml-2">{edu.degree}</span>
                    </div>
                    <div>
                      <span className="font-bold opacity-75">LOCATION:</span>
                      <span className="font-bold text-[#000080] ml-2">Montreal, QC</span>
                    </div>
                    <div>
                      <span className="font-bold opacity-75">TIMELINE:</span>
                      <span className="font-mono text-gray-800 ml-2">{edu.period}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="font-bold block mb-1.5 text-gray-700 text-[10px]">NOTES:</span>
                    <ul className="list-inside list-none flex flex-col gap-1 text-[10px] pl-1">
                      {edu.achievements.map((ach, idx) => (
                        <li key={idx} className="flex gap-2 items-start text-slate-800">
                          <span className="text-[#000080] shrink-0">-</span>
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 8. SOCIAL MEDIA LINKS VIEW */}
          {currentDir === 'socials' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-gray-300 pb-1">
                <span className="text-xl">🔗</span>
                <span className="font-press-start text-[10px] text-[#000080]">MY SOCIALS</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <a
                  href="https://github.com/sillycat79"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-2 p-3 border-2 border-gray-300 rounded hover:border-[#000d80] hover:bg-slate-50 relative group cursor-pointer"
                >
                  <span className="text-3xl filter drop-shadow">💻</span>
                  <span className="font-bold font-mono">GitHub</span>
                  <span className="text-[9px] text-[#000080] flex items-center gap-0.5 mt-1 font-mono">
                    github.com/sillycat79 <ExternalLink size={10} />
                  </span>
                </a>

                <a
                  href="https://linkedin.com/in/rebdagher"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-2 p-3 border-2 border-gray-300 rounded hover:border-[#000d80] hover:bg-blue-50 relative group cursor-pointer"
                >
                  <span className="text-3xl filter drop-shadow">💼</span>
                  <span className="font-bold font-mono">LinkedIn</span>
                  <span className="text-[9px] text-[#000080] flex items-center gap-0.5 mt-1 font-mono">
                    linkedin.com/in/rebdagher <ExternalLink size={10} />
                  </span>
                </a>

                <a
                  href="mailto:re_dagh@live.concordia.ca"
                  className="flex flex-col items-center gap-2 p-3 border-2 border-gray-300 rounded hover:border-[#000d80] hover:bg-emerald-50 relative group cursor-pointer"
                >
                  <span className="text-3xl filter drop-shadow">✉️</span>
                  <span className="font-bold font-mono">Email</span>
                  <span className="text-[9px] text-emerald-800 flex items-center gap-0.5 mt-1 font-mono">
                    re_dagh@live.concordia.ca <ExternalLink size={10} />
                  </span>
                </a>

                <a
                  href="https://instagram.com/rebcodes"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-2 p-3 border-2 border-gray-300 rounded hover:border-[#000d80] hover:bg-indigo-50 relative group cursor-pointer"
                >
                  <span className="text-3xl filter drop-shadow">📷</span>
                  <span className="font-bold font-mono">Instagram</span>
                  <span className="text-[9px] text-[#000080] flex items-center gap-0.5 mt-1 font-mono">
                    instagram.com/rebcodes <ExternalLink size={10} />
                  </span>
                </a>

                <a
                  href="https://tiktok.com/@rebcodes"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-2 p-3 border-2 border-gray-300 rounded hover:border-[#000d80] hover:bg-pink-50 relative group cursor-pointer"
                >
                  <span className="text-3xl filter drop-shadow">🎵</span>
                  <span className="font-bold font-mono">TikTok</span>
                  <span className="text-[9px] text-[#000080] flex items-center gap-0.5 mt-1 font-mono">
                    tiktok.com/@rebcodes <ExternalLink size={10} />
                  </span>
                </a>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
