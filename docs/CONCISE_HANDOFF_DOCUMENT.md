# Mei Way Mail Plus – Handoff Document

**Client:** Mei Way Mail Plus  
**Prepared by:** [YOUR NAME]  
**Date:** January 11, 2026

---

## 1. Project Overview

**What it does:** Internal mail management system for tracking packages/letters, sending customer notifications, and calculating storage fees automatically.

**Tech Stack:**
- Frontend: React + TypeScript + Vite → Hosted on **Vercel**
- Backend: Node.js + Express → Hosted on **Render**
- Database: PostgreSQL via **Supabase**
- AI: Google Gemini (smart mail scanning)
- Email: Gmail API with OAuth2

**Live URLs:**
- Frontend: [Your Vercel URL or custom domain]
- Backend: [Your Render URL]
- GitHub: https://github.com/HYC-code520/mail-management-system

---

## 2. Accounts & Ownership

All accounts should be owned by **[CLIENT EMAIL]**:

| Service | Purpose | Current Owner | Transfer? |
|---------|---------|---------------|-----------|
| **GitHub** | Code storage | [YOUR ACCOUNT] | ✅ Yes → Transfer to client |
| **Vercel** | Frontend hosting | [YOUR ACCOUNT] | ✅ Yes → Transfer to client |
| **Render** | Backend hosting | [YOUR ACCOUNT] | ✅ Yes → Transfer to client |
| **Supabase** | Database | [YOUR ACCOUNT] | ✅ Yes → Add client as Owner |
| **Google Cloud** | Gmail API | [YOUR ACCOUNT] | ✅ Yes → Transfer to client |
| **Gmail** | Sends emails | [GMAIL ADDRESS] | ✅ Already client's |

**Action Items:**
- [ ] Transfer GitHub repo ownership
- [ ] Transfer Vercel project 
- [ ] Transfer Render service (email support@render.com)
- [ ] Add client as Supabase org owner
- [ ] Enable 2FA on ALL accounts
- [ ] Client stores passwords in password manager

---

## 3. Environment Variables

### Frontend (Vercel)
```env
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc... (public key, safe to expose)
VITE_API_URL=https://[backend].onrender.com
```

### Backend (Render)
```env
# Database
SUPABASE_URL=https://[project].supabase.co
SUPABASE_ANON_KEY=eyJhbGc... (same as frontend)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (SECRET! Never expose!)

# Email (SMTP backup)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=[gmail@address.com]
SMTP_PASS=[16-char app password from Google]
SMTP_FROM_NAME=Mei Way Mail Service

# Email (OAuth2 - primary method)
GOOGLE_CLIENT_ID=[xxx].apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx (SECRET!)
GOOGLE_REDIRECT_URI=[backend-url]/api/oauth/gmail/callback
FRONTEND_URL=[frontend-url]

# AI Scanning
GEMINI_API_KEY=AIzaSy... (SECRET!)

# Security
CRON_SECRET=[random-secret-password] (SECRET!)
```

**Where to find these:**
- Supabase keys: Dashboard → Settings → API
- Gmail app password: Google Account → Security → App Passwords
- Google Client ID/Secret: Google Cloud Console → Credentials
- Gemini API key: https://makersuite.google.com/app/apikey

**⚠️ NEVER commit secrets to GitHub or share via plain text email!**

---

## 4. Deployment

**Auto-deploys when you push to `main` branch on GitHub:**

1. Push code to GitHub `main` branch
2. Vercel auto-deploys frontend (2-3 min)
3. Render auto-deploys backend (5-10 min)
4. Check deployment status in respective dashboards

**To rollback if something breaks:**
- Vercel: Dashboard → Deployments → Select previous → "Promote to Production"
- Render: Dashboard → Manual Deploy → Select previous commit

---

## 5. User Access

**Staff login:** Via Supabase Auth at [YOUR_FRONTEND_URL]

**Create new staff user:**
1. Supabase Dashboard → Authentication → Users → Add User
2. Enter email + temp password
3. Check "Auto Confirm User"
4. Send credentials securely to staff member

**Reset password:**
1. Click "Forgot Password" on login page, OR
2. Supabase Dashboard → Authentication → Find user → Send recovery email

