import { RATE_LIMIT_CONFIG } from '../utils/constants.js';

class RateLimiter {
  constructor(maxRequests = RATE_LIMIT_CONFIG.MAX_REQUESTS, windowMs = RATE_LIMIT_CONFIG.WINDOW_MS) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  async execute(fn) {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    // Check if we've exceeded the limit
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.windowMs - (now - oldestRequest);
      
      console.log(`Rate limit exceeded. Waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      // Try again after waiting
      return this.execute(fn);
    }
    
    // Add current request to the list
    this.requests.push(now);
    
    try {
      return await fn();
    } catch (error) {
      // Remove the request from the list if it failed
      const index = this.requests.indexOf(now);
      if (index > -1) {
        this.requests.splice(index, 1);
      }
      throw error;
    }
  }

  // Get current usage stats
  getStats() {
    const now = Date.now();
    const recentRequests = this.requests.filter(time => now - time < this.windowMs);
    
    return {
      currentRequests: recentRequests.length,
      maxRequests: this.maxRequests,
      remainingRequests: Math.max(0, this.maxRequests - recentRequests.length),
      resetTime: recentRequests.length > 0 ? Math.min(...recentRequests) + this.windowMs : now
    };
  }

  // Reset the rate limiter
  reset() {
    this.requests = [];
  }
}

// Create singleton instances for different services
export const jupiterRateLimiter = new RateLimiter(10, 60000); // 10 requests per minute
export const priceRateLimiter = new RateLimiter(20, 60000); // 20 requests per minute
export const generalRateLimiter = new RateLimiter(15, 60000); // 15 requests per minute

export default RateLimiter;