import React from 'react';
import { motion, useScroll } from 'motion/react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed top-0 left-2 md:left-6 w-px h-full bg-border-light z-40 pointer-events-none mix-blend-multiply">
      <motion.div
        className="w-[2px] bg-stamp origin-top transform -translate-x-[0.5px]"
        style={{
          scaleY: scrollYProgress,
          filter: 'drop-shadow(0 0 2px rgba(139, 0, 0, 0.5))',
          opacity: 0.8
        }}
      />
    </div>
  );
}
