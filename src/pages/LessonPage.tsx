import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  ArrowLeft,
  Globe,
  Camera,
  FileSpreadsheet,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Keyboard,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { Header } from '../components/Header';
import { YouTubePlayer, YouTubePlayerHandle } from '../components/YouTubePlayer';
import { FocusGuardianOverlays, WebcamStatusPill } from '../components/FocusGuardianOverlays';
import { MilestoneModal } from '../components/MilestoneModal';
import { CertificateModal } from '../components/CertificateModal';
import { ShortcutRunwayModal } from '../components/ShortcutRunwayModal';
import { StoryStudioModal } from '../components/StoryStudioModal';
import { useFocusGuardian } from '../hooks/useFocusGuardian';
import { useAppState, useProfile, useTodayProgress, useLessonProgress } from '../context/AppContext';
import { CURRICULUM, getDayLesson, getTotalDays } from '../data/curriculum';
import { AppRoute } from '../App';
import { Language, Badge } from '../types';
import { checkAndUnlockBadges } from '../lib/storage';

interface LessonPageProps {
  dayId: number;
  navigate: (route: AppRoute) => void;
}

export const LessonPage: React.FC<LessonPageProps> = ({ dayId, navigate }) => {
  const { state, dispatch } = useAppState();
  const { profile } = useProfile();
  const { todayProgress, addFocusedMinutes, markLessonDone, markPracticeDone, logStrike, logPhoneDetection } = useTodayProgress();
  const lessonProgress = useLessonProgress(dayId);

  const lesson = getDayLesson(dayId) || CURRICULUM[0];
  const playerRef = useRef<YouTubePlayerHandle | null>(null);

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(lessonProgress.language || 'english');
  const activeTrack = selectedLanguage === 'hindi' ? lesson.hindi : lesson.english;

  const [activeMode, setActiveMode] = useState<'lesson' | 'practice'>('lesson');
  const [unlockedMilestone, setUnlockedMilestone] = useState<Badge | null>(null);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [showRunway, setShowRunway] = useState<boolean>(false);
  const [showStoryStudio, setShowStoryStudio] = useState<boolean>(false);
  const [copiedData, setCopiedData] = useState<boolean>(false);

  const guardian = useFocusGuardian({
    mode: activeMode,
    onPauseVideo: () => {
      playerRef.current?.pause();
    },
    onPlayVideo: () => {
      playerRef.current?.play();
    },
    onFocusedTick: (seconds) => {
      addFocusedMinutes(seconds / 60);

      const { newBadge } = checkAndUnlockBadges(state);
      if (newBadge) {
        setUnlockedMilestone(newBadge);
      }
    },
    onStrike: () => {
      logStrike();
    },
    onPhoneDetected: () => {
      logPhoneDetection();
    },
  });

  // Automatically start webcam focus guardian when entering the lesson page
  useEffect(() => {
    let isCancelled = false;
    guardian.startSession().catch((err) => {
      if (!isCancelled) {
        console.warn('Auto-start camera failed, user interaction may be needed', err);
      }
    });

    return () => {
      isCancelled = true;
      guardian.stopSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayerProgress = useCallback(
    (seconds: number) => {
      dispatch({
        type: 'SET_LESSON_PROGRESS',
        payload: {
          dayId,
          progress: { videoProgressSec: seconds, language: selectedLanguage },
        },
      });
    },
    [dayId, selectedLanguage, dispatch]
  );

  const handleCompleteLesson = () => {
    markLessonDone(dayId);
    if (dayId === 21) {
      setShowCertificate(true);
    }
  };

  const isCompleted = Boolean(lessonProgress.completedAt);
  const isPracticeDone = todayProgress.practiceDone;

  const handleCopySampleData = () => {
    if (!lesson.practice.sampleData) return;
    const text = lesson.practice.sampleData.map((row) => row.join('\t')).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-200 dark:bg-plum-night text-plum dark:text-cream-100 transition-colors">
      <Header
        navigate={navigate}
        activePage="lesson"
        onOpenRunway={() => setShowRunway(true)}
        onOpenStoryStudio={() => setShowStoryStudio(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ─── Breadcrumb & Navigation Controls ────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-blush/20 dark:border-plum-light/20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate({ page: 'home' })}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/60 dark:bg-plum-darkCard hover:bg-cream-300 dark:hover:bg-plum border border-rose-blush/25 dark:border-plum-light/25 text-xs font-semibold tracking-wide text-plum dark:text-cream-200 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Hasini's Desk</span>
            </button>

            <span className="text-xs font-semibold tracking-editorial uppercase text-rose dark:text-rose-blush">
              Hasini · Day {lesson.day} of {getTotalDays()} · {lesson.weekTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRunway(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold-dark dark:text-gold text-xs font-semibold transition-all"
              title="Shortcut Runway Warmup"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Runway Warmup</span>
            </button>

            <button
              onClick={() => setShowStoryStudio(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/60 dark:bg-plum-darkCard border border-rose-blush/25 hover:bg-cream-300 dark:hover:bg-plum text-rose-deep dark:text-rose-blush text-xs font-semibold transition-all"
              title="Generate 9:16 Story Card for Hasini"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Share Story</span>
            </button>

            <button
              onClick={() => navigate({ page: 'lesson', dayId: dayId - 1 })}
              disabled={dayId <= 1}
              className="p-2 rounded-xl bg-white/60 dark:bg-plum-darkCard disabled:opacity-30 disabled:cursor-not-allowed border border-rose-blush/25 dark:border-plum-light/25 hover:bg-cream-300 dark:hover:bg-plum transition-all"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-serif italic text-plum-light dark:text-cream-300 px-2">
              Day {dayId}
            </span>
            <button
              onClick={() => navigate({ page: 'lesson', dayId: dayId + 1 })}
              disabled={dayId >= getTotalDays()}
              className="p-2 rounded-xl bg-white/60 dark:bg-plum-darkCard disabled:opacity-30 disabled:cursor-not-allowed border border-rose-blush/25 dark:border-plum-light/25 hover:bg-cream-300 dark:hover:bg-plum transition-all"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ─── Mode Tabs: Video Lesson vs Practice Mode ────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/60 dark:bg-plum-darkCard border border-rose-blush/25">
            <button
              onClick={() => setActiveMode('lesson')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeMode === 'lesson'
                  ? 'bg-rose text-cream-100 shadow-rose-glow'
                  : 'text-plum-light dark:text-cream-300 hover:text-plum'
              }`}
            >
              Hasini's Video Lesson
            </button>
            <button
              onClick={() => setActiveMode('practice')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeMode === 'practice'
                  ? 'bg-rose text-cream-100 shadow-rose-glow'
                  : 'text-plum-light dark:text-cream-300 hover:text-plum'
              }`}
            >
              Hasini's Excel Practice Mode
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher (Hindi vs English) */}
            <div className="flex items-center rounded-2xl bg-white/60 dark:bg-plum-darkCard p-1 border border-rose-blush/25 text-xs">
              <span className="px-2 text-plum-light dark:text-cream-300 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                Track:
              </span>
              <button
                onClick={() => setSelectedLanguage('english')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  selectedLanguage === 'english'
                    ? 'bg-rose-soft text-rose-deep dark:bg-rose-deep/40 dark:text-rose-blush font-semibold'
                    : 'text-plum-light dark:text-cream-300'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setSelectedLanguage('hindi')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  selectedLanguage === 'hindi'
                    ? 'bg-rose-soft text-rose-deep dark:bg-rose-deep/40 dark:text-rose-blush font-semibold'
                    : 'text-plum-light dark:text-cream-300'
                }`}
              >
                Hindi
              </button>
            </div>

            {/* Webcam Live Status Pill */}
            <WebcamStatusPill
              isActive={guardian.isActive}
              faceDetected={guardian.faceDetected}
              eyesClosed={guardian.eyesClosed}
              strikes={guardian.strikes}
              currentVerdict={guardian.currentVerdict}
            />
          </div>
        </div>

        {/* ─── Main Content Split: Player & Live Webcam (8 cols) vs Practice & Checklist (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Player & Hasini's Live Webcam Feed */}
          <div className="lg:col-span-8 space-y-6">
            {activeMode === 'lesson' ? (
              <div className="space-y-4">
                <YouTubePlayer
                  ref={playerRef}
                  track={activeTrack}
                  initialTime={lessonProgress.videoProgressSec || 0}
                  onProgress={handlePlayerProgress}
                  onEnded={() => markLessonDone(dayId)}
                />

                <div className="flex items-center justify-between text-xs text-plum-light dark:text-cream-300 px-1">
                  <span>Instructor: {activeTrack.channel}</span>
                  <span>Target Class Duration: {activeTrack.durationApprox}</span>
                </div>
              </div>
            ) : (
              /* Practice Mode: Dedicated Focus Timer with Excel View */
              <div className="p-8 rounded-3xl bg-white/70 dark:bg-plum-darkCard backdrop-blur-xl border border-gold/40 shadow-editorial text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-gold/20 mx-auto flex items-center justify-center text-gold-dark dark:text-gold shadow-gold-glow">
                  <FileSpreadsheet className="w-8 h-8" />
                </div>

                <div className="max-w-md mx-auto">
                  <h3 className="font-serif text-2xl font-bold text-plum dark:text-cream-50 mb-2">
                    Hasini's Live Excel Practice Active
                  </h3>
                  <p className="text-xs text-plum-light dark:text-cream-300 leading-relaxed">
                    Switch freely to Microsoft Excel on your computer. The Focus Guardian continues
                    monitoring your gaze via webcam in the background. Focus minutes tick continuously
                    for Hasini.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-cream-100/60 dark:bg-plum-night/50 border border-gold/30 inline-block text-center">
                  <span className="text-[10px] tracking-editorial uppercase text-plum-light dark:text-cream-300 block mb-1">
                    Hasini's Focus Time Today
                  </span>
                  <span className="font-serif text-4xl font-bold text-plum dark:text-cream-50">
                    {todayProgress.focusedMin}m
                  </span>
                </div>
              </div>
            )}

            {/* ─── HASINI'S LIVE WEBCAM FOCUS MONITOR (Active while listening to class) ─── */}
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-plum-darkCard backdrop-blur-xl border border-rose/30 shadow-editorial space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose animate-ping" />
                  <h4 className="font-serif text-base font-bold text-plum dark:text-cream-50">
                    Hasini's Live Focus Camera
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  {guardian.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/25">
                      <Eye className="w-3.5 h-3.5" />
                      Camera Active · Guardian Watching
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                      Camera Standby
                    </span>
                  )}

                  <span className="text-xs font-mono font-semibold text-rose px-2.5 py-1 rounded-full bg-rose/10">
                    {guardian.strikes}/3 Strikes
                  </span>
                </div>
              </div>

              {/* Dedicated Viewfinder Frame */}
              <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-plum-deep border border-gold/30 shadow-inner flex items-center justify-center">
                {/* Real-time Video Stream */}
                <video
                  ref={guardian.videoRef}
                  playsInline
                  muted
                  autoPlay
                  className={`w-full h-full object-cover -scale-x-100 transition-opacity duration-500 ${
                    guardian.isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Viewfinder Luxury Corner Reticles */}
                <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-t-2 border-l-2 border-gold rounded-tl-lg" />
                    <div className="w-6 h-6 border-t-2 border-r-2 border-gold rounded-tr-lg" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-b-2 border-l-2 border-gold rounded-bl-lg" />
                    <div className="w-6 h-6 border-b-2 border-r-2 border-gold rounded-br-lg" />
                  </div>
                </div>

                {/* Overlay: Live status badge inside viewfinder */}
                {guardian.isActive && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-plum-night/85 backdrop-blur-md text-[11px] font-mono font-semibold text-cream-100 border border-gold/30">
                    <span className="w-2 h-2 rounded-full bg-rose animate-pulse" />
                    <span>HASINI · LIVE FEED</span>
                  </div>
                )}

                {guardian.isActive && (
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-medium text-cream-200">
                    <div className="px-3 py-1 rounded-full bg-plum-night/85 backdrop-blur-md border border-rose-blush/20">
                      {guardian.faceDetected ? (
                        guardian.eyesClosed ? (
                          <span className="text-amber-400">Eyes Closed · Stay Alert</span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">Gaze Locked on Screen</span>
                        )
                      ) : (
                        <span className="text-rose-blush">Searching for Hasini's Face</span>
                      )}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-plum-night/85 backdrop-blur-md border border-rose-blush/20 text-[10px] text-gold-champagne uppercase tracking-wider">
                      100% Local Inference · Private
                    </div>
                  </div>
                )}

                {/* State: Models loading */}
                {guardian.isLoadingModels && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-plum-deep/95 text-cream-100 p-6 text-center">
                    <RefreshCw className="w-8 h-8 text-rose-blush animate-spin mb-3" />
                    <h5 className="font-serif text-base font-bold mb-1">
                      Initializing Hasini's Focus Guardian
                    </h5>
                    <p className="text-xs text-gold-champagne/80 font-mono">
                      {guardian.loadingStep || 'Calibrating neural face landmarker...'}
                    </p>
                  </div>
                )}

                {/* State: Camera Inactive / Permission required */}
                {!guardian.isActive && !guardian.isLoadingModels && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-plum-deep/95 text-cream-100 p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose/20 flex items-center justify-center text-rose-blush">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="font-serif text-lg font-bold">
                        Hasini's Webcam Monitor Standby
                      </h5>
                      <p className="text-xs text-cream-300 max-w-sm mt-1">
                        Bloom requires your webcam stream to verify focus and safeguard your 21-day streak.
                      </p>
                    </div>
                    {guardian.permissionError && (
                      <div className="text-xs text-rose font-medium max-w-sm">
                        {guardian.permissionError}
                      </div>
                    )}
                    <button
                      onClick={() => guardian.startSession()}
                      className="px-6 py-3 rounded-2xl bg-rose hover:bg-rose-deep text-cream-100 font-semibold text-xs transition-all shadow-rose-glow flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Turn On Camera & Start Class</span>
                    </button>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-plum-light dark:text-cream-300 leading-relaxed">
                Hasini, keep your eyes on the lesson. If your gaze leaves the screen for two consecutive
                evaluations, or if you pick up a phone, the video pauses automatically.
              </p>
            </div>

            {/* Key Architectural Notes from Curriculum */}
            <div className="p-6 rounded-3xl bg-white/60 dark:bg-plum-darkCard backdrop-blur-xl border border-rose-blush/25 shadow-sm space-y-4">
              <h4 className="font-serif text-lg font-bold text-plum dark:text-cream-50">
                Key Architectural Takeaways for Hasini
              </h4>
              <ul className="space-y-2.5">
                {lesson.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs text-plum dark:text-cream-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose mt-1.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Practice Mission & Completion Gate (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-plum-darkCard backdrop-blur-xl border border-rose/30 shadow-editorial space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-editorial uppercase text-rose dark:text-rose-blush">
                  Hasini's Practice Mission
                </span>
                <span className="text-xs text-plum-light dark:text-cream-300">
                  Target: 15m drill
                </span>
              </div>

              <div>
                <h4 className="font-serif text-xl font-bold text-plum dark:text-cream-50 mb-2">
                  {lesson.practice.task}
                </h4>
                <div className="space-y-1 mb-4 text-xs text-plum-light dark:text-cream-300 leading-relaxed">
                  {lesson.practice.instructions.map((step, sIdx) => (
                    <p key={sIdx}>• {step}</p>
                  ))}
                </div>

                {/* Sample Data Table (if provided) */}
                {lesson.practice.sampleData && (
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-plum dark:text-cream-200">
                        Companion Raw Data
                      </span>
                      <button
                        onClick={handleCopySampleData}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-rose hover:text-rose-deep"
                      >
                        {copiedData ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedData ? 'Copied' : 'Copy for Excel'}</span>
                      </button>
                    </div>

                    <div className="max-h-36 overflow-auto rounded-xl border border-rose-blush/25 bg-cream-50 dark:bg-plum-night/60 p-2 text-[11px] font-mono">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-rose-blush/20 text-plum-light dark:text-cream-300">
                            {lesson.practice.sampleData[0]?.map((col, idx) => (
                              <th key={idx} className="p-1 font-semibold">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {lesson.practice.sampleData.slice(1).map((row, r) => (
                            <tr key={r} className="border-b border-rose-blush/10 text-plum dark:text-cream-200">
                              {row.map((cell, c) => (
                                <td key={c} className="p-1 truncate max-w-[80px]">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-cream-100/70 dark:bg-plum/30 border border-gold/30 cursor-pointer hover:border-gold transition-all">
                <input
                  type="checkbox"
                  checked={isPracticeDone}
                  onChange={markPracticeDone}
                  className="w-4 h-4 rounded text-rose focus:ring-rose accent-rose"
                />
                <span className="text-xs font-semibold text-plum dark:text-cream-100">
                  I verified this practice task in Excel
                </span>
              </label>

              <button
                onClick={handleCompleteLesson}
                className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all shadow-rose-glow flex items-center justify-center gap-2 ${
                  isCompleted
                    ? 'bg-emerald-600 text-cream-100 shadow-md'
                    : 'bg-rose hover:bg-rose-deep text-cream-100'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{isCompleted ? 'Day Bloomed & Completed' : 'Mark Day Complete for Hasini'}</span>
              </button>

              {isCompleted && (
                <button
                  onClick={() => setShowStoryStudio(true)}
                  className="w-full py-3 rounded-2xl bg-cream-100 dark:bg-plum hover:bg-cream-200 text-plum dark:text-cream-100 font-semibold text-xs border border-rose-blush/30 transition-all flex items-center justify-center gap-2"
                >
                  <Camera className="w-3.5 h-3.5 text-rose" />
                  <span>Generate Hasini's Story Card</span>
                </button>
              )}
            </div>

            <div className="p-6 rounded-3xl bg-white/60 dark:bg-plum-darkCard backdrop-blur-xl border border-rose-blush/25 shadow-sm space-y-3">
              <span className="text-xs font-semibold tracking-editorial uppercase text-plum-light dark:text-cream-300 block">
                Hasini's Focus Accumulator
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-3xl font-bold text-plum dark:text-cream-50">
                  {todayProgress.focusedMin}m
                </span>
                <span className="text-xs text-plum-light dark:text-cream-300">
                  Goal: {profile.dailyGoalMin || 60}m
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-cream-300 dark:bg-plum overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose to-gold transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (todayProgress.focusedMin / (profile.dailyGoalMin || 60)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <FocusGuardianOverlays
        activeOverlay={guardian.activeOverlay}
        strikes={guardian.strikes}
        resumeToastVisible={guardian.resumeToastVisible}
        onDismissPhone={guardian.dismissPhoneModal}
        onResetStrikes={guardian.resetStrikesAndRetry}
        customCopy={profile.customCopy}
      />

      {/* Shortcut Runway Modal */}
      <ShortcutRunwayModal
        isOpen={showRunway}
        onClose={() => setShowRunway(false)}
      />

      {/* Story Studio Modal */}
      <StoryStudioModal
        isOpen={showStoryStudio}
        onClose={() => setShowStoryStudio(false)}
        defaultDay={dayId}
      />

      <MilestoneModal
        badge={unlockedMilestone}
        onClose={() => setUnlockedMilestone(null)}
        onOpenCertificate={() => setShowCertificate(true)}
      />

      {showCertificate && (
        <CertificateModal
          studentName={profile.name || 'Hasini'}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};
