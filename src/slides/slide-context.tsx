import { createContext, useContext } from 'react'

export interface SlideContextValue {
  activeIndex: number
  slideIds: string[]
  goToSlide: (idOrIndex: string | number) => void
}

export const SlideContext = createContext<SlideContextValue | null>(null)

export function useSlides(): SlideContextValue {
  const ctx = useContext(SlideContext)
  if (!ctx) throw new Error('useSlides debe usarse dentro de <SlideProvider>')
  return ctx
}

// Variante que no explota fuera del Provider — para componentes como Navbar
// que se renderizan en rutas sin slides (ej. /carta) y deben degradar con gracia.
export function useSlidesOptional(): SlideContextValue | null {
  return useContext(SlideContext)
}

// Labels compartidos por Navbar y el anuncio aria-live.
export const SLIDE_LABELS: Record<string, string> = {
  inicio: 'Inicio',
  nosotros: 'Nosotros',
  galeria: 'Galería',
  instagram: 'Instagram',
  horarios: 'Horarios',
}

// El SlideContext.Provider vive en Layout (para que Navbar, hermano de
// <Outlet/>, lo alcance). SlideTrack —dentro de HomePage— publica su estado
// hacia ese Provider a través de este registro, en vez de crear su propio
// Provider (que Navbar no podría ver por estar fuera de su subárbol).
export interface SlideRegistry {
  setSlideIds: (ids: string[]) => void
  setActiveIndex: (index: number) => void
  setMover: (mover: ((anchor: string) => void) | null) => void
}

export const SlideRegistryContext = createContext<SlideRegistry | null>(null)

export function useSlideRegistry(): SlideRegistry | null {
  return useContext(SlideRegistryContext)
}
