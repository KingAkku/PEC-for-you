import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CLUB_NAMES } from '../constants';
import { HeroPopup } from '../types';
import { getRandomColor, getContrastColor, getRandomInt } from '../utils';

const Hero: React.FC = () => {
  const [popups, setPopups] = useState<HeroPopup[]>([]);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    if (lastMousePos.current) {
      const deltaX = Math.abs(currentX - lastMousePos.current.x);
      
      // If moved enough horizontally
      if (deltaX > 40) { 
        const rect = containerRef.current.getBoundingClientRect();
        
        // Only spawn if within bounds
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
    const bgColor = getRandomColor();
    const textColor = getContrastColor(bgColor);
    const borderRadius = getRandomInt(0, 10);
    const id = Date.now() + Math.random();

    // Offset slightly so it doesn't appear exactly under cursor masking the text below too much
    const offsetX = getRandomInt(-50, 50);
    const offsetY = getRandomInt(-50, 50);

    const newPopup: HeroPopup = {
      id,
      text,
      x: x + offsetX,
      y: y + offsetY,
      bgColor,
      textColor,
      borderRadius
    };

    setPopups((prev) => [...prev.slice(-8), newPopup]); // Keep last 8 to avoid DOM overload

    // Auto remove after animation
    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 2000);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[85vh] flex flex-col items-center justify-center overflow-hidden cursor-crosshair"
    >
      <div className="absolute inset-0 -z-10 bg-white/30 backdrop-blur-sm"></div>

      {/* Main Text */}
      <div className="z-10 text-center select-none pointer-events-none p-4">
        <h1 className="font-display text-[15vw] leading-none text-slate-900 drop-shadow-2xl opacity-90 tracking-tight">
          PEC Portal
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-slate-600 font-light tracking-wide">
          College of Engineering, Pathanapuram
        </p>
        <p className="mt-2 text-sm text-slate-400 uppercase tracking-widest">
          Connect &bull; Create &bull; Collaborate
        </p>
      </div>

      {/* Popups Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {popups.map((popup) => (
            <motion.div
              key={popup.id}
              initial={{ width: 0, opacity: 0, x: popup.x, y: popup.y }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                backgroundColor: popup.bgColor,
                color: popup.textColor,
                borderRadius: `${popup.borderRadius}px`,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                zIndex: 20,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              }}
              className="h-12 flex items-center px-6 text-lg font-bold shadow-xl border border-white/20"
            >
              {popup.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-10 animate-bounce text-slate-400 text-sm">
        Hover to explore
      </div>
    </div>
  );
};

export default Hero;
