import { useContext } from 'react'
import { SlideContext } from './SlideContext'

// Hook público: consume el Context provisto por <SlideContainer>.
export function useSlideNav() {
  const ctx = useContext(SlideContext)
  if (!ctx) throw new Error('useSlideNav debe usarse dentro de <SlideContainer>')
  const { activeIndex, activeId, ids, goToSlide } = ctx
  return { activeIndex, activeId, ids, goToSlide }
}

// Evita prop drilling: cada Slide/componente pregunta directo al contexto si es el activo.
export function useIsActiveSlide(id: string): boolean {
  const ctx = useContext(SlideContext)
  if (!ctx) throw new Error('useIsActiveSlide debe usarse dentro de <SlideContainer>')
  return ctx.activeId === id
}
