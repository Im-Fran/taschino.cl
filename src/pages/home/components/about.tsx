import { motion, useReducedMotion } from 'motion/react'

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

interface AboutProps {
  isActive: boolean
}

export default function About({ isActive }: AboutProps) {
  const reduced = useReducedMotion()
  const variants = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  }

  return (
    <section className="about">
      <motion.div
        className="about__inner container"
        variants={variants}
        initial="hidden"
        animate={isActive ? 'visible' : 'hidden'}
      >
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
      </motion.div>
    </section>
  )
}
