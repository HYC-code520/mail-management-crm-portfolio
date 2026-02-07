# Mei Way Mail Plus – Mail Management System – Handoff Document

**Client:** Mei Way Mail Plus  
**Prepared by:** [YOUR NAME / AGENCY]  
**Date:** January 11, 2026

---

## 1. Project Overview

### Summary

**Purpose of the app:**
- Internal mail management system for a mail forwarding business
- Helps staff log incoming mail (packages and letters) for customers
- Tracks mail status from received → notified → picked up
- Automatically calculates storage fees ($2/day after 2-day grace period)
- Sends email notifications to customers when mail arrives
- AI-powered scanning: Use phone camera to scan mail labels and auto-match to customers
- Dashboard shows revenue analytics, follow-ups needed, and statistics
- Complete history and audit trail for all mail items and transactions

**Tech stack (frontend):**
- React 18 + TypeScript
- Vite (build tool)
- React Router v6 (routing)
- Tailwind CSS (styling)
- Radix UI (component library)
- Supabase client (authentication and API)
- Date-fns (date handling)
- Tesseract.js (OCR for scanning)
- Recharts (dashboard charts)
- i18next (bilingual support - English/Chinese)

**Tech stack (backend):**
- Node.js + Express.js
- Supabase (PostgreSQL database + authentication)
- Google Gemini AI (smart mail label scanning)
- Gmail API with OAuth2 (email sending)
- Nodemailer (email service)
- AWS Translate (optional - for Chinese translation)
- Helmet + CORS (security)
- Jest (testing)

---

## 2. Code Repositories (GitHub)

### Repositories

**Main Repository:** https://github.com/HYC-code520/mail-management-system

This is a **monorepo** containing both frontend and backend:
- Frontend code: `/frontend` folder
- Backend code: `/backend` folder
- Documentation: `/docs` folder (100+ technical guides)
- Database migrations: `/supabase/migrations` folder
- Scripts: `/scripts` folder (database setup)

### Ownership

