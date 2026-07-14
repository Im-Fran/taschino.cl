import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSlidesOptional } from '../slides/SlideContext'

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
  const location = useLocation()
  const isHome = location.pathname === '/'
  // Fuera de '/' el Provider no existe (Navbar vive en el Layout, fuera de HomePage);
  // useSlidesOptional no explota, solo devuelve null.
  const slides = useSlidesOptional()

  return (
    <nav
      className={`navbar${slides && slides.activeIndex > 0 ? ' navbar--scrolled' : ''}`}
      role="navigation"
      aria-label="Navegación principal"
    >
      <Link
        to="/#inicio"
        className="navbar__brand"
        onClick={(e) => {
          if (!isHome) return
          e.preventDefault()
          slides?.goToSlide('inicio')
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
                  slides?.goToSlide(link.id)
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
