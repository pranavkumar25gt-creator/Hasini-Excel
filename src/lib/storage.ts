import { BloomAppState, DayProgress, StreakState, Badge, UserProfile } from '../types';
import { CANONICAL_COPY } from './copy';

const STORAGE_KEY = 'bloom_academy_v1';
const CURRENT_SCHEMA_VERSION = 1;

export function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Hasini',
  theme: 'rose',
  dailyGoalMin: 60,
  flexibleMode: false,
  onboardingComplete: false,
};

const DEFAULT_STATE: BloomAppState = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  profile: DEFAULT_PROFILE,
  days: {},
  streak: {
    current: 0,
    best: 0,
    lastCompletedDate: null,
    shieldsUsed: 0,
  },
  badges: [],
  lessons: {},
};

export function recalculateStreak(
  days: Record<string, DayProgress>,
  dailyGoalMin: number,
  existingStreak?: StreakState
): StreakState {
  const todayKey = getTodayKey();
  const sortedDates = Object.keys(days).sort();
  
  if (sortedDates.length === 0) {
    return {
      current: 0,
      best: existingStreak?.best || 0,
      lastCompletedDate: null,
      shieldsUsed: existingStreak?.shieldsUsed || 0,
    };
  }

  // Find all dates where focusedMin >= dailyGoalMin
  const completedDateSet = new Set<string>();
  for (const [dateKey, dayData] of Object.entries(days)) {
    if (dayData.focusedMin >= dailyGoalMin) {
      completedDateSet.add(dateKey);
    }
  }

  // Calculate current streak walking backward from today or yesterday
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Check if today is completed
  const isTodayCompleted = completedDateSet.has(todayKey);
  
  let checkDate = new Date(today);
  if (!isTodayCompleted) {
    // If today is not yet completed, the streak could still be alive from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
  }

  let streakCount = 0;
  let shieldsLeft = 2 - (existingStreak?.shieldsUsed || 0);
  let shieldsUsedThisRun = existingStreak?.shieldsUsed || 0;
  let lastCompletedDate: string | null = null;

  // Walk backwards up to 365 days
  for (let i = 0; i < 365; i++) {
    const key = formatDateKey(checkDate);
    if (completedDateSet.has(key)) {
      streakCount++;
      if (!lastCompletedDate) {
        lastCompletedDate = key;
      }
    } else {
      // Only bridge with a streak shield if there is an earlier completed date to bridge to
      const hasPriorCompleted = Array.from(completedDateSet).some((d) => d < key);
      if (shieldsLeft > 0 && i > 0 && hasPriorCompleted) {
        shieldsLeft--;
        shieldsUsedThisRun++;
      } else {
        break;
      }
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Re-check best streak
  const bestStreak = Math.max(existingStreak?.best || 0, streakCount);

  return {
    current: streakCount,
    best: bestStreak,
    lastCompletedDate,
    shieldsUsed: Math.min(2, shieldsUsedThisRun),
  };
}

export const MILESTONE_DEFINITIONS: Array<{ days: number; id: string; name: string; description: string; icon: string }> = [
  { days: 3, id: 'streak_3', name: '3-Day Bloom', description: CANONICAL_COPY.milestones[3], icon: 'Sprout' },
  { days: 7, id: 'streak_7', name: '7-Day Rose', description: CANONICAL_COPY.milestones[7], icon: 'Flame' },
  { days: 14, id: 'streak_14', name: '14-Day Bouquet', description: CANONICAL_COPY.milestones[14], icon: 'Award' },
  { days: 21, id: 'streak_21', name: '21-Day Master Gardener', description: CANONICAL_COPY.milestones[21], icon: 'Crown' },
];

export function checkAndUnlockBadges(state: BloomAppState): { updatedBadges: Badge[]; newBadge: Badge | null } {
  const currentStreak = state.streak.current;
  const existingBadgeIds = new Set(state.badges.map((b) => b.id));
  const updatedBadges = [...state.badges];
  let newBadge: Badge | null = null;

  for (const def of MILESTONE_DEFINITIONS) {
    if (currentStreak >= def.days && !existingBadgeIds.has(def.id)) {
      const badge: Badge = {
        id: def.id,
        name: def.name,
        description: def.description,
        unlockedAt: new Date().toISOString(),
        iconName: def.icon,
      };
      updatedBadges.push(badge);
      if (!newBadge) {
        newBadge = badge;
      }
    }
  }

  return { updatedBadges, newBadge };
}

export function loadAppState(): BloomAppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_STATE;
    }
    const parsed = JSON.parse(raw);
    if (parsed.schemaVersion !== CURRENT_SCHEMA_VERSION) {
      // Future migrations go here
    }
    
    // Recalculate streak to ensure consistency across calendar dates
    const recomputedStreak = recalculateStreak(
      parsed.days || {},
      parsed.profile?.dailyGoalMin || 60,
      parsed.streak
    );

    return {
      ...DEFAULT_STATE,
      ...parsed,
      profile: {
        ...DEFAULT_PROFILE,
        ...parsed.profile,
        name: parsed.profile?.name && parsed.profile.name.trim() !== '' ? parsed.profile.name : 'Hasini',
      },
      streak: recomputedStreak,
    };
  } catch (err) {
    console.error('Failed to load bloom state, falling back to default', err);
    return DEFAULT_STATE;
  }
}

export function saveAppState(state: BloomAppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save bloom state', err);
  }
}

export function getTodayProgress(state: BloomAppState): DayProgress {
  const key = getTodayKey();
  return (
    state.days[key] || {
      focusedMin: 0,
      lessonIdsDone: [],
      practiceDone: false,
      strikes: 0,
      phoneDetections: 0,
    }
  );
}