**Current GitHub owner:** HYC-code520 (your account)  
**Should transfer to:** [CLIENT'S GITHUB USERNAME OR EMAIL]

**Collaborators:**
- [YOUR GITHUB USERNAME] – Role: Admin/Maintainer (for ongoing support)
- Remove after transfer if no ongoing support needed

### Notes

- ⚠️ **2FA Status:** [CHECK IF ENABLED] on client's GitHub account
- ✅ **Repository is currently PRIVATE** (recommended to keep it private)
- ✅ **Main branch:** `main`
- ✅ **Branch protection:** Recommended to enable on `main` branch
- ⚠️ **Action Required:** Transfer repository ownership to client's GitHub account
  - Go to Repository Settings → Danger Zone → Transfer ownership
  - Client will receive email to accept
  - Then client should re-invite you as Collaborator (if ongoing support)

**Important:** Enable 2FA and do not share passwords with anyone outside the team.

---

## 3. Hosting / Deployment Platform

### Platforms

**Frontend hosting platform:** Vercel (recommended)
- Project name: `mail-management-system-frontend` (or similar)
- Auto-deploys from GitHub `main` branch
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `frontend`

**Backend hosting platform:** Render
- Service name: `mail-management-backend` (or similar)
- Service type: Web Service
- Auto-deploys from GitHub `main` branch
- Build command: `npm install`
- Start command: `npm start`
- Root directory: `backend`
- Port: 5000

### Accounts & Ownership

**Frontend (Vercel):**
- Account owner (client): [CLIENT NAME + EMAIL]
- Your access: [YOUR EMAIL] – Role: [Member/Owner]
- Transfer ownership via: Vercel Dashboard → Settings → Transfer Project

**Backend (Render):**
- Account owner (client): [CLIENT NAME + EMAIL]
- Your access: [YOUR EMAIL] – Role: [Member/Owner]
- Transfer ownership: Email support@render.com with Service ID and new owner info

### Ownership Transfer Notes

**Vercel:**
1. Client creates Vercel account
2. You add client as Owner
3. Transfer project to their account
4. Client re-invites you (if ongoing support)

**Render:**
1. Client creates Render account
2. You invite client to team as Owner
3. Email support@render.com: "Please transfer service [SERVICE_ID] to [CLIENT_EMAIL]"
4. Or: Client creates their own Render service connected to their GitHub

**Important:** After transfer, verify all environment variables are still set correctly.

---

## 4. Domain & DNS

### Domain Registrar

**Domain:** [YOUR CUSTOM DOMAIN] (e.g., `meiway-mail.com`)  
**Registrar:** [e.g., GoDaddy / Namecheap / Cloudflare / Google Domains]  
**Account owner:** [CLIENT NAME + EMAIL]

*If no custom domain yet, currently using:*
- Vercel URL: `https://[project-name].vercel.app`
- Render URL: `https://[service-name].onrender.com`

### DNS Management

**DNS managed at:** [Same as registrar, or Cloudflare]

**Important DNS records (once custom domain is set up):**

**For Frontend (Vercel):**
- `A` record: `@` → Vercel IP (or use CNAME)
- `CNAME` record: `www` → `cname.vercel-dns.com`
- Or follow Vercel's specific DNS instructions in their dashboard

**For Backend (Render):**
- `CNAME` record: `api` → `[your-service].onrender.com`
- Example: `api.meiway-mail.com` points to backend

**Email verification (if using custom email):**
- `TXT` records for SPF, DKIM (depends on email provider)

### Notes

- ⚠️ DNS changes take 24-48 hours to fully propagate worldwide
- ⚠️ Do NOT delete existing DNS records without confirming their purpose
- ✅ Keep a screenshot/backup of DNS records before making changes
- ✅ Use Cloudflare (free tier) for better performance and security (optional)

---

## 5. Environment Variables & Secrets

⚠️ **CRITICAL: Do not share these publicly or store in plain text emails!**  
✅ **Store in password manager and only share via secure methods**

### Frontend Environment Variables

**Platform:** Vercel Dashboard → Project Settings → Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=[Your Supabase Project URL]
# Example: https://xxxxx.supabase.co
# Location: Supabase Dashboard → Project Settings → API → Project URL

VITE_SUPABASE_ANON_KEY=[Your Supabase Anon/Public Key]
# Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# Location: Supabase Dashboard → Project Settings → API → Project API Keys → anon/public
# Note: This key is safe to expose in frontend (public key)

VITE_API_URL=[Your Render Backend URL]
# Example: https://mail-backend-xxxx.onrender.com
# This is your Render backend service URL
# For production: Use your custom domain if configured (e.g., https://api.meiway-mail.com)
```

**How to set in Vercel:**
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add each variable for Production, Preview, Development (or just Production)
5. Redeploy for changes to take effect

---

### Backend Environment Variables

**Platform:** Render Dashboard → Service → Environment Tab

```env
# Server Configuration
PORT=5000
# The port your backend runs on (Render will override with $PORT automatically)

NODE_ENV=production
# Set to 'production' for production, 'development' for local dev

# Supabase Database Configuration
SUPABASE_URL=[Your Supabase Project URL]
# Same as frontend, example: https://xxxxx.supabase.co
# Location: Supabase Dashboard → Project Settings → API

SUPABASE_ANON_KEY=[Your Supabase Anon Key]
# Same as frontend
# Location: Supabase Dashboard → Project Settings → API

SUPABASE_SERVICE_ROLE_KEY=[Your Supabase Service Role Key]
# ⚠️ KEEP SECRET! This is the "master key" with full database access
# Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (different from anon key)
# Location: Supabase Dashboard → Project Settings → API → service_role key
# ⚠️ NEVER expose this in frontend, only in backend!

# Email Sending (SMTP - Backup Method)
SMTP_HOST=smtp.gmail.com
# Gmail SMTP server

SMTP_PORT=587
# Gmail SMTP port (587 for TLS)

SMTP_USER=[Your Gmail address]
# Example: meiway.mail@gmail.com
# The Gmail account used to send customer notifications

SMTP_PASS=[Your Gmail App Password]
# 16-character app password from Google Account settings
# NOT your regular Gmail password!
# How to get: Google Account → Security → 2-Step Verification → App passwords

SMTP_FROM_NAME=Mei Way Mail Service
# The "from" name customers see in emails

# Google OAuth2 (Primary Email Sending Method)
GOOGLE_CLIENT_ID=[Your Google OAuth Client ID]
# Example: 123456789-abc.apps.googleusercontent.com
# Location: Google Cloud Console → APIs & Services → Credentials

GOOGLE_CLIENT_SECRET=[Your Google OAuth Client Secret]
# Example: GOCSPX-xxxxxxxxxxxxxxx
# ⚠️ KEEP SECRET!
# Location: Same as Client ID

GOOGLE_REDIRECT_URI=[Your Backend URL]/api/oauth/gmail/callback
# Example: https://mail-backend-xxxx.onrender.com/api/oauth/gmail/callback
# Must match exactly what's in Google Cloud Console

FRONTEND_URL=[Your Frontend URL]
# Example: https://your-frontend.vercel.app
# Used for OAuth redirects back to frontend

# AI Scanning (Google Gemini)
GEMINI_API_KEY=[Your Google Gemini API Key]
# Example: AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
# ⚠️ KEEP SECRET!
# Location: https://makersuite.google.com/app/apikey
# Used for smart mail label scanning

# Security
CRON_SECRET=[Random secret string]
# Example: super-secret-cron-password-123
# ⚠️ KEEP SECRET! Used to secure automated fee calculation endpoint
# Generate a random string (use password generator)

# Optional: AWS Translation (for Chinese/bilingual support)
AWS_ACCESS_KEY_ID=[Your AWS Access Key]
# Only needed if using AWS Translate for Chinese templates

AWS_SECRET_ACCESS_KEY=[Your AWS Secret Key]
# ⚠️ KEEP SECRET!
# Only needed if using AWS Translate

AWS_REGION=us-east-1
# AWS region, us-east-1 is default
```

**How to set in Render:**
1. Go to Render Dashboard
2. Select your backend service
3. Click "Environment" tab
4. Click "Add Environment Variable"
5. Add each key-value pair
6. Save changes (service will auto-redeploy)

---

### Where to Find These Values

| Variable | Where to Find It |
|----------|-----------------|
| Supabase URL | Supabase Dashboard → Settings → API → Project URL |
| Supabase Anon Key | Supabase Dashboard → Settings → API → anon key |
| Supabase Service Key | Supabase Dashboard → Settings → API → service_role key |
| Gmail SMTP Password | Google Account → Security → App Passwords |
| Google Client ID/Secret | Google Cloud Console → Credentials |
| Gemini API Key | https://makersuite.google.com/app/apikey |
| Frontend/Backend URLs | Vercel/Render dashboard for your projects |

---

## 6. Application Access & Roles

### Admin Access (inside the app)

**Admin users (staff logins):**
- Madison: [madison@meiway.com or similar]
- Merlin: [merlin@meiway.com or similar]
- [Add other staff emails]

**Authentication:** Handled by Supabase Auth

**How to reset password:**
1. Go to login page: [YOUR_FRONTEND_URL]
2. Click "Forgot Password"
3. Enter email address
4. Check email for reset link
5. Click link and set new password
6. Return to login page and sign in

**Alternative (Admin method via Supabase):**
1. Log into Supabase Dashboard
2. Go to Authentication → Users
3. Find the user
4. Click "..." → Send password recovery email
5. User receives email with reset link

---

### User Management

**How to create a new staff user:**

*Method 1: Via Supabase Dashboard (Recommended)*
1. Log into Supabase Dashboard
2. Go to Authentication → Users
3. Click "Add User"
4. Enter email and temporary password
5. Select "Auto Confirm User" (so they don't need to verify email)
6. Click "Create User"
7. Send the staff member their login credentials securely
8. They should change password on first login

*Method 2: Via App Sign-Up (If enabled)*
1. Go to login page
2. Click "Sign Up" (if you have a sign-up page)
3. Enter email and password
4. User will receive confirmation email
5. Click link to confirm
6. Can now log in

**How to deactivate/remove a user:**
1. Log into Supabase Dashboard
2. Go to Authentication → Users
3. Find the user by email
4. Click "..." menu → Delete user
5. Confirm deletion

**Alternative:** Ban user instead of deleting:
1. Same steps as above
2. Click "..." → Ban user
3. User cannot log in but data is preserved

---

### Roles & Permissions

Currently, all authenticated users have **equal access** (staff role). They can:
- ✅ View all customers and mail items
- ✅ Log new mail
- ✅ Scan mail with camera
- ✅ Send email notifications
- ✅ Collect storage fees
- ✅ Mark items as picked up
- ✅ Add/edit customers
- ✅ View dashboard and analytics

**No role hierarchy** currently implemented (all staff are admins).

*Future enhancement:* Could add role-based permissions (Owner, Manager, Staff, etc.) if needed.

---

## 7. Third-Party Services & Integrations

### List of Services

| Service | Purpose | Account Owner | Notes |
|---------|---------|---------------|-------|
| **Supabase** | Database + Auth | [CLIENT EMAIL] | PostgreSQL database, authentication, free tier |
| **Google Cloud Console** | Gmail API + OAuth2 | [CLIENT EMAIL] | For sending emails, requires project setup |
| **Gmail Account** | Sends customer emails | [CLIENT EMAIL] | The actual Gmail address (e.g., meiway@gmail.com) |
| **Google Gemini AI** | Smart label scanning | [CLIENT EMAIL] | AI-powered OCR for mail scanning |
| **Vercel** | Frontend hosting | [CLIENT EMAIL] | Auto-deploys from GitHub |
| **Render** | Backend hosting | [CLIENT EMAIL] | Runs Node.js server, free tier sleeps after 15 min |
| **GitHub** | Code repository | [CLIENT EMAIL] | Stores all source code |
| AWS Translate | Translation (optional) | [CLIENT EMAIL] | Only if using Chinese translation feature |

---

### Service Details

**Supabase:**
- Website: https://supabase.com
- Project: [YOUR PROJECT NAME]
- Plan: Free tier (500MB database, 2GB bandwidth)
- Upgrade: $25/month for Pro tier (if needed)
- Purpose: Stores all data (customers, mail items, fees, messages)

**Google Cloud Console:**
- Website: https://console.cloud.google.com
- Project: MeiWay Mail System (or your project name)
- APIs enabled: Gmail API, Cloud Translation (optional)
- Purpose: Allows app to send emails through Gmail

**Gmail Account:**
- Email: [YOUR SENDING EMAIL]
- Purpose: Sends all customer notifications
- Limit: 500 emails/day (free Gmail)
- Upgrade: Google Workspace if need more

**Google Gemini AI:**
- Website: https://makersuite.google.com
- Purpose: Smart scanning - reads mail labels and matches to customers
- Plan: Free tier (60 requests/min)

**Vercel:**
- Website: https://vercel.com
- Plan: Free Hobby tier
- Purpose: Hosts your website (frontend)
- Upgrade: $20/month Pro if needed

**Render:**
- Website: https://render.com
- Plan: Free tier
- Purpose: Runs your backend server
- Note: Free tier "sleeps" after 15 min inactivity (wakes in 30-60 seconds)
- Upgrade: $7/month for 24/7 uptime

---

### Notes

- ✅ All accounts should be owned by client (not developer)
- ✅ All API keys stored as environment variables (see Section 5)
- ✅ Enable 2FA on all services for security
- ⚠️ If any service hits usage limits, you'll get email notifications
- ⚠️ Set up billing alerts to avoid surprise charges

---

## 8. Backups & Data Retention

### Database (Supabase PostgreSQL)

**Database type:** PostgreSQL  
**Hosting:** Supabase (managed service)  
**Current plan:** Free tier

**Backups:**
- **Frequency:** Daily automatic backups (Supabase handles this)
- **Retention:** 7 days on free tier, 30 days on Pro tier
- **Point-in-time recovery:** Not available on free tier (Pro feature)

**Database size:** Check in Supabase Dashboard → Settings → Database  
**Storage used:** [Check current usage]  
**Limit:** 500MB on free tier

---

### How to Export Data (Manual Backup)

**Method 1: Via Supabase Dashboard (Recommended)**

1. Log into Supabase Dashboard: https://supabase.com
2. Go to your project
3. Click "Table Editor" in sidebar
4. For each important table, click the table name:
   - `contacts` (all customers)
   - `mail_items` (all packages/letters)
   - `package_fees` (storage fees)
   - `outreach_messages` (email history)
   - `message_templates` (email templates)
   - `oauth_tokens` (Gmail connections)
5. Click "..." menu → Export → CSV
6. Save file to safe location
7. Repeat for all tables

**Recommended frequency:** Monthly, or before major changes

---

**Method 2: Via pg_dump (Advanced)**

If you have database credentials:
```bash
pg_dump --host=db.xxxxx.supabase.co \
        --port=5432 \
        --username=postgres \
        --dbname=postgres \
        --file=backup-$(date +%Y%m%d).sql
```

---

**What to backup:**
- ✅ Database tables (CSV exports)
- ✅ Code (ZIP from GitHub - see Section 2)
- ✅ Environment variables (securely document them)
- ✅ This handoff documentation
- ✅ Any uploaded files/images (if applicable)

**Where to store backups:**
- External hard drive (offline backup)
- Secure cloud storage (Google Drive, Dropbox - encrypted)
- Password manager (for credentials)

---

## 9. How to Deploy & Roll Back

### Deploying a New Version

**The good news:** Deployment is **automatic**! Here's how it works:

**Step 1: Make changes in GitHub**
1. Developer makes code changes
2. Commits to GitHub repository
3. Pushes to `main` branch

**Step 2: Automatic deployment**
- **Frontend (Vercel):** Detects push → Builds → Deploys (2-3 minutes)
- **Backend (Render):** Detects push → Builds → Deploys (5-10 minutes)

**Step 3: Verify deployment**
1. Check frontend: [YOUR_FRONTEND_URL]
2. Check backend health: [YOUR_BACKEND_URL]/health
3. Test key features (login, scan mail, send notification)

---

### Deployment Status

**Check deployment status:**

**Vercel:**
1. Go to Vercel Dashboard
2. Click on your project
3. See "Deployments" tab
4. Green ✓ = Success, Red ✗ = Failed

**Render:**
1. Go to Render Dashboard
2. Click on your service
3. See "Events" tab
4. Check "Deploy succeeded" message

---

### Rolling Back (if something breaks)

**Option 1: Vercel Rollback (Frontend)**
1. Go to Vercel Dashboard → Your Project
2. Click "Deployments" tab
3. Find previous working deployment
4. Click "..." → "Promote to Production"
5. Confirm
6. Site reverts to that version (takes ~1 minute)

**Option 2: Render Rollback (Backend)**
1. Go to Render Dashboard → Your Service
2. Click "Manual Deploy" button
3. Under "Deploy from," select previous commit
4. Click "Deploy"
5. Backend reverts to that version (takes ~5 minutes)

**Option 3: Git Revert (Best for permanent fix)**
1. In GitHub, go to repository
2. Find the problematic commit
3. Click "Revert" button
4. Commit the revert
5. Both frontend and backend auto-redeploy with fix

---

### When to Rollback

❌ **Rollback if:**
- Website shows critical errors
- Users cannot log in
- Features completely broken
- Data is being corrupted

✅ **Don't rollback for:**
- Minor visual issues
- Non-critical bugs
- Cosmetic problems

---

## 10. Documentation & Training

### Project Documentation Location

**All documentation is in the `/docs` folder:**

📂 `/docs` folder contains **100+ documentation files**, including:
- Technical guides for developers
- API endpoint documentation
- Database schema
- Feature implementation guides
- Testing documentation
- And much more!

---

### Essential Client Documentation (Already Created!)

**For Your Reference (Non-Technical):**

1. **CLIENT_HANDOFF_GUIDE.md** (51KB) ⭐ **READ THIS**
   - Complete guide for using your website
   - Handoff overview and checklist
   - GitHub explained in plain English
   - Step-by-step guides for 9 core features
   - Troubleshooting for 7 common problems
   - Daily/weekly/monthly maintenance tasks

2. **CREDENTIALS_AND_ACCOUNTS.md** (16KB) 🔒 **KEEP SECURE**
   - All your accounts and passwords
   - Where to find environment variables
   - Security best practices
   - Cost breakdown
   - Emergency procedures

3. **HANDOFF_CHECKLIST_PRINTABLE.md** (9KB)
   - Printable checklist for handoff meeting
   - Used during handoff to ensure nothing forgotten

4. **HANDOFF_INFO_TEMPLATE.md** (11KB)
   - Template for developer to fill in details
   - Client info, URLs, credentials, support agreement

5. **HANDOFF_PACKAGE_SUMMARY.md** + **HANDOFF_README.md**
   - Overview and instructions for using all documents

6. **HANDOFF_INDEX.md**
   - Navigation guide to all handoff documents

---

### How-To Guides (In CLIENT_HANDOFF_GUIDE.md)

All located in **Section 3: Client Documentation & Tutorials**

✅ **"How to log in"** - Getting started section  
✅ **"How to scan mail"** - Feature 1 (AI-powered scanning)  
✅ **"How to manually log mail"** - Feature 2 (backup method)  
✅ **"How to view customer history"** - Feature 3  
✅ **"How to send email notifications"** - Feature 4  
✅ **"How to handle customer pickup"** - Feature 5 (including fee collection)  
✅ **"How to use dashboard"** - Feature 6  
✅ **"How to manage storage fees"** - Feature 7 (automatic calculations)  
✅ **"How to add new customers"** - Feature 8  
✅ **"How to search and filter"** - Feature 9  

---

### Technical Documentation (For Future Developers)

Located in `/docs` folder on GitHub:

**Setup & Configuration:**
- `README.md` - Project overview
- `SETUP_ENV.md` - Environment setup guide
- `PROJECT_OVERVIEW.md` - What the system does

**API & Backend:**
- `API_ENDPOINTS.md` - Complete API documentation
- `PACKAGE_FEE_SYSTEM.md` - How fee calculations work
- `OAUTH2_SETUP_GUIDE.md` - Gmail sending setup

**Testing:**
- `AUTOMATED_TESTING_GUIDE.md` - Testing workflow
- `TEST_SUMMARY.md` - What's tested

**Features:**
- `SCAN_FEATURE_GUIDE.md` - Smart scanning implementation
- `SMART_MATCHING_COMPLETE.md` - AI matching system
- `GMAIL_DISCONNECTION_HANDLING.md` - Email connection management
- And 90+ more guides!

---

### Media & Screenshots

**Screenshots needed for CLIENT_HANDOFF_GUIDE.md:**

Currently has placeholders marked as `[SCREENSHOT PLACEHOLDER: Description]`

**Recommended screenshots to add:**
1. Login screen
2. Dashboard overview
3. Scan mail camera view
4. Customer profile page
5. Send notification dialog
6. Fee collection form
7. Mail log page
8. Search/filter in action

**To add screenshots:**
1. Create `/docs/images/` folder
2. Take screenshots
3. Save as PNG files
4. Replace placeholders in CLIENT_HANDOFF_GUIDE.md
5. Example: `![Login Screen](./images/login-screen.png)`

---

### Video Walkthroughs

**Recommended videos to create (optional but helpful):**

1. **Daily workflow** (5 min)
   - Morning routine
   - Scanning incoming mail
   - Handling customer pickups

2. **Email notifications** (3 min)
   - How to send notifications
   - Using templates
   - What customers receive

3. **Fee management** (4 min)
   - How fees calculate automatically
   - Collecting payments
   - Waiving fees

4. **Dashboard overview** (3 min)
   - Understanding statistics
   - Using "Needs Follow-Up"
   - Reading charts

**Where to host:**
- Loom (free screen recording)
- YouTube (unlisted videos)
- Google Drive (if client has account)

**Add links to CLIENT_HANDOFF_GUIDE.md when created**

---

## 11. Security & 2FA

### 2FA Recommendations

**Enable Two-Factor Authentication (2FA) on ALL accounts:**

✅ **GitHub**
- Go to Settings → Password and authentication
- Enable 2FA using authenticator app (Google Authenticator, Authy, etc.)
- Save backup codes in safe place

✅ **Vercel**
- Go to Account Settings → Security
- Enable 2FA
- Save backup codes

✅ **Render**
- Go to Account Settings → Security
- Enable 2FA
- Save backup codes

✅ **Supabase**
- Go to Account Settings → Security
- Enable 2FA
- Save backup codes

✅ **Gmail Account**
- Go to Google Account → Security
- Enable 2-Step Verification
- Save backup codes

✅ **Google Cloud Console**
- Same as Gmail (uses same Google account)

---

### Credential Safety Best Practices

**DO these things:**

✅ **Use a password manager**
- Recommended: 1Password, LastPass, Bitwarden, Dashlane
- Store all passwords here
- Share access securely via password manager

✅ **Use unique passwords everywhere**
- Never reuse passwords across services
- Use password generator for strong passwords

✅ **Keep environment variables secret**
- Never commit to GitHub
- Never email in plain text
- Never share in Slack/chat unencrypted
- Share via password manager or in-person

✅ **Limit access**
- Only give access to people actively working on project
- Remove access when team members leave
- Use least-privilege principle (give minimum access needed)

✅ **Save 2FA backup codes**
- Print and store in safe place
- Keep digital copy in password manager
- You'll need these if you lose your phone

---

**DON'T do these things:**

❌ **Never share passwords via:**
- Regular email
- Slack/Discord/messaging apps
- Text messages
- Sticky notes
- Unencrypted documents

❌ **Never commit secrets to GitHub:**
- No passwords in code
- No API keys in code
- Always use environment variables
- Check `.gitignore` includes `.env` files

❌ **Never make repository public**
- Keep code private
- Contains business logic
- May accidentally have credentials in git history

---

### What to Do If Credentials Leak

**If you accidentally expose a password or API key:**

**Immediate actions (within 1 hour):**

1. **Change the password/key immediately**
   - For passwords: Log in and change
   - For API keys: Regenerate new key

2. **Update environment variables**
   - Update in Vercel (frontend)
   - Update in Render (backend)
   - Redeploy if necessary

3. **Check for suspicious activity**
   - Review login history
   - Check for unauthorized changes
   - Look for strange emails sent
   - Review database for weird data

4. **Rotate related credentials**
   - If Gmail password leaked: Change password, regenerate app password
   - If Supabase key leaked: Regenerate keys in dashboard
   - If GitHub compromised: Change password, review commits

5. **Contact support if needed**
   - Supabase support: support@supabase.io
   - Vercel support: support@vercel.com
   - Render support: support@render.com

---

## 12. Support & Future Work

### If You Keep Me/Us On For Future Updates

**Developer contact:**
- Name: [YOUR NAME]
- Email: [YOUR EMAIL]
- Phone: [YOUR PHONE] (optional)
- Timezone: [YOUR TIMEZONE]
- Preferred contact: [Email / Slack / Phone]

**Response times:**
- **Emergency** (site completely down): [X hours] response
- **Urgent bug** (feature broken): [X business days] response
- **Questions** (how to do something): [X business days] response
- **Feature requests**: [X business days] for quote, then scheduled

**Support scope includes:**
- ✅ Bug fixes (if caused by original code)
- ✅ Answering "how do I...?" questions
- ✅ Emergency troubleshooting
- ✅ Deployment assistance
- ✅ Minor updates and tweaks

**Costs extra (quoted separately):**
- ⚠️ New feature development
- ⚠️ Major design changes
- ⚠️ Third-party integrations
- ⚠️ Custom reports/exports
- ⚠️ Extensive training (beyond initial handoff)

**Support agreement:**
- Hourly rate: $[XX]/hour, billed in [15-min/30-min/1-hour] increments
- OR Monthly retainer: $[XXX]/month for [X] hours included
- Payment terms: [Net 30 / Due on receipt]

---

### If You Work With Another Developer

**Handoff to new developer:**

✅ **Share this documentation package:**
- This handoff document (you're reading it)
- All files in `/docs/handoff/` folder
- Complete `/docs` folder (100+ technical guides)

✅ **Give them access to:**
- GitHub repository (add as Collaborator)
- Vercel project (add as Member) - optional
- Render service (add as Member) - optional
- DO NOT share Supabase direct access (they should work through API)

✅ **They can reach out with questions:**
- Email: [YOUR EMAIL] (optional - if you're willing to help)
- Note: Charge consulting fee if not under support agreement

**What new developer needs:**
- GitHub access (to see code)
- This handoff document
- Environment variables (via client, not you directly)
- Access to Vercel/Render only if deploying changes

**What new developer should NOT need:**
- Supabase database direct access (use API instead)
- Your personal accounts
- Original Gmail/Google Cloud access (client's credentials)

---

## 13. Current Production Version

### Version Information

**Production is currently running:**
- **Git commit:** `8496a8ad4098293934867963b79811fc08835caa`
- **Short hash:** `8496a8a`
- **Commit date:** January 11, 2026 at 6:05 PM EST
- **Commit message:** [Check GitHub for message]

**Tag / Release name:**
- No formal release tags created yet
- Recommended: Create tag `v1.0.0-production` for handoff snapshot
- How to create tag in GitHub:
  ```bash
  git tag -a v1.0.0-production -m "Production version at handoff"
  git push origin v1.0.0-production
  ```

**Date of last deployment:**
- Frontend (Vercel): [Check Vercel Dashboard → Deployments]
- Backend (Render): [Check Render Dashboard → Events]
- Approximately: January 11, 2026

**Branch deployed:**
- Both frontend and backend: `main` branch

---

### How to Check Current Version

**Frontend:**
1. Go to Vercel Dashboard → Your Project
2. Click "Deployments" tab
3. See latest deployment details
4. Shows Git commit hash and timestamp

**Backend:**
1. Go to Render Dashboard → Your Service
2. Check "Events" tab for latest deploy
3. Or visit: [YOUR_BACKEND_URL]/health
4. Response shows environment and timestamp

**GitHub:**
1. Go to repository: https://github.com/HYC-code520/mail-management-system
2. See latest commit on `main` branch
3. Click commit to see what changed

---

### Known Issues / Limitations (As of Handoff)

**Current known limitations:**

✅ **Working correctly:**
- All core features tested and functional
- Email sending working (OAuth2 + SMTP fallback)
- AI scanning working (Gemini + Tesseract)
- Fee calculations automatic and accurate
- Dashboard and analytics displaying correctly
- Mobile-responsive design works on phones

⚠️ **Minor limitations:**
- Free Render tier: Backend "sleeps" after 15 min (wakes in 30-60 sec)
- Gmail limit: 500 emails/day on free Gmail
- Supabase free tier: 500MB database limit
- No SMS notifications (email only)
- No customer self-service portal (staff-only access)

**No critical bugs reported as of handoff date.**

---

## 14. Additional Notes

### Post-Handoff Recommendations

**Within first week:**
- [ ] Test all features end-to-end
- [ ] Try scanning mail on your phone
- [ ] Send test email notifications
- [ ] Practice handling customer pickup flow
- [ ] Check dashboard daily for "Needs Follow-Up"

**Within first month:**
- [ ] Export database backup (CSV files from Supabase)
- [ ] Review monthly costs (should still be $0)
- [ ] Consider upgrading Render to paid tier ($7/mo) for 24/7 uptime
- [ ] Set up billing alerts on all services

**Ongoing:**
- [ ] Export database backup monthly
- [ ] Review team access quarterly
- [ ] Update passwords every 6 months
- [ ] Monitor email sending limits

---

### Future Feature Ideas (Optional)

If you want to enhance the system later:

**Potential additions:**
- SMS notifications (via Twilio)
- Customer self-service portal (check mail online)
- Package photo attachments
- Multi-location support
- Barcode scanning
- Advanced reporting/exports
- Mobile app for staff
- Automated abandoned package handling
- Integration with shipping carriers (USPS tracking)

**Contact developer for quotes on these features.**

---

### Thank You & Contact

**Prepared by:** [YOUR NAME / AGENCY]  
**Date:** January 11, 2026  
**Contact:** [YOUR EMAIL]  
**Phone:** [YOUR PHONE]

**This handoff document includes:**
- ✅ Complete project overview
- ✅ All repositories and hosting info
- ✅ All environment variables documented
- ✅ Complete credentials list (stored separately in secure doc)
- ✅ User management procedures
- ✅ Third-party services inventory
- ✅ Backup and rollback procedures
- ✅ Comprehensive documentation links
- ✅ Security best practices
- ✅ Support agreement details
- ✅ Current version snapshot

**Additional handoff materials provided:**
- CLIENT_HANDOFF_GUIDE.md (51KB - non-technical guide)
- CREDENTIALS_AND_ACCOUNTS.md (16KB - all passwords)
- Plus 100+ technical documentation files in `/docs` folder

---

**Congratulations on your new mail management system!** 🎉

**Questions? Contact me at [YOUR EMAIL]**

---

**Document Version:** 1.0  
**Last Updated:** January 11, 2026  
**Status:** Ready for Client Handoff
