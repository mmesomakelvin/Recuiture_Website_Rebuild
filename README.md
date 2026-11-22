# Recruiture by EduBridge Academy

Recruiture is a Nigerian job platform run by EduBridge Academy. Job seekers find live roles and apply, the EduBridge team posts and manages every job for its client companies, and verified EduBridge graduates carry a badge that helps them stand out.

## What is in this repository

This repository holds two things side by side:

| Folder | What it is | How to run it |
| --- | --- | --- |
| Root (`src/`, `product/`) | **Design OS**, the planning and design tool. It holds the product plan, sample data and clickable screen designs. | `npm install` then `npm run dev`, open http://localhost:3001 |
| `web/` | **The real website**, built with Next.js 16.4.6, React 19, Tailwind CSS v4, Prisma 7 and Supabase. | `cd web`, `npm install`, then `npm run dev` |

Website code only ever goes in `web/`. The root `src/` folder belongs to Design OS.

## Where to find things

- `product/`: the official blueprint. Product overview, roadmap, design tokens, and a spec, sample data and types for each section.
- `src/sections/`: the screen designs you can click through in Design OS.
- `docs/brainstorms/`: notes from brainstorming sessions, recording what we decided to build and why.
- `docs/planning/`: architecture notes and implementation plans for the website.
- `Templates/`: outside design templates kept for reference only. `Templates/One` holds the Cairn agents landing page (MIT licence, by Kedhareswer Naidu). Its layout ideas inspired the new home page, but none of its code is used in the site.

## Roadmap and progress

| Section | What it covers | Status |
| --- | --- | --- |
| Job Board | Public job listings, search, filters, job pages and the apply flow | Designed |
| Candidate Portal | Sign up, sign in, a basic profile with CV, and an application tracker | Designed |
| Admin Portal | Internal staff area for jobs, applications, hiring stages and enquiries | Designed |
| Info Pages | For Employers, Contact and FAQ pages | Being designed |

On the live website (`web/`), the home, jobs and About us pages are built. The home page is a scroll-driven landing page in Poppins on white, with no dark mode. Candidate accounts, the apply flow and the admin portal come next. They will follow an updated implementation plan, because the October plans assumed employers would post their own jobs. For now, EduBridge staff post every job.

## Key decisions (November 2026)

- The admin portal lives at `/admin` inside the same website, with one staff role.
- Staff post all jobs. There are no employer accounts in the first version.
- Candidates must sign in to apply. They hear about each stage change by email and see it in their portal.
- First reviews are due within 7 days of an application. After an interview, the next update is due within 5 business days.

See `docs/brainstorms/2026-11-22-website-additions-and-admin-portal-brainstorm.md` for the full reasoning and the questions still open.

## Brand

- Colours: EduBridge teal `#154b54` and gold `#f2c94c`, with warm stone neutrals.
- Font: Poppins for all text.
- Backgrounds: white only. There is no dark mode in the designs or the website.
- Copy rules: no em dashes and no emojis anywhere in website copy or design files.

---

Planning and screen designs are made with [Design OS](https://buildermethods.com/design-os) by Brian Casel at Builder Methods. See the [changelog](CHANGELOG.md) for Design OS releases.
