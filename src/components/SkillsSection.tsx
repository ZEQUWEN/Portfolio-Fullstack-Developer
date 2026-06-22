import { motion } from 'motion/react';
import { Skill, SiteContent } from '../types';
import { Language } from '../i18n';
import { FadeInSection } from './Section';

interface Props {
  skills: Skill[];
  siteContent: SiteContent;
  lang: Language;
}

export function SkillsSection({ skills, siteContent, lang }: Props) {
  return (
    <FadeInSection id="skills" className="py-24">
      <div className="flex flex-col items-center mb-16">
        <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-40 mb-2 text-ink">
          {lang === 'ru' ? siteContent.skillsClass : siteContent.skillsClassEn}
        </h2>
        <h3 className="font-serif text-3xl font-light italic text-stamp">
          {lang === 'ru' ? siteContent.skillsTitle : siteContent.skillsTitleEn}
        </h3>
        <div className="w-16 h-px bg-stamp/30 mt-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 max-w-4xl mx-auto px-4">
        {skills.map((skill, i) => {
          const level = skill.level || 70;
          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
              className="flex flex-col w-full relative"
            >
              <div className="flex justify-between items-end mb-3 w-full">
                <span className="font-serif text-2xl text-ink ink-bleed-hover">{skill.name}</span>
                <span className="text-xs uppercase tracking-widest text-ink/60">
                  {lang === 'ru' ? skill.category : skill.categoryEn}
                </span>
              </div>
              
              {/* Vintage Ruler Style Graph */}
              <div className="relative w-full h-8 pt-2">
                {/* Tick marks */}
                <div className="absolute top-0 w-full flex justify-between px-[1px]">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(tick => (
                    <div key={tick} className={`w-[1px] bg-ink/30 ${tick % 5 === 0 ? 'h-3' : 'h-1.5'}`} />
                  ))}
                </div>
                
                {/* Background track */}
                <div className="w-full h-[1px] bg-ink/20 mt-[11px] absolute top-0" />
                
                {/* Animated fill */}
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${level}%` }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-[3px] bg-ink absolute top-[10px] left-0 origin-left"
                  style={{ filter: "url(#ink-bleed)" }}
                />
                
                {/* Level indicator / "Handwritten" value */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1 + 1.2 }}
                  className="absolute top-[18px] text-[16px] font-signature tracking-wider text-stamp opacity-90"
                  style={{ left: `calc(${level}% - 14px)` }}
                >
                  {level}%
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </FadeInSection>
  );
}
