import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { getSlideVariants } from '../slides/variants'
import { useSlides } from '../slides/SlideContext'

const PHOTOS = [
  { src: '/media/taschino.webp',           alt: 'Interior de Taschino'     },
  { src: '/media/pet-friendly.webp',       alt: 'Taschino pet friendly'    },
  { src: '/media/taschino-pannetone.webp', alt: 'Panettone en Taschino'    },
  { src: '/media/matcha.webp',             alt: 'Matcha latte en Taschino' },
]

export default function Gallery() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [active, setActive] = useState<{ src: string; alt: string } | null>(null)
  const { activeIndex, slideIds } = useSlides()
  const isActive = slideIds[activeIndex] === 'galeria'
  const reduced = useReducedMotion()

  function openLightbox(photo: { src: string; alt: string }) {
    setActive(photo)
    dialogRef.current?.showModal()
  }

  function closeLightbox() {
    dialogRef.current?.close()
  }

  return (
    <section className="gallery">
      <motion.div
        className="container"
        variants={getSlideVariants(!!reduced)}
        initial="hidden"
        animate={isActive ? 'visible' : 'hidden'}
      >
        <p className="section-kicker">Benvenuti</p>
        <h2 className="section-title">Nuestro Espacio</h2>
        <div className="gallery__grid">
          {PHOTOS.map((photo) => (
            <button
              key={photo.src}
              type="button"
              className="gallery__item"
              onClick={() => openLightbox(photo)}
              aria-label={`Ampliar imagen: ${photo.alt}`}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Lightbox nativo: <dialog> maneja Escape y el backdrop solo */}
      <dialog
        ref={dialogRef}
        className="lightbox"
        onClose={() => setActive(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeLightbox()
        }}
        aria-label={active ? active.alt : 'Imagen ampliada'}
      >
        <AnimatePresence>
          {active && (
            <motion.div
              key={active.src}
              className="lightbox__content"
              initial={reduced ? false : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduced ? 0 : 0.25, ease: 'easeOut' }}
            >
              <button
                type="button"
                className="lightbox__close"
                onClick={closeLightbox}
                aria-label="Cerrar imagen ampliada"
                autoFocus
              >
                ✕
              </button>
              <img src={active.src} alt={active.alt} className="lightbox__img" />
            </motion.div>
          )}
        </AnimatePresence>
      </dialog>
    </section>
  )
}
