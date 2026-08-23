# Candidate Portal

## Pages
| Route | Description |
|-------|-------------|
| `/candidate` | Dashboard overview (stats, recent applications, recommended jobs) |
| `/candidate/profile` | Profile view/edit (multi-tab: Basics, Experience, Education, Skills, Preferences) |
| `/candidate/profile/resume` | Resume upload/management |
| `/candidate/applications` | Kanban board of applications |
| `/candidate/applications/[id]` | Application detail (status timeline, messages) |
| `/candidate/saved-jobs` | Grid of saved jobs |
| `/candidate/settings` | Account, notifications, privacy, connected accounts |

## Profile Builder (Multi-step)
```
Step 1: Basics (headline, bio, location, phone, links)
Step 2: Experience (repeater: title, company, dates, description)
Step 3: Education (repeater: degree, institution, dates)
Step 4: Skills (multi-select + custom input)
Step 5: Preferences (locations, job types, salary range, open to work)
Step 6: Resume (upload PDF/DOCX, parse preview)
```

## Resume Upload
- Drag-drop zone with file validation (PDF, DOC, DOCX, max 5MB)
- Supabase Storage: `resumes/{userId}/{timestamp}-{filename}`
- **Optional**: Parse with Affinda/Parseur API → pre-fill profile fields
- Progress indicator, error handling, replace confirmation

## Application Tracker (Kanban)
Columns: Applied → Screening → Interview → Offer → Hired | Rejected | Withdrawn
- Drag-drop to update status (candidate can only withdraw)
- Click card → Application detail modal
- Status timeline with timestamps and notes
- Filter by status, date range, search

## Saved Jobs
- Grid layout with job cards
- Remove button (confirm)
- "Apply" button on each card
- Empty state illustration

## Settings
- Account: Email, password, avatar, delete account
- Notifications: Email/push preferences per event type
- Privacy: Profile visibility, data export, delete data
- Connected Accounts: OAuth providers management

## Real-time Updates
- Subscribe to `notifications` table changes
- Toast notifications for: Application status change, New message, Job match
- Update kanban columns optimistically