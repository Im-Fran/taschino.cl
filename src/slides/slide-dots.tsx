import { SLIDE_LABELS, useSlides } from './slide-context'

export default function SlideDots() {
  const { slideIds, activeIndex, goToSlide } = useSlides()

  return (
    <nav className="slide-dots" aria-label="Navegación de secciones">
      {slideIds.map((id, index) => {
        const label = SLIDE_LABELS[id] ?? id
        const isActive = index === activeIndex
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
