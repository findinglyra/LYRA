# 🚨 CRITICAL: Missing Profiles Table

## The Problem
Your Supabase database is missing the `profiles` table, which is causing the profile creation to fail.

## Quick Fix (2 minutes)

### 1. Go to Supabase SQL Editor
- Open: https://supabase.com/dashboard/project/vruwlojrfylljrlvwrwz/sql/new
- This will open the SQL Editor for your project

### 2. Copy and Run This SQL (Step 1 - Profiles Table Only)
```sql
-- Create the profiles table
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

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public profile reads" ON public.profiles 
    FOR SELECT USING (true);

CREATE POLICY "Allow individual profile updates" ON public.profiles 
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow profile creation for authenticated users only" ON public.profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create trigger to auto-create profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create music_preferences table
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

-- Create policies for music_preferences table
CREATE POLICY "Users can view own music preferences" ON public.music_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own music preferences" ON public.music_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own music preferences" ON public.music_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own music preferences" ON public.music_preferences
    FOR DELETE USING (auth.uid() = user_id);
```

### 3. Create Storage Bucket (via Dashboard)
The storage policies need admin privileges. Instead:
1. Go to **Storage** → **Buckets** in your Supabase dashboard
2. Click **"Create a new bucket"**
3. Settings:
   - **Name**: `user-content`
   - **Public bucket**: ✅ Enable
   - **File size limit**: `5242880` (5MB)
   - **Allowed MIME types**: `image/jpeg,image/png,image/gif,image/webp`

### 3. Click "Run" 
- Click the "Run" button in the SQL Editor
- You should see "Success. No rows returned" or similar

### 4. Test It
- Go back to http://localhost:8081
- Try creating a profile again
- It should work now! 🎉

## Alternative: Web Setup
If you prefer, you can also go to:
- http://localhost:8081/database-setup

This will attempt to create the tables via the web interface.

---
**This fixes both the profiles table AND storage bucket issues at once!**