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
    <section id={id} className="slide" inert={!isActive || undefined}>
      {children}
    </section>
  )
}
