import type { LucideIcon } from 'lucide-react'
import { Atom, CircleDot, Droplets, Grid3X3, Lightbulb, Microscope, Orbit, Shapes, Sparkles, Sun, Triangle, Zap } from 'lucide-react'

export type Subject = 'math' | 'science'
export type Lesson = { id: string; subject: Subject; title: string; description: string; duration: string; level: string; accent: string; icon: LucideIcon; iconName: string; tip: string; visible?: boolean }

export const lessons: Lesson[] = [
  { id: 'area-perimeter', subject: 'math', title: 'Area & Perimeter', description: 'Now included inside Shape Explorer.', duration: '8 min', level: 'Explorer', accent: 'coral', icon: Grid3X3, iconName: 'grid', tip: 'What changes when you make a rectangle wider?', visible: false },
  { id: 'fractions', subject: 'math', title: 'Fraction Kitchen', description: 'Slice, share, and recombine a pizza to see fractions in action.', duration: '6 min', level: 'Bonus', accent: 'violet', icon: CircleDot, iconName: 'fraction', tip: 'A fraction tells us how many equal pieces we have.', visible: false },
  { id: 'shapes', subject: 'math', title: 'Volume & Surface Area', description: 'Fill cubes, prisms, and cylinders, then unfold their outside surfaces.', duration: '12 min', level: 'Explorer', accent: 'cyan', icon: Shapes, iconName: 'shapes', tip: 'Volume fills the inside. Surface area covers the outside.' },
  { id: 'multiplication', subject: 'math', title: 'Group It Up', description: 'Turn equal groups into fast multiplication thinking.', duration: '7 min', level: 'Builder', accent: 'yellow', icon: Sparkles, iconName: 'multiply', tip: 'Multiplication is a shortcut for equal groups.', visible: false },
  { id: 'solar-system', subject: 'science', title: 'Solar System', description: 'Explore our neighborhood in space and meet the planets.', duration: '9 min', level: 'Explorer', accent: 'yellow', icon: Orbit, iconName: 'orbit', tip: 'The planets travel around the Sun in paths called orbits.' },
  { id: 'water-cycle', subject: 'science', title: 'Water’s Big Trip', description: 'Follow one tiny drop from the ocean to the clouds and back.', duration: '8 min', level: 'Starter', accent: 'cyan', icon: Droplets, iconName: 'water', tip: 'The Sun gives water energy to start its journey.' },
  { id: 'states-of-matter', subject: 'science', title: 'Matter in Motion', description: 'Peek at invisible particles in solids, liquids, and gases.', duration: '8 min', level: 'Builder', accent: 'violet', icon: Atom, iconName: 'matter', tip: 'Everything is made of tiny particles that can move.' },
  { id: 'atoms', subject: 'science', title: 'Atom Explorer', description: 'Build atoms and meet the tiny particles inside everyday elements.', duration: '9 min', level: 'Explorer', accent: 'coral', icon: Atom, iconName: 'atom', tip: 'An element is named by how many protons are in its tiny centre.' },
  { id: 'cells', subject: 'science', title: 'Cell Explorer', description: 'Travel inside an animal or plant cell and meet its tiny jobs.', duration: '9 min', level: 'Explorer', accent: 'green', icon: Microscope, iconName: 'cell', tip: 'Cells are tiny living building blocks with important jobs.' },
  { id: 'light-shadow', subject: 'science', title: 'Light & Shadows', description: 'Move a lamp and discover how shadows stretch and shrink.', duration: '7 min', level: 'Explorer', accent: 'coral', icon: Lightbulb, iconName: 'light', tip: 'Light travels in straight lines until something blocks it.' },
]

export const adventureCards = [
  { id: 'math', title: 'Maths', kicker: 'Patterns & puzzles', description: 'Make ideas visible with shapes, numbers, and clever patterns.', icon: Triangle, accent: 'coral', count: '3 adventures', href: '/subject/math' },
  { id: 'science', title: 'Science', kicker: 'Big world, tiny clues', description: 'Zoom from particles to planets and find the science hiding everywhere.', icon: Zap, accent: 'cyan', count: '6 adventures', href: '/subject/science' },
  { id: 'space', title: 'Space', kicker: 'Out of this world', description: 'Meet our cosmic neighbors and trace their paths around the Sun.', icon: Sun, accent: 'yellow', count: 'Planet explorer', href: '/lesson/solar-system' },
  { id: 'chemistry', title: 'Chemistry', kicker: 'Tiny building blocks', description: 'See what atoms are made of and meet familiar elements.', icon: Atom, accent: 'violet', count: 'Atom lab', href: '/lesson/atoms' },
  { id: 'biology', title: 'Biology', kicker: 'Life up close', description: 'Step inside a cell and discover the jobs that keep it alive.', icon: Microscope, accent: 'cyan', count: 'Cell lab', href: '/lesson/cells' },
]

export const getLesson = (id?: string) => lessons.find((lesson) => lesson.id === id)
export const visibleLessons = lessons.filter((lesson) => lesson.visible !== false)
