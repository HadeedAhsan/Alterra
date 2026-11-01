import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo'
import './Navbar.css'

export default function Navbar() {
  return (
    <header className="navbar">
      <a href="#main" className="skip-link">Skip to content</a>
      <nav className="navbar-inner" aria-label="Main">
        <Link to="/" className="navbar-brand">
          <Logo size={32} />
          <span>Alterra</span>
        </Link>
        <ul className="navbar-links">
          <li><NavLink to="/" end className="nav-link">Home</NavLink></li>
          <li><NavLink to="/worlds" className="nav-link">Worlds</NavLink></li>
          <li><NavLink to="/saved" className="nav-link">Saved</NavLink></li>
        </ul>
      </nav>
    </header>
  )
}