**Remove user:**
- Supabase Dashboard → Authentication → Find user → Delete or Ban

---

## 6. Backups

**Database backups:**
- Automatic: Daily (Supabase handles this, 7-day retention)
- Manual export:
  1. Supabase Dashboard → Table Editor
  2. For each table: contacts, mail_items, package_fees, etc.
  3. Click "..." → Export → CSV
  4. Save to external drive/cloud

**Recommend:** Export monthly + before major changes

**Code backup:**
- GitHub stores all code history
- Download: Repository → Code → Download ZIP

---

## 7. Documentation

**For client (non-technical):**
- `CLIENT_HANDOFF_GUIDE.md` - Complete user guide with step-by-step instructions
- `CREDENTIALS_AND_ACCOUNTS.md` - All accounts/passwords documented

**For developers (technical):**
- `/docs` folder has 100+ technical guides
- `README.md` - Project overview
- `API_ENDPOINTS.md` - API documentation
- `SETUP_ENV.md` - Local development setup

---

## 8. Security Checklist

- [ ] Enable 2FA on: GitHub, Vercel, Render, Supabase, Gmail, Google Cloud
- [ ] Use password manager (1Password, LastPass, Bitwarden)
- [ ] Store secrets securely (never email plain text)
- [ ] Review team access quarterly
- [ ] Remove access when team members leave
- [ ] Keep repository private
- [ ] Set billing alerts on all services

---

## 9. Costs

**Current (all free tiers):**
- Vercel: $0/month
- Render: $0/month (sleeps after 15 min inactivity)
- Supabase: $0/month (up to 500MB database)
- Google Cloud: $0/month (under limits)
- Gmail: $0/month (500 emails/day limit)

**Total: $0/month**

**If you need to upgrade:**
- Render: $7/month (24/7 uptime, no sleeping)
- Supabase: $25/month (more storage + features)

---

## 10. Support

**Developer:** [YOUR NAME]  
**Email:** [YOUR EMAIL]  
**Phone:** [YOUR PHONE]

**Support terms:**
- Rate: $[XX]/hour (billed in [15-min] increments)
- OR: $[XXX]/month retainer ([X] hours included)
- Response time: [X] hours for emergencies, [X] days for bugs/questions

**Included:**
- Bug fixes, questions, emergency troubleshooting

**Costs extra:**
- New features, design changes, major updates

---

## 11. Current Version

**Production version:**
- Git commit: `8496a8a` (Jan 11, 2026)
- Branch: `main`
- No formal release tag yet (recommend creating `v1.0.0`)

**Check deployment status:**
- Vercel: Dashboard → Deployments tab
- Render: Dashboard → Events tab

---

## 12. Quick Reference

**Service Login URLs:**
- GitHub: https://github.com
- Vercel: https://vercel.com
- Render: https://render.com
- Supabase: https://supabase.com
- Google Cloud: https://console.cloud.google.com

**Emergency Contacts:**
- Vercel support: support@vercel.com
- Render support: support@render.com
- Supabase support: support@supabase.io

**Status Pages:**
- Vercel: https://vercel.com/status
- Render: https://render.com/status
- Supabase: https://status.supabase.com

---

## 13. Post-Handoff Checklist

**Immediate (during handoff):**
- [ ] Transfer all account ownership
- [ ] Client can log into all 6 services
- [ ] Test website end-to-end
- [ ] Verify environment variables set correctly
- [ ] Create database backup

**Within 1 week:**
- [ ] Enable 2FA everywhere
- [ ] Store all credentials in password manager
- [ ] Test all core features independently
- [ ] Set billing alerts

**Within 1 month:**
- [ ] Export monthly database backup
- [ ] Review costs (should still be $0)
- [ ] Consider upgrading Render if needed

---

## Notes

**No critical issues as of handoff date.**

**Additional documentation:**
- See `CLIENT_HANDOFF_GUIDE.md` for detailed user instructions
- See `/docs` folder for 100+ technical guides
- Contact developer with questions

---

**Document Status:** Ready for Handoff  
**Last Updated:** January 11, 2026

**Signatures:**

Developer: _________________________ Date: _______

Client: _________________________ Date: _______
