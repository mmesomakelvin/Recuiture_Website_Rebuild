# Admin Panel

## Pages
| Route | Description |
|-------|-------------|
| `/admin` | Dashboard (platform stats, recent activity, charts) |
| `/admin/users` | User management table |
| `/admin/jobs` | Job moderation queue |
| `/admin/companies` | Company verification |
| `/admin/analytics` | Platform analytics |
| `/admin/settings` | Platform configuration |

## User Management
- Table with: Name, Email, Role, Status, Created, Last Login
- Filters: Role (Candidate/Employer/Admin), Status (Active/Banned), Search
- Actions: View details, Change role, Ban/Unban, Delete, Impersonate
- Bulk actions: Export CSV, Batch role change

## Job Moderation
- Queue: Pending review, Flagged, Reported
- View job detail with reporter info
- Actions: Approve, Reject (with reason), Archive, Feature
- Auto-flag: Spam keywords, duplicate posts, suspicious patterns

## Company Verification
- List companies with verification status
- View company details, owner, jobs count
- Actions: Verify, Unverify, Request docs, Ban

## Analytics
- **Users**: Signups/day, Active users, Retention, Role distribution
- **Jobs**: Posted/day, Filled rate, Avg time-to-fill, By category
- **Applications**: Submitted/day, Conversion funnel, Source attribution
- **Revenue**: If applicable (job posting fees, subscriptions)
- Export: CSV, PDF reports, Scheduled emails

## Settings
- Platform: Name, logo, default currency, supported countries
- Auth: Allowed OAuth providers, Email verification required, MFA
- Email: Templates, SMTP config, Suppression list
- Features: Feature flags, Maintenance mode, Rate limits
- Legal: Terms, Privacy, Cookie policy URLs