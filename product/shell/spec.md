# Application Shell Specification

## Overview
Recruiture uses a public-website style shell: a top navigation header and a footer that wrap every page. The same shell serves visitors browsing jobs and signed-in candidates, employers and EduBridge recruiters, so the site always feels like one product. The header adapts to who is viewing it: visitors see sign in and post a job actions, while signed-in users get a role-aware dashboard link and an account menu.

## Navigation Structure
- **Find Jobs** → Job Board
- **Companies** → Job Board (company listings)
- **For Employers** → Employer Dashboard (landing and sign up for employers)
- **My Dashboard** → Candidate Portal, Employer Dashboard or Recruiter and Admin, depending on the signed-in user's role

## User Menu
Located at the right of the header.

- **Signed out:** a plain "Sign in" link and a teal "Post a job" button.
- **Signed in:** avatar with initials fallback, the user's name and a chevron. The dropdown shows the name and email, an "EduBridge Graduate" marker for verified graduates, then Profile, Settings and Log out.

The role-aware nav item is labelled "My Dashboard" for candidates, "Employer Dashboard" for employers and "Recruiter Hub" for EduBridge staff.

## Layout Pattern
Top navigation. A sticky white header holds the Recruiture wordmark (with a small "by EduBridge Academy" line) on the left, the main nav links in the middle and the user menu on the right. Page content renders full width below the header. A dark teal footer with site links, EduBridge Academy link and copyright closes every page.

## Responsive Behavior
- **Desktop:** Full header on one row: wordmark, nav links, user menu with avatar and name.
- **Tablet:** Nav links stay visible; the user menu collapses to the avatar only.
- **Mobile:** Wordmark and a menu button. The menu button opens a full-height slide-out panel with all nav links, then the account links or the sign in and post a job actions. The footer stacks its link groups vertically.

## Design Notes
- Brand teal (primary) is used for the wordmark, active nav state, the "Post a job" button and the footer background.
- Amber (secondary) marks the active nav link with an underline and styles the EduBridge Graduate marker.
- Stone (neutral) is used for nav text, borders and backgrounds.
- Poppins for all text; IBM Plex Mono is reserved for numbers and reference codes inside sections.
- No em dashes and no emojis anywhere in the interface copy.
- No authentication screens in the shell; sign in and sign up are separate pages.
