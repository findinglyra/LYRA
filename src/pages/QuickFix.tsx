import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, Zap, Database } from 'lucide-react';

export default function QuickFix() {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const clearAllRateLimits = () => {
    try {
      // Clear rate limits via dev utils
      if ((window as any).devUtils) {
        (window as any).devUtils.clearRateLimit();
        setMessage('✅ All rate limits cleared successfully!');
        setMessageType('success');
      } else {
        setMessage('⚠️ Dev utils not loaded. Refresh the page and try again.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('❌ Error clearing rate limits');
      setMessageType('error');
    }
  };

  const copyDatabaseSQL = () => {
    const sql = `-- LYRA Database Setup - Safe for Re-running
-- This script handles existing tables and policies gracefully

-- Create the profiles table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    birth_date DATE,
    zodiac_sign TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (safe to run multiple times)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first, then recreate them
DROP POLICY IF EXISTS "Allow public profile reads" ON public.profiles;
DROP POLICY IF EXISTS "Allow individual profile updates" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation for authenticated users only" ON public.profiles;

-- Create policies for profiles
CREATE POLICY "Allow public profile reads" ON public.profiles 
    FOR SELECT USING (true);

CREATE POLICY "Allow individual profile updates" ON public.profiles 
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow profile creation for authenticated users only" ON public.profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create or replace the user creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger first, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create music_preferences table (this is the missing one!)
CREATE TABLE IF NOT EXISTS public.music_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    genres TEXT[] NULL,
    artists TEXT[] NULL,
    songs TEXT[] NULL,
    listening_frequency TEXT NULL,
    discovery_methods TEXT[] NULL,
    listening_moods TEXT[] NULL,
    creates_playlists BOOLEAN NULL DEFAULT false,
    playlist_themes TEXT[] NULL,
    concert_frequency TEXT NULL,
    best_concert_experience TEXT NULL,
    musical_milestones TEXT NULL,
    tempo_preference INTEGER NULL DEFAULT 50,
    energy_level INTEGER NULL DEFAULT 50,
    danceability INTEGER NULL DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for music_preferences
ALTER TABLE public.music_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing music_preferences policies first, then recreate
DROP POLICY IF EXISTS "Users can view own music preferences" ON public.music_preferences;
DROP POLICY IF EXISTS "Users can insert own music preferences" ON public.music_preferences;
DROP POLICY IF EXISTS "Users can update own music preferences" ON public.music_preferences;
DROP POLICY IF EXISTS "Users can delete own music preferences" ON public.music_preferences;

-- Create policies for music_preferences table
CREATE POLICY "Users can view own music preferences" ON public.music_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own music preferences" ON public.music_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own music preferences" ON public.music_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own music preferences" ON public.music_preferences
    FOR DELETE USING (auth.uid() = user_id);`;

    navigator.clipboard.writeText(sql).then(() => {
      setMessage('✅ Complete database setup SQL copied to clipboard! Paste it in your Supabase SQL Editor.');
      setMessageType('success');
    }).catch(() => {
      setMessage('❌ Failed to copy to clipboard. Please copy manually from the text area below.');
      setMessageType('error');
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            LYRA Quick Fix Center
          </CardTitle>
          <CardDescription>
            One-click solutions for common development issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Rate Limiter Quick Fix */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-red-900">🚨 Rate Limiting Issues</h3>
                <p className="text-sm text-red-700">Clear all rate limits instantly</p>
              </div>
              <Button 
                onClick={clearAllRateLimits}
                className="bg-red-600 hover:bg-red-700"
              >
                <Zap className="mr-2 h-4 w-4" />
                Clear All Rate Limits
              </Button>
            </div>
          </div>

          {/* Database Issues */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-blue-900">🗄️ Missing Database Tables</h3>
                <p className="text-sm text-blue-700">Copy complete SQL setup to clipboard</p>
              </div>
              <div className="space-x-2">
                <Button 
                  onClick={copyDatabaseSQL}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Database className="mr-2 h-4 w-4" />
                  Copy Complete SQL
                </Button>
                <Button 
                  onClick={() => window.open('https://supabase.com/dashboard/project/vruwlojrfylljrlvwrwz/sql/new', '_blank')}
                  variant="outline"
                  className="border-blue-300"
                >
                  Open SQL Editor
                </Button>
              </div>
            </div>
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

          {/* Quick Steps */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-3">⚡ Quick Fix Steps:</h3>
            <ol className="text-sm text-yellow-800 space-y-2">
              <li className="flex items-start">
                <span className="bg-yellow-200 text-yellow-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
                <span><strong>Rate Limits:</strong> Click "Clear All Rate Limits" above</span>
              </li>
              <li className="flex items-start">
                <span className="bg-yellow-200 text-yellow-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
                <span><strong>Database:</strong> Click "Copy Complete SQL" then paste in Supabase SQL Editor</span>
              </li>
              <li className="flex items-start">
                <span className="bg-yellow-200 text-yellow-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
                <span><strong>Storage:</strong> Go to Supabase Dashboard → Storage → Create bucket named "user-content"</span>
              </li>
              <li className="flex items-start">
                <span className="bg-yellow-200 text-yellow-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">4</span>
                <span><strong>Test:</strong> Refresh the page and try the signup flow again</span>
              </li>
            </ol>
          </div>

          {/* Alternative Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => window.location.href = '/test-user-setup'}
              variant="outline"
              className="h-16"
            >
              <div className="text-center">
                <div className="font-semibold">Test User Setup</div>
                <div className="text-xs text-gray-600">Create test accounts</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/storage-setup'}
              variant="outline" 
              className="h-16"
            >
              <div className="text-center">
                <div className="font-semibold">Storage Setup</div>
                <div className="text-xs text-gray-600">Configure image uploads</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/database-setup'}
              variant="outline"
              className="h-16"
            >
              <div className="text-center">
                <div className="font-semibold">Database Setup</div>
                <div className="text-xs text-gray-600">Create missing tables</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}