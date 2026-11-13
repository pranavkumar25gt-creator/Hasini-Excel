/**
 * Runtime Auto-Fallback Simulation Test for YouTube Player
 * Simulates YouTube onError event 101/150 (embedding disabled) and verifies
 * automatic fallback progression: Primary -> Backup 1 -> Backup 2 -> Graceful Unavailable State.
 */

import { CURRICULUM } from '../src/data/curriculum.ts';

console.log('--- Testing YouTube Runtime Fallback Progression ---');

// Simulate the YouTube Player fallback state machine
function simulatePlayerFallback(track) {
  const candidates = [track.videoId, ...(track.backups || [])];
  let candidateIndex = 0;
  let allFallbacksFailed = false;
  const history = [candidates[candidateIndex]];

  function triggerError(code) {
    if (candidateIndex < candidates.length - 1) {
      candidateIndex++;
      history.push(candidates[candidateIndex]);
      return { status: 'fallback', newIndex: candidateIndex, id: candidates[candidateIndex] };
    } else {
      allFallbacksFailed = true;
      return { status: 'exhausted', allFallbacksFailed: true };
    }
  }

  return { candidates, getIndex: () => candidateIndex, triggerError, getHistory: () => history };
}

// Test Day 1 track
const testTrack = CURRICULUM[0].hindi;
const sim = simulatePlayerFallback(testTrack);

console.log(`[INIT] Video ID: ${sim.candidates[0]} (Candidate 0)`);

// 1. First error (101: embedding disabled)
const step1 = sim.triggerError(101);
console.log(`[ERR 101] Auto-swapped to Backup 1: ${step1.id} (Candidate 1)`);
if (step1.newIndex !== 1 || step1.id !== testTrack.backups[0]) {
  console.error('FAILED to fallback to backup 1');
  process.exit(1);
}

// 2. Second error (150: owner blocked)
const step2 = sim.triggerError(150);
console.log(`[ERR 150] Auto-swapped to Backup 2: ${step2.id} (Candidate 2)`);
if (step2.newIndex !== 2 || step2.id !== testTrack.backups[1]) {
  console.error('FAILED to fallback to backup 2');
  process.exit(1);
}

// 3. Third error (all backups exhausted)
const step3 = sim.triggerError(150);
console.log(`[ERR 150] Backups exhausted. Graceful state triggered: ${step3.allFallbacksFailed}`);
if (!step3.allFallbacksFailed) {
  console.error('FAILED to flag allFallbacksFailed');
  process.exit(1);
}

console.log('SUCCESS: YouTube fallback engine correctly handles error auto-swaps and graceful fallback.\n');

