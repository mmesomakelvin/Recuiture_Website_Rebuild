// Shared sample data and logging callbacks for the Candidate Portal previews.
// Used only by the Design OS preview wrappers in this folder; not exported.
import data from '@/../product/sections/candidate-portal/data.json'
import type { AccountScreensProps, CandidatePortalProps } from '@/../product/sections/candidate-portal/types'

export const portalProps: CandidatePortalProps = {
  candidate: data.candidate,
  today: data.today,
  applications: data.applications as unknown as CandidatePortalProps['applications'],
  locationOptions: data.locationOptions,
  onTabChange: (tab) => console.log('Tab:', tab),
  onOpenApplication: (id) => console.log('Open application:', id),
  onViewJob: (slug) => console.log('View job:', slug),
  onOpenSubmittedCv: (id) => console.log('Open submitted CV:', id),
  onWithdraw: (id, reason) => console.log('Withdraw:', id, reason),
  onBrowseJobs: () => console.log('Browse jobs'),
  onUpdateProfile: (input) => console.log('Update profile:', input),
  onViewCv: () => console.log('View CV'),
  onReplaceCv: (file) => console.log('Replace CV:', file.name, file.size),
  onRequestPasswordReset: (email) => console.log('Password reset email:', email),
}

export const accountProps: AccountScreensProps = {
  onSignIn: (email) => console.log('Sign in:', email),
  onSignUp: (input) => console.log('Sign up:', { ...input, password: '(hidden)' }),
  onRequestPasswordReset: (email) => console.log('Reset link:', email),
  onSetNewPassword: () => console.log('Set new password'),
  onGoToSignIn: () => console.log('Go to sign in'),
  onGoToSignUp: () => console.log('Go to create account'),
  onGoToForgotPassword: () => console.log('Go to forgot password'),
  onOpenTerms: () => console.log('Open terms'),
}

export const continueTo = data.continueTo
