# Job Board Specification

## Overview
The Job Board is the public heart of Recruiture, where anyone can search and filter live jobs across Nigeria and read full job details in a split view. Signed-in candidates can save jobs, share them and apply through a short guided flow using their saved CV, a cover letter and any screening questions the employer set. Roles open to EduBridge graduates and roles managed by the EduBridge recruiting team are clearly tagged.

## User Flows
- Visitor searches by keyword (job title, skill or company) and optionally a location, and sees matching jobs with a result count
- Visitor narrows results with filters: location or state (including Remote), job type, work mode, experience level, monthly salary range in naira and a Graduate-friendly toggle, and can clear individual filters or all filters at once
- Visitor changes the sort order between Most relevant, Newest and Highest salary
- Visitor selects a job in the list and its full details appear in the right-hand panel on desktop; on mobile, selecting a job opens a full-page job detail view with a back button
- Visitor shares a job by copying its link or sharing to WhatsApp or LinkedIn
- Signed-in candidate saves or unsaves a job from a job card or the detail panel; a guest who tries to save is prompted to sign in
- Guest clicks Apply and is asked to sign in or create an account before continuing
- Signed-in candidate clicks Apply and goes through the apply flow: step 1 choose the CV on their profile or upload a new one, step 2 write an optional cover letter, step 3 answer the employer's screening questions (skipped when the job has none), step 4 review everything and submit
- After submitting, the candidate sees a confirmation with the job title and company, and links to view their applications or keep browsing
- A candidate who has already applied to a job sees an "Applied" state instead of the Apply button
- When no jobs match, the visitor sees an empty state explaining this with a button to clear filters

## UI Requirements
- Desktop split view: search and filter controls across the top, a scrollable job list on the left and the selected job's detail panel on the right
- Search bar with a keyword field, a location field and a Search button
- Filters shown as dropdown chips in a bar under the search on desktop, and in a slide-up filter sheet on mobile, with active filter chips that can be removed individually and a Clear all action
- Result count and sort dropdown above the job list
- Job card shows job title, company name and logo (or initials), location, work mode, job type, monthly salary range in naira or "Confidential", posted time (for example "2 days ago"), a save button and any badges
- Selected job card is clearly highlighted in the list
- Badges: "Graduate-friendly" in amber for roles open to EduBridge graduates, "Hiring through EduBridge" for client roles managed by EduBridge recruiters, and "New" for jobs posted in the last 3 days
- Job detail shows title, company, location, work mode, job type, experience level, salary, posted date, application deadline, number of applicants, Apply button, Save button and Share button, followed by sections for About the role, Responsibilities, Requirements, Benefits and skills tags, plus a short About the company card
- Salaries are always monthly and in naira, formatted like "₦350,000 to ₦500,000 / month", or "Confidential" when the employer hides the salary
- Apply flow opens as a focused multi-step view with a step indicator (CV, Cover letter, Questions, Review), Back and Continue buttons, and the job title and company kept visible at the top
- CV step shows the candidate's saved CV with file name and upload date as the default choice, plus an option to upload a new PDF or Word file up to 5MB
- Screening questions support short text, number, yes or no, and multiple choice answers, with required questions marked
- Review step shows the chosen CV, the cover letter and all screening answers, each with an Edit link back to its step
- Success state confirms the application was sent, with View my applications and Keep browsing buttons
- Sign in prompt for guests explains why an account is needed and offers Sign in and Create account buttons
- Share menu with Copy link, WhatsApp and LinkedIn options, and a brief "Link copied" confirmation
- Numbers such as salaries and applicant counts use tabular figures
- No em dashes and no emojis anywhere in the copy
- Out of scope for this section: company listing and company profile pages, job alerts, and employer or recruiter tools

## Configuration
- shell: true
