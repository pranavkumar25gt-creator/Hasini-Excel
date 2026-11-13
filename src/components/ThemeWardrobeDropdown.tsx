import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import { useProfile } from '../context/AppContext';
import { ATELIER_THEMES, AtelierTheme } from '../lib/themes';
import { playKeyClick, playSuccessChime } from '../lib/sound';

export const ThemeWardrobeDropdown: React.FC = () => {
  const { profile, setTheme } = useProfile();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeThemeId = profile.theme || 'rose';
  const currentTheme = ATELIER_THEMES.find((t) => t.id === activeThemeId) || ATELIER_THEMES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleSelectTheme = (theme: AtelierTheme) => {
    playSuccessChime();
    setTheme(theme.id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => {
          playKeyClick();
          setIsOpen(!isOpen);
        }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-medium focus:outline-none shadow-sm ${
          isOpen
            ? 'bg-rose text-cream-100 border-rose shadow-rose-glow'
            : 'bg-white/70 dark:bg-plum/40 hover:bg-cream-300 dark:hover:bg-plum border-rose-blush/25 dark:border-plum-light/25 text-plum dark:text-cream-200'
        }`}
        title="Hasini's Mood Wardrobe (Switch Atmosphere)"
        aria-expanded={isOpen}
      >
        <Palette className="w-3.5 h-3.5 text-rose dark:text-gold-champagne" />
        <span className="hidden lg:inline">{currentTheme.name}</span>
        {/* Active Theme Color Dot */}
        <span
          className="w-2.5 h-2.5 rounded-full border border-white/40 shadow-sm"
          style={{ backgroundColor: currentTheme.swatches[1] }}
        />
      </button>

      {/* Floating Mood Wardrobe Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 w-80 sm:w-96 rounded-3xl bg-cream-100/95 dark:bg-plum-night/95 backdrop-blur-2xl border border-rose-blush/30 dark:border-plum-light/30 shadow-2xl p-4 z-50 animate-fade-in space-y-3">
          {/* Popover Masthead */}
          <div className="px-2 pt-1 pb-2 border-b border-rose-blush/20 dark:border-plum-light/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <div>
                <h4 className="font-serif text-sm font-bold text-plum dark:text-cream-50 leading-tight">
                  Hasini's Mood Wardrobe
                </h4>
                <p className="text-[10px] uppercase tracking-editorial text-rose-deep dark:text-gold-champagne">
                  Select An Atmosphere
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-plum-light dark:text-cream-300">
              6 Curated Moods
            </span>
          </div>

          {/* Theme List */}
          <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
            {ATELIER_THEMES.map((theme) => {
              const isSelected = activeThemeId === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-white dark:bg-plum/60 border-gold/50 shadow-sm ring-1 ring-gold/40'
                      : 'bg-white/40 dark:bg-plum-darkCard/40 border-rose-blush/15 dark:border-plum-light/15 hover:bg-white/70 dark:hover:bg-plum/40 hover:border-rose-blush/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* 4-color swatch preview block */}
                    <div className="flex items-center -space-x-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shrink-0">
                      {theme.swatches.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/20 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm font-bold text-plum dark:text-cream-100 group-hover:text-rose transition-colors">
                          {theme.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md font-mono uppercase bg-cream-300/60 dark:bg-plum text-plum-light dark:text-cream-300">
                          {theme.isDark ? 'Night' : 'Day'}
                        </span>
                      </div>
                      <p className="text-[11px] text-plum-light dark:text-cream-300 leading-tight">
                        {theme.subtitle}
                      </p>
                      <p className="text-[10px] italic text-rose-deep/80 dark:text-gold-champagne/80 mt-0.5">
                        {theme.mood}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold-dark dark:text-gold shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

