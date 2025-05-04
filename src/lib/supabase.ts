// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please check your environment variables.');
}

// Log Supabase connection attempt for debugging
console.log(`Connecting to Supabase at: ${supabaseUrl.slice(0, 15)}...`);

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Test the connection immediately to verify it's working
(async () => {
  try {
    const { data, error } = await supabase.from('interest_registrations').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('Supabase connection successful!');
    }
  } catch (err) {
    console.error('Error testing Supabase connection:', err);
  }
})();