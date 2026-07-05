import { forwardRef, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Menu from './Menu'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const TAGLINE = 'Il Caffè Italiano nel corazón de Ñuñoa'

// Taza de café con vapor — usada en hero y footer
const CoffeeLogo = forwardRef<SVGSVGElement, { className: string }>(({ className }, ref) => (
  <svg
    ref={ref}
    className={className}
    viewBox="0 0 160 155"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    {/* Vapor */}
    <path className="coffee-steam" d="M56,70 Q48,54 58,40 Q68,26 58,12" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
    <path className="coffee-steam" d="M80,66 Q88,50 78,36 Q68,22 78,8"  stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
    <path className="coffee-steam" d="M104,70 Q112,54 102,40 Q92,26 102,12" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
    {/* Borde superior taza */}
    <ellipse cx="80" cy="80" rx="44" ry="10" fill="currentColor"/>
    {/* Cuerpo taza */}
    <path d="M38,80 L48,128 H112 L122,80 Z" fill="currentColor"/>
    {/* Asa */}
    <path d="M120,93 Q143,93 143,110 Q143,127 120,127" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none"/>
    {/* Platillo */}
    <ellipse cx="80" cy="132" rx="56" ry="10" fill="currentColor" opacity="0.8"/>
  </svg>
))
CoffeeLogo.displayName = 'CoffeeLogo'

export default function App() {
  const navRef     = useRef<HTMLElement>(null)
  const heroBgRef  = useRef<HTMLDivElement>(null)
  const logoRef    = useRef<SVGSVGElement>(null)   // hero logo + steam
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    // ── Navbar: oscurecer al scrollear (la transición vive en CSS) ─
    const navTrigger = ScrollTrigger.create({
      start: 'top -80',
      onEnter: () => navRef.current?.classList.add('navbar--scrolled'),
      onLeaveBack: () => navRef.current?.classList.remove('navbar--scrolled'),
    })

    const mm = gsap.matchMedia()

    // ── Animaciones completas — solo sin preferencia de movimiento reducido ─
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Hero parallax
      gsap.to(heroBgRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Entrada del hero: logo → tagline → CTAs, en un solo timeline
      const chars = taglineRef.current?.querySelectorAll('.char')
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.25 })

      tl.fromTo(
        logoRef.current,
        { y: 28, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, duration: 1.1 }
      )

      if (chars && chars.length > 0) {
        tl.fromTo(
          chars,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.035, ease: 'power2.out' },
          '-=0.55'
        )
      }

      tl.fromTo(
        '.hero__ctas .btn',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
        '-=0.4'
      )

      // Steam (vapor de la taza) — loop infinito
      const steamPaths = logoRef.current?.querySelectorAll('.coffee-steam')
      if (steamPaths && steamPaths.length > 0) {
        gsap.fromTo(
          steamPaths,
          { y: 0, opacity: 0.8 },
          {
            y: -55,
            opacity: 0,
            duration: 2.2,
            stagger: 0.55,
            repeat: -1,
            ease: 'sine.inOut',
          }
        )
      }

      // Secciones fade-in al scroll
      gsap.utils.toArray<Element>('.fade-section').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          }
        )
      })

      // Cards "Sobre Nosotros" con stagger
      gsap.fromTo(
        '.about-card',
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.about__cards', start: 'top 85%' },
        }
      )

      // Galería: items con stagger
      gsap.fromTo(
        '.gallery__item',
        { scale: 0.96, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.gallery__grid', start: 'top 85%' },
        }
      )
    })

    // ── Movimiento reducido: contenido visible, sin animaciones JS ─
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set([logoRef.current, '.hero__tagline .char'], { opacity: 1 })
    })

    return () => {
      navTrigger.kill()
      mm.revert()
    }
  }, [])

  return (
    <>
      {/* ─── NAVBAR ─────────────────────────────────────────────── */}
      <nav
        ref={navRef}
        className="navbar"
        role="navigation"
        aria-label="Navegación principal"
      >
        <a href="#inicio" className="navbar__brand">
          <img src="/media/logo.webp" alt="Taschino" className="navbar__logo" />
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
          {[
            { href: '#inicio',   label: 'Inicio'    },
            { href: '#menu',     label: 'Menú'      },
            { href: '#nosotros', label: 'Nosotros'  },
            { href: '#horarios', label: 'Horarios'  },
            { href: '#contacto', label: 'Contacto'  },
          ].map(({ href, label }) => (
            <li key={href}>
              <a href={href} onClick={() => setMobileOpen(false)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ─── HERO ───────────────────────────────────────────────── */}
      <section id="inicio" className="hero" aria-label="Bienvenida">
        <div ref={heroBgRef} className="hero__bg" />
        <div className="hero__overlay" />

        <div className="hero__content">
          <CoffeeLogo ref={logoRef} className="hero__logo" />

          <p
            ref={taglineRef}
            className="hero__tagline"
            aria-label={TAGLINE}
          >
            {TAGLINE.split('').map((char, i) => (
              <span
                key={i}
                className={`char${char === ' ' ? ' char--space' : ''}`}
                aria-hidden="true"
              >
                {char}
              </span>
            ))}
          </p>

          <div className="hero__ctas">
            <a href="#menu" className="btn btn--primary">Ver Menú</a>
            <a href="#horarios" className="btn btn--outline">Encuéntranos</a>
          </div>
        </div>
      </section>

      {/* ─── SOBRE NOSOTROS ─────────────────────────────────────── */}
      <section id="nosotros" className="about fade-section">
        <div className="about__inner container">
          <div className="about__cards">
            <div className="about-card">
              <span className="about-card__icon" aria-hidden="true">☕</span>
              <h3>Café Italiano de Especialidad</h3>
              <p>
                Granos importados de Italia, extraídos con métodos tradicionales.
                Cada taza es un ritual de sabor y aroma.
              </p>
            </div>

            <div className="about-card">
              <span className="about-card__icon" aria-hidden="true">🐾</span>
              <h3>Pet Friendly</h3>
              <p>
                Tu mascota es bienvenida. Tenemos espacio y cariño para toda
                la familia, con cuatro patas incluidas.
              </p>
            </div>

            <div className="about-card">
              <span className="about-card__icon" aria-hidden="true">🌿</span>
              <h3>Ambiente Acogedor</h3>
              <p>
                Un espacio pensado para quedarte. Buena música, buena luz
                y la mejor compañía en Ñuñoa.
              </p>
            </div>
          </div>

          <div className="about__image">
            <img
              src="/media/aesthetic.webp"
              alt="Interior acogedor de Taschino"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ─── MENÚ ───────────────────────────────────────────────── */}
      <Menu />

      {/* ─── GALERÍA ────────────────────────────────────────────── */}
      <section id="galeria" className="gallery fade-section">
        <div className="container">
          <h2 className="section-title">Nuestro Espacio</h2>
          <div className="gallery__grid">
            {[
              { src: '/media/taschino.webp',          alt: 'Interior de Taschino'      },
              { src: '/media/pet-friendly.webp',       alt: 'Taschino pet friendly'     },
              { src: '/media/taschino-pannetone.webp', alt: 'Panettone en Taschino'     },
              { src: '/media/matcha.webp',             alt: 'Matcha latte en Taschino'  },
            ].map(({ src, alt }) => (
              <div key={src} className="gallery__item">
                <img src={src} alt={alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HORARIOS Y UBICACIÓN ───────────────────────────────── */}
      <section id="horarios" className="hours fade-section">
        <div className="container">
          <h2 className="section-title">Horarios y Ubicación</h2>
          <div className="hours__inner">
            <div className="hours__info">
              <div className="hours__block">
                <h3>Horario de atención</h3>
                <table className="hours__table" aria-label="Horario semanal">
                  <tbody>
                    {DIAS.map((dia) => (
                      <tr key={dia}>
                        <td>{dia}</td>
                        <td>9:00 – 20:00</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="hours__address">
                <span className="hours__address-icon" aria-hidden="true">📍</span>
                <div>
                  <strong>Cómo llegar</strong>
                  <p>Pedro de Valdivia 5461, Ñuñoa</p>
                  <p>Santiago, Chile</p>
                </div>
              </div>
            </div>

            <div className="hours__map">
              <iframe
                src="https://maps.google.com/maps?q=Pedro+de+Valdivia+5461+Nu%C3%B1oa+Santiago&output=embed"
                title="Ubicación de Taschino en Google Maps"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────── */}
      <footer id="contacto" className="footer">
        <div className="footer__inner container">
          <CoffeeLogo className="footer__logo" />

          <div className="footer__social">
            <a
              href="https://www.instagram.com/taschino.cl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Taschino en Instagram"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>

          <p className="footer__copy">
            © 2025 Taschino · Todos los derechos reservados
          </p>
        </div>
      </footer>
    </>
  )
}
