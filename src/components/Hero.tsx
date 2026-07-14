import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import CoffeeLogo from './CoffeeLogo'
import { useSlides } from '../slides/SlideContext'

const TAGLINE = 'Il Caffè Italiano nel corazón de Ñuñoa'

export default function Hero() {
  const logoRef    = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const { activeIndex, slideIds, goToSlide } = useSlides()
  const isActive = slideIds[activeIndex] === 'inicio'

  useEffect(() => {
    // Ya no hay scroll de documento que scrubear: la entrada se dispara
    // cuando el slide se activa por primera vez, no on-mount incondicional.
    if (!isActive) return
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Entrada: logo → badge → tagline → CTAs → scroll indicator
      const chars = taglineRef.current?.querySelectorAll('.char')
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.25 })

      tl.fromTo(
        logoRef.current,
        { y: 28, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, duration: 1.1 }
      )

      tl.fromTo(
        '.hero__badge',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.7'
      )

      if (chars && chars.length > 0) {
        tl.fromTo(
          chars,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.035, ease: 'power2.out' },
          '-=0.45'
        )
      }

      tl.fromTo(
        '.hero__ctas .btn',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
        '-=0.4'
      )

      tl.fromTo('.hero__scroll', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.2')
      // El vapor de la taza lo anima el propio CoffeeLogo (prop animated)
    })

    // Movimiento reducido: contenido visible, sin animaciones JS
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set([logoRef.current, '.hero__badge', '.hero__tagline .char', '.hero__scroll'], {
        opacity: 1,
      })
    })

    return () => mm.revert()
  }, [isActive])

  return (
    <div className="hero" aria-label="Bienvenida">
      <div className="hero__bg" />
      <div className="hero__overlay" />

      <div className="hero__content">
        <CoffeeLogo ref={logoRef} className="hero__logo" animated />

        <span className="hero__badge">
          <span aria-hidden="true">☕</span> Café de especialidad · Pet friendly
        </span>

        <p ref={taglineRef} className="hero__tagline" aria-label={TAGLINE}>
          {TAGLINE.split('').map((char, i) => (
            <span key={i} className={`char${char === ' ' ? ' char--space' : ''}`} aria-hidden="true">
              {char}
            </span>
          ))}
        </p>

        <div className="hero__ctas">
          <Link to="/carta" className="btn btn--primary">Ver Menú</Link>
          <a href="#horarios" className="btn btn--outline" onClick={(e) => { e.preventDefault(); goToSlide('horarios') }}>Encuéntranos</a>
        </div>
      </div>

      <a
        href="#nosotros"
        className="hero__scroll"
        aria-label="Bajar a la siguiente sección"
        onClick={(e) => { e.preventDefault(); goToSlide('nosotros') }}
      >
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>
    </div>
  )
}
