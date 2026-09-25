# Component Library (shadcn/ui + Custom)

## Base Components (shadcn/ui)
Install: `npx shadcn-ui@latest add button input card modal dropdown table avatar badge toast tooltip separator label textarea select checkbox radio-button switch tabs accordion dialog popover hover-card scroll-area`

| Component | File | Usage |
|-----------|------|-------|
| Button | `components/ui/button.tsx` | Primary, secondary, outline, ghost, destructive, link |
| Input | `components/ui/input.tsx` | Text, email, password, search |
| Textarea | `components/ui/textarea.tsx` | Cover letter, bio, description |
| Label | `components/ui/label.tsx` | Form labels |
| Select | `components/ui/select.tsx` | Job type, experience, salary |
| Checkbox | `components/ui/checkbox.tsx` | Skills, filters, terms |
| RadioGroup | `components/ui/radio-group.tsx` | Single choice (job type, salary range) |
| Switch | `components/ui/switch.tsx` | Toggle (remote, open to work) |
| Card | `components/ui/card.tsx` | Job cards, company cards, stats |
| Table | `components/ui/table.tsx` | Applications, users, jobs lists |
| Avatar | `components/ui/avatar.tsx` | User, company logos |
| Badge | `components/ui/badge.tsx` | Status chips (Applied, Interview, etc.) |
| Modal/Dialog | `components/ui/dialog.tsx` | Apply modal, confirm delete |
| Dropdown | `components/ui/dropdown-menu.tsx` | Actions, user menu, filters |
| Tabs | `components/ui/tabs.tsx` | Dashboard sections, profile tabs |
| Toast | `components/ui/toast.tsx` | Success, error, info notifications |
| Tooltip | `components/ui/tooltip.tsx` | Info icons, truncated text |
| Separator | `components/ui/separator.tsx` | Visual dividers |
| Accordion | `components/ui/accordion.tsx` | FAQ, job details sections |
| Popover | `components/ui/popover.tsx` | Date picker, filter panels |
| HoverCard | `components/ui/hover-card.tsx` | Company preview, user preview |
| ScrollArea | `components/ui/scroll-area.tsx` | Long lists, sidebar |

## Custom Form Components (`components/forms/`)
| Component | Description |
|-----------|-------------|
| `JobForm.tsx` | Create/edit job (multi-step: basics, details, requirements) |
| `CandidateProfileForm.tsx` | Multi-step profile builder |
| `CompanyForm.tsx` | Company onboarding/editing |
| `ApplicationForm.tsx` | Apply to job (resume upload + cover letter) |
| `ScreeningForm.tsx` | Custom screening questions per job |
| `FilterPanel.tsx` | Job search filters sidebar |

## Layout Components (`components/layout/`)
| Component | Description |
|-----------|-------------|
| `Header.tsx` | Marketing header with nav, auth buttons |
| `Footer.tsx` | Links, social, copyright |
| `DashboardLayout.tsx` | Sidebar + header + content wrapper |
| `Sidebar.tsx` | Role-based navigation |
| `MobileNav.tsx` | Bottom tab bar for mobile dashboards |
| `Breadcrumb.tsx` | Navigation breadcrumbs |

## Feature Components (`components/features/`)
### Job Board
- `JobCard.tsx` - Job listing card (title, company, location, salary, tags)
- `JobDetail.tsx` - Full job view with apply button
- `JobSearch.tsx` - Search bar with filters
- `JobFilters.tsx` - Sidebar filters (type, location, salary, experience)

### Candidate Portal
- `ProfileBuilder.tsx` - Stepper for profile completion
- `ResumeUpload.tsx` - Drag-drop upload with progress
- `ApplicationTracker.tsx` - Kanban board (Applied → Screening → Interview → Offer → Hired)
- `SavedJobsList.tsx` - Grid of saved jobs with remove action

### Employer Dashboard
- `CompanyProfile.tsx` - Company info, branding, team
- `JobManager.tsx` - CRUD table with status badges
- `CandidatePipeline.tsx` - Kanban drag-drop (react-beautiful-dnd)
- `CandidateCard.tsx` - Candidate preview in pipeline
- `AnalyticsDashboard.tsx` - Charts (views, applications, conversion)

### Admin Panel
- `UserManagementTable.tsx` - Users with role filter, actions
- `JobModerationTable.tsx` - Flagged/pending jobs
- `AnalyticsOverview.tsx` - Platform metrics charts

## Utility Components
- `LoadingSkeleton.tsx` - Skeleton loaders for cards, tables
- `EmptyState.tsx` - Illustrated empty states
- `ErrorBoundary.tsx` - Graceful error fallback
- `ConfirmDialog.tsx` - Reusable delete confirmation
- `ImageUpload.tsx` - Avatar/logo upload with preview/crop
- `RichTextEditor.tsx` - Job description editor (TipTap or Plate)