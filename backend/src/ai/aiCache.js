import crypto from 'crypto';

class AICache {
  constructor(ttlMs = 10 * 60 * 1000) {
    this.cache = new Map();
    this.ttlMs = ttlMs;
  }

  generateKey(prompt, extra = '') {
    return crypto.createHash('md5').update(`${prompt}:${extra}`).digest('hex');
  }

  get(prompt, extra = '') {
    const key = this.generateKey(prompt, extra);
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  set(prompt, extra = '', value) {
    const key = this.generateKey(prompt, extra);
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  clear() {
    this.cache.clear();
  }
}

export const aiCache = new AICache();
export default aiCache;
