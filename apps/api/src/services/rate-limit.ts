/**
 * In-memory sliding window rate limiter.
 * One window per key, 60 second span, checked before handlers run.
 */

const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

/** Returns true when the request is within the limit for the window. */
export function checkRateLimit(key: string, limit: number): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const timestamps = (hits.get(key) ?? []).filter((t) => t > windowStart);
  if (timestamps.length >= limit) {
    hits.set(key, timestamps);
    return false;
  }
  timestamps.push(now);
  hits.set(key, timestamps);
  return true;
}

/** Clears all windows. Used by tests to isolate cases. */
export function resetRateLimiter(): void {
  hits.clear();
}

/** Removes stale windows to keep memory bounded. */
export function pruneRateLimiter(): void {
  const windowStart = Date.now() - WINDOW_MS;
  for (const [key, timestamps] of hits) {
    const alive = timestamps.filter((t) => t > windowStart);
    if (alive.length === 0) hits.delete(key);
    else hits.set(key, alive);
  }
}
