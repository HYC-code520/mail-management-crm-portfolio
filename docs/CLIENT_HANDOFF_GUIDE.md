# 📦 Complete Website Handoff Guide

**Project:** Mail Management System  
**Date:** January 11, 2026  
**Your Developer:** [YOUR NAME]

---

## 📖 Welcome! Here's What You're Getting

Congratulations on your new mail management website! This document explains everything you need to know to **own, maintain, and use** your website confidently - even if you've never managed a website before.

**Think of this guide as your website's instruction manual.** We've organized it so you can easily find what you need:

- **Section 1:** Overview & Quick Actions (start here!)
- **Section 2:** GitHub - Your Code Storage
- **Section 3:** How to Use Your Website (step-by-step guides with pictures)
- **Section 4:** All Your Accounts & Passwords

---

# 📋 Section 1: Handoff Overview

## What Is "Handoff" and Why Does It Matter?

"Handoff" means **you now own and control everything** about your website. Think of it like buying a car - we're giving you:
- The keys (passwords)
- The title (account ownership)
- The owner's manual (this guide)
- A tutorial on how to drive it (user guides)

**Why this matters:** If something goes wrong, you can fix it yourself or hire any developer to help you. You're not stuck depending on just one person.

---

## ✅ What We've Built For You

### Your Mail Management System

This website helps you run your mail forwarding business. Here's what it does in plain English:

**For Your Staff:**
- 📸 **Scan incoming mail** with a phone camera
- 🤖 **Automatically matches mail to customers** using AI
- 📧 **Sends email notifications** to customers automatically
- 💵 **Tracks storage fees** and calculates charges
- 📊 **Shows dashboard** with who needs follow-up

**For Your Business:**
- Saves 2-3 hours per day on manual entry
- No more forgetting to notify customers
- Automatic fee tracking (no more spreadsheets!)
- Complete history of every package and payment

**Technology Used:**
- **React + TypeScript** (modern, fast website)
- **Node.js + Express** (handles calculations and emails)
- **PostgreSQL/Supabase** (stores all your data securely)
- **Gmail API** (sends emails through your Gmail)
- **Google AI** (smart scanning feature)

Don't worry if those words sound confusing - you don't need to understand them to use the website!

---

## 🎯 What You Need To Do Now (Handoff Checklist)

Work through these steps with your developer. Check each box as you complete it:

### Step 1: Take Ownership of All Accounts ⏱️ 30 minutes

