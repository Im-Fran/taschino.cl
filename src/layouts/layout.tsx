import { useCallback, useMemo, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import {
  SlideContext,
  SlideRegistryContext,
  type SlideContextValue,
  type SlideRegistry,
} from '../slides/slide-context'

export default function Layout() {
  const [slideIds, setSlideIds] = useState<string[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const moverRef = useRef<((anchor: string) => void) | null>(null)

  const goToSlide = useCallback(
    (idOrIndex: string | number) => {
      const target = typeof idOrIndex === 'number' ? idOrIndex : slideIds.indexOf(idOrIndex)
      if (target < 0 || target >= slideIds.length) return
      moverRef.current?.(slideIds[target])
    },
    [slideIds]
  )

  const value = useMemo<SlideContextValue>(
    () => ({ activeIndex, slideIds, goToSlide }),
    [activeIndex, slideIds, goToSlide]
  )

  const registry = useMemo<SlideRegistry>(
    () => ({
      setSlideIds,
      setActiveIndex,
      setMover: (mover) => {
        moverRef.current = mover
      },
    }),
    []
  )

  return (
    <SlideContext.Provider value={value}>
      <SlideRegistryContext.Provider value={registry}>
        <Navbar />
        <Outlet />
        <Footer />
      </SlideRegistryContext.Provider>
    </SlideContext.Provider>
  )
}
