import { useState } from 'react'
import type { FormEvent } from 'react'
import { INTEREST_OPTIONS } from '../data/content'
import { createEnquiry, AppError } from '../services/api'
import { validateEnquiryForm } from '../services/validation'
import type { FormErrors } from '../services/validation'
import { USER_TYPES } from '../types'
import type { EnquiryInput } from '../types'

interface Props {
  prefill?: Partial<EnquiryInput>
  idPrefix?: string
  onSuccess?: () => void
}

const EMPTY: EnquiryInput = { name: '', email: '', phone: '', userType: '', interest: '', message: '' }

// Reusable form: used on the Contact page and inside the chatbot.
export default function EnquiryForm({ prefill, idPrefix = 'enq', onSuccess }: Props) {
  const [values, setValues] = useState<EnquiryInput>({ ...EMPTY, ...prefill })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  const set = (key: keyof EnquiryInput, value: string) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError('')
    const found = validateEnquiryForm(values)
    setErrors(found)
    if (Object.keys(found).length) return

    setSubmitting(true)
    try {
      await createEnquiry(values)
      setSuccess(true)
      setValues(EMPTY)
      onSuccess?.()
    } catch (err) {
      if (err instanceof AppError) {
        setServerError(err.message)
        if (Object.keys(err.fieldErrors).length) setErrors(err.fieldErrors as FormErrors)
      } else {
        setServerError('Unexpected error. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const id = (n: string) => `${idPrefix}-${n}`
  const err = (n: keyof EnquiryInput) =>
    errors[n] ? <p className="field-error" id={id(`${n}-err`)} role="alert">{errors[n]}</p> : null
  const aria = (n: keyof EnquiryInput) => ({
    'aria-invalid': errors[n] ? true : undefined,
    'aria-describedby': errors[n] ? id(`${n}-err`) : undefined,
  })

  if (success) {
    return (
      <div className="alert alert-ok" role="status">
        <strong>Thank you! Your enquiry was sent.</strong>
        <p style={{ margin: '.4rem 0 .8rem' }}>Our team will contact you soon.</p>
        <button type="button" className="btn btn-ghost btn-small" onClick={() => setSuccess(false)}>Send another enquiry</button>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-label="Enquiry form">
      {serverError && <div className="alert alert-err" role="alert">{serverError}</div>}

      <div className="form-row">
        <div className="field">
          <label htmlFor={id('name')}>Name <span className="req" aria-hidden="true">*</span></label>
          <input id={id('name')} type="text" autoComplete="name" maxLength={80} value={values.name} onChange={(e) => set('name', e.target.value)} {...aria('name')} />
          {err('name')}
        </div>
        <div className="field">
          <label htmlFor={id('email')}>Email <span className="req" aria-hidden="true">*</span></label>
          <input id={id('email')} type="email" autoComplete="email" maxLength={120} value={values.email} onChange={(e) => set('email', e.target.value)} {...aria('email')} />
          {err('email')}
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor={id('phone')}>Phone <span className="req" aria-hidden="true">*</span></label>
          <input id={id('phone')} type="tel" autoComplete="tel" maxLength={20} placeholder="+91 98765 43210" value={values.phone} onChange={(e) => set('phone', e.target.value)} {...aria('phone')} />
          {err('phone')}
        </div>
        <div className="field">
          <label htmlFor={id('userType')}>I am a <span className="req" aria-hidden="true">*</span></label>
          <select id={id('userType')} value={values.userType} onChange={(e) => set('userType', e.target.value)} {...aria('userType')}>
            <option value="">Select user type</option>
            {USER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {err('userType')}
        </div>
      </div>

      <div className="field">
        <label htmlFor={id('interest')}>Service or course of interest <span className="req" aria-hidden="true">*</span></label>
        <select id={id('interest')} value={values.interest} onChange={(e) => set('interest', e.target.value)} {...aria('interest')}>
          <option value="">Select one</option>
          {INTEREST_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {err('interest')}
      </div>

      <div className="field">
        <label htmlFor={id('message')}>Message <span className="req" aria-hidden="true">*</span></label>
        <textarea id={id('message')} maxLength={1000} value={values.message} onChange={(e) => set('message', e.target.value)} {...aria('message')} />
        {err('message')}
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send enquiry'}
      </button>
    </form>
  )
}
