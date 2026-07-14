import { useSlideNav } from './useSlideNav'
import { SLIDE_LABELS } from './variants'

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
