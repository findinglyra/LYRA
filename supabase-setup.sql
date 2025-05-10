-- SQL setup for Lyra application using Supabase's built-in auth system
-- Run this in your Supabase SQL Editor

-- Create music_preferences table that references auth.users
CREATE TABLE IF NOT EXISTS public.music_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create interest_form table for collecting potential user interest
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

-- Grant permissions to anonymous and authenticated users
GRANT ALL ON public.interest_form TO anon, authenticated;
GRANT ALL ON public.music_preferences TO authenticated;

-- Function to make user_id lowercase to ensure compatibility
CREATE OR REPLACE FUNCTION public.handle_lowercase_user_id() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.user_id = LOWER(NEW.user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for music_preferences inserts
CREATE TRIGGER music_preferences_lowercase_user_id
BEFORE INSERT OR UPDATE ON public.music_preferences
FOR EACH ROW EXECUTE FUNCTION public.handle_lowercase_user_id();
