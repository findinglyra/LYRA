// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

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

// Create custom fetch with longer timeout
const customFetch = (url: RequestInfo | URL, options: RequestInit = {}) => {
  console.log(`🔄 Supabase request to: ${url.toString().substring(0, 50)}...`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout
  
  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).then(response => {
    clearTimeout(timeoutId);
    return response;
  }).catch(error => {
    clearTimeout(timeoutId);
    console.error(`❌ Supabase fetch error: ${error.message}`);
    throw error;
  });
};

// Create the Supabase client with proper options
export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
      },
      fetch: customFetch,
    },
    // Set longer timeouts to avoid issues
    db: {
      schema: 'public',
    },
  }
);

// Test the connection immediately and log the outcome
(async () => {
  try {
    console.log('Testing Supabase connection to interest_form table...');
    const { data, error } = await supabase
      .from('interest_form')
      .select('count', { count: 'exact', head: true });
      
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      console.error('Error details:', error);
      
      // Additional debugging info
      if (error.message.includes('auth/invalid_claims')) {
        console.error('This appears to be an authentication error. Check your Supabase API keys.');
      } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.error('The table does not exist. Please verify table name in Supabase dashboard.');
      } else if (error.message.includes('permission denied')) {
        console.error('Permission denied error. Check Row Level Security (RLS) policies in Supabase.');
      }
    } else {
      console.log('✅ Supabase connection successful! Table is accessible.');
    }
  } catch (err) {
    console.error('❌ Unexpected error testing Supabase connection:', err);
    if (err instanceof Error) {
      if (err.message.includes('fetch')) {
        console.error('This appears to be a network error. Check your internet connection and Supabase URL.');
      } else if (err.message.includes('timeout')) {
        console.error('Request timed out. The Supabase server might be unresponsive.');
      } else if (err.message.includes('abort')) {
        console.error('Request was aborted. This could be due to a timeout or network issue.');
      }
    }
  }
})();