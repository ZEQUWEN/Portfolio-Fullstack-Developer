import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface FadeInSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  id?: string;
}

export function FadeInSection({ children, delay = 0, className = '', id }: FadeInSectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 60, rotateX: 5 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`py-20 ${className}`}
    >
      {children}
    </motion.section>
  );
}
