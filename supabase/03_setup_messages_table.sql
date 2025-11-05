-- Step 3: Create messages table for tracking email messages (optional)
-- This table will automatically store all sent emails for tracking and analytics

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Message details
    sender TEXT NOT NULL,
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    html_body TEXT,
    text_body TEXT,
    
    -- Provider information
    provider TEXT NOT NULL DEFAULT 'mailersend',
    provider_message_id TEXT,
    
    -- Request/Response tracking
    request_body JSONB,
    response_body JSONB,
    status_code INTEGER,
    
    -- Delivery tracking
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    bounced_at TIMESTAMPTZ,
    complained_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,
    
    -- Metadata
    tags TEXT[] DEFAULT ARRAY['lyra-app'],
    category TEXT DEFAULT 'notifications',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON public.messages(recipient);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender);
CREATE INDEX IF NOT EXISTS idx_messages_provider_id ON public.messages(provider_message_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_status ON public.messages(status_code);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see messages sent to them
CREATE POLICY "Users can view their own messages" ON public.messages
    FOR SELECT
    TO authenticated
    USING (
        recipient = auth.jwt() ->> 'email'
        OR sender = auth.jwt() ->> 'email'
    );

-- Service role can manage all messages (for admin/system operations)
CREATE POLICY "Service role can manage all messages" ON public.messages
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_messages_updated_at_trigger ON public.messages;
CREATE TRIGGER update_messages_updated_at_trigger
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION update_messages_updated_at();

-- Grant permissions
GRANT SELECT ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;