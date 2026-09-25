'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Building2, MapPin, Briefcase, DollarSign, Calendar, Clock, Check, Building, Globe, Share2, Heart, Bookmark } from 'lucide-react'
import { formatSalary, formatDate, cn } from '@/lib/utils'
import Link from 'next/link'

interface JobDetailProps {
  job: any
}

export default function JobDetail({ job }: JobDetailProps) {
  const [showApply, setShowApply] = useState(false)
  const [saved, setSaved] = useState(false)

  const jobTypes = job.jobType || []
  const salary = formatSalary(job.salaryMin, job.salaryMax)

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Job Header */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {job.isRemote && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" aria-hidden="true" />
                      Remote
                    </Badge>
                  )}
                  {jobTypes.map((type: string) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type.replace('_', ' ')}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="text-xs">{job.experienceLevel}</Badge>
                </div>
                <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">{job.title}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-zinc-600">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-5 w-5" aria-hidden="true" />
                    <span className="font-medium text-zinc-900">{job.company}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-zinc-900">
                    <DollarSign className="h-5 w-5" aria-hidden="true" />
                    {salary}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-5 w-5" aria-hidden="true" />
                    Posted {formatDate(job.postedAt)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Dialog open={showApply} onOpenChange={setShowApply}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                      Apply Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Apply for {job.title}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 text-center text-zinc-600">
                      <p>Application form will be implemented with Supabase Auth integration.</p>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto gap-2"
                  onClick={() => setSaved(!saved)}
                  aria-label={saved ? 'Remove from saved jobs' : 'Save job'}
                >
                  <Heart className={cn('h-4 w-4', saved && 'fill-current text-red-500')} aria-hidden="true" />
                  {saved ? 'Saved' : 'Save'}
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t">
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" aria-hidden="true" />
                LinkedIn
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Twitter
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="h-4 w-4" aria-hidden="true" />
                Copy Link
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Job Content */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* About Company */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-zinc-100 flex items-center justify-center">
                      <Building className="h-6 w-6 text-zinc-600" aria-hidden="true" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{job.company}</CardTitle>
                      <p className="text-sm text-zinc-600">Verified Company • 500+ employees</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600">TechCorp Inc. is a leading technology company building innovative solutions for businesses worldwide.</p>
                </CardContent>
              </Card>

              {/* Job Description Tabs */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="description" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="requirements">Requirements</TabsTrigger>
                      <TabsTrigger value="benefits">Benefits</TabsTrigger>
                    </TabsList>
                    <TabsContent value="description" className="mt-6 text-zinc-700 whitespace-pre-wrap">
                      <p>{job.description}</p>
                    </TabsContent>
                    <TabsContent value="requirements" className="mt-6 text-zinc-700 whitespace-pre-wrap">
                      <p>{job.requirements}</p>
                    </TabsContent>
                    <TabsContent value="benefits" className="mt-6 text-zinc-700 whitespace-pre-wrap">
                      <p>{job.benefits}</p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Required Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill: string) => (
                        <Badge key={skill} variant="outline" className="text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <Card className="sticky top-24">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Job Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-blue-600" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-600">Salary Range</p>
                        <p className="font-semibold text-zinc-900">{salary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                      <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-green-600" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-600">Job Type</p>
                        <p className="font-semibold text-zinc-900">{jobTypes.join(', ').replace(/_/g, ' ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                      <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-purple-600" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-600">Location</p>
                        <p className="font-semibold text-zinc-900">{job.location}</p>
                        {job.isRemote && <p className="text-xs text-green-600">Remote friendly</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                      <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-orange-600" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-600">Experience</p>
                        <p className="font-semibold text-zinc-900">{job.experienceLevel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                      <div className="h-10 w-10 rounded-lg bg-zinc-100 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-zinc-600" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-600">Posted</p>
                        <p className="font-semibold text-zinc-900">{formatDate(job.postedAt)}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <p className="text-zinc-600">Application deadline: <span className="font-medium text-zinc-900">30 days</span></p>
                    <p className="text-zinc-600">Applications so far: <span className="font-medium text-zinc-900">47</span></p>
                    <p className="text-zinc-600">Views: <span className="font-medium text-zinc-900">1,234</span></p>
                  </div>

                  <Button className="w-full mt-4 gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => setShowApply(true)}>
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}