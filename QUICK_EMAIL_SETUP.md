# Quick Supabase SMTP Email Setup for LYRA

## 🎯 Immediate Action Items

### 1. Configure Supabase Auth Settings

Go to your **Supabase Dashboard → Authentication → Settings**:

#### A. Site URL Configuration
```
Site URL: http://localhost:8081
Additional URLs: 
- https://your-production-domain.com (when ready)
```

#### B. Email Settings
Enable **"Confirm email"** and **"Enable email confirmations"**

#### C. Redirect URLs
```
Redirect URLs:
- http://localhost:8081/auth/callback
- https://your-production-domain.com/auth/callback (when ready)
```

### 2. Update Email Templates

#### Confirmation Email Template:
Go to **Authentication → Email Templates → Confirm signup**

**Subject:** `Welcome to LYRA - Confirm Your Email 🎵`

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; }
.container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.header { text-align: center; margin-bottom: 30px; }
.logo { font-size: 32px; font-weight: bold; color: #0e86d4; margin-bottom: 10px; }
.tagline { color: #64748b; font-style: italic; }
.content { line-height: 1.6; color: #334155; }
.button { display: inline-block; background: linear-gradient(135deg, #0e86d4, #055c9d); color: white; text-decoration: none; padding: 15px 40px; border-radius: 25px; margin: 20px 0; font-weight: bold; }
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
    <p>We're thrilled to have you join the LYRA community! Your journey to finding meaningful connections through the universal language of music starts now.</p>
    
    <div style="text-align: center;">
      <a href="{{ .ConfirmationURL }}" class="button">Confirm Email & Start Your Journey</a>
    </div>
    
    <p><strong>What awaits you:</strong></p>
    <ul>
      <li>🎵 Create your unique musical profile</li>
      <li>💫 Discover people who share your musical taste</li>
      <li>🎶 Connect through the songs that move your soul</li>
      <li>✨ Find harmony in both music and relationships</li>
    </ul>
    
    <p>Ready to find your musical soulmate?</p>
    <p>With musical love,<br>The LYRA Team 🎵</p>
  </div>
  
  <div class="footer">
    <p>If the button doesn't work, copy this link: {{ .ConfirmationURL }}</p>
    <p>© 2024 LYRA. All rights reserved.</p>
  </div>
</div>
</body>
</html>
```

#### Password Reset Template:
Go to **Authentication → Email Templates → Reset password**

**Subject:** `Reset Your LYRA Password 🔐`

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; }
.container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.header { text-align: center; margin-bottom: 30px; }
.logo { font-size: 32px; font-weight: bold; color: #0e86d4; margin-bottom: 10px; }
.content { line-height: 1.6; color: #334155; text-align: center; }
.button { display: inline-block; background: linear-gradient(135deg, #0e86d4, #055c9d); color: white; text-decoration: none; padding: 15px 40px; border-radius: 25px; margin: 20px 0; font-weight: bold; }
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
    <p>We received a request to reset your LYRA password. If you made this request, click the button below:</p>
    
    <div>
      <a href="{{ .ConfirmationURL }}" class="button">Reset My Password</a>
    </div>
    
    <div class="warning">
      <strong>⚠️ Security Notice:</strong> This link expires in 1 hour. If you didn't request this reset, you can safely ignore this email.
    </div>
    
    <p>The LYRA Team 🎵</p>
  </div>
  
  <div class="footer">
    <p>If the button doesn't work, copy this link: {{ .ConfirmationURL }}</p>
    <p>© 2024 LYRA. All rights reserved.</p>
  </div>
</div>
</body>
</html>
```

### 3. Test Your Setup

1. **Start your development server:** `npm run dev`
2. **Go to:** http://localhost:8081
3. **Sign up with a real email address**
4. **Check your email** for the confirmation message
5. **Click the confirmation link**
6. **Verify you're redirected** to the profile creation page

### 4. Troubleshooting

**If emails aren't arriving:**
- Check your spam/junk folder
- Verify the email address is correct
- Check Supabase Auth logs in the dashboard

**If confirmation link doesn't work:**
- Ensure redirect URL is set correctly in Supabase
- Check browser console for errors
- Verify AuthCallback component is working

## 🎊 You're All Set!

Your LYRA app now has:
- ✅ Professional email confirmation
- ✅ Password reset functionality  
- ✅ Beautiful LYRA-branded emails
- ✅ Immediate functionality (no domain setup needed)
- 🚀 Mailersend ready for future advanced features

The email authentication flow is now ready to use while you prepare your Mailersend domain verification for advanced email features! 🎵✨