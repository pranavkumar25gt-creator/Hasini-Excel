import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Camera,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useProfile, useAppState } from '../context/AppContext';
import { AppRoute } from '../App';
import { loadVisionModels } from '../lib/vision';
import { ThemeMode } from '../types';
import { ATELIER_THEMES } from '../lib/themes';

interface OnboardingFlowProps {
  navigate: (route: AppRoute) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ navigate }) => {
  const { profile, setProfile, setTheme } = useProfile();
  const { dispatch } = useAppState();

  const [step, setStep] = useState<number>(1);
  const [nameInput, setNameInput] = useState<string>(profile.name || 'Hasini');

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [trackingConfirmed, setTrackingConfirmed] = useState<boolean>(false);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);
  const [modelStep, setModelStep] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setProfile({ name: nameInput.trim() });
    setStep(2);
  };

  const handleThemeSelect = (theme: ThemeMode) => {
    setTheme(theme);
    setProfile({ theme });
    setStep(3);
  };

  const startCameraTest = async () => {
    setCameraError(null);
    setIsLoadingModels(true);
    setModelStep('Requesting camera stream...');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);

      const models = await loadVisionModels((msg) => setModelStep(msg));
      setIsLoadingModels(false);

      const videoEl = videoRef.current;
      const canvasEl = canvasRef.current;
      const landmarker = models.faceLandmarker;

      const detectFrame = () => {
        if (!videoEl || videoEl.readyState < 2) {
          animFrameRef.current = requestAnimationFrame(detectFrame);
          return;
        }

        const now = performance.now();
        const results = landmarker.detectForVideo(videoEl, now);

        if (canvasEl) {
          const ctx = canvasEl.getContext('2d');
          if (ctx) {
            canvasEl.width = videoEl.videoWidth || 640;
            canvasEl.height = videoEl.videoHeight || 480;
            ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

            if (results && results.faceLandmarks && results.faceLandmarks.length > 0) {
              setTrackingConfirmed(true);

              const landmarks = results.faceLandmarks[0];
              let minX = 1, minY = 1, maxX = 0, maxY = 0;
              for (const pt of landmarks) {
                if (pt.x < minX) minX = pt.x;
                if (pt.y < minY) minY = pt.y;
                if (pt.x > maxX) maxX = pt.x;
                if (pt.y > maxY) maxY = pt.y;
              }

              const boxX = minX * canvasEl.width;
              const boxY = minY * canvasEl.height;
              const boxW = (maxX - minX) * canvasEl.width;
              const boxH = (maxY - minY) * canvasEl.height;

              ctx.strokeStyle = '#D4AF37';
              ctx.lineWidth = 3;
              const cornerLen = 20;

              // Top-left
              ctx.beginPath();
              ctx.moveTo(boxX, boxY + cornerLen);
              ctx.lineTo(boxX, boxY);
              ctx.lineTo(boxX + cornerLen, boxY);
              ctx.stroke();

              // Top-right
              ctx.beginPath();
              ctx.moveTo(boxX + boxW - cornerLen, boxY);
              ctx.lineTo(boxX + boxW, boxY);
              ctx.lineTo(boxX + boxW, boxY + cornerLen);
              ctx.stroke();

              // Bottom-left
              ctx.beginPath();
              ctx.moveTo(boxX, boxY + boxH - cornerLen);
              ctx.lineTo(boxX, boxY + boxH);
              ctx.lineTo(boxX + cornerLen, boxY + boxH);
              ctx.stroke();

              // Bottom-right
              ctx.beginPath();
              ctx.moveTo(boxX + boxW - cornerLen, boxY + boxH);
              ctx.lineTo(boxX + boxW, boxY + boxH);
              ctx.lineTo(boxX + boxW, boxY + boxH - cornerLen);
              ctx.stroke();
            }
          }
        }

        animFrameRef.current = requestAnimationFrame(detectFrame);
      };

      animFrameRef.current = requestAnimationFrame(detectFrame);
    } catch (err: any) {
      console.error('Camera test error', err);
      setIsLoadingModels(false);
      setCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError(
          'Camera access was denied. Please allow camera permissions in your browser address bar to proceed.'
        );
      } else {
        setCameraError('Unable to access webcam. Please check your camera connection.');
      }
    }
  };

  const handleFinishOnboarding = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    dispatch({ type: 'COMPLETE_ONBOARDING' });
    navigate({ page: 'lesson', dayId: 1 });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-cream-200 dark:bg-plum-night">
      <div className="max-w-xl w-full">
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === step
                  ? 'w-10 bg-rose'
                  : s < step
                  ? 'w-6 bg-gold'
                  : 'w-6 bg-cream-400 dark:bg-plum-light/30'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 sm:p-10 rounded-3xl bg-white/70 dark:bg-plum-darkCard backdrop-blur-xl border border-rose-blush/30 shadow-editorial text-center"
            >
              <span className="text-xs font-semibold tracking-editorial uppercase text-rose dark:text-rose-blush mb-2 block">
                Private Enrollment
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-plum dark:text-cream-50 mb-3">
                Curated for Hasini
              </h2>
              <p className="text-sm text-plum-light dark:text-cream-300 max-w-sm mx-auto mb-8">
                Welcome, Hasini. Your private 21-day Excel curriculum and daily Focus Guardian are prepared.
              </p>

              <form onSubmit={handleNameSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-cream-100 dark:bg-plum-night border border-rose-blush/40 dark:border-plum-light/40 text-plum dark:text-cream-100 text-center font-serif text-xl focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 transition-all placeholder:text-plum-light/40"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={!nameInput.trim()}
                  className="w-full py-4 rounded-2xl bg-rose hover:bg-rose-deep text-cream-100 font-semibold text-sm transition-all shadow-rose-glow tracking-wide disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 sm:p-10 rounded-3xl bg-white/70 dark:bg-plum-darkCard backdrop-blur-xl border border-rose-blush/30 shadow-editorial text-center"
            >
              <span className="text-xs font-semibold tracking-editorial uppercase text-rose dark:text-rose-blush mb-2 block">
                Enrollment · Part 2
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-plum dark:text-cream-50 mb-3">
                Select your atmosphere
              </h2>
              <p className="text-sm text-plum-light dark:text-cream-300 max-w-sm mx-auto mb-6">
                Choose the visual aesthetic for your daily study ritual. Hasini can change this anytime from the mood wardrobe in the top bar.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-h-[340px] overflow-y-auto pr-1">
                {ATELIER_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => handleThemeSelect(theme.id)}
                    className="p-4 rounded-2xl border border-rose-blush/30 dark:border-plum-light/30 bg-cream-100/70 dark:bg-plum-night/60 text-left hover:scale-[1.02] hover:border-gold transition-all shadow-sm flex flex-col justify-between"
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

                        <span className="text-[9px] px-1.5 py-0.5 rounded font-mono uppercase bg-cream-300/60 dark:bg-plum text-plum-light dark:text-cream-300">
                          {theme.isDark ? 'Night' : 'Day'}
                        </span>
                      </div>

                      <h4 className="font-serif text-base font-bold text-plum dark:text-cream-100 mb-0.5">
                        {theme.name}
                      </h4>
                      <p className="text-[11px] text-plum-light dark:text-cream-300 leading-tight">
                        {theme.subtitle}
                      </p>
                    </div>

                    <p className="text-[10px] italic text-rose-deep/80 dark:text-gold-champagne/80 mt-2">
                      {theme.mood}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 sm:p-10 rounded-3xl bg-white/70 dark:bg-plum-darkCard backdrop-blur-xl border border-rose-blush/30 shadow-editorial text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gold/15 flex items-center justify-center mx-auto mb-4 text-gold-dark dark:text-gold">
                <Camera className="w-7 h-7" />
              </div>

              <span className="text-xs font-semibold tracking-editorial uppercase text-rose dark:text-rose-blush mb-2 block">
                Focus Guardian Calibration
              </span>
              <h2 className="font-serif text-3xl font-bold text-plum dark:text-cream-50 mb-3">
                Bloom watches the room
              </h2>

              <p className="text-sm text-plum-light dark:text-cream-300 max-w-md mx-auto leading-relaxed mb-6">
                To count your daily streak, the Focus Guardian evaluates your presence every 10
                seconds. No phones. Eyes on the lesson.
              </p>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-cream-300/50 dark:bg-plum/30 border border-gold/30 text-left mb-6">
                <ShieldCheck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div className="text-xs text-plum dark:text-cream-200 leading-relaxed">
                  <strong className="block font-semibold mb-0.5 text-plum dark:text-cream-100">
                    100% On-Device Privacy Guarantee
                  </strong>
                  Your camera stream is processed strictly in your local browser using WASM neural
                  models. Frames are never recorded, uploaded, or transmitted anywhere.
                </div>
              </div>

              {!cameraActive ? (
                <div>
                  {cameraError && (
                    <div className="p-4 rounded-2xl bg-rose-soft/40 border border-rose text-rose-deep text-xs mb-4">
                      {cameraError}
                    </div>
                  )}

                  <button
                    onClick={startCameraTest}
                    disabled={isLoadingModels}
                    className="w-full py-4 rounded-2xl bg-plum dark:bg-cream-100 hover:bg-plum-deep dark:hover:bg-cream-200 text-cream-100 dark:text-plum font-semibold text-sm transition-all shadow-editorial flex items-center justify-center gap-2"
                  >
                    {isLoadingModels ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-rose-blush dark:text-rose" />
                        <span>{modelStep || 'Starting Guardian...'}</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        <span>Enable Camera & Test Tracking</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-plum-night border border-gold/40 shadow-editorial">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full pointer-events-none scale-x-[-1]"
                    />

                    <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-plum-night/85 backdrop-blur-md border border-gold/30 text-xs">
                      {trackingConfirmed ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="font-semibold text-emerald-300">
                            Tracking Confirmed
                          </span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 text-gold animate-spin" />
                          <span className="text-gold-champagne">Aligning face...</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleFinishOnboarding}
                    className="w-full py-4 rounded-2xl bg-rose hover:bg-rose-deep text-cream-100 font-semibold text-sm transition-all shadow-rose-glow tracking-wide flex items-center justify-center gap-2"
                  >
                    <span>Begin Day 1: Setup & Interface Tour</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
