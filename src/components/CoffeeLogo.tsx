import { forwardRef } from 'react'

// Taza de café con vapor — usada en hero y footer
const CoffeeLogo = forwardRef<SVGSVGElement, { className: string }>(({ className }, ref) => (
  <svg
    ref={ref}
    className={className}
    viewBox="0 0 160 155"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    {/* Vapor */}
    <path className="coffee-steam" d="M56,70 Q48,54 58,40 Q68,26 58,12" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
    <path className="coffee-steam" d="M80,66 Q88,50 78,36 Q68,22 78,8"  stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
    <path className="coffee-steam" d="M104,70 Q112,54 102,40 Q92,26 102,12" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
    {/* Borde superior taza */}
    <ellipse cx="80" cy="80" rx="44" ry="10" fill="currentColor"/>
    {/* Cuerpo taza */}
    <path d="M38,80 L48,128 H112 L122,80 Z" fill="currentColor"/>
    {/* Asa */}
    <path d="M120,93 Q143,93 143,110 Q143,127 120,127" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none"/>
    {/* Platillo */}
    <ellipse cx="80" cy="132" rx="56" ry="10" fill="currentColor" opacity="0.8"/>
  </svg>
))
CoffeeLogo.displayName = 'CoffeeLogo'

export default CoffeeLogo
