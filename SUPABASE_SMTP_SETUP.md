# LYRA Email Setup: Supabase SMTP + Mailersend Integration

This guide sets up dual email systems for your LYRA app:
- **Supabase SMTP** for authentication emails (confirmation, password reset)
- **Mailersend** for custom emails (welcome, notifications, marketing)

## 🎯 Quick Setup Strategy

### Phase 1: Supabase SMTP for Auth (Now - Day 1-21)
- ✅ Email confirmation for new signups
- ✅ Password reset emails  
- ✅ Custom LYRA-branded templates
- ✅ Works immediately with any email

### Phase 2: Mailersend for Custom Emails (Day 22+)
- 📧 Welcome emails
- 📧 Match notifications
- 📧 Marketing campaigns
- 📧 Advanced tracking & analytics

## 🚀 Step 1: Configure Supabase SMTP

### A. Update Auth Settings in Supabase Dashboard

1. **Go to Authentication → Settings** in your Supabase dashboard
2. **Scroll to "SMTP Settings"**
3. **Configure the following:**

```bash
# SMTP Configuration (Use Supabase's default or configure custom)
SMTP Host: smtp.gmail.com (or your preferred provider)
SMTP Port: 587
SMTP User: your-email@gmail.com
SMTP Password: your-app-password
```

### B. Update Email Templates

1. **Go to Authentication → Email Templates**
2. **Update "Confirm signup" template:**

```html
<h2>Welcome to LYRA! 🎵</h2>
<p>Hi there!</p>
<p>Welcome to LYRA - where your playlist meets your person! We're excited to have you join our community of music lovers.</p>
<p>To complete your registration and start your musical journey, please confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}" style="background: linear-gradient(135deg, #0e86d4, #055c9d); color: white; text-decoration: none; padding: 15px 40px; border-radius: 25px; display: inline-block; font-weight: bold;">Confirm Email & Start Your Journey</a></p>
<p><strong>What awaits you:</strong></p>
<ul>
<li>🎵 Create your unique musical profile</li>
<li>💫 Discover people who share your musical taste</li>
<li>🎶 Connect through the songs that move your soul</li>
<li>✨ Find harmony in both music and relationships</li>
</ul>
<p>Ready to find your musical soulmate?</p>
<p>With musical love,<br>The LYRA Team 🎵</p>
<hr>
<p><small>If the button doesn't work, copy this link: {{ .ConfirmationURL }}</small></p>
```

3. **Update "Reset password" template:**

```html
<h2>Reset Your LYRA Password 🔐</h2>
<p>Hi there!</p>
<p>We received a request to reset your LYRA password. If you made this request, click the button below:</p>
<p><a href="{{ .ConfirmationURL }}" style="background: linear-gradient(135deg, #0e86d4, #055c9d); color: white; text-decoration: none; padding: 15px 40px; border-radius: 25px; display: inline-block; font-weight: bold;">Reset My Password</a></p>
<p><strong>⚠️ Security Notice:</strong> This link expires in 1 hour. If you didn't request this reset, you can safely ignore this email.</p>
<p>Need help? Contact our support team - we're here to help you get back to discovering your musical connections!</p>
<p>The LYRA Team 🎵</p>
<hr>
<p><small>If the button doesn't work, copy this link: {{ .ConfirmationURL }}</small></p>
```

### C. Update Your Frontend Auth Flow

Update your `AuthContext.tsx` to handle email confirmation properly:

```typescript
// In your signup function
const signUp = async (email: string, password: string, metadata?: any) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/confirm`
      }
    });

    if (error) throw error;

    // Show success message
    toast({
      title: "Check your email! 📧",
      description: "We've sent you a confirmation link to complete your registration.",
    });

    return { data, error: null };
  } catch (error) {
    console.error('Signup error:', error);
    return { data: null, error };
  }
};
```

## 🔧 Step 2: Create Auth Callback Handler

Create or update `/Users/startferanmi/Data-Scientist/LYRA/src/pages/AuthCallback.tsx`:

```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive"
          });
          navigate('/login');
          return;
        }

        if (data.session) {
          toast({
            title: "Email Confirmed! 🎉",
            description: "Welcome to LYRA! Let's complete your profile.",
          });
          navigate('/create-profile');
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-blue-600" />
        <h2 className="text-xl font-semibold mb-2">Confirming your email...</h2>
        <p className="text-gray-600">Please wait while we verify your account.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
```

## 📧 Step 3: Keep Mailersend for Future Custom Emails

Your Mailersend setup is ready for when you get domain approval. You can use it for:

```typescript
// After domain is approved, use for welcome emails
import { sendWelcomeEmail } from '@/services/email';

// In your auth success handler
const handleSuccessfulSignup = async (user) => {
  // Supabase handles email confirmation
  // Later, when domain is ready, send welcome email via Mailersend
  try {
    await sendWelcomeEmail(user.email, user.name);
  } catch (error) {
    console.log('Welcome email failed, but user can still proceed');
  }
};
```

## ✅ Step 4: Test the Setup

### Test Email Confirmation Flow:

1. **Sign up a new user** in your app
2. **Check that confirmation email arrives** (check spam folder too)
3. **Click the confirmation link**
4. **Verify user gets redirected** to profile creation

### Test Password Reset:

1. **Go to login page**
2. **Click "Forgot Password"** 
3. **Enter email and submit**
4. **Check for reset email**
5. **Click reset link and verify** it works

## 🎯 Summary: Best of Both Worlds

### ✅ Immediate Benefits (Supabase SMTP):
- Email confirmation works instantly
- Password reset works instantly  
- Professional LYRA-branded templates
- No domain verification needed
- Reliable delivery

### 🚀 Future Benefits (Mailersend - Day 22+):
- Advanced email analytics
- Better deliverability for marketing emails
- More template customization options
- Webhook support for tracking opens/clicks
- Professional sending reputation

## 🔧 Quick Setup Checklist:

- [ ] Configure Supabase SMTP settings
- [ ] Update email templates in Supabase dashboard
- [ ] Update AuthContext signup flow
- [ ] Test email confirmation 
- [ ] Test password reset
- [ ] Keep Mailersend config for future use

This approach gives you working email authentication immediately while preserving your advanced Mailersend setup for when you're ready! 🎵✨