import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Children, isValidElement } from 'react'
import { SlideContext, SLIDE_LABELS, type SlideContextValue } from './slide-context'
import SlideDots from './slide-dots'

const TRANSITION_MS = 700
const SWIPE_THRESHOLD_PX = 50

interface SlideTrackProps {
  children: ReactNode[]
}

// Encuentra el elemento con scroll interno más cercano al target (o el target
// mismo) que aún puede consumir el gesto en la dirección indicada.
function findScrollableAncestor(target: EventTarget | null, container: HTMLElement): HTMLElement | null {
  let el = target instanceof Element ? target : null
  while (el && el !== container.parentElement) {
    if (el instanceof HTMLElement && el.scrollHeight > el.clientHeight + 1) {
      const style = getComputedStyle(el)
      if (style.overflowY === 'auto' || style.overflowY === 'scroll') return el
    }
    el = el.parentElement
  }
  return null
}

function canConsumeGesture(scrollable: HTMLElement, deltaDown: boolean): boolean {
  // deltaDown = true significa "intención de avanzar" (scroll hacia abajo).
  if (deltaDown) return scrollable.scrollTop < scrollable.scrollHeight - scrollable.clientHeight - 1
  return scrollable.scrollTop > 1
}

export default function SlideTrack({ children }: SlideTrackProps) {
  const slides = useMemo(
    () => Children.toArray(children).filter(isValidElement) as React.ReactElement<{ id: string }>[],
    [children]
  )
  const slideIds = useMemo(() => slides.map((s) => s.props.id), [slides])

  const containerRef = useRef<HTMLDivElement>(null)
  const cooldownRef = useRef(false)
  const touchStartY = useRef<number | null>(null)
  const reduced = useReducedMotion()

  const [activeIndex, setActiveIndex] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    const idx = slideIds.indexOf(hash)
    return idx === -1 ? 0 : idx
  })

  const goToSlide = useCallback(
    (idOrIndex: string | number) => {
      const target = typeof idOrIndex === 'number' ? idOrIndex : slideIds.indexOf(idOrIndex)
      if (target < 0 || target >= slideIds.length) return
      setActiveIndex(target)
    },
    [slideIds]
  )

  const changeSlide = useCallback(
    (direction: 1 | -1) => {
      if (cooldownRef.current) return
      setActiveIndex((current) => {
        const next = current + direction
        if (next < 0 || next >= slideIds.length) return current
        cooldownRef.current = true
        window.setTimeout(() => {
          cooldownRef.current = false
        }, TRANSITION_MS)
        return next
      })
    },
    [slideIds.length]
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function onWheel(e: WheelEvent) {
      const direction: 1 | -1 = e.deltaY > 0 ? 1 : -1
      const scrollable = findScrollableAncestor(e.target, container!)
      if (scrollable && canConsumeGesture(scrollable, direction === 1)) return
      e.preventDefault()
      changeSlide(direction)
    }

    function onTouchStart(e: TouchEvent) {
      touchStartY.current = e.touches[0]?.clientY ?? null
    }

    function onTouchMove(e: TouchEvent) {
      if (touchStartY.current === null) return
      const currentY = e.touches[0]?.clientY ?? touchStartY.current
      const deltaY = touchStartY.current - currentY
      const direction: 1 | -1 = deltaY > 0 ? 1 : -1
      const scrollable = findScrollableAncestor(e.target, container!)
      if (scrollable && canConsumeGesture(scrollable, direction === 1)) return
      e.preventDefault()
    }

    function onTouchEnd(e: TouchEvent) {
      if (touchStartY.current === null) return
      const endY = e.changedTouches[0]?.clientY ?? touchStartY.current
      const deltaY = touchStartY.current - endY
      touchStartY.current = null
      if (Math.abs(deltaY) < SWIPE_THRESHOLD_PX) return
      const direction: 1 | -1 = deltaY > 0 ? 1 : -1
      const scrollable = findScrollableAncestor(e.target, container!)
      if (scrollable && canConsumeGesture(scrollable, direction === 1)) return
      changeSlide(direction)
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return
      }
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        changeSlide(1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        changeSlide(-1)
      } else if (e.key === 'Home') {
        e.preventDefault()
        goToSlide(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        goToSlide(slideIds.length - 1)
      }
    }

    container.addEventListener('wheel', onWheel, { passive: false })
    container.addEventListener('touchstart', onTouchStart, { passive: true })
    container.addEventListener('touchmove', onTouchMove, { passive: false })
    container.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      container.removeEventListener('wheel', onWheel)
      container.removeEventListener('touchstart', onTouchStart)
      container.removeEventListener('touchmove', onTouchMove)
      container.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [changeSlide, goToSlide, slideIds.length])

  // Sincroniza el hash de la URL sin ensuciar el historial (replaceState).
  useEffect(() => {
    const id = slideIds[activeIndex]
    if (!id) return
    const newHash = `#${id}`
    if (window.location.hash !== newHash) {
      history.replaceState(null, '', newHash)
    }
  }, [activeIndex, slideIds])

  const activeId = slideIds[activeIndex]
  const announcement = activeId
    ? `Sección ${SLIDE_LABELS[activeId] ?? activeId} de ${slideIds.length}`
    : ''

  const value = useMemo<SlideContextValue>(
    () => ({ activeIndex, slideIds, goToSlide }),
    [activeIndex, slideIds, goToSlide]
  )

  return (
    <SlideContext.Provider value={value}>
      <div ref={containerRef} className="slide-track">
        <motion.div
          className="slide-track__stage"
          animate={{ y: `-${activeIndex * 100}vh` }}
          transition={reduced ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {slides}
        </motion.div>
      </div>
      <SlideDots />
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </SlideContext.Provider>
  )
}
