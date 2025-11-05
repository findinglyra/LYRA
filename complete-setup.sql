-- LYRA Complete Database Setup
-- This script creates all necessary tables and configurations

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public profile reads" ON public.profiles;
DROP POLICY IF EXISTS "Allow individual profile updates" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation for authenticated users only" ON public.profiles;

-- Create policies for profiles table
CREATE POLICY "Allow public profile reads" ON public.profiles 
    FOR SELECT USING (true);

CREATE POLICY "Allow individual profile updates" ON public.profiles 
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow profile creation for authenticated users only" ON public.profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);

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

-- Create interests table
CREATE TABLE IF NOT EXISTS public.interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    interests TEXT[] NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for interests
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;

-- Create policies for interests table
CREATE POLICY "Users can manage own interests" ON public.interests
    FOR ALL USING (auth.uid() = user_id);

-- Create function to handle profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_music_preferences_updated_at ON public.music_preferences;
CREATE TRIGGER handle_music_preferences_updated_at
    BEFORE UPDATE ON public.music_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_interests_updated_at ON public.interests;
CREATE TRIGGER handle_interests_updated_at
    BEFORE UPDATE ON public.interests
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for user content
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, created_at, updated_at)
VALUES 
  (
    'user-content', 
    'user-content', 
    true, 
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'], 
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  updated_at = NOW();

-- Create storage policies for user-content bucket
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-content' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Allow public to view files" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-content');

CREATE POLICY "Allow users to update own files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user-content' 
    AND auth.uid()::text = split_part(name, '/', 1)
  );

CREATE POLICY "Allow users to delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-content' 
    AND auth.uid()::text = split_part(name, '/', 1)
  );

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;