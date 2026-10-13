import type { CourseItem } from '../types'

export default function CourseCard({ course }: { course: CourseItem }) {
  return (
    <article className="card course-card">
      <h3>{course.title}</h3>
      <div className="meta">
        <span className="pill">{course.level}</span>
        <span className="pill">{course.duration}</span>
      </div>
      <p>{course.summary}</p>
      <ul>
        {course.topics.map((t) => <li key={t}>{t}</li>)}
      </ul>
    </article>
  )
}
