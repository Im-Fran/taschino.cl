import { useSlideNav } from './useSlideNav'

const SLIDE_LABELS: Record<string, string> = {
  inicio: 'Inicio',
  menu: 'Menú',
  nosotros: 'Nosotros',
  galeria: 'Galería',
  instagram: 'Instagram',
  horarios: 'Horarios',
  contacto: 'Contacto',
}

export default function SlideDots() {
  const { ids, activeId, goToSlide } = useSlideNav()

  return (
    <nav className="slide-dots" aria-label="Navegación de secciones">
      {ids.map((id) => {
        const label = SLIDE_LABELS[id] ?? id
        const isActive = id === activeId
        return (
          <button
            key={id}
            type="button"
            className={`slide-dots__dot${isActive ? ' slide-dots__dot--active' : ''}`}
            aria-label={`Ir a ${label}`}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => goToSlide(id)}
          />
        )
      })}
    </nav>
  )
}
