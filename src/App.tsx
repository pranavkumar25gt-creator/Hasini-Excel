import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useAppState } from './context/AppContext';
import { SplashScreen } from './pages/SplashScreen';
import { OnboardingFlow } from './pages/OnboardingFlow';
import { HomePage } from './pages/HomePage';
import { LessonPage } from './pages/LessonPage';
import { SettingsPage } from './pages/SettingsPage';

export type AppRoute =
  | { page: 'splash' }
  | { page: 'onboarding' }
  | { page: 'home' }
  | { page: 'lesson'; dayId: number }
  | { page: 'settings' };

function AppInner() {
  const { state } = useAppState();
  const [route, setRoute] = useState<AppRoute>({ page: 'splash' });

  const navigate = useCallback((r: AppRoute) => setRoute(r), []);

  const handleSplashDone = useCallback(() => {
    if (!state.profile.onboardingComplete) {
      setRoute({ page: 'onboarding' });
    } else {
      setRoute({ page: 'home' });
    }
  }, [state.profile.onboardingComplete]);

  const pageProps = { navigate };
  const currentTheme = state.profile.theme || 'rose';

  const blobColors = {
    rose: {
      top: 'bg-[#F7B7C9]/25',
      bottom: 'bg-[#C94F7C]/15',
      center: 'bg-[#E6C79C]/10',
    },
    plum: {
      top: 'bg-[#72426C]/30',
      bottom: 'bg-[#C94F7C]/20',
      center: 'bg-[#D4AF37]/10',
    },
    sage: {
      top: 'bg-[#98B89A]/30',
      bottom: 'bg-[#6E8B70]/20',
      center: 'bg-[#C8B282]/15',
    },
    lavender: {
      top: 'bg-[#C3B3D6]/30',
      bottom: 'bg-[#8B6F96]/20',
      center: 'bg-[#DECBB7]/15',
    },
    espresso: {
      top: 'bg-[#D4A396]/25',
      bottom: 'bg-[#A25852]/20',
      center: 'bg-[#D19B4C]/15',
    },
    sapphire: {
      top: 'bg-[#1E3A8A]/35',
      bottom: 'bg-[#F0B6C8]/15',
      center: 'bg-[#F59E0B]/12',
    },
  }[currentTheme] || {
    top: 'bg-[#F7B7C9]/25',
    bottom: 'bg-[#C94F7C]/15',
    center: 'bg-[#E6C79C]/10',
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient background blobs */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 transition-colors duration-700"
        aria-hidden="true"
      >
        <div
          className={`absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full ${blobColors.top} blur-[120px] transition-colors duration-700`}
        />
        <div
          className={`absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full ${blobColors.bottom} blur-[100px] transition-colors duration-700`}
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full ${blobColors.center} blur-[80px] transition-colors duration-700`}
        />
      </div>

      {/* Page transitions */}
      <AnimatePresence mode="wait">
        {route.page === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
          >
            <SplashScreen onDone={handleSplashDone} />
          </motion.div>
        )}

        {route.page === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <OnboardingFlow {...pageProps} />
          </motion.div>
        )}

        {route.page === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <HomePage {...pageProps} />
          </motion.div>
        )}

        {route.page === 'lesson' && (
          <motion.div
            key={`lesson-${route.dayId}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="min-h-screen"
          >
            <LessonPage dayId={route.dayId} {...pageProps} />
          </motion.div>
        )}

        {route.page === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <SettingsPage {...pageProps} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
