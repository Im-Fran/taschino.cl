import type { fullpageApi } from '@fullpage/react-fullpage'

// fullpage.js expone su instancia activa en window.fullpage_api (comportamiento
// nativo de la librería, no un wrapper propio) para poder navegar (moveTo)
// desde componentes fuera del árbol de <ReactFullpage/> (ej. Navbar).
declare global {
  interface Window {
    fullpage_api?: fullpageApi
  }
}
