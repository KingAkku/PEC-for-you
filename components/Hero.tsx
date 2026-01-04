import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CLUB_NAMES } from '../constants';
import { HeroPopup } from '../types';
import { getRandomColor, getContrastColor, getRandomInt } from '../utils';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onNavigate: (view: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [popups, setPopups] = useState<HeroPopup[]>([]);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    if (!containerRef.current) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    if (lastMousePos.current) {
      const deltaX = Math.abs(currentX - lastMousePos.current.x);
      
      if (deltaX > 40) { 
        const rect = containerRef.current.getBoundingClientRect();
        if (
          currentX >= rect.left && 
          currentX <= rect.right && 
          currentY >= rect.top && 
          currentY <= rect.bottom
        ) {
          spawnPopup(currentX, currentY);
          lastMousePos.current = { x: currentX, y: currentY };
        }
      }
    } else {
      lastMousePos.current = { x: currentX, y: currentY };
    }
  };

  const spawnPopup = (x: number, y: number) => {
    const text = CLUB_NAMES[Math.floor(Math.random() * CLUB_NAMES.length)];
    // Premium color palette for popups
    const colors = ['#0f172a', '#334155', '#475569', '#1e293b']; 
    const bgColor = colors[Math.floor(Math.random() * colors.length)];
    const textColor = '#ffffff';
    const borderRadius = 50; 
    const id = Date.now() + Math.random();

    const offsetX = getRandomInt(-40, 40);
    const offsetY = getRandomInt(-40, 40);

    const newPopup: HeroPopup = {
      id,
      text,
      x: x + offsetX,
      y: y + offsetY,
      bgColor,
      textColor,
      borderRadius
    };

    setPopups((prev) => [...prev.slice(-6), newPopup]);

    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 1500);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden cursor-default bg-white"
    >
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />

      {/* Main Text */}
      <div className="z-10 text-center select-none p-4 mt-10 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="mb-6 flex items-center space-x-2 bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-full shadow-sm">
            <Sparkles size={14} className="text-yellow-500" />
            <span className="text-xs font-bold tracking-widest uppercase text-slate-500">The Future of Campus Life</span>
          </div>
          
          <h1 className="font-display text-[12vw] md:text-[9rem] leading-[0.9] text-slate-900 tracking-tighter mix-blend-multiply">
            PEC<span className="text-slate-200">PORTAL</span>
          </h1>
          
          <p className="mt-8 text-xl md:text-2xl text-slate-500 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
            The central hub for <span className="text-slate-900 font-medium">events</span>, <span className="text-slate-900 font-medium">clubs</span>, and <span className="text-slate-900 font-medium">culture</span> at College of Engineering, Pathanapuram.
          </p>
        </motion.div>
      </div>

      {/* CTA Buttons */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="z-30 mt-12 flex flex-col sm:flex-row items-center gap-6"
      >
        <button 
          onClick={() => onNavigate('events')} 
          className="group px-10 py-5 bg-slate-900 text-white rounded-full font-medium transition-all hover:bg-black hover:scale-105 flex items-center gap-3 shadow-2xl hover:shadow-slate-900/25"
        >
          Explore Events <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={() => onNavigate('clubs')}
          className="px-10 py-5 bg-white text-slate-900 rounded-full font-medium hover:bg-slate-50 transition-all border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:scale-105"
        >
          Join a Club
        </button>
      </motion.div>

      {/* Popups Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {popups.map((popup) => (
            <motion.div
              key={popup.id}
              initial={{ opacity: 0, scale: 0.5, x: popup.x, y: popup.y }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "backOut" }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                backgroundColor: popup.bgColor,
                color: popup.textColor,
                borderRadius: `${popup.borderRadius}px`,
                zIndex: 20,
              }}
              className="px-5 py-2 text-sm font-bold shadow-2xl tracking-wide backdrop-blur-md bg-opacity-90"
            >
              {popup.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Hero;