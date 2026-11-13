/**
 * BLOOM Editorial Copy & Canonical Voice System
 * Rule: Zero emojis. Zero terms of endearment.
 * Tone: Cool, confident, slightly dramatic coach — like a premium fashion brand with standards.
 */

export interface CoachCopy {
  phoneDetectedTitle: string;
  phoneDetectedBody: string;
  eyesOffTitle: string;
  eyesOffBody: string;
  sleepingTitle: string;
  sleepingBody: string;
  tabSwitchTitle: string;
  tabSwitchBody: string;
  resumeToast: string;
  strikesTitle: string;
  strikesBody: string;
  milestones: Record<number, string>;
  microcopy: string[];
}

export const CANONICAL_COPY: CoachCopy = {
  phoneDetectedTitle: 'NO PHONES.',
  phoneDetectedBody: 'Eyes on the screen. Focus for 1 hour.',
  eyesOffTitle: 'EYES ON THE SCREEN.',
  eyesOffBody: 'The lesson paused. Come back to the page.',
  sleepingTitle: 'ASLEEP ON THE JOB?',
  sleepingBody: 'The video paused. Splash some water. Resume.',
  tabSwitchTitle: 'WHERE DID YOU GO?',
  tabSwitchBody: 'The lesson is waiting.',
  resumeToast: 'Back in focus. Resuming.',
  strikesTitle: 'SESSION VOID.',
  strikesBody: "Three strikes. Focused time won't count today. Reset and try again.",
  milestones: {
    3: 'Consistency unlocked.',
    7: "One week. Most people can't.",
    14: 'Halfway. Elite zone.',
    21: 'Excel: conquered.',
  },
  microcopy: [
    'One pivot table at a time.',
    'Consistency is the cheat code.',
    'Focus is a skill. Train it.',
  ],
};

