import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Crown, Award, Flame, Sprout, X } from 'lucide-react';
import { Badge } from '../types';

interface MilestoneModalProps {
  badge: Badge | null;
  onClose: () => void;
  onOpenCertificate?: () => void;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({
  badge,
  onClose,
  onOpenCertificate,
}) => {
  useEffect(() => {
    if (!badge) return;

    // Trigger soft pink & gold celebration confetti
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#C94F7C', '#F7B7C9', '#D4AF37', '#E6C79C', '#FFFFFF'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#C94F7C', '#F7B7C9', '#D4AF37', '#E6C79C', '#FFFFFF'],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [badge]);

  if (!badge) return null;

  const isGraduation = badge.id === 'streak_21';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum-deep/80 backdrop-blur-xl">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative max-w-lg w-full p-8 md:p-10 rounded-3xl bg-cream-50 dark:bg-plum-night border border-gold/40 shadow-editorial text-center overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-plum-light hover:text-plum hover:bg-cream-200 transition-all dark:text-cream-300 dark:hover:text-cream-100"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Rosette Icon Badge */}
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gold/20 animate-ping opacity-30" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose to-gold p-0.5 shadow-gold-glow">
              <div className="w-full h-full rounded-full bg-cream-50 dark:bg-plum-night flex items-center justify-center text-gold">
                {badge.iconName === 'Crown' ? (
                  <Crown className="w-10 h-10 text-gold" />
                ) : badge.iconName === 'Award' ? (
                  <Award className="w-10 h-10 text-gold" />
                ) : badge.iconName === 'Flame' ? (
                  <Flame className="w-10 h-10 text-rose" />
                ) : (
                  <Sprout className="w-10 h-10 text-rose" />
                )}
              </div>
            </div>
          </div>

          <span className="inline-block px-3.5 py-1 rounded-full bg-gold-light/50 dark:bg-gold-dark/30 text-gold-dark dark:text-gold text-xs font-semibold tracking-editorial uppercase mb-3">
            Milestone Unlocked
          </span>

          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-plum dark:text-cream-50 mb-3">
            {badge.name}
          </h2>

          <p className="font-serif italic text-xl text-rose dark:text-rose-blush mb-4">
            "{badge.description}"
          </p>

          <p className="text-sm text-plum-light dark:text-cream-300 max-w-sm mx-auto mb-8 leading-relaxed">
            Your discipline is carving out serious mastery. Every focused minute compounds into
            lifelong fluency.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {isGraduation && onOpenCertificate && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCertificate();
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gold hover:bg-gold-dark text-plum-deep font-semibold text-sm transition-all shadow-gold-glow"
              >
                Claim Graduation Certificate
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-plum dark:bg-cream-100 hover:bg-plum-deep dark:hover:bg-cream-200 text-cream-100 dark:text-plum font-semibold text-sm transition-all"
            >
              Continue Journey
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
