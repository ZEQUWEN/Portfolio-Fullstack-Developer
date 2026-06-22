import React from 'react';
import { WaxSeal } from './WaxSeal';
import { motion } from 'motion/react';

export function Signature() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
      whileInView={{ opacity: 1, scale: 1, rotate: -2 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: 0.5 }}
      className="relative inline-flex flex-col items-center mt-20 mb-8 transform -rotate-2 group"
    >
      <div className="relative">
        <span className="font-signature text-6xl md:text-[7rem] text-ink/80 block pr-12 -mb-6 leading-none">
          Alexander
        </span>
        <div className="absolute -bottom-4 -right-4 transform rotate-[15deg] group-hover:scale-110 transition-transform duration-500 ease-out z-10">
          <WaxSeal initial="A" size="lg" className="shadow-2xl" />
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-ink/40 mt-8 border-t border-ink/20 pt-2 px-12 italic">
        Ad Vitam Aeternam
      </span>
    </motion.div>
  );
}
