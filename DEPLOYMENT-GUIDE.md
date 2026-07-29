# SAP SD Mastery Hub — Complete Deployment Guide
### For non-technical users: every click explained

---

## What You Have

This folder contains a complete web application. To put it on the internet so anyone can access it, you need three free services:

| Service | What it does | Cost |
|---------|-------------|------|
| **GitHub** | Stores your code (like Google Drive for code) | Free |
| **Vercel** | Hosts your website (makes it accessible via a URL) | Free |
| **Supabase** | Database for user accounts & quiz results | Free (up to 50,000 users) |

**Time needed:** ~30 minutes for all three steps.

---

## STEP 1: Create a GitHub Account & Upload Your Code
**Time: 10 minutes**

### 1.1 — Create GitHub Account
1. Go to **https://github.com**
2. Click **"Sign up"** (top right)
3. Enter your email, create a password, choose a username
4. Complete the verification puzzle
5. You now have a GitHub account

### 1.2 — Create a New Repository (folder for your code)
1. After logging in, click the **green "New"** button (or go to https://github.com/new)
2. Fill in:
   - **Repository name:** `sap-sd-mastery-hub`
   - **Description:** `SAP SD Interview Prep Platform`
   - **Visibility:** Select **Public** (Vercel needs this for free tier)
   - Leave everything else as default
3. Click **"Create repository"**

### 1.3 — Upload All Files
1. On the new repository page, you'll see a section saying "Quick setup"
2. Click **"uploading an existing file"** link
3. Open the `sap-sd-mastery-hub` folder on your computer
4. **Select ALL files and folders inside it** and drag them onto the GitHub upload area:
   ```
   Files to upload:
   ├── public/          (folder — drag the whole folder)
   ├── src/             (folder — drag the whole folder)
   ├── supabase/        (folder — drag the whole folder)
   ├── .env.example
   ├── .gitignore
   ├── package.json
   ├── vercel.json
   └── README.md
   ```
5. Scroll down, click **"Commit changes"**
6. Wait for upload to finish

**Important:** Make sure the folder structure is correct. After upload, your repository should show files like `package.json` and folders like `src/`, `public/` at the ROOT level — not nested inside another folder.

**If files are nested** (e.g., you see `sap-sd-mastery-hub/package.json` instead of just `package.json`):
- Delete the repository (Settings → scroll down → "Delete this repository")
- Re-create it
- This time, open the `sap-sd-mastery-hub` folder first, then select all files INSIDE it and drag

### 1.4 — Verify Upload
Your repository should look like this:
```
github.com/YOUR_USERNAME/sap-sd-mastery-hub/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx
│   ├── index.js
│   ├── data/
│   │   └── sections.js
│   ├── lib/
│   │   ├── storage.js
│   │   └── supabase.js
│   └── styles/
│       └── App.css
├── supabase/
│   └── schema.sql
├── .env.example
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

If you see this structure → **Step 1 is done!**

---

## STEP 2: Create Supabase Database
**Time: 10 minutes**

### 2.1 — Create Supabase Account
1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign in with your **GitHub account** (easiest — click "Continue with GitHub")
4. Authorize Supabase to access your GitHub

### 2.2 — Create a New Project
1. Click **"New Project"**
2. Fill in:
   - **Name:** `sap-sd-hub`
   - **Database Password:** Choose a strong password (save it somewhere safe — you'll need it later)
   - **Region:** Choose the closest to your users (e.g., Mumbai for India, Frankfurt for Europe)
3. Click **"Create new project"**
4. **Wait 2-3 minutes** while Supabase sets up your database

### 2.3 — Create Database Tables
1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the file `supabase/schema.sql` from your project folder in any text editor (Notepad works)
4. **Copy the entire content** of that file
5. **Paste it** into the Supabase SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. You should see "Success" message

### 2.4 — Enable Email Authentication
1. In the left sidebar, click **"Authentication"**
2. Click **"Providers"** tab
3. Find **"Email"** — make sure it's **enabled** (green toggle)
4. Optional: Under "Email Templates", you can customize the confirmation email

### 2.5 — Get Your API Keys (you'll need these in Step 3)
1. Click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** in the settings menu
3. You'll see two important values. **Copy them to a notepad:**
   - **Project URL:** looks like `https://abcdefgh.supabase.co`
   - **anon public key:** a long string starting with `eyJ...`

**Keep these values ready — you'll paste them in Step 3.**

---

## STEP 3: Deploy on Vercel
**Time: 10 minutes**

### 3.1 — Create Vercel Account
1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (easiest)
4. Authorize Vercel to access your GitHub

### 3.2 — Import Your GitHub Repository
1. After logging in, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **`sap-sd-mastery-hub`** and click **"Import"**

### 3.3 — Configure the Project
1. **Framework Preset:** Vercel should auto-detect "Create React App" — if not, select it from the dropdown
2. **Root Directory:** Leave as `.` (default)
3. **Build Command:** Should auto-fill as `npm run build` — leave it
4. **Output Directory:** Should auto-fill as `build` — leave it

### 3.4 — Add Environment Variables
This is where you connect Supabase. Click **"Environment Variables"** to expand.

Add these three variables one by one:

| NAME (type exactly) | VALUE (paste from Step 2.5) |
|---|---|
| `REACT_APP_SUPABASE_URL` | Your Project URL from Supabase (e.g., `https://abcdefgh.supabase.co`) |
| `REACT_APP_SUPABASE_ANON_KEY` | Your anon key from Supabase (the long `eyJ...` string) |
| `REACT_APP_USE_LOCAL_STORAGE` | `false` |

For each one:
1. Type the NAME in the "Name" field
2. Paste the VALUE in the "Value" field
3. Click **"Add"**

### 3.5 — Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes while Vercel builds your app
3. You'll see a **"Congratulations!"** screen with your live URL
4. Your URL will be something like: `https://sap-sd-mastery-hub.vercel.app`

**Your app is now LIVE on the internet!**

---

## STEP 4: Test Everything
**Time: 5 minutes**

1. Open your Vercel URL in a browser
2. Click **"Sign Up"** and create a test account
3. Log in
4. Click **"Day 1"** → verify concepts load
5. Click **"Quiz"** tab → select Junior → answer all 10 → submit → verify explanations appear
6. Click **"Results"** tab → verify your score is saved
7. Click **"Feedback"** tab → submit feedback
8. Try **"Advanced Scenario"** and **"Final Test"**
9. Log out and log back in → verify your results are still there (Supabase is saving them)

---

## Optional: Custom Domain

If you want a custom URL like `www.sapsdmastery.com`:

1. Buy a domain from any registrar (GoDaddy, Namecheap, Google Domains) — ~$10/year
2. In Vercel Dashboard → your project → **"Settings"** → **"Domains"**
3. Click **"Add"** and type your domain name
4. Vercel will show you DNS records to add
5. Go to your domain registrar → DNS settings → add the records Vercel shows
6. Wait 10-30 minutes for DNS propagation
7. Your custom domain is now live!

---

## Troubleshooting

### "Build failed" on Vercel
- Check that `package.json` is at the ROOT of your repository (not inside a subfolder)
- Verify Framework Preset is "Create React App"

### "Login not working" after deployment
- Check environment variables in Vercel → Settings → Environment Variables
- Make sure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are correct
- If using localStorage mode: set REACT_APP_USE_LOCAL_STORAGE to `true`

### "Database error" when signing up
- Go to Supabase → SQL Editor → re-run the schema.sql
- Check Authentication → Providers → Email is enabled
- Check if email confirmation is required (you can disable it in Auth settings for testing)

### Want to skip Supabase for now?
Change the environment variable in Vercel:
- `REACT_APP_USE_LOCAL_STORAGE` = `true`
This stores everything in the user's browser. No database needed. But data won't sync across devices.

### How to update content later
1. Edit the files on GitHub (click the file → pencil icon → edit → commit)
2. Vercel auto-deploys every time you change code on GitHub
3. Wait 2 minutes → your site updates automatically

---

## What Each File Does

| File | Purpose | Do you need to edit it? |
|------|---------|------------------------|
| `src/data/sections.js` | All quiz questions and concepts | **Yes** — to add/change content |
| `src/App.jsx` | The app interface (screens, tabs, logic) | Only if changing features |
| `src/styles/App.css` | Visual design (colors, fonts, layout) | Only if changing appearance |
| `src/lib/storage.js` | Saves data to Supabase or localStorage | No |
| `src/lib/supabase.js` | Connects to Supabase database | No |
| `src/index.js` | App startup file | No |
| `public/index.html` | Base HTML page | No |
| `supabase/schema.sql` | Database table definitions | Only run once in Step 2.3 |
| `package.json` | Lists required software packages | No |
| `vercel.json` | Tells Vercel how to deploy | No |
| `.env.example` | Template for secret keys | No (you set these in Vercel) |
| `.gitignore` | Tells GitHub which files to ignore | No |

---

## Architecture Summary

```
User's Browser
    ↓
Vercel (hosts the website)
    ↓
React App (runs in browser)
    ↓
Supabase (stores user data, quiz results, feedback)
```

**Cost:** $0/month for up to ~50,000 monthly users on free tiers of all three services.

---

## Need Help?

- **Vercel docs:** https://vercel.com/docs
- **Supabase docs:** https://supabase.com/docs
- **GitHub docs:** https://docs.github.com
- **React docs:** https://react.dev

---

*Guide created: July 2026 | SAP SD Mastery Hub v3 — 405 questions, 18 sections, complete platform*
