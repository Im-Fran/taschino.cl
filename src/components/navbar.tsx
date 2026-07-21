import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

type NavLink =
  | { type: 'slide'; id: string; label: string }
  | { type: 'route'; to: string; label: string }

const LINKS: NavLink[] = [
  { type: 'slide', id: 'inicio',    label: 'Inicio'    },
  { type: 'route', to: '/carta',    label: 'Menú'      },
  { type: 'slide', id: 'nosotros',  label: 'Nosotros'  },
  { type: 'slide', id: 'instagram', label: 'Instagram' },
  { type: 'slide', id: 'horarios',  label: 'Horarios'  },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  // fullpage.js no emite eventos DOM nativos; afterLoad (registrado en HomePage)
  // redifunde el anchor activo como CustomEvent para que Navbar, fuera de ese
  // árbol, pueda reaccionar sin un Context propio.
  useEffect(() => {
    const onLoad = (e: Event) => setScrolled((e as CustomEvent<string>).detail !== 'inicio')
    window.addEventListener('fullpage:afterload', onLoad)
    return () => window.removeEventListener('fullpage:afterload', onLoad)
  }, [])

  return (
    <nav
      className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}
      role="navigation"
      aria-label="Navegación principal"
    >
      <Link
        to="/#inicio"
        className="navbar__brand"
        onClick={(e) => {
          if (!isHome) return
          e.preventDefault()
          window.fullpage_api?.moveTo('inicio')
        }}
      >
        {/* ponytail: logo CSS puro, reemplaza /media/logo.webp */}
        <span className="navbar__logo-css" aria-label="Taschino">TASCHINO</span>
      </Link>

      <button
        className={`navbar__hamburger${mobileOpen ? ' open' : ''}`}
        aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`navbar__links${mobileOpen ? ' open' : ''}`}>
        {LINKS.map((link) => (
          <li key={link.type === 'slide' ? link.id : link.to}>
            {link.type === 'route' ? (
              <Link to={link.to} onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ) : isHome ? (
              <a
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  setMobileOpen(false)
                  window.fullpage_api?.moveTo(link.id)
                }}
              >
                {link.label}
              </a>
            ) : (
              <Link to={`/#${link.id}`} onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
