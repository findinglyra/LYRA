// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import rateLimiter from '../utils/rateLimiter';

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log configuration status
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Missing Supabase credentials. Please check your environment variables.');
  console.error('Make sure you have VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
} else {
  console.log(`✅ Supabase credentials found. URL prefix: ${supabaseUrl.substring(0, 15)}...`);
}

// Check if we're in development mode
const isDevelopment = import.meta.env.MODE === 'development' || 
                      window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

// Track auth requests with rate limiting (more lenient in development mode)
const authRequestCache = new Map<string, { timestamp: number, count: number }>();
const AUTH_REQUEST_WINDOW = isDevelopment ? 30000 : 60000; // 30 seconds in dev, 1 minute in production
const MAX_AUTH_REQUESTS = isDevelopment ? 20 : 5; // 20 auth requests in dev, 5 in production
const MAX_SESSION_CHECKS = isDevelopment ? 30 : 10; // 30 session checks in dev, 10 in production

// This maps URL patterns to operation types for rate limiting
const getOperationType = (url: string): string => {
  const path = new URL(url).pathname;
  
  // Auth operations - with enhanced granularity for better rate limiting
  if (path.includes('/auth/v1/signup')) return 'auth:signUp';
  if (path.includes('/auth/v1/token')) return 'auth:signIn';
  if (path.includes('/auth/v1/recover')) return 'auth:resetPassword';
  if (path.includes('/auth/v1/user')) return 'auth:getUser'; // Specifically track getUser calls
  if (path.includes('/auth/v1/session')) return 'auth:getSession'; // Specifically track session calls
  if (path.includes('/auth/v1/magiclink')) return 'auth:magicLink';
  
  // Database operations - checking for REST endpoints
  if (path.includes('/rest/v1')) {
    const method = path.includes('?select=') ? 'db:select' : 
                  path.includes('?insert=') ? 'db:insert' : 
                  path.includes('?update=') ? 'db:update' : 
                  path.includes('?delete=') ? 'db:delete' : 'db:select';
    return method;
  }
  
  // Storage operations
  if (path.includes('/storage/v1/object')) {
    return path.includes('upload') ? 'storage:upload' : 'storage:download';
  }
  
  // Default fallback
  return 'default';
};

// Enhanced auth request limiter beyond the general rate limiter
const checkAuthRateLimit = (operationType: string): boolean => {
  // Special treatment for development mode
  if (isDevelopment && operationType === 'auth:signUp') {
    // In dev mode, allow all signUp operations to bypass most rate limiting
    // Just do basic tracking for debugging purposes
    const now = Date.now();
    const debugKey = 'dev-signup-tracking';
    const entry = authRequestCache.get(debugKey) || { timestamp: now, count: 0 };
    entry.count++;
    authRequestCache.set(debugKey, entry);
    console.log(`Dev mode signup attempt #${entry.count}`);
    return true;  // Always allow in dev mode
  }
  
  // Check if we should skip rate limiting for this request type
  // Will still track the request, but won't block it
  const skipRateLimiting = localStorage.getItem('lyra_disable_rate_limiting') === 'true';
  if (skipRateLimiting && (operationType === 'auth:signUp' || operationType === 'auth:signIn')) {
    console.log(`Bypassing rate limiting for ${operationType} as requested`);
    return true;
  }
  
  // Only apply rate limiting to auth operations
  if (!operationType.startsWith('auth:')) return true;
  
  const now = Date.now();
  let key;
  
  // More granular tracking for different auth operations
  if (operationType.startsWith('auth:get')) {
    key = 'session-checks';
  } else if (operationType === 'auth:signUp') {
    key = 'signup-operations';
  } else if (operationType === 'auth:signIn') {
    key = 'signin-operations';
  } else {
    key = 'auth-operations';
  }
  
  const entry = authRequestCache.get(key) || { timestamp: now, count: 0 };
  
  // Clean old entries
  if (now - entry.timestamp > AUTH_REQUEST_WINDOW) {
    entry.timestamp = now;
    entry.count = 1;
    authRequestCache.set(key, entry);
    return true;
  }
  
  // Special high limits for signUp in development mode
  let maxAllowed;
  if (key === 'session-checks') {
    maxAllowed = MAX_SESSION_CHECKS;
  } else if (key === 'signup-operations') {
    // Allow more sign-ups in dev mode
    maxAllowed = isDevelopment ? 50 : MAX_AUTH_REQUESTS;
  } else if (key === 'signin-operations') {
    maxAllowed = isDevelopment ? 30 : MAX_AUTH_REQUESTS;
  } else {
    maxAllowed = MAX_AUTH_REQUESTS;
  }
  
  if (entry.count >= maxAllowed) {
    const waitSeconds = Math.ceil((AUTH_REQUEST_WINDOW - (now - entry.timestamp)) / 1000);
    console.warn(`Rate limit exceeded for ${key}: ${entry.count} requests in window. Wait ${waitSeconds}s`);
    return false;
  }
  
  // Increment count
  entry.count++;
  authRequestCache.set(key, entry);
  return true;
};

