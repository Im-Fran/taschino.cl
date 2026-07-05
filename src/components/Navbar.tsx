import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const LINKS = [
  { href: '#inicio',    label: 'Inicio'    },
  { href: '#menu',      label: 'Menú'      },
  { href: '#nosotros',  label: 'Nosotros'  },
  { href: '#instagram', label: 'Instagram' },
  { href: '#horarios',  label: 'Horarios'  },
  { href: '#contacto',  label: 'Contacto'  },
]

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    // Oscurecer al scrollear — la transición vive en CSS
    const trigger = ScrollTrigger.create({
      start: 'top -80',
      onEnter: () => navRef.current?.classList.add('navbar--scrolled'),
      onLeaveBack: () => navRef.current?.classList.remove('navbar--scrolled'),
    })
    return () => trigger.kill()
  }, [])

  return (
    <nav ref={navRef} className="navbar" role="navigation" aria-label="Navegación principal">
      <a href="#inicio" className="navbar__brand">
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
        {LINKS.map(({ href, label }) => (
          <li key={href}>
            <a href={href} onClick={() => setMobileOpen(false)}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
