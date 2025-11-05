// Test script for LYRA email confirmation
// This tests the Supabase auth email setup

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vruwlojrfylljrlvwrwz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydXdsb2pyZnlsbGpybHZ3cnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNTkyNDQsImV4cCI6MjA3NzgzNTI0NH0.gKoIQMRVCCh_T6kk-X1NfokWUpIzlDF8RIyc3unlPrU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEmailConfirmation() {
  console.log('🎵 Testing LYRA email confirmation...');
  
  // Test signup with email confirmation
  const testEmail = 'test@example.com'; // Replace with your real email for testing
  const testPassword = 'TestPassword123!';
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: 'http://localhost:8081/auth/callback',
        data: {
          full_name: 'Test User'
        }
      }
    });

    if (error) {
      console.error('❌ Signup error:', error.message);
      return;
    }

    console.log('✅ Signup successful!');
    console.log('📧 Check your email for the confirmation message');
    console.log('User ID:', data.user?.id);
    console.log('Email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No');
    
    if (!data.user?.email_confirmed_at) {
      console.log('⏳ Confirmation email should be sent to:', testEmail);
      console.log('🎯 Click the confirmation link to complete signup');
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

// Run the test
testEmailConfirmation();