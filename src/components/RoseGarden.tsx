import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { CURRICULUM } from '../data/curriculum';

interface RoseGardenProps {
  completedDays: number[];
  currentDay: number;
  flexibleMode?: boolean;
  onSelectDay: (day: number) => void;
}

export const RoseGarden: React.FC<RoseGardenProps> = ({
  completedDays,
  currentDay,
  flexibleMode = false,
  onSelectDay,
}) => {
  const completedSet = new Set(completedDays);

  const isDayUnlocked = (day: number) => {
    if (flexibleMode) return true;
    if (day === 1) return true;
    // Unlocked if previous day is completed
    return completedSet.has(day - 1);
  };

  return (
    <div className="w-full">
      {/* 3 Garden Terraces: Week 1, Week 2, Week 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((week) => {
          const weekLessons = CURRICULUM.filter((l) => l.week === week);
          const weekDoneCount = weekLessons.filter((l) => completedSet.has(l.day)).length;
          const weekTitle = week === 1 ? 'Foundations' : week === 2 ? 'Analysis' : 'Advanced';

          return (
            <div
              key={week}
              className="p-6 rounded-3xl bg-white/50 dark:bg-plum-night/60 backdrop-blur-xl border border-rose-blush/25 dark:border-plum-light/20 shadow-rose-glow flex flex-col justify-between relative overflow-hidden"
            >
              {/* Garden Section Header */}
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-rose-blush/20 dark:border-plum-light/20">
                <div>
                  <span className="text-[11px] font-semibold tracking-editorial uppercase text-rose dark:text-rose-blush">
                    Terrace {week}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-plum dark:text-cream-100">
                    {weekTitle}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-300/60 dark:bg-plum/40 text-xs font-medium text-plum dark:text-gold-champagne">
                  <span>{weekDoneCount}/7 Bloomed</span>
                </div>
              </div>

              {/* Flowers Grid for This Week */}
              <div className="grid grid-cols-7 gap-2 my-2">
                {weekLessons.map((lesson) => {
                  const isDone = completedSet.has(lesson.day);
                  const isCurrent = lesson.day === currentDay;
                  const unlocked = isDayUnlocked(lesson.day);

                  return (
                    <motion.button
                      key={lesson.day}
                      whileHover={{ scale: 1.12, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => unlocked && onSelectDay(lesson.day)}
                      disabled={!unlocked}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
                        isDone
                          ? 'bg-rose-soft/40 dark:bg-rose-deep/30 border border-rose/30 shadow-sm'
                          : isCurrent
                          ? 'bg-gold-light/40 dark:bg-gold-dark/30 border-2 border-gold shadow-gold-glow'
                          : unlocked
                          ? 'bg-cream-100 dark:bg-plum-darkCard border border-cream-400/50 hover:border-rose/40'
                          : 'bg-cream-200/40 dark:bg-plum/20 opacity-40 cursor-not-allowed border border-transparent'
                      }`}
                      title={`Day ${lesson.day}: ${lesson.title}`}
                    >
                      {/* Botanical Rose Flower Graphic */}
                      <div className="w-8 h-8 flex items-center justify-center mb-1">
                        {isDone ? (
                          <svg
                            viewBox="0 0 32 32"
                            className="w-7 h-7 animate-bloom filter drop-shadow-sm"
                          >
                            <circle cx="16" cy="16" r="4.5" className="fill-gold" />
                            <path
                              d="M16 6 C12 6 10 11 16 14 C22 11 20 6 16 6 Z"
                              className="fill-rose"
                              opacity="0.9"
                            />
                            <path
                              d="M6 16 C6 12 11 10 14 16 C11 22 6 20 6 16 Z"
                              className="fill-rose-accent"
                              opacity="0.85"
                            />
                            <path
                              d="M26 16 C26 12 21 10 18 16 C21 22 26 20 26 16 Z"
                              className="fill-rose-accent"
                              opacity="0.85"
                            />
                            <path
                              d="M16 26 C12 26 10 21 16 18 C22 21 20 26 16 26 Z"
                              className="fill-rose-deep"
                              opacity="0.9"
                            />
                            <circle cx="10" cy="10" r="3.5" className="fill-rose-blush" opacity="0.75" />
                            <circle cx="22" cy="10" r="3.5" className="fill-rose-blush" opacity="0.75" />
                            <circle cx="10" cy="22" r="3.5" className="fill-rose" opacity="0.75" />
                            <circle cx="22" cy="22" r="3.5" className="fill-rose" opacity="0.75" />
                          </svg>
                        ) : isCurrent ? (
                          <svg viewBox="0 0 32 32" className="w-6 h-6 animate-pulse">
                            <circle cx="16" cy="16" r="6" className="fill-gold-champagne" />
                            <path
                              d="M16 9 C13 9 12 13 16 16 C20 13 19 9 16 9 Z"
                              className="fill-rose"
                            />
                            <circle cx="16" cy="16" r="3" className="fill-gold" />
                          </svg>
                        ) : unlocked ? (
                          <svg viewBox="0 0 32 32" className="w-5 h-5 text-plum-light/50">
                            <circle
                              cx="16"
                              cy="16"
                              r="5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeDasharray="2 2"
                            />
                            <circle cx="16" cy="16" r="1.5" fill="currentColor" />
                          </svg>
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-plum-light/40" />
                        )}
                      </div>

                      <span
                        className={`text-[10px] font-medium ${
                          isDone
                            ? 'text-rose font-bold'
                            : isCurrent
                            ? 'text-gold-dark font-bold'
                            : 'text-plum-light dark:text-cream-300'
                        }`}
                      >
                        {lesson.day}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Terrace Footer Link */}
              <div className="mt-3 pt-3 border-t border-rose-blush/15 flex items-center justify-between text-xs text-plum-light dark:text-cream-300">
                <span className="truncate max-w-[170px] text-[11px]">
                  Day {weekLessons[0].day} to Day {weekLessons[weekLessons.length - 1].day}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-rose font-medium">
                  Week {week}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
