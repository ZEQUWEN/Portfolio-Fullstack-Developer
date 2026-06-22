import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  key?: string | number;
}

export function TypewriterText({ text, delay = 0, speed = 0.02, className = '' }: TypewriterTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const characters = text.split('');

  return (
    <span ref={ref} className={className}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.1, delay: delay + index * speed }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: [0, 1, 0] } : { opacity: 0 }}
        transition={{ 
          duration: 0.8, 
          repeat: Infinity, 
          delay: delay 
        }}
        className="inline-block w-[0.5em] h-[1em] bg-ink/60 -mb-1 ml-1"
      />
    </span>
  );
}
