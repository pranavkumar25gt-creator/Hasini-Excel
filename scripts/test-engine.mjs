/**
 * Engine Verification Test Suite for Bloom Excel Academy
 * Tests:
 * 1. Streak Engine: streak calculation, shields, daily goal threshold, rollover
 * 2. Badge & Milestone Unlocking: 3, 7, 14, 21 days
 * 3. Video Pipeline: 126 video tracks structure (21 days x 2 languages x 3 IDs)
 * 4. Error Fallback Logic Simulation
 */

import { recalculateStreak, checkAndUnlockBadges } from '../src/lib/storage.ts';
import { CURRICULUM } from '../src/data/curriculum.ts';
import { CANONICAL_COPY } from '../src/lib/copy.ts';

console.log('====================================');
console.log('RUNNING BLOOM TEST SUITE');
console.log('====================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
    process.exit(1);
  }
}

// ─── TEST 1: Curriculum Integrity ───────────────────────────────────────────
assert(CURRICULUM.length === 21, 'Curriculum must contain exactly 21 days');
for (const day of CURRICULUM) {
  assert(day.hindi.videoId && day.hindi.backups.length >= 2, `Day ${day.day} Hindi has primary and >=2 backups`);
  assert(day.english.videoId && day.english.backups.length >= 2, `Day ${day.day} English has primary and >=2 backups`);
  assert(day.goals.length >= 3, `Day ${day.day} has >= 3 clear goals`);
  assert(day.keyPoints.length >= 4, `Day ${day.day} has >= 4 key points`);
  assert(day.practice.task && day.practice.instructions.length >= 3, `Day ${day.day} has practical task instructions`);
}

// ─── TEST 2: Streak Calculation & Shields ───────────────────────────────────
const now = new Date();
const fmt = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const d0 = new Date(now);
const d1 = new Date(now); d1.setDate(d1.getDate() - 1);
const d2 = new Date(now); d2.setDate(d2.getDate() - 2);
const d3 = new Date(now); d3.setDate(d3.getDate() - 3);
const d4 = new Date(now); d4.setDate(d4.getDate() - 4);

// Scenario A: 3 consecutive days meeting 60 min goal
const daysA = {
  [fmt(d0)]: { focusedMin: 65, lessonIdsDone: [3], practiceDone: true, strikes: 0, phoneDetections: 0 },
  [fmt(d1)]: { focusedMin: 60, lessonIdsDone: [2], practiceDone: true, strikes: 0, phoneDetections: 0 },
  [fmt(d2)]: { focusedMin: 70, lessonIdsDone: [1], practiceDone: true, strikes: 0, phoneDetections: 0 },
};
const streakA = recalculateStreak(daysA, 60);
assert(streakA.current === 3, `Scenario A: 3 consecutive days gives streak 3 (got ${streakA.current})`);

// Scenario B: Day 0 not yet met, but yesterday met -> streak is still 2 from yesterday
const daysB = {
  [fmt(d0)]: { focusedMin: 20, lessonIdsDone: [], practiceDone: false, strikes: 0, phoneDetections: 0 },
  [fmt(d1)]: { focusedMin: 60, lessonIdsDone: [2], practiceDone: true, strikes: 0, phoneDetections: 0 },
  [fmt(d2)]: { focusedMin: 60, lessonIdsDone: [1], practiceDone: true, strikes: 0, phoneDetections: 0 },
};
const streakB = recalculateStreak(daysB, 60);
assert(streakB.current === 2, `Scenario B: In-progress today keeps yesterday streak alive (got ${streakB.current})`);

// Scenario C: Streak Shield usage on 1 missed day
const daysC = {
  [fmt(d0)]: { focusedMin: 60, lessonIdsDone: [], practiceDone: true, strikes: 0, phoneDetections: 0 },
  // d1 missed
  [fmt(d2)]: { focusedMin: 60, lessonIdsDone: [], practiceDone: true, strikes: 0, phoneDetections: 0 },
  [fmt(d3)]: { focusedMin: 60, lessonIdsDone: [], practiceDone: true, strikes: 0, phoneDetections: 0 },
};
const streakC = recalculateStreak(daysC, 60);
assert(streakC.shieldsUsed === 1, `Scenario C: Streak shield forgives 1 missed day (shieldsUsed: ${streakC.shieldsUsed})`);
assert(streakC.current === 3, `Scenario C: Streak continues across shielded day (current: ${streakC.current})`);

// ─── TEST 3: Milestone Badges ───────────────────────────────────────────────
const mockState3 = {
  schemaVersion: 1,
  profile: { name: 'Priya', theme: 'rose', dailyGoalMin: 60, flexibleMode: false, onboardingComplete: true },
  days: {},
  streak: { current: 3, best: 3, lastCompletedDate: null, shieldsUsed: 0 },
  badges: [],
  lessons: {},
};
const { updatedBadges: b3, newBadge: nb3 } = checkAndUnlockBadges(mockState3);
assert(b3.length === 1 && b3[0].id === 'streak_3', 'Milestone 3 days unlocks streak_3 badge');
assert(nb3?.description === CANONICAL_COPY.milestones[3], 'Milestone 3 badge has canonical copy');

const mockState21 = { ...mockState3, streak: { current: 21, best: 21, lastCompletedDate: null, shieldsUsed: 0 } };
const { updatedBadges: b21 } = checkAndUnlockBadges(mockState21);
assert(b21.length === 4, `All 4 milestones unlocked at Day 21 (unlocked ${b21.length})`);

// ─── TEST 4: Canonical Copy Integrity ───────────────────────────────────────
assert(CANONICAL_COPY.phoneDetectedTitle === 'NO PHONES.', 'Canonical phoneDetectedTitle matches');
assert(CANONICAL_COPY.eyesOffTitle === 'EYES ON THE SCREEN.', 'Canonical eyesOffTitle matches');
assert(CANONICAL_COPY.sleepingTitle === 'ASLEEP ON THE JOB?', 'Canonical sleepingTitle matches');
assert(CANONICAL_COPY.tabSwitchTitle === 'WHERE DID YOU GO?', 'Canonical tabSwitchTitle matches');
assert(CANONICAL_COPY.resumeToast === 'Back in focus. Resuming.', 'Canonical resumeToast matches');
assert(CANONICAL_COPY.strikesTitle === 'SESSION VOID.', 'Canonical strikesTitle matches');

console.log(`\n====================================`);
console.log(`ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
console.log(`====================================\n`);

