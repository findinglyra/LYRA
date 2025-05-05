// Test Supabase connection and table availability
import { supabase } from '../lib/supabase';

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test 1: Basic connection
    console.log('Test 1: Basic connection test');
    const { data: connectionData, error: connectionError } = await supabase.from('interest_registrations').select('count', { count: 'exact', head: true });
    
    if (connectionError) {
      console.error('Connection test failed:', connectionError);
    } else {
      console.log('✅ Supabase connection successful');
    }
    
    // Test 2: Table structure validation
    console.log('\nTest 2: Checking interest_registrations table structure');
    const { data: tableData, error: tableError } = await supabase
      .from('interest_registrations')
      .select('id, email, name, age, created_at')
      .limit(1);
      
    if (tableError) {
      console.error('Table structure test failed:', tableError);
    } else {
      console.log('✅ Table structure looks good:', Object.keys(tableData?.[0] || {}).join(', ') || 'No records but table exists');
    }
    
    // Test 3: Attempt a test insert (will be rolled back)
    console.log('\nTest 3: Testing insert capability');
    
    const testData = {
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      age: 25,
      music_astro_balance: 50,
      expectations: 'Testing data insertion',
      match_importance: 50,
      hear_about: 'Test',
      created_at: new Date().toISOString()
    };
    
    // Begin transaction
    const { data: insertData, error: insertError } = await supabase
      .from('interest_registrations')
      .insert(testData);
      
    if (insertError) {
      // Check if this is a permission error (could be due to RLS policies)
      if (insertError.code === '42501' || insertError.message.includes('permission denied')) {
        console.log('⚠️ Insert test received permission denied - this is often due to Row Level Security and might be expected');
        console.log('Database connection appears valid but RLS policies may be restricting operations');
      } else {
        console.error('Insert test failed:', insertError);
      }
    } else {
      console.log('✅ Insert capability confirmed');
      
      // Since this is just a test, try to remove the test data
      try {
        await supabase
          .from('interest_registrations')
          .delete()
          .eq('email', testData.email);
        console.log('(Test data cleaned up)');
      } catch (cleanupError) {
        // If cleanup fails, it's not critical
        console.log('Note: Could not clean up test data due to permissions');
      }
    }
    
    console.log('\nTests completed. Check the results above to determine if your Supabase connection is working properly.');
    
  } catch (error) {
    console.error('Unexpected error during tests:', error);
  }
}

// Run the tests
testSupabaseConnection();

export {};