- [ ] **Create your own GitHub account** (if you don't have one)
  - Go to https://github.com/signup
  - Use your business email address
  - Turn on Two-Factor Authentication (2FA)

- [ ] **Transfer GitHub repository ownership** to your account
  - Your developer will go to Repository Settings → Transfer Ownership
  - You'll receive an email to accept
  - **Then:** Invite your developer back as a "Collaborator" (if you want ongoing support)

- [ ] **Create your own Vercel account** (runs your website)
  - Go to https://vercel.com/signup
  - Sign up with your business email
  - Turn on Two-Factor Authentication (2FA)

- [ ] **Transfer Vercel project ownership**
  - Your developer will add you as Owner
  - Or: Re-deploy from your GitHub account

- [ ] **Create your own Render account** (runs your backend)
  - Go to https://render.com/signup
  - Sign up with your business email
  - Turn on Two-Factor Authentication (2FA)

- [ ] **Transfer Render service ownership**
  - Email support@render.com with:
    - Service ID: [Your backend service ID]
    - New owner email: [Your email]
  - Or: Your developer invites you, then transfers ownership

- [ ] **Create your own Supabase account** (your database)
  - Go to https://supabase.com/signup
  - Sign up with your business email
  - Turn on Two-Factor Authentication (2FA)

- [ ] **Transfer Supabase project** OR get full organization access
  - Your developer will invite you as Owner
  - Or transfer the entire project

**Why you're doing this:** So YOU control everything. If your developer disappears tomorrow, you can still access and manage your website.

---

### Step 2: Secure All Accounts ⏱️ 20 minutes

- [ ] **Turn on Two-Factor Authentication (2FA) everywhere**
  - GitHub ✅
  - Vercel ✅
  - Render ✅
  - Supabase ✅
  - Gmail (the account that sends emails) ✅
  - Google Cloud Console ✅

**What is 2FA?** It means you need both your password AND your phone to log in. Even if someone steals your password, they can't get in without your phone.

**How to set it up:**
1. Download Google Authenticator app on your phone
2. Go to each service → Settings → Security → Enable 2FA
3. Scan the QR code with your phone
4. Save the backup codes somewhere safe

- [ ] **Get a password manager** (strongly recommended!)
  - Options: 1Password ($3/month), LastPass ($3/month), Bitwarden (free)
  - Why: Remembers all your passwords securely
  - Store all your website passwords here

- [ ] **Document all passwords**
  - See "CREDENTIALS_AND_ACCOUNTS.md" document
  - Fill in all the blank spaces: [YOUR EMAIL HERE]
  - Store this document in your password manager

**Why you're doing this:** Prevent hackers from accessing your website and protect your customer data.

---

### Step 3: Understand Your Costs ⏱️ 10 minutes

- [ ] **Check billing on each service**
  - Vercel: Settings → Billing (currently FREE)
  - Render: Billing tab (currently FREE)
  - Supabase: Settings → Billing (currently FREE)

- [ ] **Set up billing alerts**
  - On each service, turn on "Email me if costs exceed $10"
  - This way you won't get surprise bills

- [ ] **Understand what triggers costs:**
  - Vercel: Only if you get LOTS of visitors (thousands per day)
  - Render: Free tier = your backend "sleeps" after 15 min. $7/month = always awake
  - Supabase: Free up to 500MB database + 2GB traffic. $25/month after that.

**Current cost: $0/month**  
**Expected cost in 1 year: Still $0-7/month** (you'd only upgrade Render if you want faster speed)

**Why you're doing this:** So there are no surprise bills and you understand what you're paying for.

---

### Step 4: Test Everything Works ⏱️ 20 minutes

Do this WITH your developer on a video call:

- [ ] **Log into your website**
  - Go to: [YOUR WEBSITE URL]
  - Sign in with: [STAFF EMAIL] / [PASSWORD]
  - Can you see the dashboard? ✅

- [ ] **Try scanning a test mail item**
  - Click "Scan Mail" button
  - Take a photo of a test label
  - Does it match to a customer? ✅

- [ ] **Send a test email notification**
  - Go to a test customer's mail items
  - Click "Send Notification"
  - Check: Did the email arrive? ✅

- [ ] **Check the dashboard**
  - Can you see total customers? ✅
  - Can you see active mail items? ✅
  - Can you see revenue stats? ✅

- [ ] **Test on your phone**
  - Open website on your phone
  - Does everything work? ✅
  - Can you scan mail from your phone? ✅

**If anything doesn't work:** Have your developer fix it NOW before handoff is complete.

---

### Step 5: Get Your Documentation ⏱️ 10 minutes

- [ ] **Review this handoff guide** (you're reading it now!)

- [ ] **Review the credentials document**
  - File: `CREDENTIALS_AND_ACCOUNTS.md`
  - Fill in all placeholder information

- [ ] **Review the user guide**
  - See Section 3 below
  - Try following each step yourself

- [ ] **Watch tutorial videos** (if provided)
  - Common tasks walkthrough
  - How to handle customer pickups
  - How to scan mail efficiently

- [ ] **Bookmark important links**
  - Your live website: [URL]
  - GitHub repository: [URL]
  - This documentation folder: [URL or local path]

---

### Step 6: Establish Ongoing Support ⏱️ 10 minutes

- [ ] **Decide: Do you want ongoing developer support?**
  - Option A: Pay hourly for fixes and new features
  - Option B: Monthly retainer for X hours
  - Option C: No ongoing support (you'll hire someone else if needed)

- [ ] **If yes to support, clarify:**
  - How to contact developer: [Email? Phone? Slack?]
  - Response time: [Same day? Next business day?]
  - Hourly rate: $[XX]/hour
  - What's included vs. what costs extra

- [ ] **If no ongoing support:**
  - Document how a future developer can access everything
  - Make sure all accounts are in YOUR name (not developer's)

- [ ] **Document your decision**
  - Write it down in this guide
  - Email confirmation to create a record

**Why you're doing this:** Clear expectations prevent future confusion and disputes.

---

### Step 7: Final Checks ⏱️ 10 minutes

- [ ] **Verify you can log into EVERYTHING:**
  - GitHub ✅
  - Vercel ✅
  - Render ✅
  - Supabase ✅
  - Gmail account ✅
  - Google Cloud Console ✅

- [ ] **Test that you can make a simple change:**
  - Your developer helps you update one text label on the website
  - You see the change go live within a few minutes
  - This proves the deployment pipeline works

- [ ] **Save backup of everything:**
  - Download a ZIP of your GitHub code
  - Export your database from Supabase (as CSV files)
  - Save these files somewhere safe (external hard drive or cloud storage)

- [ ] **Get developer's final contact info:**
  - Email: [EMAIL]
  - Phone: [PHONE]
  - Best way to reach: [METHOD]
  - Timezone: [TIMEZONE]

- [ ] **Sign off on handoff completion:**
  - Both you and developer confirm everything is transferred
  - Exchange thank you / confirmation emails
  - Celebrate! 🎉

---

## 🚨 Important Safety Information

### Things That Can Go Wrong (and how to prevent them)

**1. Exposing Secret Keys**

❌ **What not to do:** Email your environment variables (passwords/API keys) to someone in plain text

✅ **What to do instead:**
- Use a password manager to share
- Or share via encrypted services like 1Password
- Or share in person / phone call

**Why it matters:** If your "Service Role Key" from Supabase leaks, someone could delete your entire database. If your Gmail password leaks, someone could send spam from your account.

**Real-world example:** A company accidentally posted their API key on GitHub. Hackers found it and ran up $72,000 in charges within 24 hours.

---

**2. Losing Access to Accounts**

❌ **What not to do:** Forget passwords and lose 2FA codes

✅ **What to do instead:**
- Use a password manager
- Save 2FA backup codes when you set up 2FA
- Keep a printed copy of critical passwords in a safe

**Why it matters:** If you lose access to your GitHub account, you lose access to your code. If you lose access to Supabase, you lose access to your data.

---

**3. Deleting Important Things**

❌ **What not to do:** Delete databases, repositories, or services thinking "I don't need this"

✅ **What to do instead:**
- Before deleting ANYTHING, ask your developer or a tech-savvy friend
- Take a backup first
- Wait 24 hours before deleting (in case you change your mind)

**Why it matters:** Deleted databases usually cannot be recovered. Deleted GitHub repos lose all history.

---

**4. Not Having Backups**

❌ **What not to do:** Trust that "the cloud" is backing things up automatically

✅ **What to do instead:**
- Export your database monthly (takes 5 minutes)
- Download a ZIP of your code from GitHub quarterly
- Store these backups somewhere safe (external drive + cloud)

**Why it matters:** Services can shut down. Accounts can get hacked. Backups are your insurance policy.

---

## 📞 Who to Contact When Things Go Wrong

### Your Website Is Down

**Symptoms:** Customers can't access the website, you see an error message

**Steps:**
1. Check if the service is down for everyone:
   - Vercel status: https://vercel.com/status
   - Render status: https://render.com/status
   - Supabase status: https://status.supabase.com

2. If those are all "OK", check your own accounts:
   - Log into Vercel → Check if project is still there
   - Log into Render → Check if backend is running
   - Log into Supabase → Check if database is online

3. If you can't figure it out:
   - Contact your developer: [CONTACT INFO]
   - Or contact the service's support (they're usually very helpful)

---

### Emails Are Not Sending

**Symptoms:** Customers aren't receiving notifications

**Steps:**
1. Check Gmail:
   - Log into the Gmail account that sends emails
   - Check "Sent" folder - are emails there?
   - Check "Spam" folder - are they getting blocked?

2. Check if you hit sending limits:
   - Gmail free: 500 emails/day limit
   - If you hit limit, wait 24 hours or upgrade to Google Workspace

3. Check backend logs:
   - Log into Render
   - Click "Logs" tab
   - Look for errors mentioning "email" or "gmail"

4. If you can't figure it out:
   - Contact your developer
   - They can check the OAuth2 connection

---

### Someone Left Your Team

**What to do:**
1. Change all shared passwords immediately:
   - Staff login password for website
   - Gmail password (if they knew it)

2. Remove their access:
   - From GitHub repository
   - From Vercel project
   - From Render service
   - Revoke their Gmail OAuth2 connection (if they connected their personal Gmail)

3. Review recent activity:
   - Check if they made any changes before leaving
   - Export database backup (just in case)

**Why this matters:** Prevent disgruntled ex-employees from causing damage.

---

### You Think You've Been Hacked

**Symptoms:** Weird charges, strange emails sent, data looks different, can't log in

**Immediate steps (do within 1 hour):**
1. Change ALL passwords
2. Check for unauthorized charges on credit cards
3. Revoke all API keys and generate new ones
4. Check your database for strange changes
5. Contact your developer ASAP
6. Contact support for each service

**Why this matters:** Fast response limits damage. Most services will refund fraudulent charges if you act quickly.

---

## 📈 Future Considerations

### When Should You Hire Another Developer?

You might need developer help when:
- ✅ You want to add new features
- ✅ Something breaks and you can't fix it
- ✅ You want to customize the design
- ✅ You're getting errors you don't understand
- ✅ You need to scale up for more users

### What NOT to Worry About

As a non-technical owner, you DON'T need to:
- ❌ Understand how the code works
- ❌ Learn programming
- ❌ Manage GitHub branches and pull requests
- ❌ Debug technical errors yourself

You just need to:
- ✅ Know how to use the website
- ✅ Keep accounts secure
- ✅ Have access to everything
- ✅ Know who to call for help

---

# 📂 Section 2: GitHub Repository Documentation

## What is GitHub?

**Simple explanation:** GitHub is like Google Drive for code. Instead of storing Word documents and Excel files, it stores the files that make your website work.

**Why you need it:** 
- All your website code is here
- You can see the history of every change ever made
- You can download a complete backup anytime
- Future developers you hire can access the code

---

## Your Repository Information

**Repository Name:** `HYC-code520/mail-management-system`

**Repository URL:** https://github.com/HYC-code520/mail-management-system

**Current Owner:** [SHOULD BE YOUR EMAIL AFTER HANDOFF]

**Privacy Setting:** Private (recommended - keeps your code secret)

**Description:** Internal mail management system for tracking customer mail, packages, and storage fees.

---

## Who Has Access?

Keep a list of everyone who can see or change your code:

| Name | Email | Role | Access Level | Date Added | Date Removed |
|------|-------|------|--------------|------------|--------------|
| [Your Name] | [Your Email] | Owner | Admin | [Date] | - |
| [Developer] | [Dev Email] | Developer | Write | [Date] | [If applicable] |
| | | | | | |

**Access Levels Explained:**
- **Admin:** Can do everything, including deleting the repository
- **Write:** Can make changes to code
- **Read:** Can only view code

**Rule of thumb:** Only give Admin access to yourself. Everyone else gets Write or Read.

---

## Repository Structure

Here's what folders are in your code, in plain English:

```
mail-management-system/
│
├── frontend/              ← The website people see
│   ├── src/
│   │   ├── components/    ← Reusable pieces (buttons, forms, etc.)
│   │   ├── pages/         ← Each page of your website
│   │   ├── lib/           ← Helper code
│   │   └── types/         ← TypeScript definitions
│   └── package.json       ← List of frontend dependencies
│
├── backend/               ← Behind-the-scenes server
│   ├── src/
│   │   ├── controllers/   ← Business logic (fees, emails, etc.)
│   │   ├── routes/        ← API endpoints
│   │   ├── services/      ← Database and email services
│   │   └── middleware/    ← Security and authentication
│   └── package.json       ← List of backend dependencies
│
├── docs/                  ← Documentation (this file!)
│   ├── CLIENT_HANDOFF_GUIDE.md      ← This guide
│   ├── CREDENTIALS_AND_ACCOUNTS.md  ← Passwords document
│   └── [100+ other guides]          ← Technical documentation
│
├── scripts/               ← Database setup scripts
│
├── supabase/              ← Database configuration
│   └── migrations/        ← Database structure changes over time
│
└── README.md              ← Overview of the project
```

**What you need to know:**
- Don't delete any folders - they're all important!
- Most changes developers make will be in `frontend/src` or `backend/src`
- The `docs/` folder is for documentation - you can read these files

---

## How to Use GitHub (Basic Tasks)

### Task 1: View Your Code

1. Go to https://github.com
2. Log in with your account
3. Click on "Repositories"
4. Click on `mail-management-system`
5. Browse folders by clicking on them

**You can now see every file in your project!**

---

### Task 2: Download a Backup

1. Go to your repository page
2. Click the green "Code" button
3. Click "Download ZIP"
4. Save the ZIP file somewhere safe
5. Unzip it to see all your files

**Do this once per quarter as a backup!**

---

### Task 3: See What Changed Recently

1. Go to your repository page
2. Click "Commits" (near the top)
3. You'll see a list of all changes made:
   - Who made the change
   - When they made it
   - What they changed
   - A message describing why

**This is your audit trail!**

---

### Task 4: Add a New Team Member

1. Go to your repository page
2. Click "Settings" tab
3. Click "Collaborators" in the left menu
4. Click "Add people"
5. Enter their GitHub username or email
6. Choose their permission level:
   - Use "Write" for developers
   - Use "Read" for people who just need to see the code

---

### Task 5: Remove Someone's Access

1. Go to repository Settings → Collaborators
2. Find their name
3. Click the "Remove" button next to their name
4. Confirm removal

**Do this immediately when someone leaves your team!**

---

## Important GitHub Security Settings

### Enable Two-Factor Authentication

- Go to your profile → Settings → Password and authentication
- Click "Enable two-factor authentication"
- Follow the steps
- **SAVE YOUR BACKUP CODES!**

### Keep Repository Private

- Go to repository Settings → General
- Scroll to "Danger Zone"
- Make sure it says "Private"
- **Never make it Public** unless you want everyone to see your code

### Enable Branch Protection

This prevents accidental deletion of important code:

- Go to repository Settings → Branches
- Click "Add rule"
- Branch name: `main`
- Check these boxes:
  - ☑️ Require a pull request before merging
  - ☑️ Require status checks to pass
- Click "Create"

**What this does:** Forces developers to review code before it goes live.

---

## What NOT to Do on GitHub

❌ **Don't delete the repository** - this is your only copy of the code

❌ **Don't commit secrets** - never put passwords in code files

❌ **Don't make the repo public** - keeps your business logic private

❌ **Don't remove the developer** until you have another developer lined up

❌ **Don't accept pull requests** you don't understand (ask your developer first)

---

## How Changes Go Live (Deployment Process)

This is automatic! Here's how it works:

```
Developer makes change
       ↓
Saves to GitHub
       ↓
GitHub notifies Vercel & Render
       ↓
Vercel rebuilds frontend (2-3 min)
Render rebuilds backend (5-10 min)
       ↓
Website automatically updates!
```

**You don't have to do anything!** Just make sure:
- Vercel is connected to GitHub ✅
- Render is connected to GitHub ✅

---

## Getting Help with GitHub

**GitHub Support:**
- Email: support@github.com
- Help docs: https://docs.github.com

**Common Issues:**
- "I forgot my password" → Use "Forgot password" link
- "I lost my 2FA codes" → Contact GitHub support with ID verification
- "I accidentally deleted something" → Contact your developer, they can restore from history

---

# 📚 Section 3: Client Documentation & Tutorials

## How to Use Your Mail Management Website

This section teaches you **exactly how to use your website** for daily operations. We've written it assuming you've never used the system before.

---

## 🎯 Product Overview: What This Website Does

### The Big Picture

Your mail management website helps you run your mail forwarding business efficiently. Before, you probably used:
- Paper logbooks to track incoming mail
- Spreadsheets to calculate storage fees
- Manual emails to notify customers
- Sticky notes to remember follow-ups

**Now everything is automatic and in one place!**

### What Problems It Solves

✅ **No more forgetting to notify customers** - The system reminds you and lets you send emails with one click

✅ **No more manual fee calculations** - Storage fees are calculated automatically based on how long packages have been sitting

✅ **No more lost package history** - Every package is tracked with complete history

✅ **No more manual data entry** - Use your phone camera to scan labels and the AI matches them to customers

✅ **No more spreadsheets** - Everything is in one searchable database

### Who Uses It

**Madison & Merlin (your staff):**
- Log incoming mail
- Scan labels with phone camera
- Send email notifications
- Track package pickups
- Collect storage fees

**You (the business owner):**
- See revenue analytics
- Review customer history
- Monitor what needs follow-up
- Access complete records

---

## 🚀 Getting Started (First Time Use)

### Step 1: Access the Website

1. **Open your web browser** (Chrome, Safari, Firefox, or Edge)

2. **Go to your website address:**
   ```
   [YOUR WEBSITE URL HERE]
   ```
   Bookmark this page so you can find it easily!

3. **You'll see the login screen**

   [SCREENSHOT PLACEHOLDER: Login screen]

### Step 2: Log In

1. **Enter your email address:**
   ```
   [STAFF EMAIL]
   ```

2. **Enter your password:**
   ```
   [You or your developer will set this]
   ```

3. **Click the "Sign In" button**

4. **You should now see the Dashboard!**

   [SCREENSHOT PLACEHOLDER: Dashboard]

### Step 3: What You See After Login

The Dashboard is your "home base." Here's what each section means:

**Top Section - Quick Actions:**
- 📸 **Scan Mail** - Start scanning mode to process incoming mail
- ✉️ **Log Mail** - Manually add a package or letter
- 👤 **Add Customer** - Create a new customer profile

**Statistics Cards:**
- **Total Customers** - How many customers you have
- **Active Mail Items** - Packages currently waiting for pickup
- **Needs Follow-Up** - Customers with overdue fees or old packages
- **Monthly Revenue** - Fees collected this month

**Needs Follow-Up List:**
- Shows customers who need attention (fees owed, packages waiting)
- Sorted by urgency (fees first, then oldest packages)

**Charts:**
- Mail volume over time
- Customer growth

---

## 📋 Core Features - Step by Step Guides

### Feature 1: Scanning New Mail (Recommended Method)

**When to use this:** Every day when mail arrives. This is the fastest way to log multiple packages.

**Step-by-step:**

1. **Click "Scan Mail" button** on the Dashboard

   [SCREENSHOT PLACEHOLDER: Scan Mail button]

2. **Allow camera access** (if prompted)
   - Your browser will ask: "Allow camera?"
   - Click "Allow"

3. **Point camera at the mail label**
   - Hold your phone steady
   - Make sure the label is clearly visible
   - You'll see a preview on screen

   [SCREENSHOT PLACEHOLDER: Camera view]

4. **Tap the "Capture" button**

5. **Wait 2-3 seconds** while AI reads the label
   - You'll see a spinning animation
   - The AI is reading the text and finding the customer

6. **Review the match**
   - System shows you which customer it matched
   - Shows confidence score (how sure it is)
   - Shows what text it read

   [SCREENSHOT PLACEHOLDER: Match result]

7. **If correct, click "Confirm"**
   - If wrong, click "Change Customer" and pick the right one

8. **Add details:**
   - Mail type: Package, Letter, Certified, or Large Package
   - Quantity: Usually 1 (but enter more if customer has multiple)
   - Notes: (optional) Tracking number, sender info, etc.

   [SCREENSHOT PLACEHOLDER: Details form]

9. **Click "Submit"**

10. **See success message!**
    - Green confirmation appears
    - Mail item is now logged
    - Customer will be notified (if you set it to auto-notify)

11. **Keep scanning!**
    - Click "Scan Another" to continue
    - Or click "Done" to exit scan mode

**Tips for better scanning:**
- Good lighting helps (avoid shadows)
- Get close enough to read the label clearly
- If scan fails, you can always type manually

---

### Feature 2: Manually Logging Mail (Alternative Method)

**When to use this:** When scanning doesn't work, or you prefer typing.

**Step-by-step:**

1. **Click "Log Mail" button** on Dashboard

   [SCREENSHOT PLACEHOLDER: Log Mail button]

2. **Select the customer**
   - Start typing customer name or mailbox number
   - System will show matching customers
   - Click on the correct one

   [SCREENSHOT PLACEHOLDER: Customer dropdown]

3. **Fill in the details:**
   - **Mail Type:** Select from dropdown
     - Package (most common)
     - Letter
     - Certified Mail
     - Large Package
   - **Quantity:** Enter number (usually 1)
   - **Received Date:** Usually today (pre-filled)
   - **Notes:** Optional tracking number, sender, etc.

   [SCREENSHOT PLACEHOLDER: Mail entry form]

4. **Click "Submit"**

5. **See confirmation!**
   - Mail item appears in the customer's history
   - Notification might be sent automatically

---

### Feature 3: Viewing Customer Mail History

**When to use this:** When a customer calls asking "Do I have any mail?", or when they come to pick up.

**Step-by-step:**

1. **Click "Customers" in the navigation menu**

   [SCREENSHOT PLACEHOLDER: Navigation menu]

2. **Find the customer:**
   - Use search box at top
   - Type name, company, or mailbox number
   - Or scroll through the list

   [SCREENSHOT PLACEHOLDER: Customer list with search]

3. **Click on the customer's name**

4. **You'll see their profile:**
   - Contact information
   - Mailbox number
   - All their mail items (grouped by date)
   - Outstanding fees

   [SCREENSHOT PLACEHOLDER: Customer profile]

5. **Mail items are shown grouped:**
   - Example: "3 packages on Dec 10"
   - Click the group to expand and see individual items
   - Each item shows:
     - Type (package/letter)
     - Status (Received, Notified, Picked Up)
     - Any fees owed
     - Notes you entered

---

### Feature 4: Sending Email Notifications

**When to use this:** After logging new mail, to notify customers their mail has arrived.

**Step-by-step:**

1. **Go to the customer's profile** (see Feature 3)

2. **Find the mail item(s)** you want to notify about

3. **Click "Send Notification" button**

   [SCREENSHOT PLACEHOLDER: Send Notification button]

4. **Choose email template:**
   - "New Mail Notification" (most common)
   - "Fee Reminder"
   - "Final Notice"
   - Or create custom message

   [SCREENSHOT PLACEHOLDER: Template selector]

5. **Preview the email**
   - See exactly what the customer will receive
   - Check that all info is correct (mail items, fees)

   [SCREENSHOT PLACEHOLDER: Email preview]

6. **Click "Send Email"**

7. **Confirmation appears!**
   - Email is sent immediately
   - Copy saved to notification history
   - Mail item status changes to "Notified"

**What the customer receives:**
- Professional email from your Gmail account
- List of their mail items
- Any fees owed
- Your contact info

---

### Feature 5: Handling Customer Pickup

**When to use this:** When a customer arrives to collect their mail.

**Step-by-step:**

1. **Go to the customer's profile** (search by name/mailbox)

2. **Review what they have:**
   - All pending packages and letters shown
   - Any fees owed are highlighted in red

   [SCREENSHOT PLACEHOLDER: Customer items with fees]

3. **Collect payment (if fees owed):**
   - Click "Collect Fee" button next to the package
   - Enter details:
     - **Staff member:** Select your name (Madison or Merlin)
     - **Payment method:** Cash, Card, Venmo, Zelle, Check
     - **Amount:** Pre-filled, but you can adjust for discounts
     - **Notes:** (optional) Why you adjusted the fee

   [SCREENSHOT PLACEHOLDER: Fee collection form]

4. **Click "Mark as Paid"**

5. **Mark items as picked up:**
   - Select all items they're taking
   - Click "Mark as Picked Up"
   - Confirm the action

   [SCREENSHOT PLACEHOLDER: Mark picked up]

6. **Items move to "Completed" status**
   - Customer's active mail count goes down
   - Dashboard updates immediately
   - Complete history is saved

**If customer is only picking up some items:**
- Just mark those specific ones as picked up
- Others stay in "Received" or "Notified" status

---

### Feature 6: Using the Dashboard

**When to use this:** Start and end of each day, or anytime you want an overview.

**What the Dashboard shows:**

**Quick Actions (top row):**
- Fast access to common tasks
- Click any button to jump right in

**Statistics Cards:**
- **Total Customers:** Active and inactive count
- **Active Mail Items:** Currently waiting for pickup
- **Needs Follow-Up:** Urgent attention needed
- **Monthly Revenue:** This month's collected fees

   [SCREENSHOT PLACEHOLDER: Stats cards]

**Needs Follow-Up Section:**
- Shows customers prioritized by:
  1. Outstanding fees (highest priority)
  2. Age of packages (older = more urgent)
  3. Notification status (not notified recently)
- Each customer card shows:
  - Name and mailbox number
  - Total fees owed (in red if any)
  - Number of items
  - Quick action buttons

   [SCREENSHOT PLACEHOLDER: Follow-up list]

**Charts (bottom section):**
- Mail volume over time
- Customer growth trends
- Revenue trends

**How to use this effectively:**
1. Start each day by checking "Needs Follow-Up"
2. Send reminder emails to customers with fees
3. Check statistics to see your workload
4. End of day: Verify all mail was logged

---

### Feature 7: Managing Storage Fees

**How fees work (automatic):**

1. **Package arrives** → Logged in system
2. **Days 1-2** → FREE (grace period)
3. **Day 3+** → $2 per day accumulates
4. **Fee calculation runs daily** → Automatic at midnight

**You don't have to calculate anything!** The system does it.

**To view fees:**

1. Go to customer profile
2. Look for red "Fee" badges on packages
3. Click package to see:
   - How many days it's been held
   - Daily rate ($2/day)
   - Total fee accumulated

   [SCREENSHOT PLACEHOLDER: Fee details]

**To collect fees:**

(See Feature 5: Handling Customer Pickup)

**To waive or discount a fee:**

1. Click "Collect Fee" button
2. Adjust the amount (lower it)
3. Add note explaining why: "Good customer", "Our mistake", etc.
4. Complete payment
5. System tracks original fee vs collected amount

---

### Feature 8: Adding New Customers

**When to use this:** When a brand new customer signs up for mailbox service.

**Step-by-step:**

1. **Click "Add Customer" button** (Dashboard or Customers page)

   [SCREENSHOT PLACEHOLDER: Add Customer button]

2. **Fill in the form:**

   **Required fields:**
   - **First Name:** Customer's first name
   - **Last Name:** Customer's last name
   - **Mailbox Number:** Their assigned mailbox (e.g., 42)

   **Optional but recommended:**
   - **Company Name:** If they have a business
   - **Email:** To send notifications
   - **Phone:** For contact
   - **Language Preference:** English or Chinese
   - **Notes:** Any special instructions

   [SCREENSHOT PLACEHOLDER: New customer form]

3. **Click "Save Customer"**

4. **New customer appears in your list!**
   - You can now log mail for them
   - They'll receive notifications at their email

**Tips:**
- Double-check email address - typos mean customer won't get notifications
- Mailbox numbers should be unique (system will warn if duplicate)
- Language preference affects email templates (English or Chinese)

---

### Feature 9: Searching and Filtering

**Multiple ways to find what you need:**

**Search customers:**
1. Go to "Customers" page
2. Type in search box:
   - Customer name: "John Smith"
   - Company: "ABC Corp"
   - Mailbox number: "42"
3. Results update instantly

   [SCREENSHOT PLACEHOLDER: Search in action]

**Search mail items:**
1. Go to "Mail Log" page
2. Filter by:
   - Status: Received, Notified, Picked Up
   - Date range: Last 7 days, Last 30 days, Custom
   - Mail type: Packages only, Letters only, etc.
   - Customer: Select from dropdown

   [SCREENSHOT PLACEHOLDER: Mail log filters]

**Tips for finding things fast:**
- Mailbox number is fastest (unique identifier)
- Search works on partial names ("John" finds "John Smith", "Johnny", etc.)
- Use filters to narrow down long lists

---

## 🔧 Upkeep & Maintenance

### Daily Tasks (5-10 minutes)

**Morning routine:**
- [ ] Check Dashboard for "Needs Follow-Up"
- [ ] Send reminder emails if needed
- [ ] Review any new notifications from system

**Throughout the day:**
- [ ] Log mail as it arrives (using Scan or Manual entry)
- [ ] Handle customer pickups
- [ ] Mark items as picked up

**End of day:**
- [ ] Verify all today's mail was logged
- [ ] Check that no customers were missed
- [ ] Review fee collections for the day

---

### Weekly Tasks (10 minutes)

- [ ] **Review outstanding fees:**
  - Go to Dashboard → Needs Follow-Up
  - Send gentle reminders to customers with old fees
  - Consider calling customers with high fees (over $50)

- [ ] **Check for abandoned packages:**
  - Go to Mail Log → Filter by "Received" status, older than 30 days
  - These might be abandoned
  - Contact customers or prepare to dispose per your policy

- [ ] **Review notification history:**
  - Make sure emails are going out successfully
  - Check Gmail "Sent" folder for confirmation

---

### Monthly Tasks (30 minutes)

- [ ] **Export data backup:**
  1. Log into Supabase
  2. Go to Table Editor
  3. Export each table as CSV:
     - contacts (customers)
     - mail_items
     - package_fees
     - outreach_messages
  4. Save files to external drive or cloud storage

- [ ] **Review revenue:**
  - Check Dashboard → Monthly Revenue
  - Compare to your bookkeeping records
  - Investigate any discrepancies

- [ ] **Clean up old data:**
  - Archive customers who haven't had mail in 6+ months
  - Mark as "Inactive" (don't delete - keep history)

- [ ] **Review team access:**
  - Make sure only current staff have login access
  - Remove any old accounts

---

### What Requires Paid Developer Support

**You can do yourself (free):**
- ✅ Use the website (all features)
- ✅ Add/remove staff login accounts
- ✅ Export data backups
- ✅ Basic troubleshooting (check status pages)

**Requires developer ($$ hourly):**
- ⚠️ **Adding new features:** "Can we add SMS notifications?"
- ⚠️ **Changing design:** "Can we change the colors?"
- ⚠️ **Fixing bugs:** Something stops working
- ⚠️ **Changing fee logic:** "Can we change grace period to 3 days?"
- ⚠️ **Upgrading services:** Moving from free to paid tiers
- ⚠️ **Email deliverability issues:** Emails going to spam
- ⚠️ **Database problems:** Data corruption, performance issues

**When to call developer:**
- If you see error messages you don't understand
- If features stop working
- If you want to add/change functionality
- If you're locked out of an account
- If you suspect a security issue

---

## 🐛 Troubleshooting & FAQs

### Problem 1: "I can't log in"

**Symptoms:** Wrong password, or website won't let you in

**Solutions:**

1. **Double-check your email and password**
   - Make sure Caps Lock is off
   - Try copying password from password manager

2. **Reset your password:**
   - Click "Forgot Password" on login screen
   - Enter your email
   - Check email for reset link
   - Create new password

3. **Check if website is down:**
   - Try from different device
   - Check status: https://vercel.com/status

4. **Still stuck?**
   - Contact your developer
   - Provide screenshot of error message
   - Mention exact time it happened

---

### Problem 2: "Emails aren't sending to customers"

**Symptoms:** Customers aren't receiving notifications

**Solutions:**

1. **Check if email was actually sent:**
   - Log into Gmail account (the one that sends emails)
   - Check "Sent" folder
   - Is the email there? If yes → problem is on customer's end

2. **Ask customer to check spam folder**
   - Your emails might be going to spam
   - Have them mark as "Not Spam"
   - Future emails should arrive in inbox

3. **Check if you hit sending limit:**
   - Gmail free: 500 emails per day max
   - Check "Sent" folder - did you send ~500 today?
   - If yes: Wait until tomorrow, or upgrade to Google Workspace

4. **Check Gmail connection:**
   - Go to Settings page on your website
   - Look for "Gmail Integration" status
   - If disconnected: Click "Connect Gmail" button

5. **Still not working?**
   - Contact your developer
   - Tell them:
     - What time you tried to send
     - Which customer (name/email)
     - What error message you saw (if any)

---

### Problem 3: "Camera won't work for scanning"

**Symptoms:** Black screen, "Camera not available", permission errors

**Solutions:**

1. **Grant camera permission:**
   - Browser will ask "Allow camera access?"
   - Click "Allow"
   - If you clicked "Block" by accident:
     - Click 🔒 lock icon in browser address bar
     - Change Camera to "Allow"
     - Refresh page

2. **Try different browser:**
   - Chrome works best
   - Safari also works
   - Firefox might have issues

3. **Check if another app is using camera:**
   - Close other apps (Zoom, FaceTime, etc.)
   - Try again

4. **Use mobile device instead:**
   - Open website on your phone
   - Phone cameras work better anyway

5. **Last resort: Manual entry**
   - Use "Log Mail" button instead
   - Type in customer and details
   - Slower but always works

---

### Problem 4: "Website is slow or timing out"

**Symptoms:** Pages take forever to load, or show "Request timeout" errors

**Solutions:**

1. **Check your internet connection:**
   - Try loading other websites (Google, etc.)
   - If those are slow too → problem is your internet
   - Restart your router

2. **Backend might be "sleeping" (if using free tier):**
   - First request after 15 minutes takes 30-60 seconds
   - Wait patiently
   - After it "wakes up", should be fast again
   - Upgrade to paid Render tier ($7/mo) to fix permanently

3. **Check service status:**
   - Vercel: https://vercel.com/status
   - Render: https://render.com/status
   - If they show "Major Outage" → wait for them to fix

4. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   - Select "Cached images and files"
   - Click "Clear data"
   - Refresh website

5. **Still slow?**
   - Contact developer
   - Mention specific pages that are slow
   - Note the time of day (might be related to traffic)

---

### Problem 5: "Fees are calculating wrong"

**Symptoms:** Fee shown doesn't match your manual calculation

**Solutions:**

1. **Understand the fee logic:**
   - Day 1-2: FREE (grace period)
   - Day 3 onward: $2 per day
   - Example: Package arrives Monday = free Mon, Tue
   - Fee starts Wednesday = $2, Thursday = $4, Friday = $6

2. **Check the received date:**
   - Click on the package
   - Look at "Received Date"
   - Count days from then to today

3. **Timezone issues:**
   - System uses New York timezone
   - If received late night, might be "next day" in NY time
   - Usually not a big deal (1 day difference max)

4. **If fee was manually adjusted:**
   - Someone might have discounted it
   - Check "Action History" on the package
   - You'll see who changed it and why

5. **If still wrong:**
   - Contact developer immediately
   - Provide specific example:
     - Customer name
     - Package received date
     - Expected fee vs shown fee
   - Screenshot helps!

---

### Problem 6: "I accidentally deleted something!"

**Symptoms:** Customer/package/data is missing

**Solutions:**

1. **Check if it's filtered out:**
   - Maybe you have filters applied
   - Reset all filters to "Show All"
   - Check "Inactive" customers if looking for customer

2. **Check if someone else moved it:**
   - Look at Action History
   - See who last modified the item
   - They might have changed status

3. **True deletion (rare):**
   - System doesn't easily delete things
   - Most actions "archive" instead of delete
   - Contact developer ASAP
   - Mention:
     - What was deleted
     - Approximately when
     - Who might have done it

4. **Developer can restore from backup:**
   - Supabase keeps backups
   - Can restore from daily backup
   - Might lose up to 24 hours of data

**Prevention:**
- Be careful with "Delete" buttons
- System usually asks "Are you sure?"
- When in doubt, "Archive" instead of "Delete"

---

### Problem 7: "Report an error to developer"

When something breaks, help your developer fix it faster by providing:

**What to tell them:**

1. **Exact error message:**
   - Take a screenshot
   - Or copy the text exactly

2. **What you were trying to do:**
   - "I was trying to scan a package"
   - "I clicked Send Email"
   - Step-by-step what you did

3. **When it happened:**
   - Exact date and time
   - "December 15, 2024 at 2:30 PM EST"

4. **What you expected vs what actually happened:**
   - Expected: "Email should send"
   - Actually: "Got error 'Failed to send'"

5. **Can you reproduce it?**
   - Does it happen every time?
   - Or just once?
   - Try again and document results

6. **Your environment:**
   - What device? (iPhone, Windows PC, Mac, etc.)
   - What browser? (Chrome, Safari, etc.)
   - Any recent changes? (Updated browser, new device, etc.)

**Example good bug report:**

> "Hey, I'm getting an error when trying to send emails. 
> 
> **What I did:**
> 1. Went to customer John Smith's profile
> 2. Clicked 'Send Notification'
> 3. Selected 'New Mail' template
> 4. Clicked 'Send Email'
> 
> **Error message:** 'Failed to send email: Invalid token'
> 
> **When:** December 15, 2024 at 2:30 PM EST
> 
> **Tried again:** Same error. Happens with all customers.
> 
> **Device:** MacBook Pro, using Chrome browser
> 
> **Screenshot:** [attached]"

This helps your developer fix it in 10 minutes instead of 2 hours!

---

## 🔐 Security & Access Management

### How to Add a New Staff Member

**Step-by-step:**

1. **They need to create a Supabase account first:**
   - Your developer will send them a signup link
   - Or: Log into Supabase → Authentication → Invite user

2. **Set their permissions:**
   - By default, they can log in
   - They'll have same access as other staff

3. **Train them:**
   - Have them read this guide
   - Shadow them for a day
   - Give them test customers to practice on

**What they can access:**
- ✅ All customer data
- ✅ All mail items
- ✅ Can send emails
- ✅ Can collect fees
- ✅ Can scan mail

**What they CAN'T access:**
- ❌ GitHub (code)
- ❌ Vercel (hosting)
- ❌ Render (backend)
- ❌ Supabase (database admin)

Those remain your control only!

---

### How to Remove Staff Access

**When someone leaves:**

1. **Disable their login:**
   - Log into Supabase
   - Go to Authentication → Users
   - Find their email
   - Click "..." → "Delete user"

2. **Change shared passwords:**
   - If they knew the Gmail password → change it
   - If they knew any API keys → rotate them (ask developer)

3. **Review recent activity:**
   - Check Mail Log for anything they did recently
   - Make sure all fees they collected are accounted for
   - Export data if needed for records

**Do this immediately when someone leaves!** Don't wait.

---

### Password Best Practices

**For your website login:**
- ✅ Use strong password (12+ characters, mix of letters/numbers/symbols)
- ✅ Don't share with anyone outside your team
- ✅ Change every 6 months
- ✅ Use different password from your email

**For your accounts (GitHub, Vercel, etc.):**
- ✅ Use password manager (1Password, LastPass, etc.)
- ✅ Turn on Two-Factor Authentication (2FA) everywhere
- ✅ Don't reuse passwords across services
- ✅ Don't write passwords on sticky notes

**For your staff:**
- ✅ Each person gets their own login
- ✅ Never share one account among multiple people
- ✅ Tell them not to write passwords down
- ✅ Train them on security basics

---

## 📞 Support Information

### Paid Developer Support Agreement

**Developer Contact Info:**
- Name: [DEVELOPER NAME]
- Email: [DEVELOPER EMAIL]
- Phone: [DEVELOPER PHONE]
- Timezone: [TIMEZONE]
- Best contact method: [EMAIL/PHONE/SLACK]

**Support Agreement:**
- ☐ **Hourly Support:** $[XX]/hour, billed in 15-minute increments
- ☐ **Monthly Retainer:** $[XXX]/month for [X] hours included
- ☐ **No Ongoing Support:** You'll hire someone else as needed

**Response Time:**
- Emergencies (site down): [X] hours
- Bugs (feature broken): [X] business days
- Feature requests: [X] weeks
- Questions: [X] business days

**What's Included:**
- ✅ Bug fixes (if it's our fault)
- ✅ Answering questions about how to use features
- ✅ Help recovering from accidental deletions

**What Costs Extra:**
- ⚠️ New features you request
- ⚠️ Design changes
- ⚠️ Integration with new services
- ⚠️ Training new staff (beyond 1 hour)
- ⚠️ Fixing problems caused by you changing code

---

### Service Support Contacts

**If your developer is unavailable**, contact these services directly:

**Vercel (Frontend Hosting):**
- Support: https://vercel.com/support
- Email: support@vercel.com
- Help docs: https://vercel.com/docs
- Status: https://vercel.com/status

**Render (Backend Hosting):**
- Support: https://render.com/support
- Email: support@render.com  
- Help docs: https://render.com/docs
- Status: https://render.com/status

**Supabase (Database):**
- Support: https://supabase.com/support
- Email: support@supabase.io
- Help docs: https://supabase.com/docs
- Status: https://status.supabase.com

**Google Cloud (Gmail API):**
- Support: https://support.google.com/cloud
- Help docs: https://cloud.google.com/docs

**GitHub (Code Storage):**
- Support: https://support.github.com
- Help docs: https://docs.github.com

**What to tell them:**
- Your account email
- Describe the problem
- Mention you're a small business customer
- Be patient - they usually respond within 24 hours

---

### Emergency Procedures

**Scenario 1: Website is completely down**

1. Check status pages (links above)
2. If service is down → wait for them to fix (usually 1-2 hours)
3. If status says "OK" but site still down → contact developer immediately
4. In meantime: Use paper to log mail, enter later when site is back

**Scenario 2: Can't send emails**

1. Log mail items as usual (this still works)
2. Check Gmail account manually
3. Call customers if urgent
4. Contact developer to fix email issue
5. Once fixed, bulk-send notifications to all pending customers

**Scenario 3: Data looks wrong or missing**

1. Don't make any more changes (might make it worse)
2. Take screenshots of what looks wrong
3. Contact developer immediately with:
   - Screenshots
   - What's missing/wrong
   - When you last saw it correct
4. Developer can restore from backup if needed

**Scenario 4: Suspected security breach**

1. Change all passwords immediately
2. Check for unauthorized charges on credit cards
3. Review recent activity in all services
4. Contact developer and service support
5. Document everything

---

## ✅ Handoff Completion Checklist

### Before Signing Off

Both you (client) and developer should confirm:

- [ ] **All accounts transferred to client ownership**
  - GitHub ✅
  - Vercel ✅
  - Render ✅
  - Supabase ✅

- [ ] **Client can log into everything**
  - Tested each service ✅
  - 2FA set up ✅
  - Passwords saved in password manager ✅

- [ ] **Website works end-to-end**
  - Can log in ✅
  - Can scan mail ✅
  - Can send emails ✅
  - Dashboard shows correct data ✅

- [ ] **Documentation provided**
  - This handoff guide ✅
  - Credentials document ✅
  - Technical documentation (in `/docs` folder) ✅

- [ ] **Backups created**
  - Code downloaded from GitHub ✅
  - Database exported from Supabase ✅
  - Stored in safe location ✅

- [ ] **Support agreement documented**
  - Hourly rate or retainer agreed ✅
  - Contact info exchanged ✅
  - Response times clarified ✅

- [ ] **Client trained on basic use**
  - Can log in ✅
  - Can scan mail ✅
  - Can send notifications ✅
  - Knows where to find help ✅

- [ ] **Costs understood**
  - Current monthly cost: $[X]
  - When costs might increase ✅
  - Billing alerts set up ✅

---

### Sign-Off

**Developer:**
- Name: [DEVELOPER NAME]
- Signature: _________________________
- Date: _______________

**Client:**
- Name: [YOUR NAME]
- Signature: _________________________
- Date: _______________

**Notes:**
```
[Any final notes, special instructions, or follow-up needed]





```

---

## 🎉 Congratulations!

You now own and control your complete mail management system!

**What you've accomplished:**
✅ You own all the code (GitHub)  
✅ You own all the hosting (Vercel & Render)  
✅ You own all the data (Supabase)  
✅ You understand how everything works  
✅ You know who to contact for help  
✅ You're protected with backups and documentation  

**You're not stuck with one developer** - any competent web developer can help you in the future because:
- Code is well-documented
- Repository is clean and organized
- Standard technologies (React, Node.js, PostgreSQL)
- This handoff guide explains everything

**You can confidently:**
- Use your website daily
- Train new staff
- Hire other developers if needed
- Maintain your business operations
- Scale up as you grow

---

## 📚 Additional Resources

All technical documentation is in the `/docs` folder of your code:

**For You (Non-Technical):**
- This guide (you're reading it!)
- `CREDENTIALS_AND_ACCOUNTS.md` - All your passwords
- `PROJECT_OVERVIEW.md` - What the system does
- `TROUBLESHOOTING.md` - Common problems

**For Future Developers:**
- `README.md` - Technical overview
- `SETUP_ENV.md` - How to run locally
- `API_ENDPOINTS.md` - API documentation
- `PACKAGE_FEE_SYSTEM.md` - How fees work
- `OAUTH2_SETUP_GUIDE.md` - Email sending setup
- `TESTING_COMPLETE.md` - Automated tests
- And 100+ other technical guides!

---

**🔒 Remember: Keep this document secure! It contains sensitive information about your business systems.**

**Questions? Contact your developer or refer to specific sections above.**

**Thank you for your business! Wishing you great success with your mail management system!** 🚀
