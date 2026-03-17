import { NavLink } from 'react-router-dom'
import './Layout.css'

export default function Layout({ children }) {
  return (
    <div className="layout">
      <header className="topbar" role="banner">
        <div className="topbar-inner">
          <div className="logo" aria-label="DailyClaw">
            <span className="logo-icon">🦞</span>
            <span className="logo-text">DailyClaw</span>
          </div>
          <nav className="nav" role="navigation" aria-label="Main navigation">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} aria-label="Dashboard">
              <span>📅</span> Dashboard
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} aria-label="Reports">
              <span>📊</span> Reports
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="main-content" role="main">
        {children}
      </main>
    </div>
  )
}
