import axios, { AxiosError } from 'axios'
import type { Enquiry, EnquiryInput, EnquiryListResponse, EnquiryStatus } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

const ADMIN_KEY_STORAGE = 'dronetv_admin_key'

export const adminKey = {
  get: () => sessionStorage.getItem(ADMIN_KEY_STORAGE) || '',
  set: (key: string) => sessionStorage.setItem(ADMIN_KEY_STORAGE, key),
  clear: () => sessionStorage.removeItem(ADMIN_KEY_STORAGE),
}

// A user-friendly error. Raw technical errors are never shown in the UI.
export class AppError extends Error {
  status: number
  fieldErrors: Record<string, string>
  constructor(message: string, status = 0, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

interface ErrorBody {
  message?: string
  errors?: Record<string, string>
}

function toAppError(err: unknown): AppError {
  if (err instanceof AxiosError) {
    if (!err.response) {
      return new AppError('Cannot reach the server. Check that the backend is running and try again.')
    }
    const body = err.response.data as ErrorBody | undefined
    const status = err.response.status
    if (status >= 500) return new AppError('Something went wrong on our side. Please try again later.', status)
    return new AppError(body?.message || 'Request failed. Please try again.', status, body?.errors || {})
  }
  return new AppError('Unexpected error. Please try again.')
}

const adminHeaders = () => ({ 'x-admin-key': adminKey.get() })

export async function createEnquiry(input: EnquiryInput): Promise<Enquiry> {
  try {
    const res = await api.post<{ data: Enquiry }>('/enquiries', input)
    return res.data.data
  } catch (err) {
    throw toAppError(err)
  }
}

export interface ListParams {
  search?: string
  userType?: string
  status?: string
  page?: number
}

export async function listEnquiries(params: ListParams, key?: string): Promise<EnquiryListResponse> {
  try {
    const res = await api.get<EnquiryListResponse>('/enquiries', {
      params: { ...params, limit: 20 },
      headers: key ? { 'x-admin-key': key } : adminHeaders(),
    })
    return res.data
  } catch (err) {
    throw toAppError(err)
  }
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<Enquiry> {
  try {
    const res = await api.patch<{ data: Enquiry }>(`/enquiries/${id}`, { status }, { headers: adminHeaders() })
    return res.data.data
  } catch (err) {
    throw toAppError(err)
  }
}

export async function deleteEnquiry(id: string): Promise<void> {
  try {
    await api.delete(`/enquiries/${id}`, { headers: adminHeaders() })
  } catch (err) {
    throw toAppError(err)
  }
}
