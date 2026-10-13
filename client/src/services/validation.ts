import type { EnquiryInput } from '../types'

export type FormErrors = Partial<Record<keyof EnquiryInput, string>>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_REGEX = /^\+?[0-9\s-]{10,16}$/

// Same rules as the backend (server/utils/validation.js). The server still re-checks everything.
export function validateEnquiryForm(v: EnquiryInput): FormErrors {
  const e: FormErrors = {}
  const name = v.name.trim()
  if (!name) e.name = 'Name is required.'
  else if (name.length < 2 || name.length > 80) e.name = 'Name must be 2 to 80 characters.'

  const email = v.email.trim()
  if (!email) e.email = 'Email is required.'
  else if (!EMAIL_REGEX.test(email)) e.email = 'Enter a valid email address.'

  const phone = v.phone.trim()
  const digits = phone.replace(/\D/g, '')
  if (!phone) e.phone = 'Phone number is required.'
  else if (!PHONE_REGEX.test(phone) || digits.length < 10 || digits.length > 13)
    e.phone = 'Enter a valid phone number (10 to 13 digits).'

  if (!v.userType) e.userType = 'Please choose a user type.'
  if (!v.interest) e.interest = 'Please choose a service or course.'

  const message = v.message.trim()
  if (!message) e.message = 'Message is required.'
  else if (message.length < 5 || message.length > 1000) e.message = 'Message must be 5 to 1000 characters.'
  return e
}
