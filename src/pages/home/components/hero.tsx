import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import CoffeeLogo from '../../../components/coffee-logo'

const TAGLINE = 'Il Caffè Italiano nel corazón de Ñuñoa'

const FRAME_COUNT = 161
const framePath = (n: number) => `/media/videos/barista_cafe.webp/frame${String(n).padStart(4, '0')}.webp`

interface HeroProps {
  isActive: boolean
}

export default function Hero({ isActive }: HeroProps) {
  const logoRef    = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const frameRef   = useRef<HTMLImageElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const scrubRef   = useRef<HTMLDivElement>(null)

  // Precarga todos los frames para que el scrub no muestre saltos/blanks.
  useEffect(() => {
    const images: HTMLImageElement[] = []
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      img.src = framePath(i)
      images.push(img)
    }
    return () => { images.length = 0 }
  }, [])

  // Scroll-scrubbing: el progreso 0..1 del scroll dentro del slide lo emite
  // fullpage.js (onScrollOverflow, ver home/index.tsx). Mutamos el DOM
  // directo en vez de useState para no re-renderizar en cada tick de scroll.
  // El progreso mostrado persigue (lerp) al progreso real en vez de saltar
  // directo, para que un scroll brusco no dispare todos los frames de golpe.
  useEffect(() => {
    const frame = frameRef.current
    const content = contentRef.current
    if (!frame || !content) return

    let targetProgress = 0
    let shownProgress = 0
    let lastFrameNumber = -1
    let rafId: number

    const onScrub = (e: Event) => {
      targetProgress = (e as CustomEvent<number>).detail
    }
    window.addEventListener('hero:scrub', onScrub)

    const tick = () => {
      shownProgress += (targetProgress - shownProgress) * 0.015
      if (Math.abs(targetProgress - shownProgress) < 0.001) shownProgress = targetProgress

      const frameNumber = Math.min(FRAME_COUNT, Math.max(1, Math.round(shownProgress * (FRAME_COUNT - 1)) + 1))
      if (frameNumber !== lastFrameNumber) {
        frame.src = framePath(frameNumber)
        lastFrameNumber = frameNumber
      }
      content.style.opacity = String(1 - Math.min(1, shownProgress / 0.6))

      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('hero:scrub', onScrub)
      cancelAnimationFrame(rafId)
    }
  }, [])

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
    <div className="hero-scrub" ref={scrubRef}>
      <div className="hero" aria-label="Bienvenida">
        <img ref={frameRef} src={framePath(1)} className="hero__bg" alt="" aria-hidden="true" />
        <div className="hero__overlay" />

        <div className="hero__content" ref={contentRef}>
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
            <a href="#horarios" className="btn btn--outline" onClick={(e) => { e.preventDefault(); window.fullpage_api?.moveTo('horarios') }}>Encuéntranos</a>
          </div>
        </div>

        <button
          type="button"
          className="hero__scroll"
          aria-label="Bajar a la siguiente sección"
          onClick={() => {
            scrubRef.current?.closest('.fp-scrollable')?.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
          }}
        >
          <span className="hero__scroll-line" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
