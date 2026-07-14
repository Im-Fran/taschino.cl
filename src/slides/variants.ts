import type { Variants } from 'motion/react'

// Variant compartida para el contenido interno de cada slide.
export const slideContentVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

// prefers-reduced-motion: mismos estados finales, sin transición animada.
export function getSlideVariants(reduced: boolean): Variants {
  if (!reduced) return slideContentVariants
  return {
    hidden: { opacity: 0, y: 36, transition: { duration: 0 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0 } },
  }
}
