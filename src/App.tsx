import React, { useEffect, useState } from 'react';
import { Send, Github, Facebook, Mail } from 'lucide-react';
import { Project, ContactSettings, SiteContent, Skill, Review } from './types';
import { initialProjects, initialContactSettings, initialSiteContent, initialSkills, reviews as initialReviews } from './data';
import { ProjectsCarousel } from './components/ProjectsCarousel';
import { AdminPanel } from './components/AdminPanel';
import { FadeInSection } from './components/Section';
import { TypewriterText } from './components/TypewriterText';
import { WaxSeal } from './components/WaxSeal';
import { SectionDivider } from './components/SectionDivider';
import { Signature } from './components/Signature';
import { ScrollProgress } from './components/ScrollProgress';
import { InkBlotsCanvas } from './components/InkBlotsCanvas';
import { QuillPen } from './components/QuillPen';
import { SVGFilters } from './components/SVGFilters';
import { InteractiveStory } from './components/InteractiveStory';
import { WelcomeLetter } from './components/WelcomeLetter';
import { SkillsSection } from './components/SkillsSection';
import { ReviewsSection } from './components/ReviewsSection';
import { CopyEmailButton } from './components/CopyEmailButton';
import { AnimatedName } from './components/AnimatedName';
import { triggerSparkles } from './sparkles';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Language, translations } from './i18n';

