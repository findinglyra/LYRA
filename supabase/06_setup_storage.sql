-- Setup Storage Buckets for LYRA
-- This script creates the necessary storage buckets and policies for file uploads

-- Create the user-content bucket for profile images and other user files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, avif_autodetection, created_at, updated_at)
VALUES 
  (
    'user-content', 
    'user-content', 
    true, 
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'], 
    false,
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  updated_at = NOW();

-- Create storage policies for the user-content bucket

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-content' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] IN ('profile-images', 'music-files', 'cover-art')
  );

-- Allow users to view all public files
CREATE POLICY "Allow public to view files" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-content');

-- Allow users to update their own files
CREATE POLICY "Allow users to update own files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user-content' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own files
CREATE POLICY "Allow users to delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-content' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a function to get user avatar URL
CREATE OR REPLACE FUNCTION public.get_avatar_url(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    avatar_path TEXT;
    public_url TEXT;
BEGIN
    -- Get the avatar_url from the profiles table
    SELECT avatar_url INTO avatar_path
    FROM public.profiles
    WHERE id = user_id;
    
    -- If no avatar_url is set, return null
    IF avatar_path IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- If it's already a full URL, return it as is
    IF avatar_path LIKE 'http%' THEN
        RETURN avatar_path;
    END IF;
    
    -- Otherwise, construct the public URL
    SELECT 
        CASE 
            WHEN avatar_path LIKE 'profile-images/%' THEN
                format('https://%s/storage/v1/object/public/user-content/%s', 
                       current_setting('app.settings.supabase_url', true), 
                       avatar_path)
            ELSE
                avatar_path
        END INTO public_url;
    
    RETURN public_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.get_avatar_url(UUID) TO authenticated;

-- Create an updated_at trigger for profiles table if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to profiles table
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON FUNCTION public.get_avatar_url(UUID) IS 'Returns the full public URL for a user''s avatar image';
COMMENT ON POLICY "Allow authenticated users to upload files" ON storage.objects IS 'Users can upload to profile-images, music-files, and cover-art folders';
COMMENT ON POLICY "Allow public to view files" ON storage.objects IS 'All files in user-content bucket are publicly viewable';