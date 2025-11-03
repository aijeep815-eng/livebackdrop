import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()

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
          {session ? (
            <>
              <li><a href="/account">Dashboard</a></li>
              <li><button onClick={()=>signOut({ callbackUrl: '/' })} className="btn btn--ghost" style={{padding:'6px 10px'}}>Logout</button></li>
            </>
          ) : (
            <li><button onClick={()=>signIn()} className="btn btn--ghost" style={{padding:'6px 10px'}}>Login</button></li>
          )}
        </ul>
      </div>
    </nav>
  )
}
