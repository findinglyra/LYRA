-- SQL to create the interest_registrations table in Supabase
-- Run this in your Supabase SQL Editor

-- Create a simple interest_registrations table
CREATE TABLE IF NOT EXISTS public.interest_registrations (
    id UUID DEFAULT gen_random_uuid(),
    email TEXT,
    name TEXT,
    age INTEGER,
    birth_date TEXT,
    birth_time TEXT,
    birth_location TEXT,
    music_platform TEXT,
    genre_preference TEXT[],
    tempo_preference TEXT,
    listening_mood TEXT[],
    zodiac_sign TEXT,
    music_astro_balance INTEGER,
    past_partner_signs TEXT[],
    past_partner_music_taste TEXT,
    meeting_frequency TEXT,
    match_importance INTEGER,
    expectations TEXT,
    hear_about TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.interest_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anonymous users
CREATE POLICY "Allow anonymous inserts" ON public.interest_registrations 
    FOR INSERT WITH CHECK (true);
    
-- Create policy to allow reading own data
CREATE POLICY "Allow anonymous selects" ON public.interest_registrations 
    FOR SELECT USING (true);

-- Grant permissions to anonymous and authenticated users
GRANT ALL ON public.interest_registrations TO anon, authenticated;
