import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

interface Product {
  name: string
  descripcion?: string
  precio: string
}

const TABS: { id: string; label: string; emoji: string }[] = [
  { id: 'cafes',      label: 'Cafés',              emoji: '☕' },
  { id: 'especiales', label: 'Bebidas Especiales',  emoji: '✨' },
  { id: 'pasteleria', label: 'Pastelería',           emoji: '🥐' },
  { id: 'sandwiches', label: 'Sándwiches',           emoji: '🥪' },
  { id: 'italiana',   label: 'Panadería Italiana',  emoji: '🍞' },
  { id: 'frias',      label: 'Bebidas Frías',        emoji: '🧃' },
  { id: 'kayser',     label: 'Kayser',               emoji: '🥖' },
  { id: 'grano',      label: 'Café en Grano',        emoji: '☕' },
]

function categorize(name: string): string {
  const n = name.toLowerCase()

  // Kayser primero — muchos ítems también encajarían en otras categorías
  if (n.includes('kayser')) return 'kayser'

  // Café en Grano
  if (n.includes('lavazza') || n.includes('kimbo') || n.includes('carraro')) return 'grano'

  // Bebidas Frías
  if (
    n.includes('jugo') || n.includes('agua') || n.includes('coca cola') ||
    n.includes('limonada') || n.includes('pomona') || n.includes('ginger') ||
    n.includes('jumex')
  ) return 'frias'

  // Panadería Italiana (panettone, pandoro, veneziana, etc.)
  if (
    n.includes('panettone') || n.includes('panettonne') || n.includes('pandoro') ||
    n.includes('veneziana') || n.includes('sperlari') || n.includes('turron') ||
    n.includes('coffee flower')
  ) return 'italiana'

  // Sándwiches — croissant solo sin calificador va a pastelería
  if (
    n.includes('bagel') || n.includes('ciabatta') || n.includes('miga') ||
    n.includes('croque') ||
    (n.includes('croissant') && (
      n.includes('chicken') || n.includes('jamón') || n.includes('jamon') || n.includes('sesamo')
    ))
  ) return 'sandwiches'

  // Bebidas Especiales (incluye tés)
  if (
    n.includes('matcha') || n.includes('chai') || n.includes('milk shake') ||
    n.includes('frappuccino') || n.includes('chocolate italiano') ||
    n.includes('chocolate tradicional') || n.includes('leche vegetal') ||
    n.includes('té negro') || n.includes('te negro')
  ) return 'especiales'

  // Pastelería
  if (
    n.includes('media luna') || n.includes('medialuna') || n.includes('churros') ||
    n.includes('brownie') || n.includes('muffin') || n.includes('tartaleta') ||
    n.includes('queque') || n.includes('kuchen') || n.includes('berlin') ||
    n.includes('roll') || n.includes('rollo') || n.includes('galletón') ||
    n.includes('galleta') || n.includes('delicia') || n.includes('cheese cake') ||
    n.includes('torta') || n.includes('porcion') || n.includes('porción') ||
    n.includes('pan de chocolate') || n.includes('croissant') || n.includes('paneton')
  ) return 'pasteleria'

  // Default: cafés
  return 'cafes'
}

export default function Menu() {
  const [activeTab, setActiveTab] = useState('cafes')
  const [products, setProducts] = useState<Product[]>([])
  const gridRef = useRef<HTMLDivElement>(null)

  // Carga productos desde public/
  useEffect(() => {
    fetch('/products.json')
      .then((r) => r.json() as Promise<Product[]>)
      .then(setProducts)
      .catch(() => {
        // ponytail: silencioso — la landing sigue funcional sin productos
      })
  }, [])

  // Stagger animation al cambiar de tab
  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll('.product-card')
    if (cards.length === 0) return

    gsap.fromTo(
      cards,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'power2.out' }
    )
  }, [activeTab, products])

  const visible = products.filter((p) => categorize(p.name) === activeTab)

  return (
    <section id="menu" className="menu">
      <div className="container">
        <h2 className="section-title">Nuestra Carta</h2>

        <div className="menu__tabs" role="tablist" aria-label="Categorías del menú">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`menu__tab${activeTab === tab.id ? ' menu__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span aria-hidden="true">{tab.emoji}</span>{' '}
              {tab.label}
            </button>
          ))}
        </div>

        <div
          ref={gridRef}
          className="menu__grid"
          role="tabpanel"
          aria-label={TABS.find((t) => t.id === activeTab)?.label}
        >
          {visible.map((product, i) => (
            <article key={`${product.name}-${i}`} className="product-card">
              <p className="product-card__name">{product.name.toLowerCase()}</p>
              {product.descripcion && (
                <p className="product-card__desc">{product.descripcion.toLowerCase()}</p>
              )}
              <p className="product-card__price">{product.precio}</p>
            </article>
          ))}

          {products.length > 0 && visible.length === 0 && (
            <p style={{ color: 'var(--text-light)', gridColumn: '1/-1', textAlign: 'center', padding: '32px 0' }}>
              Sin productos en esta categoría.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
