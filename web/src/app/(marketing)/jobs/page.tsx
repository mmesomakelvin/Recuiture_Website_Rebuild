'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Building2, MapPin, Briefcase, DollarSign, Calendar, ChevronLeft, ChevronRight, Filter, X, Search } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const mockJobs = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechCorp Inc.',
    companyLogo: null,
    location: 'San Francisco, CA',
    isRemote: true,
    jobType: ['FULL_TIME'],
    salaryMin: 150000,
    salaryMax: 200000,
    experienceLevel: 'SENIOR',
    postedAt: '2024-01-15',
    slug: 'senior-frontend-engineer',
  },
  {
    id: '2',
    title: 'Backend Developer',
    company: 'StartupXYZ',
    companyLogo: null,
    location: 'New York, NY',
    isRemote: false,
    jobType: ['FULL_TIME'],
    salaryMin: 120000,
    salaryMax: 160000,
    experienceLevel: 'MID',
    postedAt: '2024-01-14',
    slug: 'backend-developer',
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    company: 'CloudScale',
    companyLogo: null,
    location: 'Remote',
    isRemote: true,
    jobType: ['FULL_TIME', 'REMOTE'],
    salaryMin: 130000,
    salaryMax: 180000,
    experienceLevel: 'SENIOR',
    postedAt: '2024-01-13',
    slug: 'devops-engineer',
  },
  {
    id: '4',
    title: 'Product Designer',
    company: 'DesignStudio',
    companyLogo: null,
    location: 'Los Angeles, CA',
    isRemote: true,
    jobType: ['FULL_TIME', 'HYBRID'],
    salaryMin: 100000,
    salaryMax: 140000,
    experienceLevel: 'MID',
    postedAt: '2024-01-12',
    slug: 'product-designer',
  },
  {
    id: '5',
    title: 'Data Scientist',
    company: 'DataDriven Inc.',
    companyLogo: null,
    location: 'Boston, MA',
    isRemote: false,
    jobType: ['FULL_TIME'],
    salaryMin: 140000,
    salaryMax: 190000,
    experienceLevel: 'SENIOR',
    postedAt: '2024-01-11',
    slug: 'data-scientist',
  },
  {
    id: '6',
    title: 'Mobile Developer (React Native)',
    company: 'AppWorks',
    companyLogo: null,
    location: 'Austin, TX',
    isRemote: true,
    jobType: ['FULL_TIME', 'CONTRACT'],
    salaryMin: 110000,
    salaryMax: 150000,
    experienceLevel: 'MID',
    postedAt: '2024-01-10',
    slug: 'mobile-developer-react-native',
  },
]

const jobTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE', 'HYBRID']
const experienceLevels = ['JUNIOR', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedExperience, setSelectedExperience] = useState<string[]>([])
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [page, setPage] = useState(1)
  const jobsPerPage = 6

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase())
    const matchesType = selectedTypes.length === 0 || selectedTypes.some(t => job.jobType.includes(t as any))
    const matchesExperience = selectedExperience.length === 0 || selectedExperience.includes(job.experienceLevel)
    const matchesRemote = !remoteOnly || job.isRemote
    return matchesSearch && matchesLocation && matchesType && matchesExperience && matchesRemote
  })

  const paginatedJobs = filteredJobs.slice((page - 1) * jobsPerPage, page * jobsPerPage)
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

  const hasActiveFilters = searchQuery || location || selectedTypes.length > 0 || selectedExperience.length > 0 || remoteOnly

  const clearFilters = () => {
    setSearchQuery('')
    setLocation('')
    setSelectedTypes([])
    setSelectedExperience([])
    setRemoteOnly(false)
    setPage(1)
  }

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified'
    const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
    if (min && max) return `${fmt(min)} - ${fmt(max)}`
    if (min) return `From ${fmt(min)}`
    return `Up to ${fmt(max!)}`
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Search & Filters */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                  <Input
                    type="search"
                    placeholder="Search jobs (e.g., React, Python, Marketing)"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                    className="pl-10"
                    aria-label="Search jobs"
                  />
                </div>
                <div className="relative w-64">
                  <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                  <Input
                    type="search"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => { setLocation(e.target.value); setPage(1) }}
                    className="pl-10"
                    aria-label="Location"
                  />
                </div>
                <Button onClick={() => setPage(1)} className="whitespace-nowrap">
                  <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
                  Search
                </Button>
              </div>

              {/* Advanced Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <label htmlFor="job-type" className="text-sm font-medium text-zinc-700">Type:</label>
                  <Select value={selectedTypes.join(',')} onValueChange={(v) => setSelectedTypes(v.split(',').filter(Boolean))}>
                    <SelectTrigger id="job-type" className="w-44">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type.replace('_', ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="experience" className="text-sm font-medium text-zinc-700">Experience:</label>
                  <Select value={selectedExperience.join(',')} onValueChange={(v) => setSelectedExperience(v.split(',').filter(Boolean))}>
                    <SelectTrigger id="experience" className="w-44">
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remoteOnly}
                    onChange={(e) => { setRemoteOnly(e.target.checked); setPage(1) }}
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-zinc-700">Remote only</span>
                </label>
              </div>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-zinc-600 hover:text-zinc-900">
                  <X className="mr-1 h-4 w-4" aria-hidden="true" />
                  Clear all filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-zinc-600">
              Showing {paginatedJobs.length} of {filteredJobs.length} jobs
            </p>
            <div className="flex items-center gap-2">
              <Select value="relevance" onValueChange={() => {}}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="date">Newest</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {paginatedJobs.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedJobs.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.slug}`}>
                    <Card className="border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all duration-200 h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-zinc-900 truncate">{job.title}</h3>
                            <p className="mt-1 text-sm text-zinc-600 flex items-center gap-1">
                              <Building2 className="h-4 w-4" aria-hidden="true" />
                              {job.company}
                            </p>
                          </div>
                          {job.isRemote && (
                            <Badge variant="secondary" className="flex items-center gap-1 mt-0.5">
                              <Briefcase className="h-3 w-3" aria-hidden="true" />
                              Remote
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1 text-sm text-zinc-600">
                            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                            {job.location}
                          </span>
                          {job.jobType.map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-600">
                          <span className="flex items-center gap-1 font-medium text-zinc-900">
                            <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />
                            {formatSalary(job.salaryMin, job.salaryMax)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                            {job.experienceLevel}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-3 border-t">
                        <Button className="w-full" variant="outline">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum = i + 1
                    if (totalPages > 5) {
                      if (page > 3 && page < totalPages - 2) pageNum = page - 2 + i
                      else if (page >= totalPages - 2) pageNum = totalPages - 4 + i
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        aria-label={`Page ${pageNum}`}
                        aria-current={page === pageNum ? 'page' : undefined}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Building2 className="mx-auto h-12 w-12 text-zinc-300" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-medium text-zinc-900">No jobs found</h3>
              <p className="mt-2 text-zinc-600">Try adjusting your search or filters</p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}