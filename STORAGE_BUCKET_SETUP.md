# Storage Bucket Setup for LYRA

## Issue
The profile image upload is failing with "Bucket not found" error because the `user-content` storage bucket doesn't exist in your Supabase project.

## Quick Fix Options

### Option 1: Manual Setup (Recommended)
1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/xyuicvjwmihqrswtxfzb
2. Navigate to "Storage" in the left sidebar
3. Click "Create a new bucket"
4. Use these settings:
   - **Bucket name**: `user-content`
   - **Public bucket**: ✅ Enabled
   - **File size limit**: `5242880` (5MB)
   - **Allowed MIME types**: `image/jpeg,image/png,image/gif,image/webp`

### Option 2: SQL Setup
Run this SQL in your Supabase SQL Editor:

```sql
-- Create the user-content bucket
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
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
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
```

### Option 3: Code Fallback (Already implemented)
The code has been updated to automatically create the bucket if it doesn't exist, but this requires proper permissions.

## Test the Fix
1. Complete either Option 1 or Option 2 above
2. Go to http://localhost:8081
3. Try uploading a profile image during signup
4. The upload should now work successfully

## Folder Structure
Once created, images will be stored in:
- `user-content/profile-images/` - Profile pictures
- `user-content/music-files/` - Music uploads (future)
- `user-content/cover-art/` - Album/playlist covers (future)