-- Add social_links column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

-- Update trigger to initialize social_links for new users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name, avatar_url, social_links)
    VALUES (new.id, new.email, '', '', '{}'::jsonb);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
