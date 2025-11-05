/**
 * RateLimiter utility for Supabase interactions
 * 
 * This utility helps prevent hitting Supabase rate limits by:
 * 1. Tracking API calls by operation type
 * 2. Enforcing minimum intervals between similar operations
 * 3. Implementing a token bucket algorithm for overall request limits
 * 4. Providing helpful error messages when limits are hit
 */

interface RateLimitConfig {
  // Default time window in milliseconds
  windowMs: number;
  // Max requests per window
  maxRequests: number;
  // Minimum interval between similar requests (ms)
  minInterval: number;
}

// Rate limit configurations by operation type
const rateLimitConfigs: Record<string, RateLimitConfig> = {
  // Auth operations - made less aggressive for development
  'auth:signUp': { windowMs: 60000, maxRequests: 5, minInterval: 5000 },
  'auth:signIn': { windowMs: 60000, maxRequests: 10, minInterval: 2000 },
  'auth:resetPassword': { windowMs: 300000, maxRequests: 5, minInterval: 30000 },
  'auth:updatePassword': { windowMs: 300000, maxRequests: 5, minInterval: 30000 },
  'auth:magicLink': { windowMs: 300000, maxRequests: 5, minInterval: 30000 },
  
  // Database operations - made much more lenient for development
  'db:insert': { windowMs: 10000, maxRequests: 50, minInterval: 10 },
  'db:select': { windowMs: 10000, maxRequests: 100, minInterval: 10 },
  'db:update': { windowMs: 10000, maxRequests: 50, minInterval: 10 },
  'db:delete': { windowMs: 10000, maxRequests: 30, minInterval: 50 },
  
  // Storage operations
  'storage:upload': { windowMs: 60000, maxRequests: 10, minInterval: 1000 },
  'storage:download': { windowMs: 60000, maxRequests: 20, minInterval: 200 },
  
  // Default for any unspecified operations
  'default': { windowMs: 10000, maxRequests: 20, minInterval: 100 }
};

class RateLimiter {
  private requestHistory: Record<string, number[]> = {};
  private lastRequestTime: Record<string, number> = {};
  
  /**
   * Check if an operation would exceed rate limits
   * @param operationType The type of operation being performed
   * @returns An object indicating if the operation is allowed and any error message
   */
  public checkLimit(operationType: string): { allowed: boolean; message?: string } {
    const now = Date.now();
    const config = rateLimitConfigs[operationType] || rateLimitConfigs.default;
    
    // Initialize history array if it doesn't exist
    if (!this.requestHistory[operationType]) {
      this.requestHistory[operationType] = [];
    }
    
    // Check minimum interval between similar requests
    const lastReqTime = this.lastRequestTime[operationType] || 0;
    const timeSinceLast = now - lastReqTime;
    if (timeSinceLast < config.minInterval) {
      const waitTime = Math.ceil((config.minInterval - timeSinceLast) / 1000);
      return {
        allowed: false,
        message: `Please wait ${waitTime} seconds before making another ${operationType.split(':')[1] || operationType} request.`
      };
    }
    
    // Clean up old requests outside the current window
    this.requestHistory[operationType] = this.requestHistory[operationType].filter(
      timestamp => now - timestamp < config.windowMs
    );
    
    // Check if we've exceeded the max requests in the window
    if (this.requestHistory[operationType].length >= config.maxRequests) {
      const oldestTimestamp = this.requestHistory[operationType][0];
      const resetTime = Math.ceil((oldestTimestamp + config.windowMs - now) / 1000);
      
      return {
        allowed: false,
        message: `Too many ${operationType.split(':')[1] || operationType} requests. Please try again in ${resetTime} seconds.`
      };
    }
    
    return { allowed: true };
  }
  
  /**
   * Record a request for rate limiting purposes
   * @param operationType The type of operation being performed
   */
  public recordRequest(operationType: string): void {
    const now = Date.now();
    
    if (!this.requestHistory[operationType]) {
      this.requestHistory[operationType] = [];
    }
    
    this.requestHistory[operationType].push(now);
    this.lastRequestTime[operationType] = now;
  }
  
  /**
   * Check if a request is allowed and if so, record it
   * @param operationType The type of operation being performed
   * @returns An object indicating if the operation is allowed and any error message
   */
  public limitAndRecord(operationType: string): { allowed: boolean; message?: string } {
    const result = this.checkLimit(operationType);
    if (result.allowed) {
      this.recordRequest(operationType);
    }
    return result;
  }
}

// Create a singleton instance
const rateLimiter = new RateLimiter();

export default rateLimiter;
