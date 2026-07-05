import { forwardRef, useEffect, useRef } from 'react'
import gsap from 'gsap'

interface CoffeeLogoProps {
  className: string
  /** Anima el vapor con GSAP (hero). Sin animar, el vapor queda estático tenue (footer). */
  animated?: boolean
}

// Taza de espresso italiana construida con DOM + CSS (sin SVG).
// El vapor son 3 columnas difuminadas que GSAP anima con valores
// aleatorios en cada ciclo (repeatRefresh) para un movimiento orgánico.
const CoffeeLogo = forwardRef<HTMLDivElement, CoffeeLogoProps>(({ className, animated = false }, outerRef) => {
  const innerRef = useRef<HTMLDivElement>(null)

  const setRefs = (node: HTMLDivElement | null) => {
    innerRef.current = node
    if (typeof outerRef === 'function') outerRef(node)
    else if (outerRef) outerRef.current = node
  }

  useEffect(() => {
    if (!animated) return
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const wisps = innerRef.current?.querySelectorAll<HTMLElement>('.cup__steam')
      wisps?.forEach((el, i) => {
        gsap.set(el, { transformOrigin: '50% 100%' })

        // Ascenso + fundido: cada repetición sortea altura, opacidad y
        // duración nuevas, así ningún ciclo se repite igual
        gsap.to(el, {
          keyframes: {
            '0%': { y: 6, opacity: 0, scaleY: 0.45, scaleX: 0.8 },
            '25%': { opacity: 'random(0.4, 0.75)' },
            '100%': { y: 'random(-38, -58)', opacity: 0, scaleY: 1.4, scaleX: 1.6 },
            easeEach: 'sine.out',
          },
          duration: 'random(2.4, 3.8)',
          delay: i * 0.9,
          repeat: -1,
          repeatRefresh: true,
          ease: 'none',
        })

        // Vaivén lateral independiente — la curvatura "natural" del vapor
        gsap.to(el, {
          x: 'random(-7, 7)',
          skewX: 'random(-12, 12)',
          duration: 'random(1.1, 1.9)',
          repeat: -1,
          yoyo: true,
          repeatRefresh: true,
          ease: 'sine.inOut',
        })
      })
    })

    return () => mm.revert()
  }, [animated])

  return (
    <div ref={setRefs} className={`coffee-cup ${className}`} aria-hidden="true">
      <span className="cup__steam" />
      <span className="cup__steam" />
      <span className="cup__steam" />
      <span className="cup__coffee" />
      <span className="cup__rim" />
      <span className="cup__body" />
      <span className="cup__handle" />
      <span className="cup__saucer" />
    </div>
  )
})
CoffeeLogo.displayName = 'CoffeeLogo'

export default CoffeeLogo
