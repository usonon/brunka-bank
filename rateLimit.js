// Simple in-memory sliding-window rate limiter. Fine for a single-process
// demo; a real multi-instance deployment would back this with Redis.
export class RateLimiter {
  constructor() {
    this.hits = new Map(); // key -> array of timestamps (ms)
  }

  check(key, { windowMs, max }) {
    const now = Date.now();
    const list = this.hits.get(key) ?? [];
    const cutoff = now - windowMs;
    const recent = list.filter((t) => t > cutoff);
    recent.push(now);
    this.hits.set(key, recent);
    return recent.length <= max;
  }

  sweep(maxAgeMs) {
    const cutoff = Date.now() - maxAgeMs;
    for (const [key, list] of this.hits) {
      const recent = list.filter((t) => t > cutoff);
      if (recent.length === 0) this.hits.delete(key);
      else this.hits.set(key, recent);
    }
  }
}
