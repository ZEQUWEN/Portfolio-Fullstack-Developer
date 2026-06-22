import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TypewriterText } from './TypewriterText';
import { SiteContent } from '../types';

interface Props {
  siteContent: SiteContent;
  lang: 'ru' | 'en';
}

export function AnimatedName({ siteContent, lang }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const name = lang === 'ru' ? siteContent.heroName : siteContent.heroNameEn;
  const role = lang === 'ru' ? siteContent.heroRole : siteContent.heroRoleEn;

  return (
    <div className="flex flex-col items-center">
        <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-40 mb-4 text-ink">
          {role}
        </h2>
        <div 
          className="relative inline-block cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.h1 
            className={`font-serif text-5xl md:text-7xl text-ink tracking-tighter leading-tight font-light transition-opacity duration-500`}
            animate={{ opacity: isHovered ? 0 : 1 }}
          >
            {name}
          </motion.h1>
          
          <motion.div 
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center font-signature text-6xl md:text-8xl text-stamp pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isHovered && (
                <TypewriterText text={name} delay={0} speed={0.1} />
            )}
          </motion.div>
        </div>
    </div>
  );
}
