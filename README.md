# SAP SD Mastery Hub v3

Interview preparation platform for SAP Sales & Distribution functional consultants.

## What's Inside

| Content | Count |
|---------|-------|
| Learning Sections | 18 (Days 1-14 + Other Processes + Less Focused + ASAP/Agile + Public Cloud) |
| Concept Cheatsheets | 106 detailed concepts |
| Quiz Questions (Junior) | 180 MCQs with expert explanations |
| Quiz Questions (Senior) | 180 MCQs with expert explanations |
| Advanced Scenario | 20 edge-case MCQs |
| Final Test | 25 cross-topic MCQs |
| **Total Questions** | **405** |
| T-Codes Reference | 14 key transactions |
| SE16N Tables Reference | 11 key tables |

## Features

- **Junior / Senior toggle** — switch difficulty per quiz
- **Explanations after submission** — must answer all questions before seeing any answers
- **Results tracking** — score history per section and level
- **Feedback system** — difficulty and clarity ratings per section
- **Supabase authentication** — real user accounts with email/password
- **localStorage fallback** — works offline without any database
- **Mobile responsive** — study on any device

## Quick Start

### Option A: Open HTML file (instant, no setup)
Download `sap-sd-hub-v3-complete.html` and open it in your browser. Done.

### Option B: Deploy to Vercel (production website)
See [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) for step-by-step instructions.

### Option C: Run locally
```bash
npm install
cp .env.example .env
npm start
```
Opens at http://localhost:3000

## Tab Structure

| Tab | Concepts | Quiz | Results | Feedback |
|-----|----------|------|---------|----------|
| Days 1-14 | Yes | Yes (10 MCQ x 2 levels) | Yes | Yes |
| Other Processes | Yes | Yes | Yes | Yes |
| Less Focused | Yes | Yes | Yes | Yes |
| ASAP & Agile | Yes | Yes | Yes | Yes |
| Public Cloud | Yes | Yes | Yes | Yes |
| T-Codes & SE16N | Reference only | No | No | Yes |
| Advanced Scenario | No | 20 edge-case MCQs | Yes | Yes |
| Final Test | No | 25 all-topic MCQs | Yes | Yes |
| Final Feedback | No | No | No | Overall feedback |

## Tech Stack

- **React 18** — UI framework
- **Supabase** — Authentication + PostgreSQL database
- **Vercel** — Hosting and deployment
- **localStorage** — Offline fallback storage

## File Structure

```
sap-sd-mastery-hub/
├── public/index.html          # Base HTML
├── src/
│   ├── App.jsx                # Main application component
│   ├── index.js               # React entry point
│   ├── data/sections.js       # All 405 questions + 106 concepts
│   ├── lib/supabase.js        # Supabase client
│   ├── lib/storage.js         # Data layer (Supabase + localStorage)
│   └── styles/App.css         # Styling
├── supabase/schema.sql        # Database schema
├── package.json               # Dependencies
├── vercel.json                # Deployment config
├── .env.example               # Environment variable template
├── .gitignore                 # Git ignore rules
├── DEPLOYMENT-GUIDE.md        # Step-by-step deployment instructions
└── README.md                  # This file
```

## License

Private — internal use only.
