import { useState } from 'react'
import { useReducedMotion } from 'motion/react'
import ReactFullpageImport, { type Item } from '@fullpage/react-fullpage'
import Hero from './components/hero'
import About from './components/about'
import Gallery from './components/gallery'
import Instagram from './components/instagram'
import Hours from './components/hours'
import Footer from '../../components/footer'
import { useLocation } from 'react-router-dom'

// ponytail: interop CJS/ESM de Vite no desenvuelve el default de este paquete
const ReactFullpage = (ReactFullpageImport as unknown as { default: typeof ReactFullpageImport }).default ?? ReactFullpageImport

const ANCHORS = ['inicio', 'galeria', 'instagram', 'horarios']
const LABELS = ['Inicio', 'Galería', 'Instagram', 'Horarios']

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
        // ponytail: el observer interno de fullpage.js no se desconecta durante
        // destroy() y reacciona a las propias mutaciones del teardown intentando
        // reconstruir #fp-nav a medio destruir, dejando un nav huérfano en <body>
        // al navegar fuera de "/". No lo necesitamos (contenido estático).
        observer={false}
        scrollingSpeed={reduced ? 0 : 700}
        fitToSection={false}
        // El hero+about viven en un solo slide más alto que el viewport: fullpage.js
        // envuelve ese contenido en .fp-scrollable y usa scroll nativo hasta el final
        // antes de pasar al siguiente slide. Los demás slides caben exactos en 100dvh
        // y no se ven afectados (scrollOverflow solo activa si el contenido excede).
        scrollOverflow
        onScrollOverflow={(section: Item, _slide: Item, position: number) => {
          if (String(section.anchor) !== 'inicio') return
          const progress = Math.min(1, Math.max(0, position / window.innerHeight))
          window.dispatchEvent(new CustomEvent('hero:scrub', { detail: progress }))
        }}
        afterLoad={(_origin: Item, destination: Item) => {
          const anchor = String(destination.anchor)
          setActive(anchor)
          window.dispatchEvent(new CustomEvent('fullpage:afterload', { detail: anchor }))
        }}
        render={() => (
          <ReactFullpage.Wrapper>
            <div className="slide section">
              <Hero isActive={active === 'inicio'} />
              <About isActive={active === 'inicio'} />
            </div>
            <div className="slide section"><Gallery isActive={active === 'galeria'} /></div>
            <div className="slide section"><Instagram isActive={active === 'instagram'} /></div>
            {/* ponytail: footer va dentro del último slide (no después de <Outlet/>
                en Layout) porque fullpage.js bloquea el scroll nativo del documento;
                al exceder 100dvh activa el mismo scrollOverflow que usa el slide "inicio". */}
            <div className="slide section">
              <Hours isActive={active === 'horarios'} />
              <Footer />
            </div>
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
