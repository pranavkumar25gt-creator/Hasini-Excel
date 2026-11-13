import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CANONICAL_COPY } from '../lib/copy';

interface SplashScreenProps {
  onDone: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDone }) => {
  const microquote = CANONICAL_COPY.microcopy[0];

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 sm:p-12 text-center relative overflow-hidden bg-cream-200 dark:bg-plum-night">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-6"
      >
        <span className="text-xs font-semibold tracking-editorial uppercase text-rose-deep dark:text-gold-champagne">
          Private Atelier Edition · Exclusively for Hasini
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-xl mx-auto my-auto py-12"
      >
        <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-tr from-rose to-rose-blush flex items-center justify-center text-cream-100 shadow-rose-glow">
          <svg viewBox="0 0 32 32" className="w-10 h-10 fill-current">
            <circle cx="16" cy="16" r="4" fill="#D4AF37" />
            <path d="M16 4 C11 4 8 10 16 13 C24 10 21 4 16 4 Z" opacity="0.9" />
            <path d="M4 16 C4 11 10 8 13 16 C10 24 4 21 4 16 Z" opacity="0.85" />
            <path d="M28 16 C28 11 22 8 19 16 C22 24 28 21 28 16 Z" opacity="0.85" />
            <path d="M16 28 C11 28 8 22 16 19 C24 22 21 28 16 28 Z" opacity="0.9" />
          </svg>
        </div>

        <h1 className="font-serif text-6xl sm:text-7xl font-bold tracking-tight text-plum dark:text-cream-100 mb-4">
          HASINI
        </h1>

        <p className="font-serif italic text-2xl text-rose dark:text-rose-blush mb-6">
          Excel Journey · 21-Day Mastery
        </p>

        <p className="text-sm font-sans text-plum-light dark:text-cream-300 max-w-md mx-auto leading-relaxed mb-10">
          Commissioned and curated specially for Hasini. From absolute zero to advanced modeling,
          PivotTables, Power Query, and publication-grade dashboards. One hour a day. Zero excuses.
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDone}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-rose hover:bg-rose-deep text-cream-100 font-semibold text-base transition-all shadow-rose-glow tracking-wide"
        >
          <span>Begin Hasini's Journey</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="pb-6"
      >
        <p className="text-xs font-serif italic text-plum-light/70 dark:text-cream-400">
          "{microquote}"
        </p>
      </motion.div>
    </div>
  );
};
