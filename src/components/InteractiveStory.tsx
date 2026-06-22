import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../i18n';
import * as LucideIcons from 'lucide-react';
import { SiteContent } from '../types';

interface Props {
  lang: Language;
  content: SiteContent;
}

export function InteractiveStory({ lang, content }: Props) {
  const chapters = content.methodologyChapters || [];
  const [activeId, setActiveId] = useState<string | null>(chapters[0]?.id || null);

  return (
    <div className="w-full flex justify-center py-12">
      <div className="w-full max-w-4xl bg-white/20 border border-border-light shadow-sm flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Subtle decorative corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-ink/20 opacity-50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-ink/20 opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-ink/20 opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-ink/20 opacity-50 pointer-events-none" />

        {/* Sidebar Navigation */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-border-light flex flex-col bg-parchment-dark/30">
          {chapters.map((chapter) => {
            const isActive = activeId === chapter.id;
            const IconComponent = (LucideIcons as any)[chapter.iconName] || LucideIcons.Layers;
            return (
              <button
                key={chapter.id}
                onClick={() => setActiveId(chapter.id)}
                className={`relative px-6 py-8 text-left transition-all duration-500 overflow-hidden group border-b border-border-light/50 last:border-b-0
                  ${isActive ? 'bg-gradient-to-r from-parchment to-white/60 text-ink shadow-[inset_4px_0_0_0_#8b0000]' : 'text-ink/60 hover:bg-white/40 hover:text-ink/90'}
                `}
              >
                <div className="relative z-10 flex items-center gap-4">
                  <div className={`p-2 rounded-full border transition-all duration-300 ${isActive ? 'border-stamp text-stamp bg-white/50' : 'border-ink/20 group-hover:border-ink/40 bg-transparent'}`}>
                    <IconComponent size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg md:text-xl font-medium tracking-tight">
                      {lang === 'ru' ? chapter.title : chapter.titleEn}
                    </h4>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="w-full md:w-2/3 min-h-[350px] p-8 md:p-12 relative bg-parchment/60 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {chapters.map((chapter) => {
              if (activeId !== chapter.id) return null;
              return (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col h-full"
                >
                  <div className="mb-6 flex flex-col gap-2 relative">
                    <span className="font-decor text-6xl text-ink/5 absolute -top-10 -left-6 select-none pointer-events-none">❧</span>
                    <h3 className="font-serif text-3xl italic text-stamp">
                      {lang === 'ru' ? chapter.title : chapter.titleEn}
                    </h3>
                    <p className="font-body text-sm font-semibold tracking-widest uppercase text-ink/60 mt-2">
                      {lang === 'ru' ? chapter.subtitle : chapter.subtitleEn}
                    </p>
                  </div>
                  
                  <div className="w-12 h-px bg-stamp/30 mb-8" />

                  <div className="prose prose-sm font-body text-ink-light leading-loose text-base md:text-lg">
                    <p>{lang === 'ru' ? chapter.content : chapter.contentEn}</p>
                  </div>
                  
                  <div className="mt-auto pt-8 flex justify-end">
                    <span className="font-signature text-2xl text-ink/40 skew-x-[-10deg]">~ A.</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
