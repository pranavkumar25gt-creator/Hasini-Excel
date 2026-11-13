import React, { useState } from 'react';
import {
  ArrowLeft,
  Save,
  Download,
  Trash2,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { Header } from '../components/Header';
import { useAppState, useProfile } from '../context/AppContext';
import { AppRoute } from '../App';
import { CANONICAL_COPY } from '../lib/copy';
import { ATELIER_THEMES } from '../lib/themes';

interface SettingsPageProps {
  navigate: (route: AppRoute) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ navigate }) => {
  const { state } = useAppState();
  const { profile, setProfile, setTheme } = useProfile();

  const [name, setName] = useState<string>(profile.name);
  const [dailyGoalMin, setDailyGoalMin] = useState<number>(profile.dailyGoalMin || 60);
  const [flexibleMode, setFlexibleMode] = useState<boolean>(profile.flexibleMode || false);

  const [phoneTitle, setPhoneTitle] = useState<string>(
    profile.customCopy?.phoneDetectedTitle || CANONICAL_COPY.phoneDetectedTitle
  );
  const [phoneBody, setPhoneBody] = useState<string>(
    profile.customCopy?.phoneDetectedBody || CANONICAL_COPY.phoneDetectedBody
  );
  const [eyesTitle, setEyesTitle] = useState<string>(
    profile.customCopy?.eyesOffTitle || CANONICAL_COPY.eyesOffTitle
  );
  const [eyesBody, setEyesBody] = useState<string>(
    profile.customCopy?.eyesOffBody || CANONICAL_COPY.eyesOffBody
  );

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      name: name.trim(),
      dailyGoalMin,
      flexibleMode,
      customCopy: {
        phoneDetectedTitle: phoneTitle,
        phoneDetectedBody: phoneBody,
        eyesOffTitle: eyesTitle,
        eyesOffBody: eyesBody,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `bloom_excel_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetData = () => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset all progress, streak history, and garden blooms? This cannot be undone.'
    );
    if (confirmReset) {
      localStorage.removeItem('bloom_academy_v1');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-200 dark:bg-plum-night text-plum dark:text-cream-100 transition-colors">
      <Header navigate={navigate} activePage="settings" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-rose-blush/20 dark:border-plum-light/20">
          <button
            onClick={() => navigate({ page: 'home' })}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/60 dark:bg-plum-darkCard hover:bg-cream-300 dark:hover:bg-plum border border-rose-blush/25 dark:border-plum-light/25 text-xs font-semibold tracking-wide text-plum dark:text-cream-200 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Garden</span>
          </button>

          <span className="text-xs font-semibold tracking-editorial uppercase text-rose dark:text-rose-blush">
            Preferences & Rigor
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="p-8 rounded-3xl bg-white/70 dark:bg-plum-darkCard backdrop-blur-xl border border-rose-blush/25 shadow-editorial space-y-6">
            <h3 className="font-serif text-2xl font-bold text-plum dark:text-cream-50">
              Personal Standards
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold tracking-editorial uppercase text-plum-light dark:text-cream-300 mb-2">
                  Student Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-cream-100 dark:bg-plum-night border border-rose-blush/40 dark:border-plum-light/40 text-plum dark:text-cream-100 font-serif text-lg focus:outline-none focus:border-rose transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold tracking-editorial uppercase text-plum-light dark:text-cream-300">
                    Daily Focus Goal
                  </label>
                  <span className="font-serif font-bold text-base text-rose">
                    {dailyGoalMin} Minutes
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="90"
                  step="5"
                  value={dailyGoalMin}
                  onChange={(e) => setDailyGoalMin(Number(e.target.value))}
                  className="w-full h-2 bg-cream-300 dark:bg-plum rounded-lg appearance-none cursor-pointer accent-rose"
                />
                <span className="text-[11px] text-plum-light dark:text-cream-400 block mt-1">
                  Configurable between 40 and 90 minutes. Default is 60 minutes.
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-semibold tracking-editorial uppercase text-plum-light dark:text-cream-300">
                  Hasini's Mood Wardrobe (Atmosphere Theme)
                </label>
                <span className="text-[11px] font-mono text-plum-light dark:text-cream-400">
                  6 Editorial Palettes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ATELIER_THEMES.map((theme) => {
                  const isSelected = profile.theme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setTheme(theme.id)}
                      className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between group ${
                        isSelected
                          ? 'border-gold bg-white dark:bg-plum/60 shadow-gold-glow ring-2 ring-gold/40'
                          : 'border-cream-400/40 dark:border-plum-light/30 bg-cream-100/70 dark:bg-plum-night/50 hover:bg-white dark:hover:bg-plum-darkCard hover:border-rose-blush/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          {/* 4-dot swatch preview */}
                          <div className="flex items-center -space-x-1 p-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                            {theme.swatches.map((color, idx) => (
                              <div
                                key={idx}
                                className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/20 shadow-sm"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono uppercase bg-cream-300/60 dark:bg-plum text-plum-light dark:text-cream-300">
                              {theme.isDark ? 'Night' : 'Day'}
                            </span>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center text-gold-dark dark:text-gold">
                                <Check className="w-3 h-3 stroke-[2.5]" />
                              </div>
                            )}
                          </div>
                        </div>

                        <span className="font-serif text-sm font-bold text-plum dark:text-cream-50 block group-hover:text-rose transition-colors">
                          {theme.name}
                        </span>
                        <span className="text-[11px] text-plum-light dark:text-cream-300 block leading-tight mt-0.5">
                          {theme.subtitle}
                        </span>
                      </div>

                      <span className="text-[10px] italic text-rose-deep/80 dark:text-gold-champagne/80 mt-2 block">
                        {theme.mood}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-rose-blush/15 flex items-center justify-between">
              <div>
                <strong className="block text-sm font-bold text-plum dark:text-cream-100">
                  Flexible Curriculum Unlocking
                </strong>
                <p className="text-xs text-plum-light dark:text-cream-300 max-w-md mt-0.5">
                  Allow watching any future day without finishing preceding days first. Your streak
                  still requires reaching your daily focus goal.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={flexibleMode}
                  onChange={(e) => setFlexibleMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-cream-400 peer-focus:outline-none rounded-full peer dark:bg-plum peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose"></div>
              </label>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white/70 dark:bg-plum-darkCard backdrop-blur-xl border border-rose-blush/25 shadow-editorial space-y-6">
            <div>
              <span className="text-xs font-semibold tracking-editorial uppercase text-rose dark:text-rose-blush block mb-1">
                Custom Discipline Voice
              </span>
              <h3 className="font-serif text-2xl font-bold text-plum dark:text-cream-50">
                Coach Copy Customization
              </h3>
              <p className="text-xs text-plum-light dark:text-cream-300 mt-1">
                Zero emojis and zero sweet talk. Keep the tone sharp, minimal, and uncompromising.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-plum-light dark:text-cream-300 mb-1">
                    Phone Alert Title
                  </label>
                  <input
                    type="text"
                    value={phoneTitle}
                    onChange={(e) => setPhoneTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-plum-night border border-rose-blush/30 text-xs font-semibold focus:outline-none focus:border-rose"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-plum-light dark:text-cream-300 mb-1">
                    Phone Alert Message
                  </label>
                  <input
                    type="text"
                    value={phoneBody}
                    onChange={(e) => setPhoneBody(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-plum-night border border-rose-blush/30 text-xs focus:outline-none focus:border-rose"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-plum-light dark:text-cream-300 mb-1">
                    Eyes Off Title
                  </label>
                  <input
                    type="text"
                    value={eyesTitle}
                    onChange={(e) => setEyesTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-plum-night border border-rose-blush/30 text-xs font-semibold focus:outline-none focus:border-rose"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-plum-light dark:text-cream-300 mb-1">
                    Eyes Off Message
                  </label>
                  <input
                    type="text"
                    value={eyesBody}
                    onChange={(e) => setEyesBody(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-plum-night border border-rose-blush/30 text-xs focus:outline-none focus:border-rose"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-rose hover:bg-rose-deep text-cream-100 font-semibold text-sm transition-all shadow-rose-glow flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>

            {savedSuccess && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Preferences saved successfully</span>
              </span>
            )}
          </div>
        </form>

        <div className="p-8 rounded-3xl bg-white/50 dark:bg-plum-darkCard border border-cream-400/40 dark:border-plum-light/20 space-y-4">
          <span className="text-xs font-semibold tracking-editorial uppercase text-plum-light dark:text-cream-300 block">
            Data Portability & Resilience
          </span>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <strong className="block text-sm font-bold text-plum dark:text-cream-100">
                Backup Application Data
              </strong>
              <p className="text-xs text-plum-light dark:text-cream-300 mt-0.5">
                Download your full study logs, streak records, and badge timestamps as JSON.
              </p>
            </div>

            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cream-100 dark:bg-plum/30 hover:bg-cream-300 dark:hover:bg-plum border border-rose-blush/30 text-xs font-semibold text-plum dark:text-cream-100 transition-all shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON Backup</span>
            </button>
          </div>

          <div className="pt-4 border-t border-rose-blush/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <strong className="block text-sm font-bold text-rose">Reset All Academy Data</strong>
              <p className="text-xs text-plum-light dark:text-cream-300 mt-0.5">
                Clears localStorage and resets enrollment state back to Day 1.
              </p>
            </div>

            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose/10 hover:bg-rose/20 text-rose text-xs font-semibold transition-all shrink-0 border border-rose/30"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
