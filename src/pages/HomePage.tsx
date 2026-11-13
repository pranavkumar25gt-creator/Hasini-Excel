import React, { useState } from 'react';
import {
  Flame,
  Crown,
  Play,
  Clock,
  Award,
  CheckCircle2,
  Keyboard,
  Camera,
  Zap,
  Sparkles,
} from 'lucide-react';
import { Header } from '../components/Header';
import { RoseGarden } from '../components/RoseGarden';
import { MilestoneModal } from '../components/MilestoneModal';
import { CertificateModal } from '../components/CertificateModal';
import { ShortcutRunwayModal } from '../components/ShortcutRunwayModal';
import { StoryStudioModal } from '../components/StoryStudioModal';
import { useAppState, useProfile, useStreak, useTodayProgress, useBadges } from '../context/AppContext';
import { CURRICULUM, getDayLesson } from '../data/curriculum';
import { AppRoute } from '../App';
import { formatDateKey, getTodayKey } from '../lib/storage';

interface HomePageProps {
  navigate: (route: AppRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { state } = useAppState();
  const { profile } = useProfile();
  const streak = useStreak();
  const { todayProgress } = useTodayProgress();
  const badges = useBadges();

  const [selectedMilestoneBadge, setSelectedMilestoneBadge] = useState<any | null>(null);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [showRunway, setShowRunway] = useState<boolean>(false);
  const [showStoryStudio, setShowStoryStudio] = useState<boolean>(false);

  // Determine completed days array
  const completedDayNumbers: number[] = [];
  for (const day of CURRICULUM) {
    if (state.lessons[day.day]?.completedAt) {
      completedDayNumbers.push(day.day);
    }
  }

  // Next recommended day to watch: first uncompleted day, or day 1
  const nextDay =
    CURRICULUM.find((d) => !state.lessons[d.day]?.completedAt)?.day || 21;
  const todayLesson = getDayLesson(nextDay) || CURRICULUM[0];

  const dailyGoalMin = profile.dailyGoalMin || 60;
  const progressRatio = Math.min(1, todayProgress.focusedMin / dailyGoalMin);

  // Weekly 7-day strip (last 6 days + today)
  const past7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = formatDateKey(d);
    const dayData = state.days[key];
    const isMet = (dayData?.focusedMin || 0) >= dailyGoalMin;
    const isToday = key === getTodayKey();
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    return { key, dayName, dayNum, isMet, isToday };
  });

  return (
    <div className="min-h-screen flex flex-col bg-cream-200 dark:bg-plum-night text-plum dark:text-cream-100 transition-colors">
      <Header
        navigate={navigate}
        activePage="home"
        onOpenRunway={() => setShowRunway(true)}
        onOpenStoryStudio={() => setShowStoryStudio(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* ─── Hero Row: Streak + Today's Goal Ring + Active Lesson ──────────── */}
        <div className="flex items-center justify-between pb-2 border-b border-rose-blush/20">
          <div>
            <span className="text-xs font-semibold tracking-editorial uppercase text-rose-deep dark:text-gold-champagne block">
              Curated Exclusively For Hasini
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-plum dark:text-cream-50 mt-0.5">
              Welcome back, Hasini.
            </h2>
          </div>
          <span className="text-xs font-mono text-plum-light dark:text-cream-300">
            Day {todayLesson.day} of 21 In Progress
          </span>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Card 1: Streak & Goal Meter (5 cols) */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-white/60 dark:bg-plum-darkCard backdrop-blur-xl border border-rose-blush/30 dark:border-plum-light/30 shadow-editorial flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold tracking-editorial uppercase text-rose dark:text-rose-blush">
                  Hasini's Habit Engine
                </span>
                <span className="text-xs text-plum-light dark:text-cream-300">
                  Best: {streak.best} {streak.best === 1 ? 'day' : 'days'}
                </span>
              </div>

              {/* Big Streak Numbers */}
              <div className="flex items-baseline gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center text-gold">
                  <Flame className="w-7 h-7 text-gold-dark dark:text-gold" />
                </div>
                <div>
                  <h2 className="font-serif text-5xl font-extrabold tracking-tight text-plum dark:text-cream-50">
                    {streak.current}
                  </h2>
                  <span className="text-xs font-semibold tracking-editorial uppercase text-plum-light dark:text-gold-champagne">
                    Day Active Streak
                  </span>
                </div>
              </div>
            </div>

            {/* Circular Progress Ring for Today's Focused Minutes */}
            <div className="flex items-center gap-6 p-5 rounded-2xl bg-cream-100/70 dark:bg-plum-night/60 border border-gold/30">
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-cream-300 dark:text-plum"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="251"
                    strokeDashoffset={251 - 251 * progressRatio}
                    strokeLinecap="round"
                    className="text-gold transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-serif text-xl font-bold text-plum dark:text-cream-50 leading-none">
                    {todayProgress.focusedMin}
                  </span>
                  <span className="text-[10px] text-plum-light dark:text-cream-300 mt-0.5">
                    of {dailyGoalMin}m
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-serif text-base font-bold text-plum dark:text-cream-100 mb-1">
                  Today's Focus Lock
                </h4>
                <p className="text-xs text-plum-light dark:text-cream-300 leading-relaxed mb-2">
                  {todayProgress.focusedMin >= dailyGoalMin
                    ? 'Goal satisfied for today. Your streak is safeguarded.'
                    : `${dailyGoalMin - todayProgress.focusedMin} focused minutes remaining to secure today's garden bloom.`}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-gold-dark dark:text-gold">
                  <Crown className="w-3.5 h-3.5 text-gold" />
                  <span>2 Streak Shields active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Today's Active Lesson Spotlight (7 cols) */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-white/70 dark:bg-plum-darkCard backdrop-blur-xl border border-rose/30 shadow-editorial flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-rose-blush/10 dark:bg-rose/5 blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-soft text-rose-deep dark:bg-rose-deep/40 dark:text-rose-blush text-xs font-semibold tracking-editorial uppercase">
                    Day {todayLesson.day} · Week {todayLesson.week}
                  </span>
                  {state.lessons[todayLesson.day]?.completedAt && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      Completed
                    </span>
                  )}
                </div>

                <span className="text-xs text-plum-light dark:text-cream-300">
                  {todayLesson.hindi.durationApprox}
                </span>
              </div>

              <h3 className="font-serif text-3xl font-bold text-plum dark:text-cream-50 mb-3 tracking-tight">
                {todayLesson.title}
              </h3>

              <p className="text-sm text-plum-light dark:text-cream-300 leading-relaxed mb-6 line-clamp-2">
                {todayLesson.goals.join(' · ')}
              </p>

              {/* Focus Guardian Security Notice */}
              <div className="p-4 rounded-2xl bg-cream-100/60 dark:bg-plum-night/50 border border-rose-blush/25 mb-6 text-xs text-plum-light dark:text-cream-300 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-plum dark:text-cream-100">
                  <Clock className="w-3.5 h-3.5 text-rose" />
                  <span>Guardian Supervised Session</span>
                </div>
                <p>
                  Requires webcam focus verification. Zero phones allowed. Time accumulates only
                  when your gaze is locked on screen.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => navigate({ page: 'lesson', dayId: todayLesson.day })}
                className="w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl bg-rose hover:bg-rose-deep text-cream-100 font-semibold text-sm transition-all shadow-rose-glow flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {state.lessons[todayLesson.day]?.completedAt
                    ? `Review Day ${todayLesson.day}`
                    : `Start Day ${todayLesson.day} Session`}
                </span>
              </button>

              <button
                onClick={() => setShowStoryStudio(true)}
                className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-white/70 dark:bg-plum hover:bg-cream-200 dark:hover:bg-plum-night text-plum dark:text-cream-100 font-semibold text-xs border border-rose-blush/30 transition-all flex items-center justify-center gap-2"
                title="Create Instagram or Pinterest Story Card"
              >
                <Camera className="w-4 h-4 text-rose" />
                <span>Story Studio</span>
              </button>
            </div>
          </div>
        </section>

        {/* ─── Atelier Specialty Lounges (Runway + Story Generator) ───────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 1: The Shortcut Runway */}
          <div className="p-7 rounded-3xl bg-gradient-to-br from-white/70 to-cream-100/50 dark:from-plum-darkCard dark:to-plum-night/70 backdrop-blur-xl border border-gold/30 shadow-editorial flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold-dark dark:text-gold text-xs font-semibold tracking-editorial uppercase">
                  <Zap className="w-3.5 h-3.5" />
                  Interactive Speed Arcade
                </span>
                <span className="text-xs font-mono text-plum-light dark:text-cream-300">
                  Sub-second Reflex
                </span>
              </div>

              <h4 className="font-serif text-2xl font-bold text-plum dark:text-cream-50 mb-2">
                The Shortcut Runway
              </h4>
              <p className="text-xs text-plum-light dark:text-cream-300 leading-relaxed mb-6">
                Train muscle memory for essential Excel hotkeys (Flash Fill, AutoSum, Absolute
                References, Filter Toggles). Live keystroke listening with millisecond cadence scoring.
              </p>

              {/* Sample Keycaps Preview */}
              <div className="flex items-center gap-2 mb-6">
                <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-plum text-xs font-mono font-bold border border-rose-blush/40 dark:border-gold/30 shadow-sm">
                  Ctrl
                </div>
                <span className="text-xs font-bold text-plum-light">+</span>
                <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-plum text-xs font-mono font-bold border border-rose-blush/40 dark:border-gold/30 shadow-sm">
                  E
                </div>
                <span className="text-xs text-plum-light dark:text-cream-300 italic ml-2">
                  Flash Fill
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowRunway(true)}
              className="w-full py-3.5 px-5 rounded-2xl bg-gold hover:bg-gold-dark text-plum-deep font-semibold text-xs transition-all shadow-gold-glow flex items-center justify-center gap-2"
            >
              <Keyboard className="w-4 h-4" />
              <span>Launch Shortcut Runway</span>
            </button>
          </div>

          {/* Feature 5: Instagram & Pinterest Story Studio */}
          <div className="p-7 rounded-3xl bg-gradient-to-br from-white/70 to-cream-100/50 dark:from-plum-darkCard dark:to-plum-night/70 backdrop-blur-xl border border-rose-blush/30 dark:border-plum-light/30 shadow-editorial flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-soft text-rose-deep dark:bg-rose-deep/30 dark:text-rose-blush text-xs font-semibold tracking-editorial uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  Editorial Export
                </span>
                <span className="text-xs font-mono text-plum-light dark:text-cream-300">
                  1080 × 1920 PNG
                </span>
              </div>

              <h4 className="font-serif text-2xl font-bold text-plum dark:text-cream-50 mb-2">
                Story Studio
              </h4>
              <p className="text-xs text-plum-light dark:text-cream-300 leading-relaxed mb-6">
                Generate high-fashion 9:16 vertical story cards celebrating your day's bloom, active
                streak, and flawless zero-strike integrity. High-res vector graphics ready for Instagram
                and Pinterest.
              </p>

              <div className="flex items-center gap-3 text-xs text-plum-light dark:text-cream-300 mb-6">
                <span className="px-2.5 py-1 rounded-lg bg-cream-200/80 dark:bg-plum/40 border border-rose-blush/20">
                  Rose Gold
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-cream-200/80 dark:bg-plum/40 border border-rose-blush/20">
                  Plum Velvet
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-cream-200/80 dark:bg-plum/40 border border-rose-blush/20">
                  Ivory Haute
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowStoryStudio(true)}
              className="w-full py-3.5 px-5 rounded-2xl bg-rose hover:bg-rose-deep text-cream-100 font-semibold text-xs transition-all shadow-rose-glow flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Compose 9:16 Story Card</span>
            </button>
          </div>
        </section>

        {/* ─── 7-Day Consistency Strip ─────────────────────────────────────── */}
        <section className="p-6 rounded-3xl bg-white/50 dark:bg-plum-darkCard backdrop-blur-xl border border-rose-blush/20 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold tracking-editorial uppercase text-plum-light dark:text-cream-300">
              Hasini's 7-Day Discipline Arc
            </span>
            <span className="text-xs text-gold-dark dark:text-gold font-medium">
              Daily Target: {dailyGoalMin} Focused Minutes
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-4">
            {past7Days.map((item) => (
              <div
                key={item.key}
                className={`p-3 sm:p-4 rounded-2xl border text-center transition-all ${
                  item.isToday
                    ? 'border-gold bg-gold-light/20 dark:bg-gold-dark/20 shadow-sm'
                    : item.isMet
                    ? 'border-rose-blush/40 bg-rose-soft/40 dark:bg-rose-deep/20'
                    : 'border-rose-blush/15 bg-white/40 dark:bg-plum/20'
                }`}
              >
                <span className="block text-[11px] font-semibold text-plum-light dark:text-cream-300 uppercase">
                  {item.dayName}
                </span>
                <span className="block font-serif text-lg font-bold text-plum dark:text-cream-100 my-1">
                  {item.dayNum}
                </span>
                <div className="w-5 h-5 mx-auto flex items-center justify-center">
                  {item.isMet ? (
                    <CheckCircle2 className="w-4 h-4 text-rose fill-rose-soft" />
                  ) : item.isToday ? (
                    <Clock className="w-4 h-4 text-gold" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-cream-400 dark:bg-plum-light/40" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Signature Element: The Growing Rose Garden Map ──────────────── */}
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-semibold tracking-editorial uppercase text-rose dark:text-rose-blush block mb-1">
                Curriculum Journey
              </span>
              <h3 className="font-serif text-3xl font-bold tracking-tight text-plum dark:text-cream-50">
                Hasini's Rose Garden
              </h3>
            </div>
            <p className="hidden sm:block text-xs text-plum-light dark:text-cream-300 max-w-xs text-right">
              Hasini, each completed day blooms a rose along your pathway. Complete all 21 to earn your
              Master Gardener Seal.
            </p>
          </div>

          <RoseGarden
            completedDays={completedDayNumbers}
            currentDay={nextDay}
            flexibleMode={profile.flexibleMode}
            onSelectDay={(day) => navigate({ page: 'lesson', dayId: day })}
          />
        </section>

        {/* ─── Badges & Milestone Shelf ────────────────────────────────────── */}
        <section className="p-8 rounded-3xl bg-white/50 dark:bg-plum-darkCard backdrop-blur-xl border border-rose-blush/25 shadow-rose-glow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-semibold tracking-editorial uppercase text-gold-dark dark:text-gold block mb-0.5">
                Accreditations
              </span>
              <h4 className="font-serif text-2xl font-bold text-plum dark:text-cream-50">
                Hasini's Accreditations Shelf
              </h4>
            </div>

            {completedDayNumbers.length >= 21 && (
              <button
                onClick={() => setShowCertificate(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-plum-deep font-semibold text-xs transition-all shadow-gold-glow"
              >
                <Award className="w-4 h-4" />
                View Graduation Certificate
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { days: 3, id: 'streak_3', name: '3-Day Bloom', icon: 'Sprout' },
              { days: 7, id: 'streak_7', name: '7-Day Rose', icon: 'Flame' },
              { days: 14, id: 'streak_14', name: '14-Day Bouquet', icon: 'Award' },
              { days: 21, id: 'streak_21', name: '21-Day Conquered', icon: 'Crown' },
            ].map((badgeDef) => {
              const unlockedBadge = badges.find((b) => b.id === badgeDef.id);
              const isUnlocked = Boolean(unlockedBadge);

              return (
                <button
                  key={badgeDef.id}
                  onClick={() => unlockedBadge && setSelectedMilestoneBadge(unlockedBadge)}
                  disabled={!isUnlocked}
                  className={`p-5 rounded-2xl border text-center transition-all ${
                    isUnlocked
                      ? 'bg-cream-50 dark:bg-plum-night/80 border-gold/40 shadow-gold-glow hover:scale-105 cursor-pointer'
                      : 'bg-cream-200/40 dark:bg-plum/20 border-transparent opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center ${
                      isUnlocked
                        ? 'bg-gold/20 text-gold-dark dark:text-gold'
                        : 'bg-cream-300 dark:bg-plum text-plum-light'
                    }`}
                  >
                    {badgeDef.icon === 'Crown' ? (
                      <Crown className="w-6 h-6" />
                    ) : badgeDef.icon === 'Award' ? (
                      <Award className="w-6 h-6" />
                    ) : badgeDef.icon === 'Flame' ? (
                      <Flame className="w-6 h-6" />
                    ) : (
                      <Award className="w-6 h-6" />
                    )}
                  </div>

                  <h5 className="font-serif text-sm font-bold text-plum dark:text-cream-100 mb-0.5">
                    {badgeDef.name}
                  </h5>
                  <span className="text-[10px] tracking-editorial uppercase text-plum-light dark:text-cream-300 block">
                    {isUnlocked ? 'Unlocked' : `${badgeDef.days} Days Goal`}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* Shortcut Runway Speed Drill Modal */}
      <ShortcutRunwayModal
        isOpen={showRunway}
        onClose={() => setShowRunway(false)}
      />

      {/* Instagram / Pinterest Story Studio Modal */}
      <StoryStudioModal
        isOpen={showStoryStudio}
        onClose={() => setShowStoryStudio(false)}
        defaultDay={todayLesson.day}
      />

      {/* Milestone Celebration Modal */}
      <MilestoneModal
        badge={selectedMilestoneBadge}
        onClose={() => setSelectedMilestoneBadge(null)}
        onOpenCertificate={() => setShowCertificate(true)}
      />

      {/* Graduation Certificate Modal */}
      {showCertificate && (
        <CertificateModal
          studentName={profile.name}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};
