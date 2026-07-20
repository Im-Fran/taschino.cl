import type { ReactNode } from 'react'
import { useSlides } from './slide-context'

interface SlideProps {
  id: string
  children: ReactNode
}

export default function Slide({ id, children }: SlideProps) {
  const { activeIndex, slideIds } = useSlides()
  const isActive = slideIds[activeIndex] === id

  return (
    // sin id manual: fullpage.js asigna el id = anchor (slideIds) a esta .section
    <section className="slide section" inert={!isActive || undefined}>
      {children}
    </section>
  )
}
