import { Link } from 'react-router-dom'
import CourseCard from '../components/CourseCard'
import Notice from '../components/Notice'
import { COURSES } from '../data/content'

export default function CoursesPage() {
  return (
    <div className="container section">
      <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)' }}>Courses and training</h1>
      <Notice />
      <div className="grid">{COURSES.map((c) => <CourseCard key={c.id} course={c} />)}</div>
      <p style={{ marginTop: '2rem' }}><Link className="btn btn-primary" to="/contact">Register your interest</Link></p>
    </div>
  )
}
