# Candidate Portal Specification

## Overview
The Candidate Portal is where signed-in job seekers manage their job search on Recruiture. It brings together a dashboard of what needs attention, a filterable list of every application with its full history, the jobs they have saved and a profile they can edit card by card. Verified EduBridge Academy graduates see their graduate badge on their profile and a shortcut to graduate-friendly roles.

## User Flows
- Candidate moves between the four portal screens (Dashboard, Applications, Saved jobs, Profile) using a row of portal tabs under the site header
- Candidate lands on the Dashboard and sees application counts by stage (Active, Interviewing, Offers) and their three most recently updated applications, and can open any of them
- Candidate sees their profile completeness percentage with a list of missing items, and can jump straight to the profile card that fixes each one
- Candidate browses recommended jobs that match their skills and preferences, and can view or save each one
- Candidate reads a recent activity feed, such as status changes on their applications and employers viewing their profile
- Candidate sees saved jobs whose deadline is within the next 7 days and can apply before they close
- A verified graduate sees a card on the Dashboard linking to graduate-friendly roles on the Job Board
- Candidate views all applications and filters them with tabs: All, Active (applied or screening), Interviewing, Offers (offer or hired) and Closed (not selected or withdrawn), each tab showing its count
- Candidate opens an application to see the job summary, a status timeline of every stage with dates, and exactly what they submitted: the CV, cover letter and screening answers
- Candidate withdraws an application that is still applied, in screening or at interview, confirming in a dialog with an optional reason, after which it moves to Closed as Withdrawn
- Candidate views saved jobs with their deadline and applied state, applies to a job, opens it on the Job Board, or removes it from saved jobs
- Candidate views their profile with a header showing name, headline, location, an Open to work toggle and, for verified graduates, the amber EduBridge Graduate badge with program name and completion date
- Candidate edits a profile card in place (About, Experience, Education, Skills, Job preferences, Links), saving or cancelling without leaving the page
- Candidate adds, edits and removes experience and education entries
- Candidate replaces their CV with a new PDF or Word file up to 5MB, or opens the current one
- Candidate adds a profile photo from the completeness list

## UI Requirements
- Portal tabs under the site header: Dashboard, Applications, Saved jobs and Profile, with the active tab highlighted; the tabs scroll horizontally on mobile
- Dashboard layout: greeting with the candidate's first name, stat tiles for Active, Interviewing and Offers, then recent applications, profile completeness, recommended jobs, recent activity and saved jobs closing soon, arranged in two columns on desktop and one column on mobile
- Graduate card on the Dashboard only for verified graduates, in amber, naming their program
- Profile completeness shown as a percentage with a progress ring or bar, plus a checklist of missing items each linking to the right card
- Application list cards show job title, company, location, a status pill, applied date and last updated time, and a "Hiring through EduBridge" badge where it applies
- Status pills use distinct colours: Applied and Screening in stone, Interview in teal, Offer and Hired in amber, Not selected and Withdrawn in muted grey
- Filter tabs above the application list with counts, and an empty state per tab when no applications match
- Application detail shows the job summary with a link to the job, a vertical status timeline with the current stage highlighted, and the submission (CV file name, cover letter or "No cover letter", and each screening question with its answer)
- Withdraw button only for applications that are applied, in screening or at interview, opening a confirmation dialog with an optional reason field
- Saved jobs shown as cards with title, company, location, monthly salary in naira or "Confidential", deadline, and badges for Applied, Closing soon (7 days or fewer) and Closed
- Saved job actions: Apply (hidden once applied and disabled once closed), View job, and Remove
- Empty state for saved jobs with a button to browse jobs
- Profile page as a stack of cards: About (headline, location, phone, bio), Experience, Education, Skills, Job preferences (preferred locations, job types, work modes and minimum monthly salary in naira), Links (LinkedIn, portfolio, GitHub) and CV
- Each profile card has an Edit button that turns the card into a form with Save and Cancel; Experience and Education also have Add and per-entry Remove
- Open to work shown as a switch in the profile header with a short explanation
- CV card shows file name, size and upload date with View and Replace actions, and accepts PDF or Word files up to 5MB
- Salaries are monthly and in naira; dates are shown like "12 Sep 2026" and recent times like "2 days ago"
- No em dashes and no emojis anywhere in the copy
- Out of scope for this section: interview scheduling details, messaging with employers, job alerts and requesting graduate verification

## Configuration
- shell: true
