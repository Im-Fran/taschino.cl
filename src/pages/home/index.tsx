import { useState } from 'react'
import { useReducedMotion } from 'motion/react'
import ReactFullpageImport, { type Item } from '@fullpage/react-fullpage'
import Hero from './components/hero'
import About from './components/about'
import Gallery from './components/gallery'
import Instagram from './components/instagram'
import Hours from './components/hours'
import { useLocation } from 'react-router-dom'

// ponytail: interop CJS/ESM de Vite no desenvuelve el default de este paquete
const ReactFullpage = (ReactFullpageImport as unknown as { default: typeof ReactFullpageImport }).default ?? ReactFullpageImport

const ANCHORS = ['inicio', 'nosotros', 'galeria', 'instagram', 'horarios']
const LABELS = ['Inicio', 'Nosotros', 'Galería', 'Instagram', 'Horarios']

const HomePage = () => {
  const reduced = useReducedMotion()
  const [active, setActive] = useState('inicio')
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      <ReactFullpage
        anchors={ANCHORS}
        navigationTooltips={LABELS}
        licenseKey="gplv3-license" // ponytail: clave abierta oficial de fullpage.js para uso GPLv3
        credits={{ enabled: false }}
        navigation={isHome}
        controlArrows={false}
        scrollingSpeed={reduced ? 0 : 700}
        fitToSection={false}
        afterLoad={(_origin: Item, destination: Item) => {
          const anchor = String(destination.anchor)
          setActive(anchor)
          window.dispatchEvent(new CustomEvent('fullpage:afterload', { detail: anchor }))
        }}
        render={() => (
          <ReactFullpage.Wrapper>
            <div className="slide section"><Hero isActive={active === 'inicio'} /></div>
            <div className="slide section"><About isActive={active === 'nosotros'} /></div>
            <div className="slide section"><Gallery isActive={active === 'galeria'} /></div>
            <div className="slide section"><Instagram isActive={active === 'instagram'} /></div>
            <div className="slide section"><Hours isActive={active === 'horarios'} /></div>
          </ReactFullpage.Wrapper>
        )}
      />
      <span className="sr-only" aria-live="polite">
        {`Sección ${LABELS[ANCHORS.indexOf(active)]} de ${ANCHORS.length}`}
      </span>
    </>
  )
}

export default HomePage
