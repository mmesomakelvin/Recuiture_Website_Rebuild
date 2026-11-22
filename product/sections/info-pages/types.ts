// =============================================================================
// Data Types
// =============================================================================

/** Topics a visitor can pick on the Contact form */
export type ContactTopic = 'my-application' | 'my-account' | 'hiring' | 'partnerships' | 'something-else'

/** FAQ groups, by who is asking */
export type FaqGroupId = 'job-seekers' | 'employers' | 'accounts-and-privacy'

/** Which info page is showing */
export type InfoPage = 'for-employers' | 'contact' | 'faq'

export interface Option<T extends string = string> {
  value: T
  label: string
}

export interface OpeningHours {
  /** For example "Monday to Friday" */
  days: string
  /** For example "9:00 am to 5:00 pm" */
  hours: string
}

/** EduBridge contact details. Sample placeholders until the real ones are supplied. */
export interface ContactDetails {
  email: string
  phone: string
  /** Number used for the WhatsApp chat link, digits only with country code */
  whatsappNumber: string
  addressLines: string[]
  city: string
  state: string
  openingHours: OpeningHours[]
  /** Link that opens the office in a maps app */
  mapUrl: string
  /** Typical reply time shown after sending a form */
  replyTime: string
  /** True while these are sample details rather than EduBridge's real ones */
  isPlaceholder: boolean
}

export interface HiringStep {
  title: string
  text: string
}

export interface TalentPoint {
  title: string
  text: string
}

export interface FaqItem {
  id: string
  group: FaqGroupId
  question: string
  answer: string
}

export interface FaqGroup {
  id: FaqGroupId
  label: string
  description: string
}

export interface ForEmployersContent {
  heroTitle: string
  heroText: string
  steps: HiringStep[]
  talentPoints: TalentPoint[]
  pricingNote: string
  /** Ids of FAQ items shown on the For Employers page */
  faqIds: string[]
}

export interface FormOptions {
  /** Nigerian states plus a Remote option */
  locations: Option[]
  companySizes: Option[]
  industries: Option[]
  heardAbout: Option[]
  contactTopics: Option<ContactTopic>[]
}

/** What the For Employers form sends */
export interface HiringEnquiryInput {
  companyName: string
  contactName: string
  contactRole: string
  email: string
  phone: string
  rolesToFill: number
  roleTitles: string
  roleDescription: string
  /** Free text such as "Within a month" or a date */
  startBy: string
  location: string
  salaryMin: number | null
  salaryMax: number | null
  companySize: string
  industry: string
  heardAbout: string
}

/** What the Contact form sends */
export interface ContactMessageInput {
  name: string
  email: string
  phone: string
  topic: ContactTopic
  message: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface InfoPagesProps {
  contactDetails: ContactDetails
  forEmployers: ForEmployersContent
  faqGroups: FaqGroup[]
  faqs: FaqItem[]
  formOptions: FormOptions
  /** Which page to show; defaults to For Employers */
  page?: InfoPage

  /**
   * Called when an employer sends the hiring form. Resolve with the enquiry
   * reference (for example EQ-1048) to show the thank-you panel.
   */
  onSubmitHiringEnquiry?: (input: HiringEnquiryInput) => Promise<string> | string
  /** Called when a visitor sends the Contact form; resolve with the reference */
  onSubmitContactMessage?: (input: ContactMessageInput) => Promise<string> | string
  /** Called when a visitor opens WhatsApp from the Contact page */
  onOpenWhatsApp?: (number: string) => void
  /** Called when a visitor follows a link to another info page */
  onNavigate?: (page: InfoPage) => void
}
