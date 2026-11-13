import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { AlertCircle, ExternalLink, RefreshCw, ShieldCheck } from 'lucide-react';
import { VideoTrack } from '../types';
import { youTubeApiReady, YTPlayer } from '../lib/youtube';

export interface YouTubePlayerHandle {
  play: () => void;
  pause: () => void;
  getCurrentTime: () => number;
  seekTo: (seconds: number) => void;
  isPlaying: () => boolean;
}

interface YouTubePlayerProps {
  track: VideoTrack;
  initialTime?: number;
  onProgress?: (seconds: number) => void;
  onEnded?: () => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
}

export const YouTubePlayer = forwardRef<YouTubePlayerHandle, YouTubePlayerProps>(
  ({ track, initialTime = 0, onProgress, onEnded, onPlayStateChange, className = '' }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YTPlayer | null>(null);
    const progressIntervalRef = useRef<number | null>(null);

    // Current candidate video index: 0 = primary, 1 = backup 1, 2 = backup 2
    const [candidateIndex, setCandidateIndex] = useState<number>(0);
    const [allFallbacksFailed, setAllFallbacksFailed] = useState<boolean>(false);
    const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
    const [isPlayingState, setIsPlayingState] = useState<boolean>(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const candidates = [track.videoId, ...(track.backups || [])];
    const currentVideoId = candidates[candidateIndex] || track.videoId;

    // Reset when track changes
    useEffect(() => {
      setCandidateIndex(0);
      setAllFallbacksFailed(false);
      setLoadError(null);
    }, [track.videoId]);

    // ─── Progress tracking ────────────────────────────────────────────────────

    const stopProgressTracking = useCallback(() => {
      if (progressIntervalRef.current !== null) {
        window.clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }, []);

    const startProgressTracking = useCallback(() => {
      stopProgressTracking();
      progressIntervalRef.current = window.setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          try {
            const time = playerRef.current.getCurrentTime();
            if (typeof time === 'number' && !isNaN(time)) {
              onProgress?.(Math.floor(time));
            }
          } catch {
            // Ignore transient errors during state transition
          }
        }
      }, 1000);
    }, [onProgress, stopProgressTracking]);

    // ─── YT event handlers ────────────────────────────────────────────────────

    const handleStateChange = useCallback(
      (event: { data: number }) => {
        const state = event.data;
        if (state === 1 /* PLAYING */) {
          setIsPlayingState(true);
          onPlayStateChange?.(true);
          startProgressTracking();
        } else {
          setIsPlayingState(false);
          onPlayStateChange?.(false);
          stopProgressTracking();
          if (state === 0 /* ENDED */) {
            onEnded?.();
          }
        }
      },
      [onPlayStateChange, onEnded, startProgressTracking, stopProgressTracking]
    );

    const handleError = useCallback(
      (event: { data: number }) => {
        const errorCode = event.data;
        console.warn(`[YouTubePlayer] error ${errorCode} on video ID: ${currentVideoId}`);
        if (candidateIndex < candidates.length - 1) {
          const nextIndex = candidateIndex + 1;
          console.info(
            `[YouTubePlayer] Auto-swapping to backup #${nextIndex}: ${candidates[nextIndex]}`
          );
          setCandidateIndex(nextIndex);
        } else {
          setAllFallbacksFailed(true);
          setLoadError('Video embedding restricted by owner. You can watch directly on YouTube.');
        }
      },
      [candidateIndex, candidates, currentVideoId]
    );

    // ─── Player initialisation ────────────────────────────────────────────────
    //
    // We await the singleton `youTubeApiReady` promise (from src/lib/youtube.ts).
    // The YT script is loaded in index.html BEFORE the app bundle, so in most cases
    // the promise is already resolved by the time this effect runs.

    useEffect(() => {
      let isMounted = true;
      setIsPlayerReady(false);

      youTubeApiReady.then(() => {
        if (!isMounted || !containerRef.current) return;

        // Destroy any previous player instance
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch {
            // Ignore
          }
          playerRef.current = null;
        }

        // Create a fresh div target so the YT Player can own the DOM node
        const playerId = `yt-player-${Math.random().toString(36).substring(2, 9)}`;
        const playerDiv = document.createElement('div');
        playerDiv.id = playerId;
        playerDiv.style.width = '100%';
        playerDiv.style.height = '100%';
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(playerDiv);

        try {
          playerRef.current = new window.YT.Player(playerId, {
            videoId: currentVideoId,
            playerVars: {
              autoplay: 0,
              rel: 0,
              modestbranding: 1,
              cc_load_policy: 1,
              playsinline: 1,
              start: Math.floor(initialTime),
            },
            events: {
              onReady: () => {
                if (isMounted) {
                  setIsPlayerReady(true);
                  setLoadError(null);
                }
              },
              onStateChange: handleStateChange,
              onError: handleError,
            },
          });
        } catch (err) {
          console.error('[YouTubePlayer] Failed to instantiate YT.Player', err);
          if (isMounted) {
            setLoadError('Could not load the YouTube player.');
          }
        }
      });

      return () => {
        isMounted = false;
        stopProgressTracking();
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch {
            // Ignore
          }
          playerRef.current = null;
        }
      };
      // Re-run when the video ID changes (track swap or fallback cascade)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentVideoId]);

    // ─── Imperative handle for Focus Guardian ─────────────────────────────────

    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          try {
            playerRef.current?.playVideo();
          } catch (e) {
            console.warn('[YouTubePlayer] playVideo failed', e);
          }
        },
        pause: () => {
          try {
            playerRef.current?.pauseVideo();
          } catch (e) {
            console.warn('[YouTubePlayer] pauseVideo failed', e);
          }
        },
        getCurrentTime: () => {
          try {
            return playerRef.current?.getCurrentTime() ?? 0;
          } catch {
            return 0;
          }
        },
        seekTo: (seconds: number) => {
          try {
            playerRef.current?.seekTo(seconds, true);
          } catch (e) {
            console.warn('[YouTubePlayer] seekTo failed', e);
          }
        },
        isPlaying: () => isPlayingState,
      }),
      [isPlayingState]
    );

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
      <div
        className={`relative w-full aspect-video bg-plum-deep rounded-2xl overflow-hidden border border-rose-blush/25 shadow-editorial ${className}`}
      >
        {/* YT Player mounts here */}
        <div ref={containerRef} className="w-full h-full" />

        {/* Loading state */}
        {!isPlayerReady && !allFallbacksFailed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-plum-deep text-cream-200 pointer-events-none">
            <RefreshCw className="w-8 h-8 text-rose-blush animate-spin mb-3" />
            <p className="font-serif text-lg tracking-wide text-cream-100">
              Preparing editorial lesson...
            </p>
            <p className="text-xs uppercase tracking-editorial text-gold-champagne/80 mt-1">
              {track.channel} · {track.durationApprox}
            </p>
          </div>
        )}

        {/* All fallbacks exhausted */}
        {allFallbacksFailed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-plum-night text-cream-100 p-6 text-center">
            <AlertCircle className="w-10 h-10 text-rose mb-3" />
            <h4 className="font-serif text-xl mb-1">Video Stream Protected</h4>
            <p className="text-sm text-cream-300 max-w-md mb-4">
              {loadError || 'This lesson video cannot be embedded directly in the player frame.'}
            </p>
            <a
              href={`https://www.youtube.com/watch?v=${track.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose text-cream-100 font-medium text-sm hover:bg-rose-deep transition-all shadow-rose-glow"
            >
              Open on YouTube
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Backup indicator pill */}
        {candidateIndex > 0 && !allFallbacksFailed && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-plum-night/85 backdrop-blur-md text-[11px] font-medium text-gold-champagne border border-gold/30">
            <ShieldCheck className="w-3 h-3 text-gold" />
            Auto-swapped to backup #{candidateIndex}
          </div>
        )}
      </div>
    );
  }
);

YouTubePlayer.displayName = 'YouTubePlayer';
