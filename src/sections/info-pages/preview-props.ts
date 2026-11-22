// Shared sample data and logging callbacks for the Info Pages previews.
// Used only by the Design OS preview wrappers in this folder; not exported.
import data from '@/../product/sections/info-pages/data.json'
import type { InfoPagesProps } from '@/../product/sections/info-pages/types'

let counter = 1047
const pretendSend = (label: string, input: unknown) =>
  new Promise<string>((resolve) => {
    console.log(label, input)
    counter += 1
    setTimeout(() => resolve(`EQ-${counter}`), 900)
  })

export const infoProps: InfoPagesProps = {
  contactDetails: data.contactDetails,
  forEmployers: data.forEmployers,
  faqGroups: data.faqGroups as InfoPagesProps['faqGroups'],
  faqs: data.faqs as InfoPagesProps['faqs'],
  formOptions: data.formOptions as InfoPagesProps['formOptions'],
  onSubmitHiringEnquiry: (input) => pretendSend('Hiring enquiry:', input),
  onSubmitContactMessage: (input) => pretendSend('Contact message:', input),
  onOpenWhatsApp: (number) => console.log('Open WhatsApp:', number),
  onNavigate: (page) => console.log('Navigate:', page),
}
