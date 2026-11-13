import { CoachCopy } from '../lib/copy';

export type Language = 'hindi' | 'english';
export type ThemeMode = 'rose' | 'plum' | 'sage' | 'lavender' | 'espresso' | 'sapphire';

export interface VideoTrack {
  videoId: string;
  backups: string[];
  channel: string;
  durationApprox: string;
}

export interface PracticeTask {
  task: string;
  instructions: string[];
  sampleData?: string[][];
  expectedOutcome: string;
}

export interface DayLesson {
  day: number;
  title: string;
  subtitle: string;
  week: number;
  weekTitle: string;
  goals: string[];
  hindi: VideoTrack;
  english: VideoTrack;
  keyPoints: string[];
  practice: PracticeTask;
}

export interface DayProgress {
  focusedMin: number;
  lessonIdsDone: number[];
  practiceDone: boolean;
  strikes: number;
  phoneDetections: number;
}

export interface StreakState {
  current: number;
  best: number;
  lastCompletedDate: string | null;
  shieldsUsed: number; // max 2
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
  iconName: string;
}

export interface LessonProgress {
  videoProgressSec: number;
  completedAt: string | null;
  language: Language;
}

export interface UserProfile {
  name: string;
  theme: ThemeMode;
  dailyGoalMin: number; // 40-90, default 60
  flexibleMode: boolean;
  onboardingComplete: boolean;
  customCopy?: Partial<CoachCopy>;
}

export interface BloomAppState {
  schemaVersion: number;
  profile: UserProfile;
  days: Record<string, DayProgress>; // yyyy-mm-dd
  streak: StreakState;
  badges: Badge[];
  lessons: Record<number, LessonProgress>;
}

export type FocusVerdict = 'focused' | 'eyes-off' | 'phone-visible' | 'asleep' | 'away';

export interface GuardianSignals {
  faceDetected: boolean;
  eyesClosed: boolean;
  pitch: number; // degrees: up/down
  yaw: number;   // degrees: left/right
  phoneDetected: boolean;
  phoneScore: number;
  timestamp: number;
}

export interface GuardianVerdictHistory {
  verdict: FocusVerdict;
  timestamp: number;
}

