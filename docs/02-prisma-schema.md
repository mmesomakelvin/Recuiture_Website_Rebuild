# Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  CANDIDATE
  EMPLOYER
  ADMIN
}

enum JobStatus {
  DRAFT
  PUBLISHED
  CLOSED
  ARCHIVED
}

enum JobType {
  FULL_TIME
  PART_TIME
  CONTRACT
  INTERNSHIP
  REMOTE
  HYBRID
}

enum ApplicationStatus {
  APPLIED
  SCREENING
  INTERVIEW
  OFFER
  HIRED
  REJECTED
  WITHDRAWN
}

enum CompanySize {
  STARTUP_1_10
  SMALL_11_50
  MEDIUM_51_200
  LARGE_201_500
  ENTERPRISE_500_PLUS
}

model User {
  id            String    @id @default(cuid())
  supabaseId    String    @unique @map("supabase_id")
  email         String    @unique
  fullName      String?   @map("full_name")
  avatarUrl     String?   @map("avatar_url")
  role          UserRole  @default(CANDIDATE)
  isActive      Boolean   @default(true) @map("is_active")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  candidateProfile CandidateProfile?
  employerProfile  EmployerProfile?
  applications     Application[]
  savedJobs        SavedJob[]
  notifications    Notification[]
  company          Company?        @relation("CompanyOwner")
  managedCompany   Company?        @relation("CompanyManager")

  @@map("users")
}

model CandidateProfile {
  id              String    @id @default(cuid())
  userId          String    @unique @map("user_id")
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  headline        String?
  bio             String?
  location        String?
  phone           String?
  website         String?
  linkedinUrl     String?   @map("linkedin_url")
  githubUrl       String?   @map("github_url")
  portfolioUrl    String?   @map("portfolio_url")
  resumeUrl       String?   @map("resume_url")
  resumeFileName  String?   @map("resume_file_name")
  skills          String[]  @default([])
  experience      Json      @default("[]")
  education       Json      @default("[]")
  preferredLocations String[] @default([]) @map("preferred_locations")
  preferredJobTypes JobType[] @default([]) @map("preferred_job_types")
  salaryMin       Int?      @map("salary_min")
  salaryMax       Int?      @map("salary_max")
  currency        String    @default("USD")
  isOpenToWork    Boolean   @default(true) @map("is_open_to_work")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  @@map("candidate_profiles")
}

model EmployerProfile {
  id          String   @id @default(cuid())
  userId      String   @unique @map("user_id")
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  companyId   String?  @unique @map("company_id")
  company     Company? @relation(fields: [companyId], references: [id], onDelete: SetNull)
  title       String?
  department  String?
  phone       String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("employer_profiles")
}

model Company {
  id              String       @id @default(cuid())
  name            String
  slug            String       @unique
  description     String?
  logoUrl         String?      @map("logo_url")
  bannerUrl       String?      @map("banner_url")
  website         String?
  size            CompanySize?
  industry        String?
  location        String?
  foundedYear     Int?         @map("founded_year")
  linkedinUrl     String?      @map("linkedin_url")
  twitterUrl      String?      @map("twitter_url")
  isVerified      Boolean      @default(false) @map("is_verified")
  ownerId         String       @map("owner_id")
  owner           User         @relation("CompanyOwner", fields: [ownerId], references: [id])
  managers        User[]       @relation("CompanyManager")
  jobs            Job[]
  createdAt       DateTime     @default(now()) @map("created_at")
  updatedAt       DateTime     @updatedAt @map("updated_at")

  @@map("companies")
}

