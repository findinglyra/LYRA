-- In supabase-complete-setup.sql (or run directly in Supabase SQL Editor)

-- ========================================================================
-- PROFILES TABLE RLS OPTIMIZATION
-- ========================================================================

-- 1. Drop the overly permissive SELECT policy on profiles
DROP POLICY IF EXISTS "Users can read any profile" ON public.profiles;

-- 2. Create a policy for users to read THEIR OWN profile
-- This is CRITICAL for AuthContext.tsx's checkUserCompletionStatus performance
CREATE POLICY "Users can read their own profile" ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- 3. Create a policy for users to update only their own profile (Unchanged, was good)
-- Ensure it exists if you dropped all policies for a fresh start.
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id); -- Added WITH CHECK for completeness

-- 4. Create policy for users to insert their own profile (Unchanged, was good)
-- Ensure it exists if you dropped all policies for a fresh start.
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 5. [IMPORTANT FOR MATCHING] Policy for reading OTHER users' profiles (for matching screen)
-- This policy should be more restrictive than `USING (true)`.
-- Option A: Allow reading any profile IF the requesting user has a complete profile.
-- This prevents incomplete profiles from browsing others.
-- CREATE POLICY "Authenticated users with complete profiles can read other profiles" ON public.profiles
--     FOR SELECT
--     USING (
--         EXISTS (
--             SELECT 1
--             FROM public.profiles p_check
--             WHERE p_check.id = auth.uid() AND p_check.setup_complete = TRUE
--         )
--         -- AND potentially other conditions, e.g., not selecting own profile if that's handled client-side
--         -- AND id != auth.uid() -- If you want to exclude own profile from this policy
--     );
-- Option B: (Simpler, but still better than USING(true) if you only allow authenticated users)
-- Allow any authenticated user to read other profiles. This is closer to your original intent
-- but is still broad. If matching is highly sensitive, consider a backend function.
CREATE POLICY "Authenticated users can read other profiles for matching" ON public.profiles
    FOR SELECT
    USING ( auth.role() = 'authenticated' );
    -- If you only want users with *their own profile created* to see others, combine:
    -- USING ( auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM public.profiles p_check WHERE p_check.id = auth.uid()) );


-- ========================================================================
-- MUSIC_PREFERENCES TABLE RLS (Mostly Unchanged, was good)
-- ========================================================================

-- 1. Policy for users to read their own music preferences (Unchanged, was good)
-- Ensure it exists.
CREATE POLICY "Users can read own music preferences" ON public.music_preferences
    FOR SELECT
    USING (auth.uid() = user_id);

-- 2. Policy for users to insert their own music preferences (Unchanged, was good)
-- Ensure it exists.
CREATE POLICY "Users can create own music preferences" ON public.music_preferences
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 3. Policy for users to update their own music preferences (Unchanged, was good)
-- Ensure it exists.
CREATE POLICY "Users can update own music preferences" ON public.music_preferences
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id); -- Added WITH CHECK for completeness


-- ========================================================================
-- Ensure Row Level Security is enabled (if not already)
-- ========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_preferences ENABLE ROW LEVEL SECURITY;

-- ========================================================================
-- Review GRANTS (Your existing grants are generally fine)
-- ========================================================================
-- GRANT ALL ON public.profiles TO authenticated; -- 'ALL' includes SELECT, INSERT, UPDATE, DELETE.
-- GRANT ALL ON public.music_preferences TO authenticated;
-- Consider more granular permissions if needed, e.g.,
-- GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
-- GRANT SELECT, INSERT, UPDATE ON public.music_preferences TO authenticated;
-- (DELETE is often handled differently, e.g. soft deletes or more restricted policies)
