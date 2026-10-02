import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Home, Menu, Star, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useLearnLab } from '../state/LearnLabProvider'

export function AppShell() {
  const { progress } = useLearnLab()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  return <div className="site-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <header className="top-nav page-width">
      <Link to="/" className="brand" aria-label="LearnLab Kids home"><span className="brand-orb"><span /></span><span>LearnLab <em>Kids</em></span></Link>
      <nav className={`desktop-nav ${menuOpen ? 'mobile-open' : ''}`}>
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
        <NavLink to="/subjects" className={({ isActive }) => isActive || location.pathname.startsWith('/subject') ? 'nav-link active' : 'nav-link'}>Adventures</NavLink>
        <Link to="/subjects" className="nav-link nav-link-muted">How it works <ArrowRight size={14} /></Link>
      </nav>
      <div className="nav-actions"><div className="star-count"><Star size={15} fill="currentColor" /><span>{progress.stars}</span></div><Link className="nav-cta" to={progress.lastVisited ? `/lesson/${progress.lastVisited}` : '/subjects'}>{progress.lastVisited ? 'Continue' : 'Start learning'} <ArrowRight size={15} /></Link><button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation">{menuOpen ? <X size={21} /> : <Menu size={21} />}</button></div>
    </header>
    <main><motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>{/* route content */}<OutletShim /></motion.div></main>
    <footer className="site-footer page-width"><div className="brand footer-brand"><span className="brand-orb"><span /></span><span>LearnLab <em>Kids</em></span></div><span>Made for curious minds · Ages 8–10</span><span className="footer-links"><BookOpen size={14} /> Learn by playing</span></footer>
  </div>
}

// This keeps the shell's page transition in one place without wrapping each route.
import { Outlet } from 'react-router-dom'
function OutletShim() { return <Outlet /> }
