import { useState } from 'react'

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="nav">
      <div className="nav__inner">
        <a href="/" className="brand">
          <img src="/logo.png" alt="Live Backdrop logo" className="brand__logo" />
          <span className="brand__text">Live Backdrop</span>
        </a>

        <button className="nav__toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>

        <ul className={`menu ${open ? 'menu--open' : ''}`}>
          <li><a href="/">Home</a></li>
          <li className="has-dropdown">
            <span className="trigger">About</span>
            <ul className="dropdown">
              <li><a href="/about">What we do</a></li>
              <li><a href="/tech">Our tech</a></li>
              <li><a href="/team">Team</a></li>
            </ul>
          </li>
          <li><a href="/pricing">Pricing</a></li>
          <li><a href="/account">Account</a></li>
        </ul>
      </div>
    </nav>
  )
}
