# Admin Portal Specification

## Overview
The Admin Portal is the internal staff area where the EduBridge team runs all recruitment on Recruiture. Staff post and manage every job for client companies, review applicants and move them through hiring stages with truthful candidate emails, and follow up on enquiries from the public Contact and For Employers forms. Every staff member has the same access.

## User Flows
- Staff open the portal to an Overview showing counts and to-do lists: applications waiting for first review (with the seven-day target and overdue ones highlighted), interviews needing a next-step update, new enquiries, and published jobs closing within seven days. Each item links into the relevant list or record.
- Staff browse Jobs in a table filtered by status (Draft, Published, Paused, Closed) and searchable by title or company, with applicant counts per job.
- Staff create a job in a full-page form: title, company, location, work mode, job type, experience level, monthly naira salary range or confidential, deadline, summary, description, responsibilities, requirements, benefits, skills, the Graduate-friendly flag and optional screening questions. They save it as a draft or publish it.
- While creating a job, staff search existing client companies or add a new company inline (name, logo, industry, size, location, about) without leaving the form.
- Staff edit a job, publish a draft, pause a published job (it leaves public search but keeps its applicants), resume a paused job, or close a job as Filled or Cancelled. Closing shows how many active applicants will be resolved: Filled moves them to Not selected, Cancelled moves them to Role cancelled, and both send emails.
- Staff review Applications in a table across all jobs, filtered by job and stage and searchable by candidate name. Opening a job's applicants shows the same table filtered to that job.
- Clicking an applicant opens a side panel with contact details, the EduBridge graduate marker when verified, a link to open the CV, the cover letter, screening answers, stage controls and the dated history.
- Staff move an applicant to Screening, Interview, Offer, Hired or Not selected. A confirmation dialog shows the new stage and a preview of the candidate email, lets staff add an optional personal note, and records the change in the history when confirmed. Opening an application never changes its stage.
- For an applicant at Interview, staff mark the interview as completed. The portal suggests a next-update date five business days later, which staff confirm or change. Overdue next updates appear on the Overview.
- Staff see withdrawn applications and Role cancelled outcomes in the history but cannot set those stages themselves.
- Staff work through Enquiries in a list filtered by status (New, In progress, Closed) and source (Contact, For Employers). Opening an enquiry shows the message, the sender's details, employer details for For Employers enquiries, and internal notes.
- Staff change an enquiry's status, add internal notes, and use Reply by email to open their own email client addressed to the sender.
- Staff sign out from the account menu.

## UI Requirements
- Standalone staff layout: a left sidebar with Overview, Jobs, Applications and Enquiries, each showing a count badge for items needing attention, and a slim top bar with the Recruiture wordmark, an "Admin" label and the staff account menu.
- On mobile the sidebar collapses into a menu button; tables become stacked cards and the applicant side panel opens full screen.
- Overview uses stat cards plus short to-do lists, each with a "View all" link.
- Jobs and Applications use dense, filterable tables with status and stage badges in consistent colours.
- Applicant detail opens in a right-hand side panel over the table, keeping the list visible on desktop.
- History is a vertical timeline of dated entries showing the stage, who made the change (staff name, candidate or system), any personal note and whether the email was sent, queued or failed.
- Stage moves and job closing always use a confirmation dialog; the stage dialog includes the email preview and optional note field.
- First-review due dates show in a mono font, turning amber within two days of the target and red once overdue.
- Empty states for no jobs, no applicants for a job, no results for a filter, and no enquiries.
- Uses product tokens: teal primary, amber secondary, stone neutrals, Poppins, IBM Plex Mono for dates, counts and reference codes. Full light and dark mode.
- No em dashes and no emojis in interface copy.
- Out of scope: employer accounts, employer verification, job reconfirmation, staff management and roles, graduate verification, shortlists shared with clients, sending email replies from inside the portal.

## Configuration
- shell: false
