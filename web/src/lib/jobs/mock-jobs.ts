export interface PreviewJob {
  id: string
  slug: string
  title: string
  company: string
  companyLogo: null
  sector: string
  location: string
  workMode: 'Remote' | 'Hybrid' | 'On-site'
  isRemote: boolean
  jobType: string[]
  salaryMin: number
  salaryMax: number
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR'
  postedAt: string
  description: string
  requirements: string
  responsibilities: string
  benefits: string
  skills: string[]
}

// Illustrative content for design review. Replace with published jobs from the backend.
export const previewJobs: PreviewJob[] = [
  {
    id: '1', slug: 'data-analyst', title: 'Data Analyst', company: 'Paystream Technologies', companyLogo: null,
    sector: 'Fintech', location: 'Lagos', workMode: 'Hybrid', isRemote: false, jobType: ['FULL_TIME'],
    salaryMin: 350000, salaryMax: 500000, experienceLevel: 'MID', postedAt: '2026-10-24',
    description: 'Turn business data into useful decisions for a growing payments team.',
    requirements: 'Experience with SQL, spreadsheets, and clear data storytelling.',
    responsibilities: 'Build reports, investigate trends, and share insights with product and operations teams.',
    benefits: 'Flexible work arrangement and learning support.', skills: ['SQL', 'Excel', 'Data visualisation'],
  },
  {
    id: '2', slug: 'frontend-developer', title: 'Frontend Developer', company: 'Lumen Health Nigeria', companyLogo: null,
    sector: 'Health tech', location: 'Remote, Nigeria', workMode: 'Remote', isRemote: true, jobType: ['FULL_TIME'],
    salaryMin: 700000, salaryMax: 1100000, experienceLevel: 'MID', postedAt: '2026-10-23',
    description: 'Build accessible digital tools that support healthcare teams across Nigeria.',
    requirements: 'Strong React, TypeScript, responsive design, and accessibility skills.',
    responsibilities: 'Create patient-facing interfaces and collaborate with product and clinical teams.',
    benefits: 'Remote work and professional development support.', skills: ['React', 'TypeScript', 'Accessibility'],
  },
  {
    id: '3', slug: 'hr-associate', title: 'HR Associate', company: 'Greenfield Agro', companyLogo: null,
    sector: 'Agriculture', location: 'Ibadan, Oyo', workMode: 'On-site', isRemote: false, jobType: ['FULL_TIME'],
    salaryMin: 220000, salaryMax: 300000, experienceLevel: 'ENTRY', postedAt: '2026-10-22',
    description: 'Help people and operations grow together at an expanding agriculture business.',
    requirements: 'Strong organisation, communication, and people administration skills.',
    responsibilities: 'Support hiring, onboarding, records, and employee experience.',
    benefits: 'Training and a supportive team.', skills: ['Recruitment', 'People operations', 'Communication'],
  },
  {
    id: '4', slug: 'product-designer', title: 'Product Designer', company: 'Forma Studio', companyLogo: null,
    sector: 'Design', location: 'Lagos', workMode: 'Hybrid', isRemote: false, jobType: ['CONTRACT'],
    salaryMin: 450000, salaryMax: 650000, experienceLevel: 'MID', postedAt: '2026-10-21',
    description: 'Shape practical digital products through thoughtful research and interface design.',
    requirements: 'A portfolio showing product thinking, interaction design, and visual craft.',
    responsibilities: 'Explore user needs, create prototypes, and work closely with engineers.',
    benefits: 'Flexible hybrid schedule and varied projects.', skills: ['Figma', 'Research', 'Prototyping'],
  },
  {
    id: '5', slug: 'graduate-operations-intern', title: 'Graduate Operations Intern', company: 'BrightPath Logistics', companyLogo: null,
    sector: 'Logistics', location: 'Abuja, FCT', workMode: 'On-site', isRemote: false, jobType: ['INTERNSHIP'],
    salaryMin: 120000, salaryMax: 180000, experienceLevel: 'ENTRY', postedAt: '2026-10-20',
    description: 'Start your career by improving the everyday systems behind reliable deliveries.',
    requirements: 'Recent graduate with curiosity, attention to detail, and spreadsheet confidence.',
    responsibilities: 'Track operations, help resolve issues, and document improvements.',
    benefits: 'Mentorship and practical learning opportunities.', skills: ['Operations', 'Excel', 'Problem solving'],
  },
  {
    id: '6', slug: 'digital-marketing-lead', title: 'Digital Marketing Lead', company: 'Northline Media', companyLogo: null,
    sector: 'Media', location: 'Remote, Nigeria', workMode: 'Remote', isRemote: true, jobType: ['FULL_TIME'],
    salaryMin: 500000, salaryMax: 750000, experienceLevel: 'SENIOR', postedAt: '2026-10-19',
    description: 'Lead campaigns that connect ambitious brands with the people they serve.',
    requirements: 'Experience planning campaigns, measuring performance, and leading creative work.',
    responsibilities: 'Set campaign direction, coach the team, and report on results.',
    benefits: 'Remote work and a collaborative team.', skills: ['Campaign strategy', 'Analytics', 'Leadership'],
  },
]
