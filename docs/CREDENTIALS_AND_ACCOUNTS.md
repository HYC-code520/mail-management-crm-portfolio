# 🔐 Your Website Accounts & Passwords Guide

**Last Updated:** January 11, 2026

---

## 📖 What This Document Is

This is a complete list of all the accounts, passwords, and important "keys" that your mail management website needs to work. Think of these like the keys to different locks - each service needs its own key.

**IMPORTANT SECURITY RULES:**
- ✅ Keep this document in a password manager (like 1Password, LastPass, or Dashlane)
- ✅ Never email passwords in plain text
- ❌ Never share passwords with strangers
- ✅ Change passwords if someone leaves your team
- ✅ Turn on "Two-Factor Authentication" (2FA) wherever possible - it's like having two locks instead of one

---

## 🗂️ Quick Overview - What Services You're Using

Your website is made of several pieces that all work together:

| Service | What It Does | Who Owns It | Cost |
|---------|--------------|-------------|------|
| **GitHub** | Stores all the website code | You | Free |
| **Vercel** | Runs your website (frontend) | You | Free tier |
| **Render** | Runs your backend server | You | Free tier |
| **Supabase** | Stores all your data (database) | You | Free tier |
| **Google Cloud** | Lets you send emails through Gmail | You | Free |
| **Gmail Account** | The email address that sends notifications | You | Free |

---

## 1️⃣ GitHub - Your Code Storage

**What it is:** GitHub is like Google Drive for computer code. All the files that make your website work are stored here.

**Account Owner:** [CLIENT EMAIL HERE]

**Login Details:**
- Website: https://github.com
- Repository Name: `HYC-code520/mail-management-system`
- Repository URL: https://github.com/HYC-code520/mail-management-system

**Important Settings:**
- ✅ **Two-Factor Authentication (2FA):** MUST be turned on
- ✅ **Repository Privacy:** Set to "Private" (so only you and your team can see it)
- ✅ **Team Members:** [List who has access]

**What You Can Do Here:**
- See the history of all changes made to your website
- Download a complete copy of all your code
- Give access to new developers you hire

**What to Never Do:**
- Don't make the repository "Public" - your code should stay private
- Don't delete the repository - this is your only copy of the code
- Don't share your GitHub password with anyone

---

## 2️⃣ Vercel - Your Website (Frontend)

**What it is:** Vercel is the company that "hosts" your website - meaning they make it available on the internet 24/7. This is the part your customers see.

**Account Owner:** [CLIENT EMAIL HERE]

**Login Details:**
- Website: https://vercel.com
- Project Name: `mail-management-system-frontend`
- Live Website URL: [YOUR PRODUCTION URL HERE]

**Important Settings:**
- ✅ **Two-Factor Authentication (2FA):** Recommended
- ✅ **Connected to GitHub:** Yes (auto-deploys when code changes)
- ✅ **Custom Domain:** [YOUR DOMAIN NAME HERE]

**Environment Variables Needed:**
These are like secret settings that your website needs to work:

```
VITE_SUPABASE_URL = [Your Supabase Project URL]
VITE_SUPABASE_ANON_KEY = [Your Supabase Public Key]
VITE_API_URL = [Your Render Backend URL]
```

**Where to Find Environment Variables:**
1. Log into Vercel
2. Click on your project
3. Go to "Settings" → "Environment Variables"

**How to Deploy Updates:**
- **Good news:** It happens automatically! When your developer makes changes and saves them to GitHub, Vercel automatically updates your website within 2-3 minutes.

**Costs:**
- Free tier: Perfect for your needs
- If you go over limits: Vercel will email you first

---

## 3️⃣ Render - Your Backend Server

**What it is:** Render runs the "backend" of your website - this is the behind-the-scenes part that handles calculations, sends emails, and talks to your database. Your customers don't see this directly.

**Account Owner:** [CLIENT EMAIL HERE]

