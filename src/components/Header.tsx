import React from 'react';
import {
  Flame,
  Crown,
  Settings,
  Clock,
  Keyboard,
  Camera,
} from 'lucide-react';
import { useProfile, useStreak, useTodayProgress } from '../context/AppContext';
import { AppRoute } from '../App';
import { ThemeWardrobeDropdown } from './ThemeWardrobeDropdown';

interface HeaderProps {
  navigate: (route: AppRoute) => void;
  activePage?: string;
  onOpenRunway?: () => void;
  onOpenStoryStudio?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  navigate,
  activePage,
  onOpenRunway,
  onOpenStoryStudio,
}) => {
  const { profile } = useProfile();
  const streak = useStreak();
  const { todayProgress } = useTodayProgress();

  const shieldsRemaining = Math.max(0, 2 - streak.shieldsUsed);
  const goalMin = profile.dailyGoalMin || 60;
  const isGoalMet = todayProgress.focusedMin >= goalMin;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-cream-200/80 dark:bg-plum-night/85 border-b border-rose-blush/20 dark:border-plum-light/20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => navigate({ page: 'home' })}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          {/* Botanical Rose Logo Emblem */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose to-rose-blush flex items-center justify-center text-cream-100 shadow-rose-glow group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <path d="M12 4 C9 4 8 8 12 9 C16 8 15 4 12 4 Z" fill="currentColor" opacity="0.8" />
              <path d="M4 12 C4 9 8 8 9 12 C8 16 4 15 4 12 Z" fill="currentColor" opacity="0.8" />
              <path d="M20 12 C20 9 16 8 15 12 C16 16 20 15 20 12 Z" fill="currentColor" opacity="0.8" />
              <path d="M12 20 C9 20 8 16 12 15 C16 16 15 20 12 20 Z" fill="currentColor" opacity="0.8" />
            </svg>
          </div>

          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-plum dark:text-cream-100">
              HASINI
            </span>
            <span className="block text-[9px] font-semibold tracking-editorial uppercase text-rose-deep dark:text-gold-champagne">
              Excel Journey · 21-Day Intensive
            </span>
          </div>
        </button>

        {/* Center / Right Metrics & Navigation */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Today's Focus Progress Capsule */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 dark:bg-plum/40 border border-rose-blush/25 dark:border-plum-light/25 shadow-sm text-xs">
            <Clock
              className={`w-3.5 h-3.5 ${
                isGoalMet ? 'text-emerald-500' : 'text-plum-light dark:text-gold-champagne'
              }`}
            />
            <span className="font-medium text-plum dark:text-cream-200">
              {todayProgress.focusedMin} / {goalMin}m
            </span>
            {isGoalMet && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                Goal Met
              </span>
            )}
          </div>

          {/* Current Streak Capsule */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-light/40 dark:bg-gold-dark/25 border border-gold/40 text-xs font-semibold text-gold-dark dark:text-gold shadow-gold-glow">
            <Flame className="w-3.5 h-3.5 text-rose animate-bounce" />
            <span>
              {streak.current} {streak.current === 1 ? 'Day' : 'Days'}
            </span>

            {/* Streak Shield Indicators */}
            <div
              className="flex items-center gap-0.5 ml-1 pl-1.5 border-l border-gold/30"
              title={`${shieldsRemaining} Streak Shields left`}
            >
              {[0, 1].map((idx) => (
                <Crown
                  key={idx}
                  className={`w-3 h-3 ${idx < shieldsRemaining ? 'text-gold fill-gold' : 'text-gold/30'}`}
                />
              ))}
            </div>
          </div>

          {/* Shortcut Runway Drill Quick Trigger */}
          {onOpenRunway && (
            <button
              onClick={onOpenRunway}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 dark:bg-plum/40 hover:bg-cream-300 dark:hover:bg-plum border border-rose-blush/25 dark:border-plum-light/25 text-xs font-medium text-plum dark:text-cream-200 transition-all shadow-sm"
              title="Open The Shortcut Runway (Speed Drill)"
            >
              <Keyboard className="w-3.5 h-3.5 text-gold-dark dark:text-gold" />
              <span>Runway</span>
            </button>
          )}

          {/* Story Studio Quick Trigger */}
          {onOpenStoryStudio && (
            <button
              onClick={onOpenStoryStudio}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 dark:bg-plum/40 hover:bg-cream-300 dark:hover:bg-plum border border-rose-blush/25 dark:border-plum-light/25 text-xs font-medium text-plum dark:text-cream-200 transition-all shadow-sm"
              title="Open Story Studio (Instagram / Pinterest Card Generator)"
            >
              <Camera className="w-3.5 h-3.5 text-rose dark:text-rose-blush" />
              <span className="hidden sm:inline">Story</span>
            </button>
          )}

          {/* Hasini's Mood Wardrobe Selector */}
          <ThemeWardrobeDropdown />

          {/* Settings Button */}
          <button
            onClick={() => navigate({ page: 'settings' })}
            className={`p-2.5 rounded-full border transition-all focus:outline-none ${
              activePage === 'settings'
                ? 'bg-rose text-cream-100 border-rose shadow-rose-glow'
                : 'bg-white/60 dark:bg-plum/40 hover:bg-cream-300 dark:hover:bg-plum border-rose-blush/25 dark:border-plum-light/25 text-plum dark:text-cream-200'
            }`}
            title="Settings & Preferences"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
