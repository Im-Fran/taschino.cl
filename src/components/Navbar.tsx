import { useState } from 'react'
import { useSlideNav } from '../slides/useSlideNav'

const LINKS = [
  { href: '#inicio',    id: 'inicio',    label: 'Inicio'    },
  { href: '#menu',      id: 'menu',      label: 'Menú'      },
  { href: '#nosotros',  id: 'nosotros',  label: 'Nosotros'  },
  { href: '#instagram', id: 'instagram', label: 'Instagram' },
  { href: '#horarios',  id: 'horarios',  label: 'Horarios'  },
  { href: '#contacto',  id: 'contacto',  label: 'Contacto'  },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { activeIndex, goToSlide } = useSlideNav()

  return (
    <nav
      className={`navbar${activeIndex > 0 ? ' navbar--scrolled' : ''}`}
      role="navigation"
      aria-label="Navegación principal"
    >
      <a href="#inicio" className="navbar__brand" onClick={(e) => { e.preventDefault(); goToSlide('inicio') }}>
        {/* ponytail: logo CSS puro, reemplaza /media/logo.webp */}
        <span className="navbar__logo-css" aria-label="Taschino">TASCHINO</span>
      </a>

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
        {LINKS.map(({ href, id, label }) => (
          <li key={href}>
            <a
              href={href}
              onClick={(e) => {
                e.preventDefault()
                setMobileOpen(false)
                goToSlide(id)
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
