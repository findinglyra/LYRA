-- Test the Mailersend integration
-- Run these queries to test your email setup

-- 1. Verify the API token is stored correctly
SELECT 
    key,
    CASE 
        WHEN value LIKE 'mlsn.%' THEN CONCAT(LEFT(value, 15), '...[', LENGTH(value) - 15, ' chars hidden]')
        ELSE 'Invalid token format - should start with "mlsn."'
    END AS token_status,
    created_at
FROM private.keys 
WHERE key = 'MAILERSEND_API_TOKEN';

-- 2. Test basic email sending
-- IMPORTANT: Replace these email addresses with real ones for testing
SELECT send_email_message(json_build_object(
    'sender', 'noreply@yourdomain.com',  -- Replace with your verified sender
    'recipient', 'test@example.com',      -- Replace with test recipient
    'subject', 'LYRA Test Email - Mailersend Integration Working! 🎵',
    'html_body', '
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #0e86d4; font-size: 32px; margin-bottom: 10px;">LYRA</h1>
                <p style="color: #64748b; font-style: italic;">Where your playlist meets your person</p>
            </div>
            
            <h2 style="color: #334155;">🎉 Mailersend Integration Success!</h2>
            
            <p>Congratulations! Your LYRA application can now send emails via Mailersend.</p>
            
            <p><strong>This test confirms:</strong></p>
            <ul>
                <li>✅ Mailersend API token is configured</li>
                <li>✅ Database functions are working</li>
                <li>✅ Email templates are ready</li>
                <li>✅ Your app can send transactional emails</li>
            </ul>
            
            <div style="background: #f0f9ff; border: 1px solid #0369a1; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>🚀 Next Steps:</strong></p>
                <ol>
                    <li>Test welcome emails for new users</li>
                    <li>Test email confirmation flow</li>
                    <li>Test password reset emails</li>
                    <li>Configure your production domain</li>
                </ol>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                This is a test message sent from your LYRA app using 
                <a href="https://supabase.io" style="color: #0e86d4;">Supabase</a> and 
                <a href="https://mailersend.com" style="color: #0e86d4;">Mailersend</a>.
            </p>
        </body>
        </html>
    '
)) AS test_result;

-- 3. Test templated email (Welcome email)
-- IMPORTANT: Replace the email and variables with real values
SELECT send_templated_email(
    'welcome_email',
    'test@example.com',  -- Replace with test recipient
    json_build_object(
        'user_name', 'Test User',
        'user_email', 'test@example.com',
        'app_url', 'https://your-lyra-app.com'
    )::jsonb,
    'noreply@yourdomain.com'  -- Replace with your verified sender
) AS welcome_email_result;

-- 4. Test email confirmation template
SELECT send_templated_email(
    'email_confirmation',
    'test@example.com',  -- Replace with test recipient
    json_build_object(
        'user_name', 'Test User',
        'confirmation_url', 'https://your-lyra-app.com/auth/confirm?token=test123'
    )::jsonb
) AS confirmation_email_result;

-- 5. Check sent messages (if messages table exists)
SELECT 
    id,
    sender,
    recipient,
    subject,
    provider,
    status_code,
    created_at,
    CASE 
        WHEN status_code BETWEEN 200 AND 299 THEN '✅ Success'
        ELSE '❌ Failed'
    END AS status
FROM public.messages 
ORDER BY created_at DESC 
LIMIT 10;

-- 6. View available email templates
SELECT 
    template_key,
    subject,
    variables,
    description,
    is_active,
    created_at
FROM public.email_templates 
WHERE is_active = true
ORDER BY template_key;