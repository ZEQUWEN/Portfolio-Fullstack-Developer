import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function QuillPen() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      setIsScrolling(true);
      setScrollPos(window.scrollY);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 400); 
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {isScrolling && (
        <motion.div
          initial={{ opacity: 0, x: 50, y: 50, rotate: 20 }}
          animate={{ 
            opacity: 0.7, 
            x: Math.sin(scrollPos * 0.1) * 15, 
            y: Math.cos(scrollPos * 0.1) * 8,
            rotate: Math.sin(scrollPos * 0.05) * 20 - 10
          }}
          exit={{ opacity: 0, x: 50, y: 50, rotate: 20 }}
          transition={{ opacity: { duration: 0.3 } }}
          className="fixed bottom-12 right-12 md:bottom-24 md:right-24 z-50 pointer-events-none text-ink drop-shadow-lg origin-bottom-left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-ink">
            <path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"/>
            <polyline points="16 8 2 22"/>
            <polyline points="17.5 15 9 15"/>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
