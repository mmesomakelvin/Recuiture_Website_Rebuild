import { z } from 'zod'
import { JobType, JobStatus, ApplicationStatus, UserRole, CompanySize } from '@prisma/client'

// Auth schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters').optional(),
  role: z.enum(['CANDIDATE', 'EMPLOYER', 'ADMIN']).default('CANDIDATE'),
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// Job schemas
export const createJobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(50, 'Description must be at least 50 characters').max(10000),
  requirements: z.string().max(5000).optional(),
  responsibilities: z.string().max(5000).optional(),
  benefits: z.string().max(5000).optional(),
  location: z.string().min(2, 'Location is required'),
  isRemote: z.boolean().default(false),
  jobType: z.array(z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE', 'HYBRID'])).min(1, 'Select at least one job type'),
  experienceLevel: z.enum(['JUNIOR', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']).optional(),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  currency: z.string().length(3).default('USD'),
  skills: z.array(z.object({ skill: z.string(), isRequired: z.boolean() })).optional(),
  expiresAt: z.string().datetime().optional(),
  companyId: z.string().cuid(),
})

export const updateJobSchema = createJobSchema.partial()

export const jobSearchSchema = z.object({
  q: z.string().optional(),
  location: z.string().optional(),
  type: z.array(z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE', 'HYBRID'])).optional(),
  experience: z.array(z.string()).optional(),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  remote: z.boolean().optional(),
  datePosted: z.enum(['24h', 'week', 'month']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(20),
  sort: z.enum(['relevance', 'date', 'salary']).default('relevance'),
})

// Candidate schemas
export const candidateProfileSchema = z.object({
  headline: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  location: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  website: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
  skills: z.array(z.string()).default([]),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    description: z.string().optional(),
    current: z.boolean().optional(),
  })).default([]),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
  })).default([]),
  preferredLocations: z.array(z.string()).default([]),
  preferredJobTypes: z.array(z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE', 'HYBRID'])).default([]),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  currency: z.string().length(3).default('USD'),
  isOpenToWork: z.boolean().default(true),
})

export const applyToJobSchema = z.object({
  jobId: z.string().cuid(),
  coverLetter: z.string().max(5000).optional(),
  resumeUrl: z.string().url().optional(),
  screeningAnswers: z.record(z.string(), z.string()).optional(),
})

// Employer schemas
export const companySchema = z.object({
  name: z.string().min(2, 'Company name is required').max(100),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional(),
  website: z.string().url().optional().or(z.literal('')),
  size: z.enum(['STARTUP_1_10', 'SMALL_11_50', 'MEDIUM_51_200', 'LARGE_201_500', 'ENTERPRISE_500_PLUS']).optional(),
  industry: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
})

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED', 'WITHDRAWN']),
  note: z.string().optional(),
})

// Admin schemas
export const updateUserSchema = z.object({
  role: z.enum(['CANDIDATE', 'EMPLOYER', 'ADMIN']).optional(),
  isActive: z.boolean().optional(),
})

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type CreateJobInput = z.infer<typeof createJobSchema>
export type UpdateJobInput = z.infer<typeof updateJobSchema>
export type JobSearchInput = z.infer<typeof jobSearchSchema>
export type CandidateProfileInput = z.infer<typeof candidateProfileSchema>
export type ApplyToJobInput = z.infer<typeof applyToJobSchema>
export type CompanyInput = z.infer<typeof companySchema>
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>