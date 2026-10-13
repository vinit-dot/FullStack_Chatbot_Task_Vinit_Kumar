import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="container section">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link className="btn btn-primary" to="/">Go to home</Link>
    </div>
  )
}