// Create custom fetch with longer timeout and rate limiting
const customFetch = (url: RequestInfo | URL, options: RequestInit = {}) => {
  const urlString = url.toString();
  console.log(`🔄 Supabase request to: ${urlString.substring(0, 50)}...`);
  
  // Apply rate limiting
  const operationType = getOperationType(urlString);
  
  // Check auth-specific rate limits first (these are stricter)
  if (!checkAuthRateLimit(operationType)) {
    const isSessionCheck = operationType.includes('getSession') || operationType.includes('getUser');
    const errorMessage = isSessionCheck
      ? 'Too many authentication status checks. Please wait before trying again.'
      : 'Too many authentication requests. Please wait before trying again.';
      
    console.warn(`⚠️ Auth rate limit exceeded for ${operationType}`);
    return Promise.reject(new Error(`Auth rate limit exceeded: ${errorMessage}`));
  }
  
  // Then check general rate limits
  const rateLimit = rateLimiter.checkLimit(operationType);
  if (!rateLimit.allowed) {
    console.warn(`⚠️ Rate limit exceeded for ${operationType}: ${rateLimit.message}`);
    return Promise.reject(new Error(`Rate limit exceeded: ${rateLimit.message}`));
  }
  
  // Record this request for rate limiting purposes
  rateLimiter.recordRequest(operationType);
  
  // Set up request timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60-second timeout
  
  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).then(response => {
    clearTimeout(timeoutId);
    return response;
  }).catch(error => {
    clearTimeout(timeoutId);
    
    // Check if this is a rate limit error from Supabase
    if (error.message?.includes('rate limit') || 
        error.status === 429 || 
        (error.error?.code === 429)) {
      // If Supabase is rate limiting us, adjust our local rate limiter
      console.error(`⚠️ Supabase rate limit detected for ${operationType}`);
      // This makes the limiter more strict for this operation type
      rateLimiter.recordRequest(operationType);
      rateLimiter.recordRequest(operationType);
    }
    
    console.error(`❌ Supabase fetch error: ${error.message}`);
    throw error;
  });
};

// Configure retry strategy
const retryCount = 3;
const retryDelay = 2000; // 2 seconds between retries

// Retry fetch function with exponential backoff
const fetchWithRetry = async (url: RequestInfo | URL, options: RequestInit = {}, attempts = 0): Promise<Response> => {
  try {
    return await customFetch(url, options);
  } catch (error) {
    // Don't retry rate limit errors
    if (error.message?.includes('Rate limit exceeded')) {
      console.warn(`⚠️ Not retrying rate-limited request: ${error.message}`);
      throw error;
    }
    
    if (attempts < retryCount) {
      const delay = retryDelay * Math.pow(2, attempts);
      console.log(`Retrying fetch (attempt ${attempts + 1}/${retryCount}) after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, attempts + 1);
    }
    throw error;
  }
};

// Create the Supabase client with proper options
export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'lyra-auth', // Use consistent storage key
      debug: true, // Enable debug logs for auth issues
      detectSessionInUrl: true, // Detect session from URL on initial load
      storage: localStorage, // Explicitly use localStorage
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
      },
      fetch: fetchWithRetry,
    },
    // Set longer timeouts to avoid issues
    db: {
      schema: 'public',
    },
    realtime: {
      timeout: 60000, // 60 seconds timeout for realtime connections
    }
  }
);

// Log client creation success
console.log('✅ Supabase client initialized successfully');

// Test the connection immediately and log the outcome
(async () => {
  try {
    console.log('Testing Supabase connection...');
    const { error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
    } else {
      console.log('✅ Supabase connection test successful');
    }
  } catch (e) {
    console.error('❌ Supabase connection test error:', e);
  }
})();