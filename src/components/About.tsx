import { useEffect } from 'react'
import gsap from 'gsap'

const CARDS = [
  {
    icon: '☕',
    title: 'Café Italiano de Especialidad',
    text: 'Granos importados de Italia, extraídos con métodos tradicionales. Cada taza es un ritual de sabor y aroma.',
  },
  {
    icon: '🐾',
    title: 'Pet Friendly',
    text: 'Tu mascota es bienvenida. Tenemos espacio y cariño para toda la familia, con cuatro patas incluidas.',
  },
  {
    icon: '🌿',
    title: 'Ambiente Acogedor',
    text: 'Un espacio pensado para quedarte. Buena música, buena luz y la mejor compañía en Ñuñoa.',
  },
]

export default function About() {
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        '.about-card',
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.about__cards', start: 'top 85%' },
        }
      )
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="nosotros" className="about fade-section">
      <div className="about__inner container">
        <div className="about__cards">
          <p className="section-kicker">Casa nostra</p>
          <h2 className="section-title section-title--left">Sobre Nosotros</h2>

          {CARDS.map(({ icon, title, text }) => (
            <div key={title} className="about-card">
              <span className="about-card__icon" aria-hidden="true">{icon}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="about__image">
          <img src="/media/aesthetic.webp" alt="Interior acogedor de Taschino" loading="lazy" />
        </div>
      </div>
    </section>
  )
}
