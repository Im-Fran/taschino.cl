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
    {/* Vapor — 3 wisps distintos (largo, amplitud, grosor y opacidad base) que nacen
        justo sobre el borde de la taza (y≈72.5). Hero los anima por índice con GSAP;
        estáticos también se ven bien (footer usa el logo sin animación) */}
    <path className="coffee-steam" d="M62,70 C55,61 67,54 60,45 C56,40 52,37 53,31" strokeWidth="3" opacity="0.5" />
    <path className="coffee-steam" d="M79,71 C71,60 88,50 79,38 C71,27 87,20 80,8" strokeWidth="4" opacity="0.7" />
    <path className="coffee-steam" d="M95,70 C102,61 89,53 97,44 C102,38 106,35 104,28" strokeWidth="3.5" opacity="0.58" />

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
