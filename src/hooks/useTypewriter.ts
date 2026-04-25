/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * USE TYPEWRITER — Word-by-word text reveal hook
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import type { CoachMessage } from '../types/oracle';

export interface UseTypewriterResult {
  /** The partially revealed text */
  displayedText: string;
  /** Whether the typewriter is currently active */
  isRevealing: boolean;
  /** The message currently being revealed (null when done) */
  revealedMessage: CoachMessage | null;
  /** Start revealing a message word-by-word */
  start: (msg: CoachMessage, speedMs: number, onComplete?: (msg: CoachMessage) => void) => void;
  /** Stop the typewriter immediately */
  stop: () => void;
}

export function useTypewriter(): UseTypewriterResult {
  const [displayedText, setDisplayedText] = useState('');
  const [revealedMessage, setRevealedMessage] = useState<CoachMessage | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(
    (msg: CoachMessage, speedMs: number, onComplete?: (msg: CoachMessage) => void) => {
      stop();
      setRevealedMessage(msg);
      const words = msg.text.split(/(\s+)/);
      setDisplayedText(words[0] || '');
      let i = 1;
      timerRef.current = setInterval(() => {
        i++;
        setDisplayedText(words.slice(0, i).join(''));
        if (i >= words.length) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setRevealedMessage(null);
          onComplete?.(msg);
        }
      }, speedMs);
    },
    [stop]
  );

  // Clean up on unmount
  useEffect(() => () => stop(), [stop]);

  return {
    displayedText,
    isRevealing: revealedMessage !== null,
    revealedMessage,
    start,
    stop,
  };
}