**Login Details:**
- Website: https://render.com
- Service Name: `mail-management-backend`
- Backend URL: [YOUR RENDER URL HERE] (something like: https://mail-backend-xxxx.onrender.com)

**Important Settings:**
- ✅ **Two-Factor Authentication (2FA):** Recommended
- ✅ **Connected to GitHub:** Yes (auto-deploys when code changes)
- ✅ **Service Type:** Web Service

**Environment Variables Needed:**
These are the secret settings your backend needs:

```
PORT = 5000

# Database Connection
SUPABASE_URL = [Your Supabase Project URL]
SUPABASE_ANON_KEY = [Your Supabase Public Key]
SUPABASE_SERVICE_ROLE_KEY = [Your Supabase Private Key - KEEP SECRET!]

# Email Sending
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = [Your Gmail address, like: yourmail@gmail.com]
SMTP_PASS = [Your Gmail App Password - see Gmail section below]
SMTP_FROM_NAME = Mei Way Mail Service

# Google OAuth (for sending emails)
GOOGLE_CLIENT_ID = [Your Google Client ID from Google Cloud Console]
GOOGLE_CLIENT_SECRET = [Your Google Client Secret - KEEP SECRET!]
GOOGLE_REDIRECT_URI = [Your backend URL]/api/oauth/gmail/callback
FRONTEND_URL = [Your Vercel frontend URL]

# AI Features (for smart scanning)
GEMINI_API_KEY = [Your Google Gemini API Key - KEEP SECRET!]

# Security
CRON_SECRET = [Random secret password for automated tasks - KEEP SECRET!]

# Optional: Translation (if you want bilingual support)
AWS_ACCESS_KEY_ID = [Optional - for Chinese translation]
AWS_SECRET_ACCESS_KEY = [Optional - for Chinese translation]
AWS_REGION = us-east-1
```

**Where to Find Environment Variables:**
1. Log into Render
2. Click on your backend service
3. Go to "Environment" tab

**How It Deploys:**
- Automatically when code changes in GitHub
- Takes about 5-10 minutes to deploy

**Costs:**
- Free tier: Your backend will "sleep" after 15 minutes of no activity
- What this means: First request after sleeping takes 30-60 seconds to "wake up"
- Paid tier ($7/month): Stays awake 24/7, faster response times

---

## 4️⃣ Supabase - Your Database

**What it is:** Supabase is where ALL your data lives - customer information, mail tracking, fees, email history, everything. Think of it like a very organized Excel spreadsheet that your website can read and write to.

**Account Owner:** [CLIENT EMAIL HERE]

**Login Details:**
- Website: https://supabase.com
- Project Name: `mail-management-system`
- Project URL: [YOUR PROJECT URL] (looks like: https://xxxxx.supabase.co)

**Important Settings:**
- ✅ **Two-Factor Authentication (2FA):** MUST be turned on
- ✅ **Auto-Backups:** Enabled (Supabase does this automatically)
- ✅ **Database Password:** Keep this safe - you'll rarely need it

**Important Keys:**
You have THREE different keys from Supabase. Each one has different powers:

1. **Project URL** (Public - safe to share)
   - What it is: The address of your database
   - Where to use it: Vercel and Render environment variables

2. **Anon Key** (Public - safe to share)
   - What it is: A "read-only" key that lets your website read data
   - Where to use it: Vercel and Render environment variables
   - Security: Can only do what you allow in "Row Level Security" rules

3. **Service Role Key** (🚨 KEEP SECRET! 🚨)
   - What it is: The "master key" that can do ANYTHING to your database
   - Where to use it: ONLY in Render backend (never in Vercel!)
   - Security: Can delete all data, change passwords, everything
   - Warning: If this leaks, someone could delete your entire database

**Where to Find Your Keys:**
1. Log into Supabase
2. Click on your project
3. Go to "Project Settings" → "API"
4. You'll see all three keys there

**Data Backups:**
- **Automatic:** Supabase backs up your database daily
- **Manual:** You can also export your data anytime:
  1. Go to "Table Editor"
  2. Click on a table (like "contacts" or "mail_items")
  3. Click "Export" → Download as CSV
  4. Save this file somewhere safe

**How to Access Your Data:**
- Through the website (normal way)
- Through Supabase dashboard (for viewing/exporting)
- Direct database access (only for developers)

**Costs:**
- Free tier: Up to 500MB database + 2GB bandwidth/month
- This should be plenty for years
- If you grow: Paid tier is $25/month

---

## 5️⃣ Google Cloud Console - For Sending Emails

**What it is:** Google Cloud is where you set up permission for your website to send emails through Gmail. It's like giving your website a special badge that says "yes, this website is allowed to send emails from my Gmail account."

**Account Owner:** [CLIENT EMAIL HERE]

**Login Details:**
- Website: https://console.cloud.google.com
- Project Name: `MeiWay Mail System` (or whatever you named it)

**Important Settings:**
- ✅ **Gmail API:** Must be enabled
- ✅ **OAuth 2.0 Client:** Must be created

**Your OAuth Credentials:**
These let your website send emails:

```
Client ID: [Something like: 123456789-abc.apps.googleusercontent.com]
Client Secret: [Something like: GOCSPX-xxxxxxxxxxxx]
```

**Where These Are Used:**
- In your Render backend environment variables
- Stored as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

**What You Can Do Here:**
- See how many emails were sent
- Add new team members who can send emails
- Revoke access if needed

**Costs:**
- Free for the first 100 emails/day
- After that: Still free up to 1 billion emails (you won't hit this)

---

## 6️⃣ Gmail Account - Your Email Sending Address

**What it is:** This is the actual Gmail email address that sends notifications to your customers.

**Email Address:** [YOUR GMAIL HERE, like: meiway@gmail.com]

**Login Details:**
- Website: https://gmail.com
- Email: [Your email]
- Password: [Your password]

**Important Settings:**
- ✅ **Two-Factor Authentication (2FA):** MUST be turned on
- ✅ **"Less Secure App Access":** Should be OFF (you're using OAuth2 instead)

**App Password (Backup Method):**
If OAuth2 stops working, you can use an "App Password":

1. Go to Google Account Settings
2. Security → 2-Step Verification → App Passwords
3. Generate new password for "Mail"
4. Copy this 16-character password
5. Put it in Render as `SMTP_PASS` variable

**What to Monitor:**
- Check the "Sent" folder occasionally to see what emails went out
- Make sure you're not hitting sending limits (500 emails/day for regular Gmail)

---

## 7️⃣ Google Gemini API - Smart Scanning AI

**What it is:** Google Gemini is the artificial intelligence that helps match scanned mail labels to customers automatically.

**Account Owner:** [CLIENT EMAIL HERE]

**Login Details:**
- Website: https://makersuite.google.com/app/apikey
- Same Google account as above

**API Key:**
```
GEMINI_API_KEY = [Your API key here]
```

**Where It's Used:**
- In Render backend environment variables
- Powers the "Smart Scan" feature

**Costs:**
- Free tier: 60 requests per minute
- Paid tier: Only if you need more speed
- Your usage: Should stay free forever

**What If It Breaks:**
- The system has a backup (Tesseract OCR) that still works
- Just slower and less accurate

---

## 🔐 Password Security Best Practices

### DO These Things:

✅ **Use a Password Manager**
   - Examples: 1Password, LastPass, Bitwarden, Dashlane
   - Costs: $3-8/month (worth it!)
   - Why: Remembers all passwords, generates strong ones, stays secure

✅ **Turn On Two-Factor Authentication (2FA)**
   - On GitHub, Vercel, Render, Supabase, Gmail
   - Use Google Authenticator app or similar
   - Why: Even if password leaks, hackers still can't get in

✅ **Use Different Passwords Everywhere**
   - Never reuse passwords across services
   - Why: If one site gets hacked, others stay safe

✅ **Review Access Regularly**
   - Once every 3-6 months, check who has access
   - Remove people who left your team
   - Why: Prevents unauthorized access

### DON'T Do These Things:

❌ **Never Email Passwords**
   - Use password managers to share instead
   - Or share in person / secure channels

❌ **Never Save Passwords in Browser**
   - Use a real password manager instead
   - Why: Browser storage is less secure

❌ **Never Share Your "Service Role Key"**
   - This is your Supabase master key
   - Only goes in Render backend, nowhere else
   - If leaked: Regenerate immediately

❌ **Never Commit Secrets to GitHub**
   - Never put passwords in code files
   - Always use environment variables
   - Why: If you make repo public later, passwords leak

---

## 🚨 What To Do If Something Gets Exposed

If you accidentally shared a password, API key, or secret:

### Immediate Steps (Do within 1 hour):

1. **Change the password immediately**
   - Log into that service
   - Go to Security settings
   - Click "Change Password"

2. **Rotate API keys**
   - For Supabase: Generate new keys in Project Settings
   - For Google: Create new OAuth credentials
   - For Gemini: Generate new API key

3. **Update environment variables**
   - In Vercel: Settings → Environment Variables → Edit
   - In Render: Environment tab → Edit
   - Use the NEW passwords/keys

4. **Monitor for suspicious activity**
   - Check if anyone logged in from strange locations
   - Check your email "Sent" folder for strange emails
   - Check Supabase for weird data changes

### Who to Contact:

- **Your developer:** Help changing keys and testing
- **Service support:** If you see suspicious charges
  - Vercel: support@vercel.com
  - Render: support@render.com
  - Supabase: support@supabase.io

---

## 📊 Cost Summary

Here's what you should expect to pay monthly:

| Service | Free Tier | When You'd Pay | Paid Cost |
|---------|-----------|----------------|-----------|
| GitHub | ✅ Free | If you need private repos for teams | $4/user/mo |
| Vercel | ✅ Free | If traffic is very high | $20/mo |
| Render | ✅ Free* | If you want 24/7 uptime | $7/mo |
| Supabase | ✅ Free | If database grows past 500MB | $25/mo |
| Google Cloud | ✅ Free | You won't hit limits | Free |
| Gmail | ✅ Free | You won't hit limits | Free |
| Gemini AI | ✅ Free | You won't hit limits | Free |

**Total Current Cost: $0/month**  
**Expected Cost in 1 Year: $0-7/month** (only if you upgrade Render for faster speed)

*Render free tier: Backend "sleeps" after 15 min of inactivity, takes 30-60s to wake up on first request.

---

## 📋 Access Checklist for New Team Members

When you hire a new developer or give someone access:

- [ ] Invite them to GitHub repository (as "Collaborator" not "Owner")
- [ ] Invite them to Vercel project (as "Member" not "Owner")
- [ ] Invite them to Render service (as "Member" not "Owner")
- [ ] DO NOT give them direct Supabase access (developers work through API)
- [ ] DO NOT share your Gmail password
- [ ] DO NOT share Service Role Key unless absolutely necessary
- [ ] Document who they are and when they were added
- [ ] Set an end date and review access when they're done

---

## 🔄 Regular Maintenance Tasks

### Monthly:
- [ ] Check your email sent count (should be under 500/day)
- [ ] Export database backup from Supabase (just in case)
- [ ] Review who has access to each service

### Quarterly (Every 3 Months):
- [ ] Review and remove access for anyone who left
- [ ] Check costs on Vercel, Render, Supabase (should still be $0)
- [ ] Update passwords if anyone left your team

### Yearly:
- [ ] Consider rotating all passwords (good security practice)
- [ ] Review if you need paid tiers for better performance
- [ ] Check if any services have announced deprecations

---

## 📞 Emergency Contacts

**If Website Goes Down:**
1. Check Vercel status: https://vercel.com/status
2. Check Render status: https://render.com/status
3. Check Supabase status: https://status.supabase.com
4. Contact your developer: [DEVELOPER CONTACT INFO]

**If You're Locked Out:**
- Try "Forgot Password" on the service
- Check your email for reset links
- Contact service support (they're usually very helpful)

**If You Think You've Been Hacked:**
1. Change all passwords immediately
2. Check for unauthorized charges
3. Contact your developer
4. Contact service support

---

## 📝 Notes Section

Use this space to write down additional passwords or notes:

```
[Your notes here]





```

---

**🔒 Remember: This document contains sensitive information. Store it securely and never share publicly!**
