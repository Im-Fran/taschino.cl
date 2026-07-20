import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { getSlideVariants } from '../../../slides/variants'
import { useSlides } from '../../../slides/slide-context'

const INSTAGRAM_URL = 'https://www.instagram.com/taschino_cafe'

// ponytail: embed sin API; si Instagram lo bloquea, migrar a Behold.so o Graph API
export default function Instagram() {
  const { activeIndex, slideIds } = useSlides()
  const isActive = slideIds[activeIndex] === 'instagram'
  const reduced = useReducedMotion()
  const [embedUnlocked, setEmbedUnlocked] = useState(false)

  return (
    <section className="instagram">
      <motion.div
        className="container"
        variants={getSlideVariants(!!reduced)}
        initial="hidden"
        animate={isActive ? 'visible' : 'hidden'}
      >
        <p className="section-kicker">@taschino_cafe</p>
        <h2 className="section-title">Síguenos en Instagram</h2>

        <div className="instagram__embed">
          <iframe
            src={`${INSTAGRAM_URL}/embed`}
            title="Últimas publicaciones de Taschino en Instagram"
            loading="lazy"
            style={embedUnlocked ? { pointerEvents: 'auto' } : undefined}
          />
          {!embedUnlocked && (
            <button
              type="button"
              className="embed-unlock"
              aria-label="Habilitar interacción con el feed de Instagram"
              onClick={() => setEmbedUnlocked(true)}
            />
          )}
        </div>

        {/* Fallback siempre visible: si el embed no carga, el CTA sigue funcionando */}
        <div className="instagram__cta">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary"
          >
            Seguir @taschino_cafe
          </a>
        </div>
      </motion.div>
    </section>
  )
}
