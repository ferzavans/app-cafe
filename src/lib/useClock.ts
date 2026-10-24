import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * A pausable clock measured against Date.now(), so it stays accurate even when
 * JS timers are throttled. `elapsedMs` updates a few times per second while running.
 */
export function useClock() {
  const [running, setRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedAt = useRef<number | null>(null);
  const banked = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (startedAt.current != null) setElapsedMs(banked.current + Date.now() - startedAt.current);
    }, 200);
    return () => clearInterval(id);
  }, [running]);

  const start = useCallback(() => {
    if (startedAt.current != null) return;
    startedAt.current = Date.now();
    setRunning(true);
  }, []);

  const pause = useCallback(() => {
    if (startedAt.current == null) return;
    banked.current += Date.now() - startedAt.current;
    startedAt.current = null;
    setElapsedMs(banked.current);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    startedAt.current = null;
    banked.current = 0;
    setElapsedMs(0);
    setRunning(false);
  }, []);

  return { running, elapsedMs, start, pause, reset };
}