model Job {
  id              String      @id @default(cuid())
  title           String
  slug            String      @unique
  description     String      @db.Text
  requirements    String?     @db.Text
  responsibilities String?    @db.Text
  benefits        String?     @db.Text
  location        String
  isRemote        Boolean     @default(false) @map("is_remote")
  jobType         JobType[]   @default([FULL_TIME]) @map("job_type")
  experienceLevel String?     @map("experience_level")
  salaryMin       Int?        @map("salary_min")
  salaryMax       Int?        @map("salary_max")
  currency        String      @default("USD")
  status          JobStatus   @default(DRAFT)
  companyId       String      @map("company_id")
  company         Company     @relation(fields: [companyId], references: [id], onDelete: Cascade)
  postedById      String      @map("posted_by_id")
  postedBy        User        @relation(fields: [postedById], references: [id])
  publishedAt     DateTime?   @map("published_at")
  expiresAt       DateTime?   @map("expires_at")
  viewsCount      Int         @default(0) @map("views_count")
  applicationsCount Int       @default(0) @map("applications_count")
  createdAt       DateTime    @default(now()) @map("created_at")
  updatedAt       DateTime    @updatedAt @map("updated_at")

  applications    Application[]
  savedJobs       SavedJob[]
  skills          JobSkill[]

  @@index([companyId, status])
  @@index([status, publishedAt])
  @@map("jobs")
}

model JobSkill {
  id        String @id @default(cuid())
  jobId     String @map("job_id")
  job       Job    @relation(fields: [jobId], references: [id], onDelete: Cascade)
  skill     String
  isRequired Boolean @default(true) @map("is_required")

  @@unique([jobId, skill])
  @@map("job_skills")
}

model Application {
  id            String            @id @default(cuid())
  jobId         String            @map("job_id")
  job           Job               @relation(fields: [jobId], references: [id], onDelete: Cascade)
  candidateId   String            @map("candidate_id")
  candidate     User              @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  coverLetter   String?           @map("cover_letter") @db.Text
  resumeUrl     String?           @map("resume_url")
  status        ApplicationStatus @default(APPLIED)
  statusHistory Json              @default("[]") @map("status_history")
  screeningAnswers Json?          @map("screening_answers")
  reviewedAt    DateTime?         @map("reviewed_at")
  reviewedById  String?           @map("reviewed_by_id")
  interviewedAt DateTime?         @map("interviewed_at")
  offerSentAt   DateTime?         @map("offer_sent_at")
  hiredAt       DateTime?         @map("hired_at")
  rejectedAt    DateTime?         @map("rejected_at")
  rejectionReason String?         @map("rejection_reason") @db.Text
  createdAt     DateTime          @default(now()) @map("created_at")
  updatedAt     DateTime          @updatedAt @map("updated_at")

  @@unique([jobId, candidateId])
  @@index([candidateId, status])
  @@index([jobId, status])
  @@map("applications")
}

model SavedJob {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  jobId     String   @map("job_id")
  job       Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now()) @map("created_at")

  @@unique([userId, jobId])
  @@map("saved_jobs")
}

model Notification {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      String
  title     String
  message   String   @db.Text
  data      Json?
  isRead    Boolean  @default(false) @map("is_read")
  readAt    DateTime? @map("read_at")
  createdAt DateTime @default(now()) @map("created_at")

  @@index([userId, isRead])
  @@map("notifications")
}

model AuditLog {
  id        String   @id @default(cuid())
  userId    String?  @map("user_id")
  action    String
  entity    String
  entityId  String   @map("entity_id")
  oldData   Json?
  newData   Json?
  ipAddress String?  @map("ip_address")
  userAgent String?  @map("user_agent")
  createdAt DateTime @default(now()) @map("created_at")

  @@index([entity, entityId])
  @@index([userId, createdAt])
  @@map("audit_logs")
}
```

## Key Relationships
- User 1:1 CandidateProfile (role=CANDIDATE)
- User 1:1 EmployerProfile (role=EMPLOYER)
- User 1:N Company (owner)
- User N:M Company (managers)
- Company 1:N Job
- Job 1:N Application
- User 1:N Application (candidate)
- User 1:N SavedJob
- Job 1:N SavedJob
- User 1:N Notification