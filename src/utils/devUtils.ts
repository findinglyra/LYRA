import rateLimiter from './rateLimiter';

/**
 * Development utilities for debugging and testing
 * Available in browser console as window.devUtils
 */
export const devUtils = {
  /**
   * Clear all rate limiter history
   */
  clearRateLimit: () => {
    // @ts-ignore - accessing private properties for development
    rateLimiter.requestHistory = {};
    // @ts-ignore
    rateLimiter.lastRequestTime = {};
    console.log('🔄 Rate limiter cache cleared');
  },

  /**
   * Clear rate limiter for specific operation
   */
  clearRateLimitFor: (operationType: string) => {
    // @ts-ignore - accessing private properties for development
    delete rateLimiter.requestHistory[operationType];
    // @ts-ignore
    delete rateLimiter.lastRequestTime[operationType];
    console.log(`🔄 Rate limiter cleared for ${operationType}`);
  },

  /**
   * Show current rate limiter state
   */
  showRateLimits: () => {
    // @ts-ignore
    console.log('Rate limiter history:', rateLimiter.requestHistory);
    // @ts-ignore
    console.log('Last request times:', rateLimiter.lastRequestTime);
  }
};

// Make available in browser console for development
if (typeof window !== 'undefined') {
  (window as any).devUtils = devUtils;
  console.log('🔧 Development utilities loaded. Type "devUtils" in console to see available functions.');
}