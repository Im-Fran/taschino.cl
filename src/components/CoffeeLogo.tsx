import { forwardRef } from 'react'

// Taza de espresso italiana con vapor, estilo line-art — usada en hero y footer
const CoffeeLogo = forwardRef<SVGSVGElement, { className: string }>(({ className }, ref) => (
  <svg
    ref={ref}
    className={className}
    viewBox="0 0 160 155"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Vapor — nace junto al borde de la taza (Hero lo anima con GSAP) */}
    <path className="coffee-steam" d="M58,66 Q50,53 58,41 Q66,29 58,17" strokeWidth="4" />
    <path className="coffee-steam" d="M78,62 Q86,48 78,36 Q70,24 78,10" strokeWidth="4" />
    <path className="coffee-steam" d="M98,66 Q106,53 98,41 Q90,29 98,17" strokeWidth="4" />

    {/* Café dentro de la taza — fill sutil */}
    <ellipse cx="78" cy="80" rx="34" ry="7.5" fill="currentColor" opacity="0.15" stroke="none" />

    {/* Borde de la taza */}
    <ellipse cx="78" cy="80" rx="34" ry="7.5" strokeWidth="4.5" />

    {/* Cuerpo de la taza — bowl con curvas suaves */}
    <path d="M44,80 C45,102 54,124 78,124 C102,124 111,102 112,80" strokeWidth="4.5" />

    {/* Asa proporcionada */}
    <path d="M112,88 C128,85 137,93 135,103 C133,113 122,117 110,113" strokeWidth="4.5" />

    {/* Platillo — arco fino bajo la taza */}
    <path d="M32,133 C42,142 58,147 78,147 C98,147 114,142 124,133" strokeWidth="4" />
  </svg>
))
CoffeeLogo.displayName = 'CoffeeLogo'

export default CoffeeLogo
