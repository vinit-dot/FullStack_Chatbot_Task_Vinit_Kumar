import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import EnquiryDetails from '../components/EnquiryDetails'
import StatusBadge from '../components/StatusBadge'
import { AppError, adminKey, deleteEnquiry, listEnquiries, updateEnquiryStatus } from '../services/api'
import { STATUSES, USER_TYPES } from '../types'
import type { Enquiry, EnquiryStatus, Pagination } from '../types'

function Login({ onLogin }: { onLogin: (key: string) => void }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!key.trim()) return setError('Enter the admin key.')
    setBusy(true)
    setError('')
    try {
      await listEnquiries({ page: 1 }, key.trim()) // the server decides if the key is valid
      adminKey.set(key.trim())
      onLogin(key.trim())
    } catch (err) {
      setError(err instanceof AppError ? (err.status === 401 ? 'Invalid admin key.' : err.message) : 'Login failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <div className="card login-card">
        <h1 style={{ fontSize: '2.4rem' }}>Admin sign in</h1>
        <p>Enter the admin key from the server <code>.env</code> file (<code>ADMIN_API_KEY</code>).</p>
        <form className="form" onSubmit={submit} noValidate>
          {error && <div className="alert alert-err" role="alert">{error}</div>}
          <div className="field">
            <label htmlFor="admin-key">Admin key</label>
            <input id="admin-key" type="password" autoComplete="current-password" value={key} onChange={(e) => setKey(e.target.value)} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Checking...' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  )
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [rows, setRows] = useState<Enquiry[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [userType, setUserType] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [reload, setReload] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [toDelete, setToDelete] = useState<Enquiry | null>(null)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')

  // debounce typing in the search box so we do not call the API on every key press
  useEffect(() => {
    const t = window.setTimeout(() => { setSearch(searchInput.trim()); setPage(1) }, 350)
    return () => window.clearTimeout(t)
  }, [searchInput])

  const handleAuth = useCallback((err: unknown) => {
    if (err instanceof AppError && err.status === 401) {
      adminKey.clear()
      onLogout()
      return true
    }
    return false
  }, [onLogout])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    listEnquiries({ search, userType, status, page })
      .then((res) => { if (!cancelled) { setRows(res.data); setPagination(res.pagination) } })
      .catch((err) => { if (!cancelled && !handleAuth(err)) setError(err instanceof AppError ? err.message : 'Could not load enquiries.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [search, userType, status, page, reload, handleAuth])

  const changeStatus = async (id: string, next: EnquiryStatus) => {
    setBusy(true)
    setActionError('')
    try {
      const updated = await updateEnquiryStatus(id, next)
      setRows((r) => r.map((x) => (x._id === id ? updated : x)))
    } catch (err) {
      if (!handleAuth(err)) setActionError(err instanceof AppError ? err.message : 'Could not update status.')
    } finally {
      setBusy(false)
    }
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    setBusy(true)
    setActionError('')
    try {
      await deleteEnquiry(toDelete._id)
      setToDelete(null)
      if (rows.length === 1 && page > 1) setPage(page - 1)
      else setReload((n) => n + 1)
    } catch (err) {
      if (!handleAuth(err)) { setActionError(err instanceof AppError ? err.message : 'Could not delete enquiry.'); setToDelete(null) }
    } finally {
      setBusy(false)
    }
  }

  const selected = rows.find((r) => r._id === selectedId) || null
  const filtersActive = !!(search || userType || status)

  return (
    <div className="container section">
      <div className="cta-row" style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', margin: 0 }}>Enquiry dashboard</h1>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <button className="btn btn-ghost" onClick={() => setReload((n) => n + 1)}>Refresh</button>
          <button className="btn btn-ghost" onClick={() => { adminKey.clear(); onLogout() }}>Sign out</button>
        </div>
      </div>

      <div className="toolbar">
        <div className="field">
          <label htmlFor="f-search">Search by name or email</label>
          <input id="f-search" type="search" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="e.g. Vinit or name@mail.com" />
        </div>
        <div className="field" style={{ maxWidth: 200 }}>
          <label htmlFor="f-type">User type</label>
          <select id="f-type" value={userType} onChange={(e) => { setUserType(e.target.value); setPage(1) }}>
            <option value="">All</option>
            {USER_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="field" style={{ maxWidth: 200 }}>
          <label htmlFor="f-status">Status</label>
          <select id="f-status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
            <option value="">All</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {actionError && <div className="alert alert-err" role="alert" style={{ marginBottom: '1rem' }}>{actionError}</div>}

      {loading ? (
        <div className="state-box" role="status"><div className="spinner" />Loading enquiries...</div>
      ) : error ? (
        <div className="state-box" role="alert">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => setReload((n) => n + 1)}>Try again</button>
        </div>
      ) : rows.length === 0 ? (
        <div className="state-box">
          <p style={{ marginBottom: 0 }}>{filtersActive ? 'No enquiries match these filters. Clear the search or filters to see more.' : 'No enquiries yet. New enquiries from the chatbot and contact form will appear here.'}</p>
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <caption className="sr-only">Enquiries</caption>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Type</th><th>Interest</th><th>Status</th><th>Received</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r._id}>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.userType}</td>
                    <td>{r.interest}</td>
                    <td>
                      <label className="sr-only" htmlFor={`st-${r._id}`}>Status for {r.name}</label>
                      <select id={`st-${r._id}`} value={r.status} disabled={busy} onChange={(e) => changeStatus(r._id, e.target.value as EnquiryStatus)} style={{ minHeight: 36 }}>
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      {' '}<StatusBadge status={r.status} />
                    </td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn-ghost btn-small" onClick={() => setSelectedId(r._id)} aria-label={`View details for ${r.name}`}>View</button>
                        <button className="btn btn-danger btn-small" onClick={() => setToDelete(r)} aria-label={`Delete enquiry from ${r.name}`}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination && (
            <div className="pager">
              <span>{pagination.total} enquir{pagination.total === 1 ? 'y' : 'ies'} | Page {pagination.page} of {pagination.pages}</span>
              <div style={{ display: 'flex', gap: '.5rem' }}>
                <button className="btn btn-ghost btn-small" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
                <button className="btn btn-ghost btn-small" disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            </div>
          )}
        </>
      )}

      {selected && <EnquiryDetails enquiry={selected} busy={busy} onStatus={(s) => changeStatus(selected._id, s)} onClose={() => setSelectedId(null)} />}
      {toDelete && (
        <ConfirmDialog
          title="Delete this enquiry?"
          message={`The enquiry from ${toDelete.name} will be permanently removed. This cannot be undone.`}
          confirmLabel="Delete enquiry"
          busy={busy}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  )
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(!!adminKey.get())
  const logout = useCallback(() => setAuthed(false), [])
  return authed ? <Dashboard onLogout={logout} /> : <Login onLogin={() => setAuthed(true)} />
}
