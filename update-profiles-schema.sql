-- Add new columns to the profiles table for enhanced profile data

-- Add location column
ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS location TEXT;

-- Add social media links as JSON
ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS social_links JSONB;

-- Update the handle_new_user function to initialize these fields
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        username, 
        full_name, 
        avatar_url, 
        location,
        social_links
    )
    VALUES (
        new.id, 
        new.email, 
        '', 
        '',
        '',
        '{}'::jsonb
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT ALL ON public.profiles TO authenticated;
