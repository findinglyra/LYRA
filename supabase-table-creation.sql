-- SQL to create the interest_form table in Supabase
-- Run this in your Supabase SQL Editor

-- Create a simple interest_form table
CREATE TABLE IF NOT EXISTS public.interest_form (
    id UUID DEFAULT gen_random_uuid(),
    email TEXT,
    name TEXT,
    music_service TEXT,
    music_astro_balance INTEGER,
    match_importance INTEGER,
    expectations TEXT,
    hear_about TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.interest_form ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anonymous users
CREATE POLICY "Allow anonymous inserts" ON public.interest_form 
    FOR INSERT WITH CHECK (true);
    
-- Create policy to allow reading own data
CREATE POLICY "Allow anonymous selects" ON public.interest_form 
    FOR SELECT USING (true);

-- Grant permissions to anonymous and authenticated users
GRANT ALL ON public.interest_form TO anon, authenticated;
