import { ArrowDown, BadgeCheck, MessageSquareQuote, Search, Sparkles, Wallet } from 'lucide-react'
import type { ContactDetails, FaqItem, ForEmployersContent, FormOptions, HiringEnquiryInput } from '@/../product/sections/info-pages/types'
import { FaqAccordionItem } from './Bits'
import { HiringForm } from './HiringForm'
import { BTN_GOLD, CARD, EYEBROW, H2 } from './styles'

interface ForEmployersPageProps {
  content: ForEmployersContent
  faqs: FaqItem[]
  contactDetails: ContactDetails
  formOptions: FormOptions
  onSubmitHiringEnquiry?: (input: HiringEnquiryInput) => Promise<string> | string
}

const TALENT_ICONS = [Sparkles, Search, MessageSquareQuote]

export function ForEmployersPage({ content, faqs, contactDetails, formOptions, onSubmitHiringEnquiry }: ForEmployersPageProps) {
  const pageFaqs = content.faqIds.map((id) => faqs.find((faq) => faq.id === id)).filter((faq): faq is FaqItem => Boolean(faq))
  const scrollToForm = () => document.getElementById('hiring-enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="bg-white text-stone-950">
      {/* Hero */}
      <section className="px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-teal-900 text-white">
          <div className="grid gap-10 px-6 py-14 sm:px-12 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:px-16 lg:py-20">
            <div className="ip-rise">
              <p className="text-sm font-semibold text-amber-300">For employers</p>
              <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{content.heroTitle}</h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-teal-50 sm:text-lg">{content.heroText}</p>
              <button type="button" onClick={scrollToForm} className={`${BTN_GOLD} mt-8`}>
                Start a hiring enquiry <ArrowDown className="h-4 w-4" />
              </button>
            </div>
            <ol className="ip-rise grid gap-3 [animation-delay:150ms]" aria-label="How hiring with EduBridge works">
              {content.steps.map((step, index) => (
                <li key={step.title} className="flex gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-inset ring-white/10">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-300 text-sm font-bold text-teal-950">{index + 1}</span>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-teal-100">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Why EduBridge talent */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className={EYEBROW}>Why EduBridge talent</p>
            <h2 className={`mt-3 ${H2}`}>People who are ready on day one.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {content.talentPoints.map((point, index) => {
              const Icon = TALENT_ICONS[index % TALENT_ICONS.length]
              return (
                <article key={point.title} className={`${CARD} p-7`}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-800">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight">{point.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{point.text}</p>
                </article>
              )
            })}
          </div>

          {/* Pricing */}
          <div className="mt-6 flex flex-col gap-5 rounded-3xl bg-amber-50 p-7 ring-1 ring-inset ring-amber-200/70 sm:flex-row sm:items-center sm:p-8">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-300 text-teal-950">
              <Wallet className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold tracking-tight">What it costs</h3>
              <p className="mt-1 text-sm leading-relaxed text-stone-700">{content.pricingNote}</p>
            </div>
            <button type="button" onClick={scrollToForm} className="shrink-0 text-sm font-semibold text-teal-800 underline decoration-amber-400 decoration-2 underline-offset-4 hover:text-teal-950">
              Ask for a quote
            </button>
          </div>
        </div>
      </section>

      {/* Form and FAQs */}
      <section id="hiring-enquiry" className="scroll-mt-24 border-t border-stone-100 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="min-w-0">
            <p className={EYEBROW}>Hiring enquiry</p>
            <h2 className={`mt-3 ${H2}`}>Tell us about the roles.</h2>
            <p className="mt-4 text-base leading-relaxed text-stone-600">
              It takes about three minutes. Our recruiting team reads every enquiry and calls you to agree the details.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-stone-700">
              {['We call you to agree the details', 'Roles posted and screened by our team', 'Every candidate kept informed'].map((point) => (
                <li key={point} className="flex items-center gap-2.5">
                  <BadgeCheck className="h-4 w-4 shrink-0 text-teal-700" />
                  {point}
                </li>
              ))}
            </ul>

            {pageFaqs.length > 0 && (
              <div className="mt-12">
                <h3 className="text-lg font-semibold tracking-tight">Questions employers ask</h3>
                <div className="mt-2">
                  {pageFaqs.map((faq) => (
                    <FaqAccordionItem key={faq.id} item={faq} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={`${CARD} min-w-0 p-6 sm:p-8 lg:self-start`}>
            <HiringForm formOptions={formOptions} replyTime={contactDetails.replyTime} onSubmit={onSubmitHiringEnquiry} />
          </div>
        </div>
      </section>
    </div>
  )
}
