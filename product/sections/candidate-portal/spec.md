# Candidate Portal Specification

## Overview
The Candidate Portal is where job seekers create an account, sign in and keep track of every job they have applied for on Recruiture. It is kept deliberately small for the first version: account screens, a basic profile with one CV, and an application tracker that shows each application's current stage, a dated history of every change and what to expect next.

## User Flows
- Visitor creates an account with full name, email, phone and password, agreeing to the terms; if they arrived from a job's Apply button, the screen names that job and they continue to it after signing up
- Candidate signs in with email and password, sees a clear error when the details are wrong, and can switch to Create account or Forgot password
- Candidate who forgot their password enters their email and sees a "check your email" confirmation that never reveals whether the account exists
- Candidate opens the reset link from the email, sets a new password that meets the rules, and is taken to sign in
- Signed-in candidate moves between My applications and Profile using tabs at the top of the portal
- Candidate sees counts of applications In progress, at Interview and with an Offer, and a list of every application filtered by Active, Closed or All
- Each application in the list shows the job, company, current stage, a stage progress line, the date of the last update and a plain sentence about what happens next
- Candidate opens an application to see a dated history of every stage change, newest first, including any note from the hiring team and whether an email was sent about it
- Candidate reviews exactly what they submitted: the CV, the cover letter or "No cover letter", and each screening question with their answer
- Candidate opens the job they applied for on the Job Board
- Candidate withdraws an application that is Applied, in Screening or at Interview, confirming in a dialog with an optional reason; it then shows as Withdrawn and moves to Closed
- Candidate with no applications sees an empty state with a button to browse jobs
- Candidate updates their name, phone and location on the Profile tab and saves; their email is shown but cannot be changed here
- Candidate views their current CV or replaces it with a PDF or Word file up to 5 MB, with a clear error for the wrong type or size
- Candidate asks for a password reset email from the Profile tab

## UI Requirements
- Account screens (Sign in, Create account, Forgot password, Set new password) are centred cards inside the site shell, with the Recruiture wordmark, short helper text and links between them
- When sign-in or sign-up was started from a job, a teal banner above the form names the job and company
- Password rules shown under the password field (at least 8 characters, with a letter and a number), with a show or hide toggle
- Portal header with a greeting using the candidate's first name and two tabs: My applications and Profile
- Three coloured stat tiles: In progress (teal), Interview (amber) and Offers (green), matching the Admin Portal look
- Filter tabs (Active, Closed, All) with counts above the application list
- Application cards show a company initials tile, job title, company, location, a stage pill, a five-step progress line (Applied, Screening, Interview, Offer, Hired) and the next-step sentence
- Next-step wording: Applied says when to expect a first update (7 days from applying); Interview after it is completed says when the next update is due; Offer says the hiring team will be in touch; closed stages say the application is closed
- Stage pills: Applied in stone, Screening in amber, Interview in teal, Offer in solid teal, Hired in green, Not selected in rose, Withdrawn and Role cancelled in muted grey
- Application detail has a back link, a header card with job, company, stage pill, reference number and applied date, a vertical dated timeline, a "What you sent" card and a job summary card with a View job link
- Withdraw button appears only for Applied, Screening and Interview, and opens a confirmation dialog with an optional reason field
- Profile tab has a details card (full name, email read only, phone, location by state) with Save, a CV card (file name, size, upload date, View and Replace) and a password card with a Send reset email action
- Dates shown like "12 Nov 2026"; recent times like "2 days ago"; salaries monthly in naira or "Confidential"
- Works on mobile: tiles stack two per row, cards go full width and the detail page becomes one column
- No em dashes and no emojis anywhere in the copy
- Out of scope for this version: saved jobs, recommended jobs, the full profile (experience, education, skills, preferences), the EduBridge graduate badge and graduate verification, interview scheduling and messaging

## Configuration
- shell: true
