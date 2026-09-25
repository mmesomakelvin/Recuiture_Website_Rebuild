import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Users, Briefcase, Search, Shield, Zap, Target } from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: Search,
      title: 'Smart Job Search',
      description: 'AI-powered matching finds the perfect role for your skills and preferences.',
    },
    {
      icon: Users,
      title: 'Candidate Portal',
      description: 'Build your profile, track applications, and get personalized job recommendations.',
    },
    {
      icon: Briefcase,
      title: 'Employer Dashboard',
      description: 'Post jobs, manage candidates, and collaborate with your hiring team.',
    },
    {
      icon: Shield,
      title: 'Verified Companies',
      description: 'Work with confidence knowing companies are verified and reviewed.',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Instant notifications on application status, messages, and new matches.',
    },
    {
      icon: Target,
      title: 'Salary Insights',
      description: 'Transparent salary ranges and market data for informed decisions.',
    },
  ]

  const stats = [
    { value: '50K+', label: 'Active Jobs' },
    { value: '10K+', label: 'Companies' },
    { value: '500K+', label: 'Candidates' },
    { value: '95%', label: 'Match Rate' },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 to-white py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
              Find Your Dream Job
              <br />
              <span className="text-blue-600">Faster Than Ever</span>
            </h1>
            <p className="mt-6 text-lg text-zinc-600">
              Recruiture connects top talent with innovative companies. Smart matching,
              transparent salaries, and a seamless application experience.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/jobs">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Browse Jobs
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-zinc-900 sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-zinc-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              Powerful tools for both job seekers and employers to make hiring effortless.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-zinc-200 hover:border-zinc-300 transition-colors">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-blue-600" aria-hidden="true" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-24 bg-zinc-900">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-zinc-300">
            Join thousands of candidates and companies already using Recruiture.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto">
                Create Free Account
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/jobs">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-zinc-700 text-white hover:bg-zinc-800">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}