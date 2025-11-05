-- Step 1: Setup private keys schema and table for storing Mailersend API token
-- Run this first to create the private schema and keys table

-- Create private schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS private;

-- Create the keys table to store sensitive configuration
CREATE TABLE IF NOT EXISTS private.keys (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on the keys table (important for security)
ALTER TABLE private.keys ENABLE ROW LEVEL SECURITY;

-- Create policy to restrict access (only service role can access)
DROP POLICY IF EXISTS "Service role can manage keys" ON private.keys;
CREATE POLICY "Service role can manage keys" ON private.keys
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Insert the Mailersend API token
INSERT INTO private.keys (key, value) 
VALUES ('MAILERSEND_API_TOKEN', 'mlsn.d6efdd5f897cf82ead6e0f385b9604b4b2767a4a1b8c4414288dfd61f6700361')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- Verify the key was inserted
SELECT key, 
       CASE 
           WHEN value LIKE 'mlsn.%' THEN CONCAT(LEFT(value, 10), '...[hidden]')
           ELSE 'Not set properly'
       END AS token_preview,
       created_at
FROM private.keys 
WHERE key = 'MAILERSEND_API_TOKEN';