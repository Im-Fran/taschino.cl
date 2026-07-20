import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

interface HoursProps {
  isActive: boolean
}

export default function Hours({ isActive }: HoursProps) {
  const reduced = useReducedMotion()
  const [mapUnlocked, setMapUnlocked] = useState(false)
  const variants = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  }

  return (
    <section className="hours">
      <motion.div
        className="container"
        variants={variants}
        initial="hidden"
        animate={isActive ? 'visible' : 'hidden'}
      >
        <p className="section-kicker">Ti aspettiamo</p>
        <h2 className="section-title">Horarios y Ubicación</h2>
        <div className="hours__inner">
          <div className="hours__info">
            <div className="hours__block">
              <h3>Horario de atención</h3>
              <table className="hours__table" aria-label="Horario semanal">
                <tbody>
                  {DIAS.map((dia) => (
                    <tr key={dia}>
                      <td>{dia}</td>
                      <td>9:00 – 20:00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="hours__address">
              <span className="hours__address-icon" aria-hidden="true">📍</span>
              <div>
                <strong>Cómo llegar</strong>
                <p>Pedro de Valdivia 5461, Ñuñoa</p>
                <p>Santiago, Chile</p>
              </div>
            </div>
          </div>

          <div className="hours__map">
            <iframe
              src="https://maps.google.com/maps?q=Pedro+de+Valdivia+5461+Nu%C3%B1oa+Santiago&output=embed"
              title="Ubicación de Taschino en Google Maps"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={mapUnlocked ? { pointerEvents: 'auto' } : undefined}
            />
            {!mapUnlocked && (
              <button
                type="button"
                className="embed-unlock"
                aria-label="Habilitar interacción con el mapa"
                onClick={() => setMapUnlocked(true)}
              />
            )}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
