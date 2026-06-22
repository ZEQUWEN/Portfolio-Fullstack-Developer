import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail } from 'lucide-react';
import { Language } from '../i18n';
import { WaxSeal } from './WaxSeal';

interface Props {
  email: string;
  lang: Language;
}

export function CopyEmailButton({ email, lang }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      <button
        onClick={handleCopy}
        className="group flex flex-col items-center gap-4 text-ink hover:text-stamp transition-colors relative allow-print"
        title={lang === 'ru' ? 'Скопировать Email' : 'Copy Email'}
      >
        <div className="w-24 h-24 border border-ink p-1 relative flex items-center justify-center transition-transform group-hover:scale-105 bg-white/20 backdrop-blur-sm copy-email-box">
          <div className="text-center flex flex-col items-center">
            <Mail size={32} className="mx-auto mb-2 stroke-[1.5]" />
            <div className="text-[10px] uppercase font-bold tracking-[0.2em]">Contact</div>
          </div>
          
          <AnimatePresence>
            {!copied && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -top-3 -right-3"
              >
                <WaxSeal initial="@" size="sm" className="rotate-[15deg] transition-transform group-hover:scale-110" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <span className="text-sm italic tracking-wide font-serif">{email || "hello@example.com"}</span>
      </button>

      {/* Rubber Stamp Copied Effect */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, scale: 2, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: -12 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute top-4 pointer-events-none"
          >
            <div className="border-[3px] border-stamp px-4 py-1 flex items-center justify-center bg-parchment/90 backdrop-blur-sm shadow-md">
              <span className="font-mono text-stamp font-bold text-lg uppercase tracking-widest text-shadow-engrave">
                {lang === 'ru' ? 'Скопировано' : 'Copied'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
