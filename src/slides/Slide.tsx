import { useContext, useLayoutEffect, useRef, type ReactNode } from 'react'
import { SlideContext } from './SlideContext'

interface SlideProps {
  id: string
  children: ReactNode
  /** Permite scroll interno propio (contenido más alto que 100dvh) sin romper el snap del padre. */
  scrollInternal?: boolean
  className?: string
  'aria-label'?: string
}

export default function Slide({ id, children, scrollInternal = false, className, ...rest }: SlideProps) {
  const ref = useRef<HTMLElement>(null)
  const ctx = useContext(SlideContext)
  if (!ctx) throw new Error('<Slide> debe usarse dentro de <SlideContainer>')

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    return ctx.registerSlide(id, el)
    // ponytail: registerSlide es estable via useMemo del padre, no hace falta en deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const classes = ['slide', scrollInternal ? 'slide--scroll-internal' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <section id={id} ref={ref} className={classes} {...rest}>
      {children}
    </section>
  )
}
