import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Eye,
  Coffee,
  ExternalLink,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Camera,
} from 'lucide-react';
import { CANONICAL_COPY } from '../lib/copy';

interface FocusGuardianOverlaysProps {
  activeOverlay: 'phone' | 'eyes-off' | 'sleeping' | 'tab' | 'strikes' | null;
  strikes: number;
  resumeToastVisible: boolean;
  onDismissPhone: () => void;
  onResetStrikes: () => void;
  customCopy?: Partial<typeof CANONICAL_COPY>;
}

export const FocusGuardianOverlays: React.FC<FocusGuardianOverlaysProps> = ({
  activeOverlay,
  strikes,
  resumeToastVisible,
  onDismissPhone,
  onResetStrikes,
  customCopy,
}) => {
  const copy = { ...CANONICAL_COPY, ...customCopy };

  return (
    <>
      {/* ─── Back in Focus Resume Toast ────────────────────────────────────── */}
      <AnimatePresence>
        {resumeToastVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-plum-night/95 backdrop-blur-xl border border-gold/40 text-cream-100 shadow-gold-glow text-sm font-medium tracking-wide"
          >
            <CheckCircle2 className="w-4 h-4 text-gold" />
            <span>{copy.resumeToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Active Modal Overlays ─────────────────────────────────────────── */}
      <AnimatePresence>
        {activeOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum-deep/85 backdrop-blur-xl"
          >
            {/* 1. PHONE DETECTED MODAL */}
            {activeOverlay === 'phone' && (
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="max-w-md w-full p-8 rounded-3xl bg-cream-50 dark:bg-plum-night border border-rose/30 shadow-editorial text-center relative overflow-hidden"
              >
                <div className="w-16 h-16 rounded-2xl bg-rose-soft/40 dark:bg-rose-deep/30 flex items-center justify-center mx-auto mb-5 text-rose">
                  <Smartphone className="w-8 h-8" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-soft text-rose-deep text-xs font-semibold tracking-editorial uppercase mb-3">
                  Strike {strikes} of 3
                </div>
                <h3 className="font-serif text-3xl font-bold tracking-tight text-plum dark:text-cream-100 mb-2">
                  {copy.phoneDetectedTitle}
                </h3>
                <p className="text-plum-light dark:text-cream-300 text-sm leading-relaxed mb-6">
                  {copy.phoneDetectedBody}
                </p>
                <button
                  onClick={onDismissPhone}
                  className="w-full py-3.5 px-6 rounded-xl bg-rose hover:bg-rose-deep text-cream-100 font-medium text-sm transition-all shadow-rose-glow tracking-wide"
                >
                  I Put It Away. Resume Lesson
                </button>
              </motion.div>
            )}

            {/* 2. EYES OFF SCREEN OVERLAY */}
            {activeOverlay === 'eyes-off' && (
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="max-w-md w-full p-8 rounded-3xl bg-cream-50 dark:bg-plum-night border border-gold/30 shadow-editorial text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gold-light/40 dark:bg-gold-dark/30 flex items-center justify-center mx-auto mb-5 text-gold-dark dark:text-gold">
                  <Eye className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="font-serif text-3xl font-bold tracking-tight text-plum dark:text-cream-100 mb-2">
                  {copy.eyesOffTitle}
                </h3>
                <p className="text-plum-light dark:text-cream-300 text-sm leading-relaxed mb-5">
                  {copy.eyesOffBody}
                </p>
                <div className="p-3 rounded-xl bg-gold-champagne/15 border border-gold/20 text-xs text-plum dark:text-cream-200">
                  Auto-resumes 1 second after you look back at your screen.
                </div>
              </motion.div>
            )}

            {/* 3. SLEEPING OVERLAY */}
            {activeOverlay === 'sleeping' && (
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="max-w-md w-full p-8 rounded-3xl bg-cream-50 dark:bg-plum-night border border-plum-light/30 shadow-editorial text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-plum-light/20 flex items-center justify-center mx-auto mb-5 text-plum dark:text-gold-champagne">
                  <Coffee className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-3xl font-bold tracking-tight text-plum dark:text-cream-100 mb-2">
                  {copy.sleepingTitle}
                </h3>
                <p className="text-plum-light dark:text-cream-300 text-sm leading-relaxed mb-5">
                  {copy.sleepingBody}
                </p>
                <div className="p-3 rounded-xl bg-plum/5 dark:bg-white/5 border border-plum/10 text-xs text-plum-light dark:text-cream-300">
                  Focus will resume once your eyes are open and steady for two verdict cycles.
                </div>
              </motion.div>
            )}

            {/* 4. TAB SWITCH OVERLAY */}
            {activeOverlay === 'tab' && (
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="max-w-md w-full p-8 rounded-3xl bg-cream-50 dark:bg-plum-night border border-rose-blush/30 shadow-editorial text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-rose-soft/30 flex items-center justify-center mx-auto mb-5 text-rose">
                  <ExternalLink className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-3xl font-bold tracking-tight text-plum dark:text-cream-100 mb-2">
                  {copy.tabSwitchTitle}
                </h3>
                <p className="text-plum-light dark:text-cream-300 text-sm leading-relaxed mb-4">
                  {copy.tabSwitchBody}
                </p>
                <p className="text-xs text-plum-light/70 dark:text-cream-400">
                  Return to this tab to resume the lesson video.
                </p>
              </motion.div>
            )}

            {/* 5. 3 STRIKES SCREEN */}
            {activeOverlay === 'strikes' && (
              <motion.div
                initial={{ scale: 0.85, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 30 }}
                className="max-w-lg w-full p-8 rounded-3xl bg-plum-night border border-rose text-center text-cream-100 shadow-2xl relative"
              >
                <div className="w-20 h-20 rounded-2xl bg-rose/20 border border-rose/40 flex items-center justify-center mx-auto mb-5 text-rose">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose text-cream-100 text-xs font-semibold tracking-editorial uppercase mb-3">
                  3 Strikes Exceeded
                </div>
                <h3 className="font-serif text-3xl font-bold tracking-tight text-cream-50 mb-3">
                  {copy.strikesTitle}
                </h3>
                <p className="text-cream-300 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                  {copy.strikesBody}
                </p>
                <button
                  onClick={onResetStrikes}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gold hover:bg-gold-dark text-plum-deep font-semibold text-sm transition-all shadow-gold-glow tracking-wide"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Session & Try Again
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface WebcamStatusPillProps {
  videoRef?: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  faceDetected: boolean;
  eyesClosed: boolean;
  strikes: number;
  currentVerdict: string;
}

export const WebcamStatusPill: React.FC<WebcamStatusPillProps> = ({
  isActive,
  faceDetected,
  eyesClosed,
  strikes,
}) => {
  return (
    <div className="relative group">
      {/* Floating Guardian Pill in Corner */}
      <div className="flex items-center gap-3 px-3.5 py-2 rounded-full bg-white/70 dark:bg-plum-night/80 backdrop-blur-xl border border-rose-blush/30 dark:border-plum-light/30 shadow-rose-glow">
        <div className="relative flex items-center justify-center">
          <Camera className="w-3.5 h-3.5 text-plum dark:text-cream-200" />
          <span
            className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
              isActive
                ? faceDetected && !eyesClosed
                  ? 'bg-emerald-500 animate-pulse'
                  : 'bg-amber-400'
                : 'bg-gray-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-plum dark:text-cream-100 tracking-wide">
            {isActive
              ? faceDetected
                ? eyesClosed
                  ? 'Eyes Closed'
                  : 'Focus Locked'
                : 'Searching Face'
              : 'Guardian Idle'}
          </span>

          {strikes > 0 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose/15 text-rose dark:bg-rose/30 dark:text-rose-blush">
              {strikes}/3 Strikes
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
