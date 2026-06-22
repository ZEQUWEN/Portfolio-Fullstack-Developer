import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react';
import { Project } from '../types';
import { WaxSeal } from './WaxSeal';
import { Language, translations } from '../i18n';
import { ProjectMedia } from './ProjectMedia';

interface Props {
  projects: Project[];
  lang?: Language;
}

export function ProjectsCarousel({ projects, lang = 'ru' }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [readProjects, setReadProjects] = useState<Set<string>>(new Set());

  const t = (key: keyof typeof translations['ru']) => translations[lang][key] || key;

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };
  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const getTags = (p: Project) => {
    const rawTags = lang === 'en' ? (p.tagsEn || p.tags || '') : (p.tags || '');
    return rawTags.split(',').map(tag => tag.trim()).filter(Boolean);
  };

  const allTags = Array.from(new Set(projects.flatMap(getTags)));

  const filteredProjects = activeTag
    ? projects.filter(p => getTags(p).includes(activeTag))
    : projects;

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 mb-10 w-full px-4">
        <button
          onClick={() => setActiveTag(null)}
          className={`px-4 py-1.5 border border-ink/40 text-[10px] uppercase font-bold tracking-widest transition-all ${
            activeTag === null ? 'bg-stamp text-parchment shadow-md border-stamp' : 'text-ink/60 hover:text-ink hover:border-ink/60 bg-transparent'
          }`}
        >
          {t('projectsAll')}
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-1.5 border border-ink/40 text-[10px] uppercase font-bold tracking-widest transition-all ${
              activeTag === tag ? 'bg-stamp text-parchment shadow-md border-stamp' : 'text-ink/60 hover:text-ink hover:border-ink/60 bg-transparent'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="relative group w-full">
        <button 
          onClick={scrollLeft}
          className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-10 p-2 text-ink/50 hover:text-ink bg-parchment/80 rounded-full md:opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={32} strokeWidth={1} />
        </button>
        
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-8 pb-12 pt-4 px-4 snap-x snap-mandatory no-scrollbar"
          style={{ perspective: '1200px' }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => {
              const tags = getTags(project);
              const title = lang === 'en' ? (project.titleEn || project.title) : project.title;
              const shortDesc = lang === 'en' ? (project.shortDescriptionEn || project.shortDescription) : project.shortDescription;
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, rotateX: -45, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateX: 45, y: -40, scale: 0.95 }}
                  whileHover={{ scale: 1.03, y: -8, rotateY: 2, rotateX: 2 }}
                  viewport={{ once: true, margin: '80px' }}
                  transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
                  style={{ transformOrigin: 'top center' }}
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project);
                    setReadProjects(prev => {
                      const next = new Set(prev);
                      next.add(project.id);
                      return next;
                    });
                  }}
                  className="snap-center shrink-0 w-[280px] md:w-[340px] cursor-pointer group/card"
                >
                  <div className="vintage-border p-6 h-full flex flex-col transition-colors duration-300 relative">
                    <AnimatePresence>
                      {!readProjects.has(project.id) && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.5, filter: 'blur(4px)' }}
                          transition={{ duration: 0.4 }}
                          className="absolute -top-3 -right-3 z-10 w-10 h-10 text-stamp transform rotate-12 origin-center"
                        >
                          <motion.svg 
                            viewBox="0 0 100 100" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="w-full h-full drop-shadow-md"
                          >
                            <motion.path 
                               d="M15,35 L85,35 L50,60 Z" 
                               fill="#f4ebd8" 
                               exit={{ y: -20, opacity: 0, rotate: -15 }} 
                            />
                            <motion.path 
                               d="M15,35 L15,75 L85,75 L85,35 L50,60 Z" 
                               fill="#f4ebd8" 
                               exit={{ y: 20, opacity: 0, rotate: 15 }} 
                            />
                            <motion.circle 
                               cx="50" 
                               cy="55" 
                               r="8" 
                               fill="currentColor" 
                               opacity="0.9" 
                               exit={{ scale: 3, opacity: 0 }} 
                            />
                          </motion.svg>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="aspect-[4/3] overflow-hidden border border-border-light relative mb-6 bg-ink/5">
                      <ProjectMedia 
                        src={project.imageUrl} 
                        alt={title} 
                        className="w-full h-full object-cover filter grayscale opacity-80 group-hover/card:scale-110 group-hover/card:grayscale-0 group-hover/card:opacity-100 transition-all duration-700"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-stamp font-bold">{tags[0]}</span>
                      <h4 className="font-serif text-2xl mt-1 mb-3 text-ink ink-bleed-hover inline-block w-fit">{title}</h4>
                      <p className="text-sm leading-relaxed opacity-80 font-body text-ink-light line-clamp-3">
                        {shortDesc}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4 border-t border-border-light/50 pt-4 opacity-70 group-hover/card:opacity-100 transition-opacity">
                      <span className="text-[10px] italic">{t('detailsBtn')}</span>
                      <span className="text-[10px] px-2 py-0.5 border border-ink uppercase">{t('openBtn')}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {filteredProjects.length === 0 && (
            <div className="w-full text-center py-12 text-ink/50 italic font-serif">
              Архив пуст.
            </div>
          )}
        </div>

        <button 
          onClick={scrollRight}
          className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-10 p-2 text-ink/50 hover:text-ink bg-parchment/80 rounded-full md:opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={32} strokeWidth={1} />
        </button>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ perspective: "1500px" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, rotateY: 90, x: -50 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              exit={{ opacity: 0, rotateY: -90, x: 50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ transformOrigin: "left center" }}
              onClick={e => e.stopPropagation()}
              className="bg-parchment w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-border-light p-8 md:p-12 relative flex flex-col md:flex-row gap-10 shadow-2xl"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-ink-light hover:text-ink p-2 transition-colors"
                title="Close"
              >
                <X strokeWidth={1.5} size={28} />
              </button>

              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <div className="aspect-[4/3] w-full relative border border-border-light overflow-hidden bg-ink/5">
                   <ProjectMedia src={selectedProject.imageUrl} alt="Project visual" className="w-full h-full object-cover filter grayscale opacity-90" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {getTags(selectedProject).map((tag, i) => (
                    <span key={i} className="border border-ink-light/30 px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-stamp">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-1/2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6 pb-4 border-b border-border-light">
                    <h2 className="font-serif font-light text-4xl text-ink">
                      {lang === 'en' ? (selectedProject.titleEn || selectedProject.title) : selectedProject.title}
                    </h2>
                    <WaxSeal initial={selectedProject.title[0]} size="lg" className="rotate-[-10deg] -mt-4 opacity-90 shadow-xl" />
                  </div>
                  
                  <div className="prose prose-sm font-body text-ink-light space-y-4 text-sm leading-relaxed opacity-90 whitespace-pre-wrap">
                    {lang === 'en' ? (selectedProject.descriptionEn || selectedProject.description) : selectedProject.description}
                  </div>
                </div>

                {selectedProject.link && (
                  <div className="mt-8 pt-6 border-t border-border-light flex justify-between items-center">
                    <span className="text-[10px] italic opacity-60">{t('contactInfo')}</span>
                    <a 
                      href={selectedProject.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-ink hover:bg-ink hover:text-parchment transition-all text-[10px] uppercase font-bold tracking-widest"
                    >
                      {t('contactBtn')}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
