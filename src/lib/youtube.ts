/**
 * youtube.ts — Singleton YouTube IFrame API ready promise.
 *
 * The YouTube IFrame API script is loaded in index.html (before the app bundle).
 * When it finishes downloading it calls window.onYouTubeIframeAPIReady.
 * We capture that callback here — once — so every player instance across the app
 * can simply `await youTubeApiReady` without racing each other or clobbering
 * the global callback.
 */

// Extend the global Window type for YT
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        options: Record<string, unknown>
      ) => YTPlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  destroy: () => void;
  loadVideoById: (videoId: string, startSeconds?: number) => void;
}

/**
 * Resolves once window.YT.Player is available.
 * If the YT API script already fired (e.g., fast network), resolves immediately.
 * Otherwise waits for the global onYouTubeIframeAPIReady callback.
 */
export const youTubeApiReady: Promise<void> = new Promise<void>((resolve) => {
  // Already loaded? Resolve immediately.
  if (
    typeof window !== 'undefined' &&
    window.YT &&
    typeof window.YT.Player === 'function'
  ) {
    resolve();
    return;
  }

  // Chain onto any previously registered handler so we don't clobber it.
  const previous = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => {
    if (typeof previous === 'function') previous();
    resolve();
  };
});

