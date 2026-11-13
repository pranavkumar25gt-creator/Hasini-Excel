import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Keyboard,
  RotateCcw,
  Trophy,
  X,
  Timer,
} from 'lucide-react';
import { playKeyClick, playSuccessChime, playMilestoneBell } from '../lib/sound';

export interface ShortcutItem {
  id: string;
  name: string;
  category: 'Editing' | 'Formatting' | 'Navigation' | 'Formulas';
  description: string;
  winKeys: string[];
  macKeys: string[];
  // Key matcher function: checks event
  matches: (e: KeyboardEvent, isMac: boolean) => boolean;
}

export const SHORTCUTS_CATALOG: ShortcutItem[] = [
  {
    id: 'flash_fill',
    name: 'Flash Fill',
    category: 'Editing',
    description: 'Instantly detects pattern and populates the remaining column cells.',
    winKeys: ['Ctrl', 'E'],
    macKeys: ['Cmd', 'E'],
    matches: (e, isMac) => (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'e',
  },
  {
    id: 'create_table',
    name: 'Create Official Table',
    category: 'Formatting',
    description: 'Converts selected range into a structured Excel table with sorting and total rows.',
    winKeys: ['Ctrl', 'T'],
    macKeys: ['Cmd', 'T'],
    matches: (e, isMac) => (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 't',
  },
  {
    id: 'autosum',
    name: 'Instant AutoSum',
    category: 'Formulas',
    description: 'Inserts the SUM formula for adjacent contiguous numbers above or to the left.',
    winKeys: ['Alt', '='],
    macKeys: ['Option', 'Cmd', '='],
    matches: (e, isMac) =>
      isMac
        ? (e.metaKey && e.altKey && (e.key === '=' || e.key === '+'))
        : (e.altKey && (e.key === '=' || e.key === '+')),
  },
  {
    id: 'toggle_filters',
    name: 'Toggle AutoFilters',
    category: 'Navigation',
    description: 'Applies or clears drop-down filter arrows on headers in a single stroke.',
    winKeys: ['Ctrl', 'Shift', 'L'],
    macKeys: ['Cmd', 'Shift', 'F'],
    matches: (e, isMac) =>
      isMac
        ? e.metaKey && e.shiftKey && e.key.toLowerCase() === 'f'
        : e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l',
  },
  {
    id: 'format_cells',
    name: 'Format Cells Palette',
    category: 'Formatting',
    description: 'Invokes the full formatting dossier (currency, alignment, borders, font).',
    winKeys: ['Ctrl', '1'],
    macKeys: ['Cmd', '1'],
    matches: (e, isMac) => (isMac ? e.metaKey : e.ctrlKey) && (e.key === '1' || e.code === 'Digit1'),
  },
  {
    id: 'insert_date',
    name: 'Current Date Stamp',
    category: 'Editing',
    description: 'Permanently writes today’s date into the selected cell.',
    winKeys: ['Ctrl', ';'],
    macKeys: ['Cmd', ';'],
    matches: (e, isMac) => (isMac ? e.metaKey : e.ctrlKey) && (e.key === ';' || e.code === 'Semicolon'),
  },
  {
    id: 'currency_format',
    name: 'Apply Currency Format',
    category: 'Formatting',
    description: 'Instantly applies standard two-decimal financial currency formatting.',
    winKeys: ['Ctrl', 'Shift', '$'],
    macKeys: ['Ctrl', 'Shift', '$'],
    matches: (e) => (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === '$' || e.code === 'Digit4'),
  },
  {
    id: 'select_column',
    name: 'Select Entire Column',
    category: 'Navigation',
    description: 'Highlights all 1,048,576 rows in the current active column.',
    winKeys: ['Ctrl', 'Space'],
    macKeys: ['Ctrl', 'Space'],
    matches: (e) => (e.ctrlKey || e.metaKey) && (e.key === ' ' || e.code === 'Space'),
  },
  {
    id: 'select_row',
    name: 'Select Entire Row',
    category: 'Navigation',
    description: 'Highlights all 16,384 columns in the current active row.',
    winKeys: ['Shift', 'Space'],
    macKeys: ['Shift', 'Space'],
    matches: (e) => e.shiftKey && !e.ctrlKey && !e.metaKey && (e.key === ' ' || e.code === 'Space'),
  },
  {
    id: 'select_all',
    name: 'Select Data Region',
    category: 'Navigation',
    description: 'Instantly selects all contiguous cells within the active data boundary.',
    winKeys: ['Ctrl', 'A'],
    macKeys: ['Cmd', 'A'],
    matches: (e, isMac) => (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'a',
  },
  {
    id: 'toggle_absolute',
    name: 'Toggle Absolute Reference ($)',
    category: 'Formulas',
    description: 'Cycles formula references between $A$1, A$1, $A1, and A1.',
    winKeys: ['F4'],
    macKeys: ['Cmd', 'T'],
    matches: (e, isMac) =>
      isMac
        ? (e.metaKey && e.key.toLowerCase() === 't') || e.key === 'F4'
        : e.key === 'F4',
  },
  {
    id: 'edit_cell',
    name: 'In-Cell Formula Editor',
    category: 'Editing',
    description: 'Enters direct cell editing mode with cursor placed at the formula end.',
    winKeys: ['F2'],
    macKeys: ['Ctrl', 'U'],
    matches: (e, isMac) =>
      isMac
        ? (e.ctrlKey && e.key.toLowerCase() === 'u') || e.key === 'F2'
        : e.key === 'F2',
  },
];

interface ShortcutRunwayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutRunwayModal: React.FC<ShortcutRunwayModalProps> = ({ isOpen, onClose }) => {
  // Detect OS platform
  const [isMac, setIsMac] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && navigator.platform) {
      return /Mac|iPhone|iPod|iPad/i.test(navigator.platform);
    }
    return false;
  });

  const [sprintList, setSprintList] = useState<ShortcutItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [drillCompleted, setDrillCompleted] = useState<boolean>(false);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [lastReflexMs, setLastReflexMs] = useState<number | null>(null);
  const [pressedKeysVisual, setPressedKeysVisual] = useState<string[]>([]);
  const [isSuccessFlash, setIsSuccessFlash] = useState<boolean>(false);

  const startTimeRef = useRef<number>(Date.now());

  // Shuffle and set up a 7-shortcut runway sprint
  const initSprint = useCallback(() => {
    const shuffled = [...SHORTCUTS_CATALOG].sort(() => 0.5 - Math.random()).slice(0, 7);
    setSprintList(shuffled);
    setCurrentIndex(0);
    setDrillCompleted(false);
    setReactionTimes([]);
    setLastReflexMs(null);
    setPressedKeysVisual([]);
    setIsSuccessFlash(false);
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (isOpen) {
      initSprint();
    }
  }, [isOpen, initSprint]);

  const currentShortcut = sprintList[currentIndex];

  // Global key listener for the active sprint
  useEffect(() => {
    if (!isOpen || drillCompleted || !currentShortcut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disregard standalone modifier keys for scoring
      if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
        playKeyClick();
        return;
      }

      // Check if matches the active shortcut
      const isMatch = currentShortcut.matches(e, isMac);

      if (isMatch) {
        // Intercept standard browser actions (e.g. Ctrl+T new tab, Ctrl+1 tab switch)
        e.preventDefault();
        e.stopPropagation();

        const elapsed = Date.now() - startTimeRef.current;
        playSuccessChime();
        setLastReflexMs(elapsed);
        setIsSuccessFlash(true);

        const newTimes = [...reactionTimes, elapsed];
        setReactionTimes(newTimes);

        setTimeout(() => {
          setIsSuccessFlash(false);
          if (currentIndex + 1 < sprintList.length) {
            setCurrentIndex(currentIndex + 1);
            startTimeRef.current = Date.now();
          } else {
            setDrillCompleted(true);
            playMilestoneBell();
          }
        }, 400);
      } else {
        // Wrong key combination
        playKeyClick();
        const activeKeys: string[] = [];
        if (e.ctrlKey) activeKeys.push('Ctrl');
        if (e.metaKey) activeKeys.push('Cmd');
        if (e.altKey) activeKeys.push('Alt');
        if (e.shiftKey) activeKeys.push('Shift');
        if (e.key && !['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
          activeKeys.push(e.key.toUpperCase());
        }
        setPressedKeysVisual(activeKeys);
        setTimeout(() => setPressedKeysVisual([]), 600);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isOpen, drillCompleted, currentShortcut, currentIndex, sprintList, isMac, reactionTimes]);

  if (!isOpen) return null;

  const targetKeys = currentShortcut ? (isMac ? currentShortcut.macKeys : currentShortcut.winKeys) : [];
  const averageMs =
    reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;

  const getReflexRating = (ms: number) => {
    if (ms < 750) return { label: 'Haute Cadence', tone: 'text-gold' };
    if (ms < 1400) return { label: 'Sharp & Poised', tone: 'text-rose' };
    return { label: 'Methodical Pace', tone: 'text-plum-light dark:text-cream-300' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum-night/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-cream-100 dark:bg-plum-darkCard rounded-3xl border border-rose-blush/30 dark:border-plum-light/30 shadow-editorial overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-rose-blush/20 dark:border-plum-light/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold/20 flex items-center justify-center text-gold-dark dark:text-gold">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-plum dark:text-cream-50 leading-tight">
                The Shortcut Runway
              </h3>
              <p className="text-[10px] font-semibold tracking-editorial uppercase text-rose-deep dark:text-gold-champagne">
                Keyboard Speed & Muscle Memory Drill
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* OS Platform Switcher */}
            <div className="flex items-center rounded-xl bg-cream-200/80 dark:bg-plum/40 p-1 border border-rose-blush/25 text-xs font-medium">
              <button
                onClick={() => setIsMac(false)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  !isMac
                    ? 'bg-white dark:bg-plum text-plum dark:text-cream-100 shadow-sm font-semibold'
                    : 'text-plum-light dark:text-cream-300 hover:text-plum'
                }`}
              >
                Windows
              </button>
              <button
                onClick={() => setIsMac(true)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  isMac
                    ? 'bg-white dark:bg-plum text-plum dark:text-cream-100 shadow-sm font-semibold'
                    : 'text-plum-light dark:text-cream-300 hover:text-plum'
                }`}
              >
                macOS
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-plum-light hover:text-plum dark:text-cream-300 dark:hover:text-cream-100 hover:bg-cream-200 dark:hover:bg-plum transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-8">
          {!drillCompleted && currentShortcut ? (
            <div className="space-y-8">
              {/* Progress & Category strip */}
              <div className="flex items-center justify-between text-xs">
                <span className="px-3 py-1 rounded-full bg-rose-soft text-rose-deep dark:bg-rose-deep/30 dark:text-rose-blush font-semibold tracking-editorial uppercase">
                  {currentShortcut.category}
                </span>

                <div className="flex items-center gap-2 font-mono text-xs text-plum-light dark:text-cream-300">
                  <span>Drill {currentIndex + 1} of {sprintList.length}</span>
                  <div className="w-24 h-1.5 rounded-full bg-cream-300 dark:bg-plum overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose to-gold transition-all duration-300"
                      style={{ width: `${((currentIndex) / sprintList.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Headline Card */}
              <div
                className={`p-8 rounded-3xl border transition-all duration-300 text-center relative overflow-hidden ${
                  isSuccessFlash
                    ? 'bg-emerald-500/10 border-emerald-500 shadow-gold-glow scale-[1.02]'
                    : 'bg-white/70 dark:bg-plum-night/50 border-rose-blush/30 dark:border-plum-light/30 shadow-sm'
                }`}
              >
                <span className="text-[11px] font-semibold tracking-editorial uppercase text-plum-light dark:text-gold-champagne block mb-2">
                  Execute This Command
                </span>

                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-plum dark:text-cream-50 mb-3 tracking-tight">
                  {currentShortcut.name}
                </h2>

                <p className="text-sm text-plum-light dark:text-cream-200 max-w-md mx-auto leading-relaxed">
                  {currentShortcut.description}
                </p>

                {/* Last reaction speed indicator */}
                {lastReflexMs !== null && (
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-100 dark:bg-plum text-xs font-mono font-semibold text-gold-dark dark:text-gold border border-gold/30">
                    <Timer className="w-3.5 h-3.5 text-gold" />
                    <span>{lastReflexMs}ms · {getReflexRating(lastReflexMs).label}</span>
                  </div>
                )}
              </div>

              {/* Target Keycap Display */}
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs uppercase tracking-editorial text-plum-light dark:text-cream-300 font-semibold">
                  Press The Key Combination On Your Keyboard
                </span>

                <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                  {targetKeys.map((key, kIndex) => (
                    <React.Fragment key={kIndex}>
                      <div
                        className={`min-w-[64px] px-4 py-3 rounded-2xl border-2 flex items-center justify-center font-mono text-base font-bold transition-all shadow-md ${
                          isSuccessFlash
                            ? 'bg-emerald-500 text-white border-emerald-400'
                            : 'bg-white dark:bg-plum border-rose-blush/40 dark:border-gold/30 text-plum dark:text-cream-50'
                        }`}
                      >
                        {key}
                      </div>
                      {kIndex < targetKeys.length - 1 && (
                        <span className="text-plum-light dark:text-cream-300 font-bold text-lg">+</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Wrong key sequence detector helper */}
                {pressedKeysVisual.length > 0 && !isSuccessFlash && (
                  <div className="mt-2 text-xs font-mono text-rose dark:text-rose-blush animate-shake">
                    Detected: {pressedKeysVisual.join(' + ')} (Awaiting target combo)
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Sprint Complete Dossier */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-gold/20 mx-auto flex items-center justify-center text-gold-dark dark:text-gold shadow-gold-glow">
                <Trophy className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-semibold tracking-editorial uppercase text-rose dark:text-rose-blush">
                  Sprint Complete
                </span>
                <h3 className="font-serif text-3xl font-extrabold text-plum dark:text-cream-50 mt-1">
                  Atelier Reflex Confirmed
                </h3>
                <p className="text-sm text-plum-light dark:text-cream-300 mt-1">
                  7 critical Excel shortcuts executed in pure muscle memory.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="p-4 rounded-2xl bg-white/60 dark:bg-plum/30 border border-gold/30">
                  <span className="text-[10px] tracking-editorial uppercase text-plum-light dark:text-cream-300 block mb-1">
                    Mean Pace
                  </span>
                  <span className="font-mono text-2xl font-bold text-plum dark:text-cream-50">
                    {(averageMs / 1000).toFixed(2)}s
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/60 dark:bg-plum/30 border border-gold/30">
                  <span className="text-[10px] tracking-editorial uppercase text-plum-light dark:text-cream-300 block mb-1">
                    Fastest
                  </span>
                  <span className="font-mono text-2xl font-bold text-gold-dark dark:text-gold">
                    {reactionTimes.length > 0 ? (Math.min(...reactionTimes) / 1000).toFixed(2) : 0}s
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/60 dark:bg-plum/30 border border-gold/30">
                  <span className="text-[10px] tracking-editorial uppercase text-plum-light dark:text-cream-300 block mb-1">
                    Accuracy
                  </span>
                  <span className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    100%
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-4">
                <button
                  onClick={initSprint}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose hover:bg-rose-deep text-cream-100 font-semibold text-sm transition-all shadow-rose-glow"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Run Another Sprint</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-cream-200 dark:bg-plum text-plum dark:text-cream-200 font-semibold text-sm hover:bg-cream-300 transition-all border border-rose-blush/25"
                >
                  Return to Desk
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
