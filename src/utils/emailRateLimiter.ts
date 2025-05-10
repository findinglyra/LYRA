// src/utils/emailRateLimiter.ts
/**
 * Helper utility to track email-specific rate limiting for Supabase
 * This helps prevent hitting the "email rate limit exceeded" error
 * from Supabase's authentication service
 */

const EMAIL_CACHE_PREFIX = 'lyra_email_';
const EMAIL_LIMIT_SUFFIX = '_until';
const EMAIL_RATE_LIMIT_WINDOW = 3600000; // 1 hour (Supabase email limit is typically 1 hour)

/**
 * Check if an email is currently rate limited
 * @param email The email to check
 * @returns Object containing whether the email is limited and how many minutes remaining
 */
export function checkEmailRateLimit(email: string): { limited: boolean; minutesRemaining: number } {
  try {
    const now = Date.now();
    const key = `lyra_rate_limit_${email}`;
    const data = localStorage.getItem(key);
    
    if (!data) return { limited: false, minutesRemaining: 0 };
    
    const { timestamp, attempts } = JSON.parse(data);
    const elapsedMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    // Exponential backoff based on attempts
    const cooldownMinutes = Math.min(5 * Math.pow(2, attempts - 1), 480); // Max 8 hours
    
    if (elapsedMinutes < cooldownMinutes) {
      return {
        limited: true,
        minutesRemaining: cooldownMinutes - elapsedMinutes
      };
    }
    
    return { limited: false, minutesRemaining: 0 };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return { limited: false, minutesRemaining: 0 }; // Fail open
  }
}

/**
 * Mark an email as rate limited for a period of time
 * @param email The email to mark as rate limited
 * @param minutes Optional override for how many minutes to limit (default: 60)
 */
export function markEmailRateLimited(email: string, minutes: number = 60): void {
  try {
    if (!email) return;
    
    const key = `lyra_rate_limit_${email}`;
    const now = Date.now();
    const data = localStorage.getItem(key);
    
    let attempts = 1;
    if (data) {
      const { attempts: prevAttempts } = JSON.parse(data);
      attempts = prevAttempts + 1;
    }
    
    // Store the expiration time and attempts
    const limitUntil = now + (minutes * 60000);
    localStorage.setItem(key, JSON.stringify({ timestamp: now, attempts }));
    
    console.log(`Email ${email.substring(0, 3)}*** marked as rate limited for ${minutes} minutes (attempt ${attempts})`);
  } catch (error) {
    console.error('Failed to mark email as rate limited:', error);
  }
}

/**
 * Clear rate limiting for a specific email
 * @param email The email to clear rate limiting for
 */
export function clearEmailRateLimit(email: string): void {
  try {
    if (!email) return;
    
    const key = `lyra_rate_limit_${email}`;
    localStorage.removeItem(key);
    
    console.log(`Email ${email.substring(0, 3)}*** rate limit cleared`);
  } catch (error) {
    console.error('Failed to clear email rate limit:', error);
  }
}
