import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function TestUserSetup() {
  const [isCreating, setIsCreating] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState('test@lyra.app');
  const [password, setPassword] = useState('testpassword123');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const clearRateLimits = () => {
    // Clear rate limits via dev utils
    if ((window as any).devUtils) {
      (window as any).devUtils.clearRateLimit();
    }
    setMessage('✅ Rate limits cleared');
    setMessageType('success');
  };

  const createTestUser = async () => {
    setIsCreating(true);
    setMessage('');
    
    try {
      // Clear rate limits first
      clearRateLimits();
      
      // Create the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'Test User'
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        setMessage(`✅ Test user created successfully! User ID: ${data.user.id}`);
        setMessageType('success');
      } else {
        setMessage('⚠️ User creation completed but no user object returned');
        setMessageType('error');
      }
      
    } catch (error: any) {
      setMessage(`❌ Error creating user: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsCreating(false);
    }
  };

  const signInTestUser = async () => {
    setIsSigningIn(true);
    setMessage('');
    
    try {
      // Clear rate limits first
      clearRateLimits();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        setMessage(`✅ Successfully signed in! User: ${data.user.email}`);
        setMessageType('success');
      }
      
    } catch (error: any) {
      setMessage(`❌ Error signing in: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsSigningIn(false);
    }
  };

  const deleteTestUser = async () => {
    try {
      // Note: This requires admin privileges, won't work with anon key
      setMessage('❌ User deletion requires admin privileges. Delete manually in Supabase dashboard if needed.');
      setMessageType('error');
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
      setMessageType('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Test User Setup & Rate Limiter
          </CardTitle>
          <CardDescription>
            Create and manage test users, and clear rate limits for development
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Rate Limiter Controls */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Rate Limiter Controls</h3>
            <div className="flex gap-2">
              <Button 
                onClick={clearRateLimits}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Clear All Rate Limits
              </Button>
              <Button 
                onClick={() => (window as any).devUtils?.showRateLimits()}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Show Current Limits
              </Button>
            </div>
          </div>

          {/* Test User Credentials */}
          <div className="space-y-4">
            <h3 className="font-semibold">Test User Credentials</h3>
            <div className="grid gap-2">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="test@lyra.app"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="testpassword123"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <Button 
              onClick={createTestUser} 
              disabled={isCreating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Test User
            </Button>
            
            <Button 
              onClick={signInTestUser} 
              disabled={isSigningIn}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSigningIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In Test User
            </Button>
            
            <Button 
              onClick={deleteTestUser} 
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Delete Test User
            </Button>
          </div>
          
          {/* Status Message */}
          {message && (
            <Alert className={messageType === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              {messageType === 'success' ? 
                <CheckCircle className="h-4 w-4 text-green-600" /> : 
                <XCircle className="h-4 w-4 text-red-600" />
              }
              <AlertDescription className={messageType === 'success' ? 'text-green-800' : 'text-red-800'}>
                {message}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Console Commands */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Console Commands</h3>
            <p className="text-sm text-gray-600 mb-2">Open browser console (F12) and use these commands:</p>
            <div className="space-y-1 text-xs font-mono bg-gray-100 p-2 rounded">
              <div><code>devUtils.clearRateLimit()</code> - Clear all rate limits</div>
              <div><code>devUtils.clearRateLimitFor('auth:signIn')</code> - Clear specific limit</div>
              <div><code>devUtils.showRateLimits()</code> - Show current state</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-2">Quick Fix for Rate Limiting:</h3>
            <ol className="text-sm text-amber-800 space-y-1">
              <li>1. Click "Clear All Rate Limits" above</li>
              <li>2. Create a test user with the form above</li>
              <li>3. Use the test credentials to sign in</li>
              <li>4. If you hit rate limits, clear them and try again</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}