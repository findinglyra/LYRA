-- Step 4: Create email templates and helper functions for LYRA app
-- This file contains pre-built email templates for common use cases

-- Create email templates table
CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_key TEXT UNIQUE NOT NULL,
    subject TEXT NOT NULL,
    html_body TEXT NOT NULL,
    text_body TEXT,
    variables TEXT[] DEFAULT '{}', -- Array of variable names used in template
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Only service role can manage templates
CREATE POLICY "Service role can manage email templates" ON public.email_templates
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Authenticated users can read active templates
CREATE POLICY "Users can read active templates" ON public.email_templates
    FOR SELECT
    TO authenticated
    USING (is_active = true);

-- Insert default email templates for LYRA
INSERT INTO public.email_templates (template_key, subject, html_body, text_body, variables, description) VALUES
(
    'welcome_email',
    'Welcome to LYRA - Your Musical Journey Begins! 🎵',
    '<!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 32px; font-weight: bold; color: #0e86d4; margin-bottom: 10px; }
            .tagline { color: #64748b; font-style: italic; }
            .content { line-height: 1.6; color: #334155; }
            .button { display: inline-block; background: linear-gradient(135deg, #0e86d4, #055c9d); color: white; text-decoration: none; padding: 12px 30px; border-radius: 25px; margin: 20px 0; font-weight: bold; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">LYRA</div>
                <div class="tagline">Where your playlist meets your person</div>
            </div>
            
            <div class="content">
                <h2>Welcome, {{user_name}}! 🌟</h2>
                
                <p>We''re thrilled to have you join the LYRA community! Your journey to finding meaningful connections through the universal language of music starts now.</p>
                
                <p><strong>What''s next?</strong></p>
                <ul>
                    <li>Complete your musical profile</li>
                    <li>Connect your favorite streaming services</li>
                    <li>Discover people who share your musical taste</li>
                    <li>Start meaningful conversations about the songs that move you</li>
                </ul>
                
                <div style="text-align: center;">
                    <a href="{{app_url}}" class="button">Complete Your Profile</a>
                </div>
                
                <p>Ready to find your harmony? Let your musical journey guide you to authentic connections that resonate with your soul.</p>
                
                <p>With musical love,<br>The LYRA Team 🎵</p>
            </div>
            
            <div class="footer">
                <p>This email was sent to {{user_email}}. If you didn''t sign up for LYRA, you can safely ignore this email.</p>
                <p>© 2024 LYRA. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>',
    'Welcome to LYRA - Your Musical Journey Begins!

    Hi {{user_name}},

    We''re thrilled to have you join the LYRA community! Your journey to finding meaningful connections through the universal language of music starts now.

    What''s next?
    - Complete your musical profile
    - Connect your favorite streaming services  
    - Discover people who share your musical taste
    - Start meaningful conversations about the songs that move you

    Complete your profile: {{app_url}}

    Ready to find your harmony? Let your musical journey guide you to authentic connections that resonate with your soul.

    With musical love,
    The LYRA Team

    ---
    This email was sent to {{user_email}}. If you didn''t sign up for LYRA, you can safely ignore this email.
    © 2024 LYRA. All rights reserved.',
    ARRAY['user_name', 'user_email', 'app_url'],
    'Welcome email sent after user registration'
),
(
    'email_confirmation',
    'Confirm Your Email - LYRA 🎵',
    '<!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 32px; font-weight: bold; color: #0e86d4; margin-bottom: 10px; }
            .content { line-height: 1.6; color: #334155; text-align: center; }
            .button { display: inline-block; background: linear-gradient(135deg, #0e86d4, #055c9d); color: white; text-decoration: none; padding: 15px 40px; border-radius: 25px; margin: 20px 0; font-weight: bold; font-size: 16px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">LYRA</div>
            </div>
            
            <div class="content">
                <h2>Confirm Your Email Address</h2>
                
                <p>Hi {{user_name}},</p>
                
                <p>Thank you for joining LYRA! To complete your registration and start discovering your musical matches, please confirm your email address.</p>
                
                <div>
                    <a href="{{confirmation_url}}" class="button">Confirm Email Address</a>
                </div>
                
                <p>This link will expire in 24 hours for security purposes.</p>
                
                <p>If you didn''t create an account with LYRA, you can safely ignore this email.</p>
            </div>
            
            <div class="footer">
                <p>If the button doesn''t work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #0e86d4;">{{confirmation_url}}</p>
                <p>© 2024 LYRA. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>',
    'Confirm Your Email - LYRA

    Hi {{user_name}},

    Thank you for joining LYRA! To complete your registration and start discovering your musical matches, please confirm your email address.

    Click here to confirm: {{confirmation_url}}

    This link will expire in 24 hours for security purposes.

    If you didn''t create an account with LYRA, you can safely ignore this email.

    ---
    If the link doesn''t work, copy and paste this URL into your browser:
    {{confirmation_url}}

    © 2024 LYRA. All rights reserved.',
    ARRAY['user_name', 'confirmation_url'],
    'Email confirmation for new registrations'
),
(
    'password_reset',
    'Reset Your Password - LYRA 🔐',
    '<!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 32px; font-weight: bold; color: #0e86d4; margin-bottom: 10px; }
            .content { line-height: 1.6; color: #334155; text-align: center; }
            .button { display: inline-block; background: linear-gradient(135deg, #0e86d4, #055c9d); color: white; text-decoration: none; padding: 15px 40px; border-radius: 25px; margin: 20px 0; font-weight: bold; font-size: 16px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 14px; }
            .warning { background: #fef3cd; border: 1px solid #facc15; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">LYRA</div>
            </div>
            
            <div class="content">
                <h2>Reset Your Password</h2>
                
                <p>Hi {{user_name}},</p>
                
                <p>We received a request to reset the password for your LYRA account. If you made this request, click the button below to reset your password.</p>
                
                <div>
                    <a href="{{reset_url}}" class="button">Reset Password</a>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour for your security. If you didn''t request this password reset, please ignore this email or contact support if you''re concerned about your account security.
                </div>
            </div>
            
            <div class="footer">
                <p>If the button doesn''t work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #0e86d4;">{{reset_url}}</p>
                <p>© 2024 LYRA. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>',
    'Reset Your Password - LYRA

    Hi {{user_name}},

    We received a request to reset the password for your LYRA account. If you made this request, click the link below to reset your password.

    Reset your password: {{reset_url}}

    ⚠️ SECURITY NOTICE: This link will expire in 1 hour for your security. If you didn''t request this password reset, please ignore this email or contact support if you''re concerned about your account security.

    ---
    If the link doesn''t work, copy and paste this URL into your browser:
    {{reset_url}}

    © 2024 LYRA. All rights reserved.',
    ARRAY['user_name', 'reset_url'],
    'Password reset email template'
);

-- Function to send templated emails
CREATE OR REPLACE FUNCTION send_templated_email(
    template_key_param TEXT,
    recipient_email TEXT,
    variables_param JSONB DEFAULT '{}'::JSONB,
    sender_email TEXT DEFAULT 'noreply@lyra.app'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    template_record RECORD;
    final_subject TEXT;
    final_html TEXT;
    final_text TEXT;
    var_key TEXT;
    var_value TEXT;
    message_json JSON;
BEGIN
    -- Get template
    SELECT * INTO template_record
    FROM public.email_templates
    WHERE template_key = template_key_param AND is_active = true;
    
    IF template_record IS NULL THEN
        RAISE EXCEPTION 'Template not found: %', template_key_param;
    END IF;
    
    -- Start with template content
    final_subject := template_record.subject;
    final_html := template_record.html_body;
    final_text := template_record.text_body;
    
    -- Replace variables
    FOR var_key, var_value IN SELECT * FROM jsonb_each_text(variables_param) LOOP
        final_subject := replace(final_subject, '{{' || var_key || '}}', var_value);
        final_html := replace(final_html, '{{' || var_key || '}}', var_value);
        final_text := replace(final_text, '{{' || var_key || '}}', var_value);
    END LOOP;
    
    -- Build message JSON
    message_json := json_build_object(
        'sender', sender_email,
        'recipient', recipient_email,
        'subject', final_subject,
        'html_body', final_html,
        'text_body', final_text
    );
    
    -- Send email
    RETURN send_email_message(message_json);
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION send_templated_email(TEXT, TEXT, JSONB, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION send_templated_email(TEXT, TEXT, JSONB, TEXT) TO service_role;