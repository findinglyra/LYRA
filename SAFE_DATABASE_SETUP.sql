-- LYRA Database Setup - Safe for Re-running
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
    FOR DELETE USING (auth.uid() = user_id);