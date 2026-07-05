import { useEffect } from 'react'
import gsap from 'gsap'

const PHOTOS = [
  { src: '/media/taschino.webp',           alt: 'Interior de Taschino'     },
  { src: '/media/pet-friendly.webp',       alt: 'Taschino pet friendly'    },
  { src: '/media/taschino-pannetone.webp', alt: 'Panettone en Taschino'    },
  { src: '/media/matcha.webp',             alt: 'Matcha latte en Taschino' },
]

export default function Gallery() {
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

  return (
    <section id="galeria" className="gallery fade-section">
      <div className="container">
        <p className="section-kicker">Benvenuti</p>
        <h2 className="section-title">Nuestro Espacio</h2>
        <div className="gallery__grid">
          {PHOTOS.map(({ src, alt }) => (
            <div key={src} className="gallery__item">
              <img src={src} alt={alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
