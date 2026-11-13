import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import {
  BloomAppState,
  UserProfile,
  DayProgress,
  LessonProgress,
  Language,
  ThemeMode,
} from '../types';
import {
  loadAppState,
  saveAppState,
  getTodayKey,
  recalculateStreak,
  checkAndUnlockBadges,
} from '../lib/storage';

// ─── Action Types ───────────────────────────────────────────────────────────

type AppAction =
  | { type: 'SET_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'SET_THEME'; payload: ThemeMode }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'ADD_FOCUSED_MINUTES'; payload: { minutes: number } }
  | { type: 'MARK_LESSON_DONE'; payload: { dayId: number } }
  | { type: 'MARK_PRACTICE_DONE' }
  | { type: 'LOG_STRIKE' }
  | { type: 'LOG_PHONE_DETECTION' }
  | { type: 'RESET_SESSION_STRIKES' }
  | { type: 'SET_LESSON_PROGRESS'; payload: { dayId: number; progress: Partial<LessonProgress> } }
  | { type: 'RELOAD_STATE' };

// ─── Reducer ────────────────────────────────────────────────────────────────

function bloomReducer(state: BloomAppState, action: AppAction): BloomAppState {
  switch (action.type) {
    case 'RELOAD_STATE':
      return loadAppState();

    case 'SET_PROFILE':
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
      };

    case 'SET_THEME': {
      const next = { ...state, profile: { ...state.profile, theme: action.payload } };
      document.documentElement.setAttribute('data-theme', action.payload);
      if (action.payload === 'plum' || action.payload === 'sapphire') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    }

    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        profile: { ...state.profile, onboardingComplete: true },
      };

    case 'ADD_FOCUSED_MINUTES': {
      const todayKey = getTodayKey();
      const existing = state.days[todayKey] ?? {
        focusedMin: 0,
        lessonIdsDone: [],
        practiceDone: false,
        strikes: 0,
        phoneDetections: 0,
      };
      const updatedDay: DayProgress = {
        ...existing,
        focusedMin: existing.focusedMin + action.payload.minutes,
      };
      const updatedDays = { ...state.days, [todayKey]: updatedDay };
      const newStreak = recalculateStreak(updatedDays, state.profile.dailyGoalMin, state.streak);
      const { updatedBadges } = checkAndUnlockBadges({ ...state, streak: newStreak });
      return {
        ...state,
        days: updatedDays,
        streak: newStreak,
        badges: updatedBadges,
      };
    }

    case 'MARK_LESSON_DONE': {
      const todayKey = getTodayKey();
      const existing = state.days[todayKey] ?? {
        focusedMin: 0,
        lessonIdsDone: [],
        practiceDone: false,
        strikes: 0,
        phoneDetections: 0,
      };
      const lessonIds = existing.lessonIdsDone.includes(action.payload.dayId)
        ? existing.lessonIdsDone
        : [...existing.lessonIdsDone, action.payload.dayId];
      const updatedDays = {
        ...state.days,
        [todayKey]: { ...existing, lessonIdsDone: lessonIds },
      };
      const lesson = state.lessons[action.payload.dayId] ?? { videoProgressSec: 0, completedAt: null, language: 'english' as Language };
      const updatedLessons = {
        ...state.lessons,
        [action.payload.dayId]: { ...lesson, completedAt: new Date().toISOString() },
      };
      return { ...state, days: updatedDays, lessons: updatedLessons };
    }

    case 'MARK_PRACTICE_DONE': {
      const todayKey = getTodayKey();
      const existing = state.days[todayKey] ?? {
        focusedMin: 0,
        lessonIdsDone: [],
        practiceDone: false,
        strikes: 0,
        phoneDetections: 0,
      };
      return {
        ...state,
        days: { ...state.days, [todayKey]: { ...existing, practiceDone: true } },
      };
    }

    case 'LOG_STRIKE': {
      const todayKey = getTodayKey();
      const existing = state.days[todayKey] ?? {
        focusedMin: 0,
        lessonIdsDone: [],
        practiceDone: false,
        strikes: 0,
        phoneDetections: 0,
      };
      return {
        ...state,
        days: { ...state.days, [todayKey]: { ...existing, strikes: existing.strikes + 1 } },
      };
    }

    case 'LOG_PHONE_DETECTION': {
      const todayKey = getTodayKey();
      const existing = state.days[todayKey] ?? {
        focusedMin: 0,
        lessonIdsDone: [],
        practiceDone: false,
        strikes: 0,
        phoneDetections: 0,
      };
      return {
        ...state,
        days: {
          ...state.days,
          [todayKey]: {
            ...existing,
            strikes: existing.strikes + 1,
            phoneDetections: existing.phoneDetections + 1,
          },
        },
      };
    }

    case 'RESET_SESSION_STRIKES': {
      const todayKey = getTodayKey();
      const existing = state.days[todayKey];
      if (!existing) return state;
      return {
        ...state,
        days: { ...state.days, [todayKey]: { ...existing, strikes: 0 } },
      };
    }

    case 'SET_LESSON_PROGRESS': {
      const { dayId, progress } = action.payload;
      const existing = state.lessons[dayId] ?? { videoProgressSec: 0, completedAt: null, language: 'english' as Language };
      return {
        ...state,
        lessons: { ...state.lessons, [dayId]: { ...existing, ...progress } },
      };
    }

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: BloomAppState;
  dispatch: React.Dispatch<AppAction>;
  todayProgress: DayProgress;
  todayKey: string;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(bloomReducer, undefined, loadAppState);

  // Apply theme on mount
  useEffect(() => {
    const theme = state.profile.theme || 'rose';
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'plum' || theme === 'sapphire') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.profile.theme]);

  // Save to localStorage on every state change
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  const todayKey = getTodayKey();
  const todayProgress: DayProgress = state.days[todayKey] ?? {
    focusedMin: 0,
    lessonIdsDone: [],
    practiceDone: false,
    strikes: 0,
    phoneDetections: 0,
  };

  return (
    <AppContext.Provider value={{ state, dispatch, todayProgress, todayKey }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}

export function useProfile() {
  const { state, dispatch } = useAppState();
  const setProfile = useCallback(
    (payload: Partial<UserProfile>) => dispatch({ type: 'SET_PROFILE', payload }),
    [dispatch]
  );
  const setTheme = useCallback(
    (theme: ThemeMode) => dispatch({ type: 'SET_THEME', payload: theme }),
    [dispatch]
  );
  return { profile: state.profile, setProfile, setTheme };
}

export function useStreak() {
  const { state } = useAppState();
  return state.streak;
}

export function useTodayProgress() {
  const { todayProgress, dispatch } = useAppState();
  const addFocusedMinutes = useCallback(
    (minutes: number) => dispatch({ type: 'ADD_FOCUSED_MINUTES', payload: { minutes } }),
    [dispatch]
  );
  const markLessonDone = useCallback(
    (dayId: number) => dispatch({ type: 'MARK_LESSON_DONE', payload: { dayId } }),
    [dispatch]
  );
  const markPracticeDone = useCallback(
    () => dispatch({ type: 'MARK_PRACTICE_DONE' }),
    [dispatch]
  );
  const logStrike = useCallback(() => dispatch({ type: 'LOG_STRIKE' }), [dispatch]);
  const logPhoneDetection = useCallback(() => dispatch({ type: 'LOG_PHONE_DETECTION' }), [dispatch]);
  const resetStrikes = useCallback(() => dispatch({ type: 'RESET_SESSION_STRIKES' }), [dispatch]);

  return {
    todayProgress,
    addFocusedMinutes,
    markLessonDone,
    markPracticeDone,
    logStrike,
    logPhoneDetection,
    resetStrikes,
  };
}

export function useBadges() {
  const { state } = useAppState();
  return state.badges;
}

export function useLessonProgress(dayId: number): LessonProgress {
  const { state } = useAppState();
  return state.lessons[dayId] ?? { videoProgressSec: 0, completedAt: null, language: 'english' };
}

