import { createContext } from 'react'

export interface SlideContextValue {
  activeIndex: number
  activeId: string | null
  ids: string[]
  goToSlide: (id: string) => void
  registerSlide: (id: string, el: HTMLElement) => () => void
}

export const SlideContext = createContext<SlideContextValue | null>(null)
