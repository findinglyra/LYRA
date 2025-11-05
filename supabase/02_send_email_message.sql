-- Step 2: Create the send_email_message function for Mailersend
-- This function handles sending emails via Mailersend API

CREATE OR REPLACE FUNCTION send_email_message(message_json JSON)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    -- Mailersend configuration
    email_provider text := 'mailersend';
    api_key text;
    api_url text := 'https://api.mailersend.com/v1/email';
    
    -- Message components
    sender_email text;
    sender_name text;
    recipient_email text;
    recipient_name text;
    subject_text text;
    html_content text;
    text_content text;
    
    -- HTTP request
    request_body json;
    response json;
    http_response record;
    
    -- Tracking
    message_id uuid;
    provider_message_id text;
BEGIN
    -- Get API key from private.keys table
    SELECT value INTO api_key 
    FROM private.keys 
    WHERE key = 'MAILERSEND_API_TOKEN';
    
    IF api_key IS NULL THEN
        RAISE EXCEPTION 'MAILERSEND_API_TOKEN not found in private.keys table';
    END IF;
    
    -- Extract message details from JSON
    sender_email := message_json->>'sender';
    sender_name := COALESCE(message_json->>'sender_name', split_part(sender_email, '@', 1));
    recipient_email := message_json->>'recipient';
    recipient_name := COALESCE(message_json->>'recipient_name', split_part(recipient_email, '@', 1));
    subject_text := message_json->>'subject';
    html_content := message_json->>'html_body';
    text_content := COALESCE(message_json->>'text_body', strip_tags(html_content));
    
    -- Validate required fields
    IF sender_email IS NULL OR recipient_email IS NULL OR subject_text IS NULL THEN
        RAISE EXCEPTION 'Missing required fields: sender, recipient, and subject are required';
    END IF;
    
    -- Build Mailersend API request body
    request_body := json_build_object(
        'from', json_build_object(
            'email', sender_email,
            'name', sender_name
        ),
        'to', json_build_array(
            json_build_object(
                'email', recipient_email,
                'name', recipient_name
            )
        ),
        'subject', subject_text,
        'html', html_content,
        'text', text_content,
        'tags', json_build_array('lyra-app'),
        'category', 'lyra-notifications'
    );
    
    -- Make HTTP request to Mailersend API
    SELECT INTO http_response *
    FROM http((
        'POST',
        api_url,
        ARRAY[
            http_header('Authorization', 'Bearer ' || api_key),
            http_header('Content-Type', 'application/json'),
            http_header('X-Requested-With', 'XMLHttpRequest')
        ],
        'application/json',
        request_body::text
    ));
    
    -- Parse response
    response := http_response.content::json;
    
    -- Extract provider message ID if available
    provider_message_id := response->>'message_id';
    
    -- Store message in messages table if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages' AND table_schema = 'public') THEN
        INSERT INTO public.messages (
            sender,
            recipient,
            subject,
            html_body,
            text_body,
            provider,
            provider_message_id,
            request_body,
            response_body,
            status_code,
            created_at
        ) VALUES (
            sender_email,
            recipient_email,
            subject_text,
            html_content,
            text_content,
            email_provider,
            provider_message_id,
            request_body,
            response,
            http_response.status,
            NOW()
        ) RETURNING id INTO message_id;
    END IF;
    
    -- Return response with additional metadata
    RETURN json_build_object(
        'success', CASE WHEN http_response.status BETWEEN 200 AND 299 THEN true ELSE false END,
        'status_code', http_response.status,
        'provider_response', response,
        'message_id', message_id,
        'provider_message_id', provider_message_id,
        'provider', email_provider
    );
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log error and return failure response
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM,
            'error_code', SQLSTATE,
            'provider', email_provider
        );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION send_email_message(JSON) TO authenticated;

-- Grant execute permission to service role for system emails
GRANT EXECUTE ON FUNCTION send_email_message(JSON) TO service_role;