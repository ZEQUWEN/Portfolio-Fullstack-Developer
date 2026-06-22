import { motion } from 'motion/react';
import { Review } from '../types';
import { Language } from '../i18n';
import { FadeInSection } from './Section';
import { WaxSeal } from './WaxSeal';
import { Star } from 'lucide-react';

interface Props {
  reviews: Review[];
  lang: Language;
  t: (key: any) => string;
}

export function ReviewsSection({ reviews, lang, t }: Props) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <FadeInSection id="reviews" className="py-24">
      <div className="flex flex-col items-center mb-16">
        <h2 className="text-xs uppercase tracking-[0.3em] font-bold opacity-40 mb-2 text-ink">{t('reviewsClass')}</h2>
        <h3 className="font-serif text-3xl font-light italic text-stamp">{t('reviewsTitle')}</h3>
        <div className="w-16 h-px bg-stamp/30 mt-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {reviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.2, duration: 0.8, ease: "easeOut" }}
            className="relative p-8 border border-border-light bg-white/20 backdrop-blur-sm flex flex-col"
          >
            <div className="absolute -top-4 -left-4">
              <span className="font-decor text-6xl text-ink/10 select-none">"</span>
            </div>
            
            <div className="flex gap-1 mb-4 relative z-10">
               {[1, 2, 3, 4, 5].map((star) => (
                 <Star key={star} size={16} className={star <= (review.rating || 5) ? 'fill-stamp text-stamp' : 'text-ink/20'} strokeWidth={1} />
               ))}
            </div>

            <p className="font-serif text-lg italic text-ink/80 leading-relaxed mb-6 relative z-10 flex-1">
              {lang === 'ru' ? review.text : (review.textEn || review.text)}
            </p>
            
            <div className="flex items-center gap-4 border-t border-ink/10 pt-4 mt-auto">
              {review.photoUrl ? (
                <img src={review.photoUrl} alt={review.author} className="w-12 h-12 rounded-full object-cover border border-ink/20" />
              ) : (
                <WaxSeal initial={(lang === 'ru' ? review.author : (review.authorEn || review.author)).charAt(0)} size="sm" />
              )}
              <div>
                <div className="font-serif text-ink font-semibold">
                  {lang === 'ru' ? review.author : (review.authorEn || review.author)}
                </div>
                {review.role && (
                  <div className="text-xs uppercase tracking-widest text-ink/60 mt-1">
                    {lang === 'ru' ? review.role : (review.roleEn || review.role)}
                  </div>
                )}
                {review.link && (
                  <a href={review.link} target="_blank" rel="noopener noreferrer" className="text-stamp hover:text-stamp/80 text-xs mt-1 inline-block italic">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </FadeInSection>
  );
}
