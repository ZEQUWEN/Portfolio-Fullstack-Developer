import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WaxSeal } from './WaxSeal';
import { Language } from '../i18n';

interface WelcomeLetterProps {
  onOpen: () => void;
  lang: Language;
}

export function WelcomeLetter({ onOpen, lang }: WelcomeLetterProps) {
  const [isBroken, setIsBroken] = useState(false);

  const handleBreak = () => {
    setIsBroken(true);
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  const title = lang === 'ru' ? 'Александр' : 'Alexander';
  const subtitle = lang === 'ru' ? 'Личное дело' : 'Personal File';

  return (
    <motion.div
      initial={{ y: "10%" }}
      animate={{ y: 0 }}
      exit={{ y: "-10%", opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 backdrop-blur-sm p-4 px-6 md:px-12"
    >
      <div 
        className="relative w-full max-w-lg aspect-[3/2] bg-[#f4f1ea] shadow-2xl flex items-center justify-center cursor-pointer group" 
        onClick={handleBreak}
        style={{ perspective: '1200px' }}
      >
        <div className="absolute inset-0 border border-ink/10 pointer-events-none" />
        {/* Envelope back styling */}
        <div className="absolute inset-0 bg-[#e8dfcf] opacity-30" clipPath="polygon(0 0, 100% 0, 100% 100%, 0 100%)" />
        
        {/* Flaps */}
        <div className="absolute inset-0 border-[20px] md:border-[40px] border-[#e2d5bd] opacity-80 pointer-events-none" style={{ borderTopWidth: '100px', borderBottomWidth: '100px' }} />

        {/* Top Flap (opens) */}
        <motion.div 
          initial={{ rotateX: 0 }}
          animate={isBroken ? { rotateX: 180 } : { rotateX: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-x-0 top-0 h-1/2 bg-[#f4ebd8] origin-top shadow-md z-10" 
          style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', backfaceVisibility: 'hidden' }} 
        />
        
        {/* The Seal */}
        <div className="relative z-20 w-24 h-24 pointer-events-none">
           {isBroken ? (
             <motion.div 
               initial={{ scale: 1, opacity: 1 }}
               animate={{ scale: 1.2, opacity: 0, filter: 'blur(10px)' }}
               transition={{ duration: 0.5, ease: 'easeOut' }}
             >
                <div className="absolute inset-0 flex items-center justify-center text-stamp drop-shadow-xl" style={{ filter: 'url(#goo)' }}>
                  <div className="w-12 h-24 bg-stamp rounded-l-full -translate-x-3 rotate-12" />
                  <div className="w-12 h-24 bg-stamp rounded-r-full translate-x-3 -rotate-12" />
                </div>
             </motion.div>
           ) : (
             <motion.div
               animate={{ scale: [1, 1.05, 1] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="group-hover:scale-110 transition-transform"
             >
               <WaxSeal initial="A" size="lg" className="w-24 h-24 text-4xl shadow-2xl" />
             </motion.div>
           )}
        </div>

        {/* Address */}
        <div className="absolute bottom-6 md:bottom-12 text-center text-ink/50 font-serif uppercase tracking-widest text-sm w-full z-10 pointer-events-none">
           <span className="block italic opacity-70 border-b border-ink/20 inline-block px-8 pb-2 mb-2">{title}</span><br />
           <span className="text-[10px]">{subtitle}</span>
        </div>
      </div>
    </motion.div>
  );
}
