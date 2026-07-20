import { useEffect, useMemo, type ReactNode } from 'react'
import { Children, isValidElement } from 'react'
import { useReducedMotion } from 'motion/react'
import ReactFullpageImport from '@fullpage/react-fullpage'
import type { Item } from '@fullpage/react-fullpage'

// ponytail: interop CJS/ESM de Vite no desenvuelve el default de este paquete
const ReactFullpage = (ReactFullpageImport as unknown as { default: typeof ReactFullpageImport }).default
  ?? ReactFullpageImport
import { SLIDE_LABELS, useSlideRegistry, useSlides } from './slide-context'
import SlideDots from './slide-dots'

interface SlideTrackProps {
  children: ReactNode[]
}

export default function SlideTrack({ children }: SlideTrackProps) {
  const slides = useMemo(
    () => Children.toArray(children).filter(isValidElement) as React.ReactElement<{ id: string }>[],
    [children]
  )
  const slideIds = useMemo(() => slides.map((s) => s.props.id), [slides])
  const reduced = useReducedMotion()
  const registry = useSlideRegistry()
  const { activeIndex } = useSlides()

  useEffect(() => {
    registry?.setSlideIds(slideIds)
    return () => registry?.setSlideIds([])
  }, [registry, slideIds])

  useEffect(() => () => registry?.setMover(null), [registry])

  const activeId = slideIds[activeIndex]
  const announcement = activeId
    ? `Sección ${SLIDE_LABELS[activeId] ?? activeId} de ${slideIds.length}`
    : ''

  return (
    <>
      <ReactFullpage
        anchors={slideIds}
        licenseKey="gplv3-license" // ponytail: clave abierta oficial de fullpage.js para uso GPLv3
        credits={{ enabled: false }}
        navigation={false}
        controlArrows={false}
        normalScrollElements=".slide"
        scrollingSpeed={reduced ? 0 : 700}
        afterLoad={(_origin: Item, destination: Item) => registry?.setActiveIndex(destination.index)}
        render={({ fullpageApi }) => {
          registry?.setMover((anchor) => fullpageApi.moveTo(anchor))
          return <ReactFullpage.Wrapper>{slides}</ReactFullpage.Wrapper>
        }}
      />
      <SlideDots />
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </>
  )
}
