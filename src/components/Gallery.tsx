import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const PHOTOS = [
  { src: '/media/taschino.webp',           alt: 'Interior de Taschino'     },
  { src: '/media/pet-friendly.webp',       alt: 'Taschino pet friendly'    },
  { src: '/media/taschino-pannetone.webp', alt: 'Panettone en Taschino'    },
  { src: '/media/matcha.webp',             alt: 'Matcha latte en Taschino' },
]

export default function Gallery() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [active, setActive] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        '.gallery__item',
        { scale: 0.96, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.gallery__grid', start: 'top 85%' },
        }
      )
    })
    return () => mm.revert()
  }, [])

  function openLightbox(photo: { src: string; alt: string }) {
    setActive(photo)
    dialogRef.current?.showModal()
  }

  function closeLightbox() {
    dialogRef.current?.close()
  }

  return (
    <section id="galeria" className="gallery fade-section">
      <div className="container">
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
      </div>

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
        <button
          type="button"
          className="lightbox__close"
          onClick={closeLightbox}
          aria-label="Cerrar imagen ampliada"
          autoFocus
        >
          ✕
        </button>
        {active && <img src={active.src} alt={active.alt} className="lightbox__img" />}
      </dialog>
    </section>
  )
}
