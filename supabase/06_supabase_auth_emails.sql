-- Supabase SMTP Configuration for Authentication Emails
-- This configures Supabase's built-in email system for auth flows

-- 1. First, let's create a function to handle custom auth email templates
CREATE OR REPLACE FUNCTION get_auth_email_template(
    template_type TEXT,
    user_email TEXT,
    user_name TEXT DEFAULT NULL,
    confirmation_url TEXT DEFAULT NULL,
    reset_url TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    template_data JSON;
BEGIN
    CASE template_type
        WHEN 'confirmation' THEN
            template_data := json_build_object(
                'subject', 'Welcome to LYRA - Confirm Your Email 🎵',
                'html', 
                '<!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; }
                        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        .header { text-align: center; margin-bottom: 30px; }
                        .logo { font-size: 32px; font-weight: bold; color: #0e86d4; margin-bottom: 10px; }
                        .tagline { color: #64748b; font-style: italic; }
                        .content { line-height: 1.6; color: #334155; text-align: center; }
                        .button { display: inline-block; background: linear-gradient(135deg, #0e86d4, #055c9d); color: white; text-decoration: none; padding: 15px 40px; border-radius: 25px; margin: 20px 0; font-weight: bold; font-size: 16px; }
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
                            <h2>Welcome to LYRA! 🌟</h2>
                            
                            <p>Hi' || COALESCE(' ' || user_name, '') || ',</p>
                            
                            <p>Welcome to the LYRA community! We''re excited to have you join us on this musical journey where authentic connections are formed through the universal language of music.</p>
                            
                            <p>To complete your registration and start discovering your perfect musical matches, please confirm your email address:</p>
                            
                            <div>
                                <a href="' || COALESCE(confirmation_url, '{{ .ConfirmationURL }}') || '" class="button">Confirm Email & Start Your Journey</a>
                            </div>
                            
                            <p><strong>What awaits you:</strong></p>
                            <ul style="text-align: left; display: inline-block;">
                                <li>🎵 Create your unique musical profile</li>
                                <li>💫 Discover people who share your musical taste</li>
                                <li>🎶 Connect through the songs that move your soul</li>
                                <li>✨ Find harmony in both music and relationships</li>
                            </ul>
                            
                            <p>This confirmation link will expire in 24 hours for security.</p>
                            
                            <p>Ready to find your musical soulmate?</p>
                            
                            <p>With musical love,<br>The LYRA Team 🎵</p>
                        </div>
                        
                        <div class="footer">
                            <p>If the button doesn''t work, copy and paste this link:</p>
                            <p style="word-break: break-all; color: #0e86d4;">' || COALESCE(confirmation_url, '{{ .ConfirmationURL }}') || '</p>
                            <p>This email was sent to ' || user_email || '</p>
                            <p>© 2024 LYRA. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>'
            );
        
        WHEN 'recovery' THEN
            template_data := json_build_object(
                'subject', 'Reset Your LYRA Password 🔐',
                'html',
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
                            
                            <p>Hi' || COALESCE(' ' || user_name, '') || ',</p>
                            
                            <p>We received a request to reset your LYRA password. If you made this request, click the button below to create a new password:</p>
                            
                            <div>
                                <a href="' || COALESCE(reset_url, '{{ .ConfirmationURL }}') || '" class="button">Reset My Password</a>
                            </div>
                            
                            <div class="warning">
                                <strong>⚠️ Security Notice:</strong> This link expires in 1 hour. If you didn''t request this reset, you can safely ignore this email.
                            </div>
                            
                            <p>Need help? Contact our support team - we''re here to help you get back to discovering your musical connections!</p>
                        </div>
                        
                        <div class="footer">
                            <p>If the button doesn''t work, copy and paste this link:</p>
                            <p style="word-break: break-all; color: #0e86d4;">' || COALESCE(reset_url, '{{ .ConfirmationURL }}') || '</p>
                            <p>© 2024 LYRA. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>'
            );
        
        ELSE
            RAISE EXCEPTION 'Unknown template type: %', template_type;
    END CASE;
    
    RETURN template_data;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_auth_email_template(TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;

-- Create a simple function to test Supabase auth emails
CREATE OR REPLACE FUNCTION test_auth_email_template(template_type TEXT DEFAULT 'confirmation')
RETURNS JSON
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN get_auth_email_template(
        template_type,
        'test@example.com',
        'Test User',
        'https://your-app.com/auth/confirm?token=test123',
        'https://your-app.com/reset-password?token=test123'
    );
END;
$$;