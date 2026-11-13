import { useState, useEffect, useRef, useCallback } from 'react';
import { loadVisionModels, extractEulerAngles, extractBlinkScore, VisionModels } from '../lib/vision';
import { FocusVerdict } from '../types';

export interface UseFocusGuardianOptions {
  mode: 'lesson' | 'practice';
  onPauseVideo?: () => void;
  onPlayVideo?: () => void;
  onFocusedTick?: (seconds: number) => void;
  onStrike?: () => void;
  onPhoneDetected?: () => void;
}

export interface GuardianStatus {
  isActive: boolean;
  isLoadingModels: boolean;
  loadingStep: string;
  cameraPermissionGranted: boolean;
  permissionError: string | null;
  currentVerdict: FocusVerdict;
  activeOverlay: 'phone' | 'eyes-off' | 'sleeping' | 'tab' | 'strikes' | null;
  sessionVoided: boolean;
  strikes: number;
  faceDetected: boolean;
  eyesClosed: boolean;
  phoneScore: number;
  pitch: number;
  yaw: number;
  resumeToastVisible: boolean;
  isPracticing: boolean;
}

export function useFocusGuardian({
  mode,
  onPauseVideo,
  onPlayVideo,
  onFocusedTick,
  onStrike,
  onPhoneDetected,
}: UseFocusGuardianOptions) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const [currentVerdict, setCurrentVerdict] = useState<FocusVerdict>('focused');
  const [activeOverlay, setActiveOverlay] = useState<'phone' | 'eyes-off' | 'sleeping' | 'tab' | 'strikes' | null>(null);
  const [sessionVoided, setSessionVoided] = useState<boolean>(false);
  const [strikes, setStrikes] = useState<number>(0);

  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [eyesClosed, setEyesClosed] = useState<boolean>(false);
  const [phoneScore, setPhoneScore] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(0);
  const [yaw, setYaw] = useState<number>(0);
  const [resumeToastVisible, setResumeToastVisible] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const visionModelsRef = useRef<VisionModels | null>(null);
  const wakeLockRef = useRef<any>(null);

  // Tracking timestamps and consecutive counters
  const lastEyesClosedStartRef = useRef<number | null>(null);
  const consecutiveEyesOffVerdictsRef = useRef<number>(0);
  const consecutiveFocusedVerdictsRef = useRef<number>(0);
  const phoneCooldownRef = useRef<number>(0);
  const lastTabHiddenTimeRef = useRef<number | null>(null);

  // 10-second rolling sample buffer
  const sampleBufferRef = useRef<Array<{
    faceDetected: boolean;
    eyesClosed: boolean;
    pitch: number;
    yaw: number;
    phoneDetected: boolean;
    timestamp: number;
  }>>([]);

  const loopAnimFrameRef = useRef<number | null>(null);
  const cocoIntervalRef = useRef<number | null>(null);
  const verdictIntervalRef = useRef<number | null>(null);
  const focusTickerRef = useRef<number | null>(null);

  // ─── Wake Lock ─────────────────────────────────────────────────────────────
  const requestWakeLock = useCallback(async () => {
    if ('wakeLock' in navigator && !wakeLockRef.current) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      } catch (err) {
        console.warn('Wake Lock request failed', err);
      }
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    if (wakeLockRef.current) {
      try {
        wakeLockRef.current.release();
      } catch {
        // Ignore
      }
      wakeLockRef.current = null;
    }
  }, []);

  // ─── Pause & Resume Triggers ───────────────────────────────────────────────
  const triggerPause = useCallback(
    (reason: 'phone' | 'eyes-off' | 'sleeping' | 'tab' | 'strikes') => {
      setActiveOverlay(reason);
      onPauseVideo?.();
    },
    [onPauseVideo]
  );

  const triggerResume = useCallback(() => {
    setActiveOverlay(null);
    setResumeToastVisible(true);
    setTimeout(() => setResumeToastVisible(false), 2500);
    onPlayVideo?.();
  }, [onPlayVideo]);

  // ─── Stop Camera Stream ───────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    releaseWakeLock();
  }, [releaseWakeLock]);

  // ─── Tab Visibility Listener ───────────────────────────────────────────────
  useEffect(() => {
    if (!isActive || sessionVoided) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        lastTabHiddenTimeRef.current = Date.now();
        // If in practice mode, switching to Excel is permitted!
        if (mode === 'lesson') {
          setTimeout(() => {
            if (document.hidden && isActive) {
              triggerPause('tab');
            }
          }, 3000);
        }
      } else {
        lastTabHiddenTimeRef.current = null;
        if (activeOverlay === 'tab') {
          triggerResume();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, sessionVoided, mode, activeOverlay, triggerPause, triggerResume]);

  // ─── Start Session ─────────────────────────────────────────────────────────
  const startSession = useCallback(async () => {
    setIsLoadingModels(true);
    setPermissionError(null);

    try {
      // 1. Request camera stream
      setLoadingStep('Requesting local camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraPermissionGranted(true);

      // 2. Load Vision Models
      const models = await loadVisionModels((step) => setLoadingStep(step));
      visionModelsRef.current = models;

      // 3. Acquire wake lock
      await requestWakeLock();

      setIsLoadingModels(false);
      setIsActive(true);
      setActiveOverlay(null);
      setSessionVoided(false);
      consecutiveEyesOffVerdictsRef.current = 0;
      consecutiveFocusedVerdictsRef.current = 0;
    } catch (err: any) {
      console.error('Focus Guardian failed to start', err);
      setIsLoadingModels(false);
      setCameraPermissionGranted(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError('Camera permission was denied. Bloom requires camera access to verify your focus.');
      } else {
        setPermissionError('Could not initialize local camera. Check device settings and reload.');
      }
      stopCamera();
    }
  }, [requestWakeLock, stopCamera]);

  // Ensure video element always binds to stream as soon as DOM element is ready
  useEffect(() => {
    if (videoRef.current && streamRef.current && videoRef.current.srcObject !== streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  });

  // ─── Stop Session ──────────────────────────────────────────────────────────
  const stopSession = useCallback(() => {
    setIsActive(false);
    setActiveOverlay(null);
    stopCamera();

    if (loopAnimFrameRef.current) {
      cancelAnimationFrame(loopAnimFrameRef.current);
      loopAnimFrameRef.current = null;
    }
    if (cocoIntervalRef.current) {
      window.clearInterval(cocoIntervalRef.current);
      cocoIntervalRef.current = null;
    }
    if (verdictIntervalRef.current) {
      window.clearInterval(verdictIntervalRef.current);
      verdictIntervalRef.current = null;
    }
    if (focusTickerRef.current) {
      window.clearInterval(focusTickerRef.current);
      focusTickerRef.current = null;
    }
  }, [stopCamera]);

  // ─── Focused Time Accumulator (Integrity Rule) ────────────────────────────
  // Focused minutes tick ONLY while:
  // (video is playing OR practice mode is active) AND latest verdict is "focused" AND no overlay is active
  useEffect(() => {
    if (!isActive || sessionVoided || activeOverlay !== null || currentVerdict !== 'focused') {
      if (focusTickerRef.current) {
        window.clearInterval(focusTickerRef.current);
        focusTickerRef.current = null;
      }
      return;
    }

    focusTickerRef.current = window.setInterval(() => {
      onFocusedTick?.(1); // 1 second
    }, 1000);

    return () => {
      if (focusTickerRef.current) {
        window.clearInterval(focusTickerRef.current);
        focusTickerRef.current = null;
      }
    };
  }, [isActive, sessionVoided, activeOverlay, currentVerdict, onFocusedTick]);

  // ─── FaceLandmarker Continuous Loop ───────────────────────────────────────
  useEffect(() => {
    if (!isActive || !visionModelsRef.current || !videoRef.current || sessionVoided) {
      return;
    }

    const videoEl = videoRef.current;
    const landmarker = visionModelsRef.current.faceLandmarker;
    let isRunning = true;

    const processFrame = () => {
      if (!isRunning || !videoEl || videoEl.readyState < 2) {
        loopAnimFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      try {
        const now = performance.now();
        const results = landmarker.detectForVideo(videoEl, now);

        if (results && results.faceLandmarks && results.faceLandmarks.length > 0) {
          setFaceDetected(true);

          // Blink score
          const blink = extractBlinkScore(results.faceBlendshapes);
          const isBlinkingOrClosed = blink > 0.45;
          setEyesClosed(isBlinkingOrClosed);

          // Sleep check: eyes closed continuously > 3s
          const wallNow = Date.now();
          if (isBlinkingOrClosed) {
            if (!lastEyesClosedStartRef.current) {
              lastEyesClosedStartRef.current = wallNow;
            } else if (wallNow - lastEyesClosedStartRef.current >= 3000) {
              // Asleep!
              if (activeOverlay !== 'sleeping' && activeOverlay !== 'phone' && activeOverlay !== 'strikes') {
                setCurrentVerdict('asleep');
                triggerPause('sleeping');
              }
            }
          } else {
            lastEyesClosedStartRef.current = null;
          }

          // Head pose Euler angles
          let curPitch = 0;
          let curYaw = 0;
          if (results.facialTransformationMatrixes && results.facialTransformationMatrixes.length > 0) {
            const angles = extractEulerAngles(results.facialTransformationMatrixes[0].data);
            curPitch = angles.pitch;
            curYaw = angles.yaw;
            setPitch(curPitch);
            setYaw(curYaw);
          }

          // Record in 10s sample buffer
          sampleBufferRef.current.push({
            faceDetected: true,
            eyesClosed: isBlinkingOrClosed,
            pitch: curPitch,
            yaw: curYaw,
            phoneDetected: false,
            timestamp: wallNow,
          });
        } else {
          // No face in frame
          setFaceDetected(false);
          setEyesClosed(false);
          sampleBufferRef.current.push({
            faceDetected: false,
            eyesClosed: false,
            pitch: 0,
            yaw: 0,
            phoneDetected: false,
            timestamp: Date.now(),
          });
        }
      } catch (err) {
        console.warn('Frame detection error', err);
      }

      loopAnimFrameRef.current = requestAnimationFrame(processFrame);
    };

    loopAnimFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      isRunning = false;
      if (loopAnimFrameRef.current) {
        cancelAnimationFrame(loopAnimFrameRef.current);
        loopAnimFrameRef.current = null;
      }
    };
  }, [isActive, sessionVoided, activeOverlay, triggerPause]);

  // ─── Object Detection (coco-ssd) runs every 2s ────────────────────────────
  useEffect(() => {
    if (!isActive || !visionModelsRef.current || !videoRef.current || sessionVoided) {
      return;
    }

    const coco = visionModelsRef.current.cocoModel;
    const videoEl = videoRef.current;

    cocoIntervalRef.current = window.setInterval(async () => {
      if (!videoEl || videoEl.readyState < 2) return;

      try {
        const predictions = await coco.detect(videoEl);
        const phonePrediction = predictions.find(
          (p) => (p.class === 'cell phone' || p.class === 'remote') && p.score > 0.50
        );

        if (phonePrediction) {
          const score = phonePrediction.score;
          setPhoneScore(score);
          const now = Date.now();

          // Prevent double trigger within 5 seconds
          if (now - phoneCooldownRef.current > 5000) {
            phoneCooldownRef.current = now;
            onPhoneDetected?.();
            onStrike?.();

            setStrikes((prev) => {
              const nextStrikes = prev + 1;
              if (nextStrikes >= 3) {
                setSessionVoided(true);
                triggerPause('strikes');
              } else {
                triggerPause('phone');
              }
              return nextStrikes;
            });
          }
        } else {
          setPhoneScore(0);
        }
      } catch (err) {
        console.warn('coco-ssd detection error', err);
      }
    }, 2000);

    return () => {
      if (cocoIntervalRef.current) {
        window.clearInterval(cocoIntervalRef.current);
        cocoIntervalRef.current = null;
      }
    };
  }, [isActive, sessionVoided, onPhoneDetected, onStrike, triggerPause]);

  // ─── 10-Second Verdict Loop ────────────────────────────────────────────────
  useEffect(() => {
    if (!isActive || sessionVoided) return;

    verdictIntervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const tenSecsAgo = now - 10000;

      // Filter sample buffer to last 10s
      const recentSamples = sampleBufferRef.current.filter((s) => s.timestamp >= tenSecsAgo);
      sampleBufferRef.current = recentSamples;

      if (recentSamples.length === 0) return;

      // Evaluate signals over last 10s:
      // Count face presence and off-screen gaze
      let facePresentCount = 0;
      let eyesOffCount = 0;

      for (const sample of recentSamples) {
        if (sample.faceDetected) {
          facePresentCount++;
          // Yaw threshold: > 24 degrees left/right; Pitch threshold: > 20 degrees up/down
          if (Math.abs(sample.yaw) > 24 || Math.abs(sample.pitch) > 20) {
            eyesOffCount++;
          }
        }
      }

      const facePresenceRatio = facePresentCount / recentSamples.length;
      const eyesOffRatio = facePresentCount > 0 ? eyesOffCount / facePresentCount : 1;

      // Check if eyes are off screen (no face > 40% of time OR gaze deviated > 45% of time)
      const isFailingGaze = facePresenceRatio < 0.6 || eyesOffRatio > 0.45;

      if (isFailingGaze) {
        consecutiveEyesOffVerdictsRef.current += 1;
        consecutiveFocusedVerdictsRef.current = 0;

        // Two consecutive failing verdicts -> pause video + EYES ON THE SCREEN overlay
        if (consecutiveEyesOffVerdictsRef.current >= 2) {
          setCurrentVerdict('eyes-off');
          if (activeOverlay !== 'phone' && activeOverlay !== 'sleeping' && activeOverlay !== 'strikes') {
            triggerPause('eyes-off');
          }
        }
      } else {
        // Good focus in this 10s block
        consecutiveEyesOffVerdictsRef.current = 0;
        consecutiveFocusedVerdictsRef.current += 1;

        // If recovering from eyes-off overlay: auto-resume 1s after focus re-confirmed
        if (activeOverlay === 'eyes-off') {
          setCurrentVerdict('focused');
          setTimeout(() => {
            triggerResume();
          }, 1000);
        } else if (activeOverlay === 'sleeping') {
          // Sleeping overlay requires 2 consecutive focused verdicts to resume
          if (consecutiveFocusedVerdictsRef.current >= 2) {
            setCurrentVerdict('focused');
            triggerResume();
          }
        } else if (!activeOverlay) {
          setCurrentVerdict('focused');
        }
      }
    }, 10000);

    return () => {
      if (verdictIntervalRef.current) {
        window.clearInterval(verdictIntervalRef.current);
        verdictIntervalRef.current = null;
      }
    };
  }, [isActive, sessionVoided, activeOverlay, triggerPause, triggerResume]);

  // Dismiss phone modal explicitly
  const dismissPhoneModal = useCallback(() => {
    if (activeOverlay === 'phone') {
      setActiveOverlay(null);
      triggerResume();
    }
  }, [activeOverlay, triggerResume]);

  // Reset 3 strikes session void screen
  const resetStrikesAndRetry = useCallback(() => {
    setStrikes(0);
    setSessionVoided(false);
    setActiveOverlay(null);
    consecutiveEyesOffVerdictsRef.current = 0;
    consecutiveFocusedVerdictsRef.current = 0;
    triggerResume();
  }, [triggerResume]);

  return {
    isActive,
    isLoadingModels,
    loadingStep,
    cameraPermissionGranted,
    permissionError,
    currentVerdict,
    activeOverlay,
    sessionVoided,
    strikes,
    faceDetected,
    eyesClosed,
    phoneScore,
    pitch,
    yaw,
    resumeToastVisible,
    videoRef,
    startSession,
    stopSession,
    dismissPhoneModal,
    resetStrikesAndRetry,
  };
}

