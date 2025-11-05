# LYRA Mailersend Integration Setup Guide

This guide will help you set up Mailersend email integration for your LYRA application.

## 📋 Prerequisites

1. **Mailersend Account**: Sign up at [mailersend.com](https://www.mailersend.com/)
2. **Verified Domain**: Add and verify your sending domain in Mailersend
3. **API Token**: Generate an API token from your Mailersend dashboard
4. **Supabase Project**: Your LYRA Supabase project with appropriate permissions

## 🚀 Setup Steps

### Step 1: Update Environment Variables

1. **Add your Mailersend API token** to your `.env` file:
   ```bash
   # Replace 'your_actual_mailersend_token_here' with your real token
   MAILERSEND_API_TOKEN=mlsn.your_actual_mailersend_token_here
   ```

2. **Get your Mailersend token**:
   - Go to [Mailersend Dashboard](https://app.mailersend.com/)
   - Navigate to: Settings → API Tokens
   - Create a new token with "Email sending" permissions
   - Copy the token (it starts with `mlsn.`)

### Step 2: Run SQL Setup Scripts

Execute these SQL files **in order** in your Supabase SQL Editor:

#### 1. Setup Private Keys (Required First)
```sql
-- File: supabase/01_setup_private_keys.sql
-- Creates private schema and stores your Mailersend API token securely
```

**IMPORTANT**: After running this script, update the API token:
```sql
UPDATE private.keys 
SET value = 'mlsn.your_actual_mailersend_token_here' 
WHERE key = 'MAILERSEND_API_TOKEN';
```

#### 2. Email Function Setup
```sql
-- File: supabase/02_send_email_message.sql  
-- Creates the main email sending function
```

#### 3. Messages Table (Optional but Recommended)
```sql
-- File: supabase/03_setup_messages_table.sql
-- Creates table to track all sent emails
```

#### 4. Email Templates
```sql
-- File: supabase/04_email_templates.sql
-- Creates pre-built templates for welcome, confirmation, password reset emails
```

### Step 3: Test the Integration

Run the test queries from `supabase/05_test_mailersend.sql`:

```sql
-- 1. Verify token is stored
SELECT key, LEFT(value, 15) || '...' as token_preview 
FROM private.keys 
WHERE key = 'MAILERSEND_API_TOKEN';

-- 2. Send test email (update email addresses)
SELECT send_email_message(json_build_object(
    'sender', 'your-verified-email@yourdomain.com',
    'recipient', 'test@example.com',
    'subject', 'LYRA Test Email',
    'html_body', '<h1>Test successful!</h1>'
));
```

### Step 4: Domain Configuration

1. **Add your domain** in Mailersend:
   - Go to Mailersend → Domains
   - Add your domain (e.g., `yourdomain.com`)
   - Follow DNS verification steps

2. **Update sender email** in your code to use your verified domain

## 📧 Usage in Your Application

### Frontend Integration

The email service is ready to use in your React components:

```typescript
import { sendWelcomeEmail, sendEmailConfirmation, sendPasswordReset } from '@/services/email';

// Send welcome email
await sendWelcomeEmail(user.email, user.name, 'https://your-app.com');

// Send email confirmation  
await sendEmailConfirmation(user.email, user.name, confirmationUrl);

// Send password reset
await sendPasswordReset(user.email, user.name, resetUrl);
```

### Available Email Templates

1. **welcome_email** - Sent after user registration
2. **email_confirmation** - Email verification 
3. **password_reset** - Password reset emails

### Custom Emails

```typescript
import { sendEmail } from '@/services/email';

await sendEmail({
  recipient: 'user@example.com',
  subject: 'Custom Subject',
  htmlBody: '<h1>Custom HTML content</h1>',
  sender: 'noreply@yourdomain.com'
});
```

## 🔧 Integration Points

### 1. User Registration Flow
```typescript
// In your AuthContext or signup handler
const handleSignUp = async (email, password, name) => {
  // ... create user with Supabase Auth
  
  // Send welcome email
  await sendWelcomeEmail(email, name);
};
```

### 2. Email Confirmation Flow
```typescript
// After user signs up, send confirmation
const confirmationUrl = `${window.location.origin}/auth/confirm?token=${token}`;
await sendEmailConfirmation(user.email, user.name, confirmationUrl);
```

### 3. Password Reset Flow
```typescript
// In password reset handler
const resetUrl = `${window.location.origin}/reset-password?token=${token}`;
await sendPasswordReset(user.email, user.name, resetUrl);
```

## 🛡️ Security Notes

1. **API Token Security**: Your Mailersend token is stored in the private schema, only accessible by service role
2. **RLS Policies**: Email templates and messages have proper Row Level Security
3. **Sender Verification**: Only use verified domains/emails as senders
4. **Rate Limiting**: Consider implementing rate limiting for email sending

## 📊 Monitoring & Analytics

### View Sent Messages
```sql
-- Check recent sent emails
SELECT sender, recipient, subject, status_code, created_at 
FROM messages 
ORDER BY created_at DESC 
LIMIT 10;
```

### Email Template Management
```sql
-- View available templates
SELECT template_key, subject, description 
FROM email_templates 
WHERE is_active = true;
```

## 🚨 Troubleshooting

### Common Issues

1. **Token not found error**:
   - Verify token is stored: `SELECT * FROM private.keys WHERE key = 'MAILERSEND_API_TOKEN'`
   - Check token format starts with `mlsn.`

2. **Domain not verified**:
   - Complete domain verification in Mailersend dashboard
   - Use verified sender email addresses

3. **Function not found**:
   - Ensure all SQL scripts ran successfully
   - Check Supabase logs for errors

4. **TypeScript errors**:
   - The updated `src/types/supabase.ts` includes new tables and functions
   - Restart TypeScript server if needed

### Testing Checklist

- [ ] API token stored correctly
- [ ] Domain verified in Mailersend
- [ ] Test email sends successfully
- [ ] Templates render correctly
- [ ] Messages tracked in database
- [ ] Frontend service functions work

## 🎯 Next Steps

1. **Customize Templates**: Update email templates with your branding
2. **Add More Templates**: Create templates for matches, notifications, etc.
3. **Webhook Integration**: Set up Mailersend webhooks for delivery tracking
4. **Email Preferences**: Allow users to manage email preferences
5. **Analytics**: Build dashboards for email performance

---

Your LYRA app now has professional email capabilities! 🎵📧