-- Complete SQL setup for Lyra application
-- Run this in your Supabase SQL Editor

-- 1. Create the profiles table
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

-- Enable Row Level Security on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read any profile (needed for matching)
CREATE POLICY "Users can read any profile" ON public.profiles 
    FOR SELECT USING (true);

-- Create policy for users to update only their own profile
CREATE POLICY "Users can update own profile" ON public.profiles 
    FOR UPDATE USING (auth.uid() = id);

-- Create policy for users to insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Create music_preferences table that references profiles
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

-- Enable Row Level Security on music_preferences
ALTER TABLE public.music_preferences ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own music preferences
CREATE POLICY "Users can read own music preferences" ON public.music_preferences 
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to insert their own music preferences
CREATE POLICY "Users can create own music preferences" ON public.music_preferences 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own music preferences
CREATE POLICY "Users can update own music preferences" ON public.music_preferences 
    FOR UPDATE USING (auth.uid() = user_id);

-- 3. Create interest_form table for collecting potential user interest
CREATE TABLE IF NOT EXISTS public.interest_form (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT,
    name TEXT,
    music_service TEXT NULL,
    music_astro_balance INTEGER NULL,
    match_importance INTEGER NULL,
    expectations TEXT NULL,
    hear_about TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on interest_form
ALTER TABLE public.interest_form ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts to interest_form
CREATE POLICY "Allow anonymous inserts" ON public.interest_form 
    FOR INSERT WITH CHECK (true);
    
-- Create policy to allow authenticated users to read interest form data
CREATE POLICY "Allow authenticated selects" ON public.interest_form 
    FOR SELECT USING (true);

-- 4. Create automatic profile creation trigger for new users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name, avatar_url)
    VALUES (new.id, new.email, '', '');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if the trigger already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created' 
        AND tgrelid = 'auth.users'::regclass
    ) THEN
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END
$$;

-- 5. Grant permissions to authenticated users
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.music_preferences TO authenticated;
GRANT ALL ON public.interest_form TO anon, authenticated;
