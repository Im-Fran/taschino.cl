import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { SlideContext, type SlideContextValue } from './SlideContext'
import { SLIDE_LABELS } from './variants'

interface SlideContainerProps {
  children: ReactNode
}

export default function SlideContainer({ children }: SlideContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const slidesRef = useRef(new Map<string, HTMLElement>())
  const [ids, setIds] = useState<string[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const activeId = ids[activeIndex] ?? null
  const announcement = activeId ? `Sección ${SLIDE_LABELS[activeId] ?? activeId} de ${ids.length}` : ''

  // Salto inicial al hash de la URL, antes del primer pintado.
  useLayoutEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (!hash) return
    const el = slidesRef.current.get(hash)
    el?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, [])

  // Un solo IntersectionObserver sobre todos los slides registrados.
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (!visible) return
        const id = visible.target.id
        setIds((current) => {
          const idx = current.indexOf(id)
          if (idx !== -1) setActiveIndex(idx)
          return current
        })
      },
      { root: container, threshold: 0.6 }
    )

    slidesRef.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  // Sincroniza el hash de la URL sin provocar scroll-jump del navegador.
  useLayoutEffect(() => {
    if (!activeId) return
    const newHash = `#${activeId}`
    if (window.location.hash !== newHash) {
      history.replaceState(null, '', newHash)
    }
  }, [activeId])

  function goToSlide(id: string) {
    const el = slidesRef.current.get(id)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' })
  }

  function registerSlide(id: string, el: HTMLElement) {
    slidesRef.current.set(id, el)
    setIds(Array.from(slidesRef.current.keys()))
    return () => {
      slidesRef.current.delete(id)
      setIds(Array.from(slidesRef.current.keys()))
    }
  }

  const value = useMemo<SlideContextValue>(
    () => ({ activeIndex, activeId, ids, goToSlide, registerSlide }),
    [activeIndex, activeId, ids]
  )

  return (
    <SlideContext.Provider value={value}>
      <div ref={containerRef} className="slide-container">
        {children}
      </div>
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </SlideContext.Provider>
  )
}