function ParallaxBackground() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 2000], [0, -100]);
  const y2 = useTransform(scrollY, [0, 2000], [0, 150]);
  const y3 = useTransform(scrollY, [0, 2000], [0, -200]);

  return (
    <>
      <motion.div style={{ y: y1 }} className="absolute top-[10%] right-[5%] font-decor text-9xl text-stamp/10 select-none pointer-events-none -z-10 rotate-12 print-hidden">
        ❦
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute top-[40%] left-[2%] font-decor text-[15rem] text-ink/5 select-none pointer-events-none -z-10 -rotate-12 print-hidden">
        ❧
      </motion.div>
      <motion.div style={{ y: y3 }} className="absolute top-[80%] right-[10%] font-decor text-8xl text-stamp/10 select-none pointer-events-none -z-10 rotate-45 print-hidden">
        ☙
      </motion.div>
    </>
  );
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [reviewsData, setReviewsData] = useState<Review[]>(initialReviews);
  const [contactSettings, setContactSettings] = useState<ContactSettings>(initialContactSettings);
  const [siteContent, setSiteContent] = useState<SiteContent>(initialSiteContent);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('ru');
  const [hasVisited, setHasVisited] = useState(false);

  const t = (key: keyof typeof translations['ru']) => translations[lang][key] || key;

  // Load from local storage on mount
  useEffect(() => {
    const visited = localStorage.getItem('vintage_visited');
    if (visited) setHasVisited(true);

    const saved = localStorage.getItem('vintage_projects');
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved projects");
      }
    }

    const savedSkills = localStorage.getItem('vintage_skills');
    if (savedSkills) {
      try {
        setSkills(JSON.parse(savedSkills));
      } catch (e) {
        console.error("Error parsing saved skills");
      }
    }

    const savedReviews = localStorage.getItem('vintage_reviews');
    if (savedReviews) {
      try {
        setReviewsData(JSON.parse(savedReviews));
      } catch (e) {
        console.error("Error parsing saved reviews");
      }
    }

    const savedContacts = localStorage.getItem('vintage_contacts');
    if (savedContacts) {
      try {
        setContactSettings(JSON.parse(savedContacts));
      } catch (e) {
        console.error("Error parsing saved contacts");
      }
    }

    const savedContent = localStorage.getItem('vintage_content');
    if (savedContent) {
      try {
        setSiteContent(JSON.parse(savedContent));
      } catch (e) {
        console.error("Error parsing saved content");
      }
    }

    const savedLastUpdated = localStorage.getItem('vintage_last_updated');
    if (savedLastUpdated) {
      setLastUpdated(savedLastUpdated);
    }
  }, []);

  const updateTimestamp = () => {
    const now = new Date().toISOString();
    setLastUpdated(now);
    localStorage.setItem('vintage_last_updated', now);
  };

  const handleOpenLetter = () => {
    localStorage.setItem('vintage_visited', 'true');
    setHasVisited(true);
  };

  const saveProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('vintage_projects', JSON.stringify(updatedProjects));
    updateTimestamp();
  };

  const saveSkills = (updatedSkills: Skill[]) => {
    setSkills(updatedSkills);
    localStorage.setItem('vintage_skills', JSON.stringify(updatedSkills));
    updateTimestamp();
  };

  const saveReviews = (updatedReviews: Review[]) => {
    setReviewsData(updatedReviews);
    localStorage.setItem('vintage_reviews', JSON.stringify(updatedReviews));
    updateTimestamp();
  };

  const handleUpdateContacts = (contacts: ContactSettings) => {
    setContactSettings(contacts);
    localStorage.setItem('vintage_contacts', JSON.stringify(contacts));
    updateTimestamp();
  };

  const handleUpdateSiteContent = (content: SiteContent) => {
    setSiteContent(content);
    localStorage.setItem('vintage_content', JSON.stringify(content));
    updateTimestamp();
  };

  const handleResetDefaults = () => {
    if (confirm(lang === 'ru' ? 'Вы уверены, что хотите сбросить все данные по умолчанию?' : 'Are you sure you want to reset to defaults?')) {
      setProjects(initialProjects);
      setSkills(initialSkills);
      setReviewsData(initialReviews);
      setContactSettings(initialContactSettings);
      setSiteContent(initialSiteContent);
      localStorage.removeItem('vintage_projects');
      localStorage.removeItem('vintage_skills');
      localStorage.removeItem('vintage_reviews');
      localStorage.removeItem('vintage_contacts');
      localStorage.removeItem('vintage_content');
    }
  };

  const handleAddProject = (p: Project) => {
    saveProjects([p, ...projects]);
  };

  const handleUpdateProject = (p: Project) => {
    saveProjects(projects.map(proj => (proj.id === p.id ? p : proj)));
  };

  const handleDeleteProject = (id: string) => {
    saveProjects(projects.filter(proj => proj.id !== id));
  };

  const handleTelegramClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Generate sparkles, standard link behavior follows (target="_blank")
    triggerSparkles(e);
  };

  const handleSocialClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    triggerSparkles(e);
  };

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-ink selection:text-parchment">
      <SVGFilters />
      <AnimatePresence>
        {!hasVisited && <WelcomeLetter onOpen={handleOpenLetter} lang={lang} />}
      </AnimatePresence>

      <ScrollProgress />
      <InkBlotsCanvas />
      <QuillPen />
      {/* Decorative floral/vintage corners could be added here */}
      <ParallaxBackground />
      
      <main className="max-w-5xl mx-auto px-6 md:px-12 pt-24 pb-12">
        
        {/* Language Toggle */}
        <div className="flex justify-end mb-8 relative z-20 print-hidden">
          <div className="flex items-center gap-4 bg-white/40 p-2 border border-border-light shadow-sm backdrop-blur-sm self-end">
             <button 
                onClick={() => setLang('ru')} 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm transition-all ${lang === 'ru' ? 'bg-stamp text-parchment shadow-md' : 'text-ink/60 hover:text-ink hover:bg-white/60'}`}
             >
                RU
             </button>
             <button 
                onClick={() => setLang('en')} 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm transition-all ${lang === 'en' ? 'bg-stamp text-parchment shadow-md' : 'text-ink/60 hover:text-ink hover:bg-white/60'}`}
             >
                EN
             </button>
          </div>
        </div>

        {/* Header / Hero */}
        <FadeInSection className="text-center min-h-[50vh] flex flex-col justify-center relative -mt-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="mb-8"
          >
            <span className="font-decor text-4xl md:text-6xl text-ink/20 select-none">❧</span>
          </motion.div>

          <AnimatedName siteContent={siteContent} lang={lang} />
          
          <p className="font-serif text-sm opacity-70 mb-8 mt-4 max-w-2xl mx-auto italic">
            {lang === 'ru' ? siteContent.heroSubtitle : siteContent.heroSubtitleEn}
          </p>
          <div className="w-24 h-px bg-ink/30 mx-auto my-12" />
          
          <div className="text-lg md:text-xl text-ink/80 max-w-3xl mx-auto leading-relaxed space-y-6">
            <p>
              <TypewriterText 
                text={lang === 'ru' ? siteContent.heroIntro : siteContent.heroIntroEn} 
                delay={0.8}
                speed={0.03}
                key={`${lang}-content`}
              />
            </p>
          </div>
        </FadeInSection>

        <SectionDivider />

        {/* Methodology / Interactive Story Section */}
        <FadeInSection className="py-24">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-40 mb-2 text-ink">
              {lang === 'ru' ? siteContent.methodologyClass : siteContent.methodologyClassEn}
            </h2>
            <h3 className="font-serif text-3xl font-light italic text-stamp">
              {lang === 'ru' ? siteContent.methodologyTitle : siteContent.methodologyTitleEn}
            </h3>
            <div className="w-16 h-px bg-stamp/30 mt-6" />
          </div>
          <InteractiveStory lang={lang} content={siteContent} />
        </FadeInSection>

        <SectionDivider />

        {/* Skills Section */}
        <SkillsSection skills={skills} siteContent={siteContent} lang={lang} />

        <SectionDivider />

        {/* Projects Section */}
        <FadeInSection id="projects" className="py-24">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-40 mb-2 text-ink">
              {lang === 'ru' ? siteContent.projectsClass : siteContent.projectsClassEn}
            </h2>
            <h3 className="font-serif text-3xl font-light italic text-stamp">
              {lang === 'ru' ? siteContent.projectsTitle : siteContent.projectsTitleEn}
            </h3>
            <div className="w-16 h-px bg-stamp/30 mt-6" />
          </div>
          
          <ProjectsCarousel projects={projects} lang={lang} />
        </FadeInSection>

        <SectionDivider />

        {/* Reviews Section */}
        <ReviewsSection reviews={reviewsData} lang={lang} t={t} />

        <SectionDivider />

        {/* Contact Section */}
        <FadeInSection id="contact" className="py-24 flex flex-col items-center text-center">
          <span className="font-decor text-3xl text-ink/20 select-none mb-8">❦</span>
          <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-40 mb-2 text-ink">
            {lang === 'ru' ? siteContent.contactClass : siteContent.contactClassEn}
          </h2>
          <h3 className="font-serif text-3xl font-light italic text-stamp mb-8">
            {lang === 'ru' ? siteContent.contactTitle : siteContent.contactTitleEn}
          </h3>
          
          <p className="font-serif text-sm italic opacity-70 mb-12 max-w-md">
            {lang === 'ru' ? siteContent.contactIntro : siteContent.contactIntroEn}
          </p>

          <div className="flex flex-col items-center gap-12 w-full max-w-xl mx-auto">
            <CopyEmailButton email={contactSettings.email} lang={lang} />
            
            <div className="flex justify-center gap-8 md:gap-12 w-full mt-8 border-t border-ink/20 pt-12 relative print-hidden">
              <span className="absolute -top-3 bg-parchment px-4 italic font-serif text-sm opacity-60">Социальные сети</span>
              
              {contactSettings.github && (
                <a href={contactSettings.github} target="_blank" rel="noopener noreferrer" onClick={handleSocialClick} className="group relative" title="GitHub">
                  <WaxSeal initial="GH" size="md" className="transition-transform group-hover:scale-110" />
                </a>
              )}
              {contactSettings.telegram && (
                <a href={contactSettings.telegram} target="_blank" rel="noopener noreferrer" onClick={handleSocialClick} className="group relative" title="Telegram">
                  <WaxSeal initial="TG" size="md" className="transition-transform group-hover:scale-110" />
                </a>
              )}
              {contactSettings.vk && (
                <a href={contactSettings.vk} target="_blank" rel="noopener noreferrer" onClick={handleSocialClick} className="group relative" title="VKontakte">
                  <WaxSeal initial="VK" size="md" className="transition-transform group-hover:scale-110" />
                </a>
              )}
              {contactSettings.facebook && (
                <a href={contactSettings.facebook} target="_blank" rel="noopener noreferrer" onClick={handleSocialClick} className="group relative" title="Facebook">
                  <WaxSeal initial="FB" size="md" className="transition-transform group-hover:scale-110" />
                </a>
              )}
            </div>
          </div>
          
          <div className="mt-20">
            <Signature />
          </div>
        </FadeInSection>

        <footer className="mt-24 border-t border-ink/20 pt-8 flex flex-col items-center">
          {lastUpdated && (
            <p className="font-serif text-xs italic opacity-60">
              {t('lastUpdated')}: {new Date(lastUpdated).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </footer>
      </main>

      <AdminPanel 
        projects={projects}
        skills={skills}
        reviews={reviewsData}
        contactSettings={contactSettings}
        siteContent={siteContent}
        lastUpdated={lastUpdated}
        onAddProject={handleAddProject} 
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
        onUpdateContacts={handleUpdateContacts}
        onUpdateSiteContent={handleUpdateSiteContent}
        onAddSkill={(s) => saveSkills([...skills, s])}
        onDeleteSkill={(id) => saveSkills(skills.filter(s => s.id !== id))}
        onAddReview={(r) => saveReviews([r, ...reviewsData])}
        onDeleteReview={(id) => saveReviews(reviewsData.filter(r => r.id !== id))}
        onResetDefaults={handleResetDefaults}
        lang={lang} 
      />
    </div>
  );
}
