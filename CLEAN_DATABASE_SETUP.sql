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

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, created_at, updated_at)
VALUES 
  (
    'user-content', 
    'user-content', 
    true, 
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'], 
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  updated_at = NOW();

-- Create storage policies
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-content' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Allow public to view files" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-content');

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;