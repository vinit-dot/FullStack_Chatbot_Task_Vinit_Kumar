import type { CourseItem, ServiceItem } from '../types'

// IMPORTANT: everything below is SAMPLE content written for this demo.
// It is not official DroneTV information. Official details: https://dronetv.in
export const SAMPLE_NOTICE =
  'Sample content for this demo project. It is not official DroneTV information. Please check dronetv.in for real details.'

export const SERVICES: ServiceItem[] = [
  { id: 'aerial-media', title: 'Aerial photography and video', icon: 'camera',
    summary: 'Sample service: cinematic aerial shots for weddings, real estate, tourism and brand films.' },
  { id: 'mapping', title: 'Drone mapping and surveying', icon: 'map',
    summary: 'Sample service: site maps and orthomosaics for construction, land and infrastructure planning.' },
  { id: 'agri', title: 'Agriculture monitoring', icon: 'leaf',
    summary: 'Sample service: crop-health imagery and field overviews to support farm decisions.' },
  { id: 'inspection', title: 'Infrastructure inspection', icon: 'inspect',
    summary: 'Sample service: close visual inspection of towers, roofs and bridges without climbing.' },
  { id: 'events', title: 'Event coverage', icon: 'event',
    summary: 'Sample service: live and recorded aerial coverage of public and private events.' },
  { id: 'training', title: 'Pilot training support', icon: 'cap',
    summary: 'Sample service: guidance for people who want to learn to fly drones responsibly.' },
]

export const COURSES: CourseItem[] = [
  { id: 'pilot-basics', title: 'Drone Pilot Fundamentals', level: 'Beginner', duration: 'Sample: 2 weeks',
    summary: 'Sample course: first steps in flying a drone safely.',
    topics: ['Parts of a drone', 'Pre-flight checks', 'Basic flight controls', 'Safety and rules awareness'] },
  { id: 'videography', title: 'Aerial Videography Basics', level: 'Beginner to Intermediate', duration: 'Sample: 1 week',
    summary: 'Sample course: camera settings, framing and smooth movement for aerial video.',
    topics: ['Camera settings', 'Shot types', 'Smooth flight paths', 'Basic editing workflow'] },
  { id: 'mapping-intro', title: 'Mapping and Survey Introduction', level: 'Intermediate', duration: 'Sample: 2 weeks',
    summary: 'Sample course: how drone images become maps and 3D models.',
    topics: ['Flight planning', 'Ground control basics', 'Photogrammetry overview', 'Reading map outputs'] },
  { id: 'agri-ops', title: 'Agriculture Drone Operations', level: 'Intermediate', duration: 'Sample: 1 week',
    summary: 'Sample course: using drones for field observation and crop monitoring.',
    topics: ['Field survey planning', 'Crop-health imagery', 'Data interpretation', 'Operational safety'] },
]

export const INTEREST_OPTIONS: string[] = [
  ...SERVICES.map((s) => `Service: ${s.title}`),
  ...COURSES.map((c) => `Course: ${c.title}`),
  'Not sure yet',
]
