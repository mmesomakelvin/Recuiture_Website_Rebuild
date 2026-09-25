# Data Shape

## Entities

### User
Anyone with an account. Each user has a role: candidate, employer, recruiter (EduBridge staff) or admin.

### CandidateProfile
A job seeker's public profile: headline, location, experience, education, skills, CV and job preferences.

### Company
An organisation that hires through the platform. A company is either self-serve, managing its own jobs, or a client whose jobs are managed by the EduBridge recruiting team.

### Job
A role a company is hiring for, with title, description, location, job type, experience level, salary range in naira and a status such as draft, published or closed.

### Application
A candidate's application to a job, holding their CV, cover letter and current hiring stage, from applied through to hired or rejected.

### Shortlist
A set of applications a recruiter has picked for a client role and shared with that client company.

### SavedJob
A job a candidate has bookmarked to come back to later.

### Program
An EduBridge Academy training program, such as a course or bootcamp, that candidates can graduate from.

### GraduateVerification
A staff-confirmed record that a candidate completed an EduBridge program, with the completion date. It is what gives a candidate the graduate badge.

### Notification
A message to a user about something that happened, such as an application status change or a new applicant.

## Relationships

- User has one CandidateProfile (candidates only)
- Company has many Users as its team members (employers)
- Company has many Jobs
- Job belongs to Company and is posted by a User (employer or recruiter)
- Job has many Applications
- Application belongs to both Job and CandidateProfile
- Shortlist belongs to Job and is created by a recruiter
- Shortlist has many Applications
- SavedJob belongs to both User and Job
- CandidateProfile has many GraduateVerifications
- GraduateVerification belongs to both CandidateProfile and Program, and is confirmed by a staff User
- User has many Notifications
