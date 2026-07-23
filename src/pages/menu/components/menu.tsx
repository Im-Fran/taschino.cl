import { useState, useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'

interface Product {
  name: string
  price: number | null
  description: string | null
  in_stock: boolean
  url: string
  imagen?: string
}

interface Category {
  category: string
  products: Product[]
}

interface MenuData {
  categories: Category[]
}

// Etiqueta y emoji por categoría del backend. Categorías nuevas no listadas
// aquí igual se muestran, con el nombre tal cual y un emoji genérico.
const CATEGORY_META: Record<string, { label: string; emoji: string }> = {
  CAFETERIA: { label: 'Cafés', emoji: '☕' },
  'LINEA ITALIA': { label: 'Panadería Italiana', emoji: '🍞' },
  BOLLERIA: { label: 'Bollería', emoji: '🥐' },
  PROMOCIONES: { label: 'Promociones', emoji: '🎁' },
  BEBIDAS: { label: 'Bebidas Frías', emoji: '🧃' },
  Ensaladas: { label: 'Ensaladas', emoji: '🥗' },
  Pasteleria: { label: 'Pastelería', emoji: '🍰' },
  'Pasteleria Individual': { label: 'Pastelería Individual', emoji: '🧁' },
  'Platos calientes': { label: 'Platos Calientes', emoji: '🍲' },
  'Sandwich Miga': { label: 'Sándwich Miga', emoji: '🥪' },
  Sandwichs: { label: 'Sándwiches', emoji: '🥪' },
  'LINEA CARRARO': { label: 'Café en Grano', emoji: '☕' },
  'LINEA KAYSER': { label: 'Kayser', emoji: '🥖' },
  INGREDIENTE: { label: 'Insumos', emoji: '🧾' },
}

const CAFE_CATEGORIES = new Set(['CAFETERIA'])
const SANDWICH_CATEGORIES = new Set(['Sandwichs', 'Sandwich Miga'])

const isAddOn = (name: string) => /^agregado/i.test(name.trim())
const isPromo = (name: string) => /^promo/i.test(name.trim())

const priceFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})
const formatPrice = (price: number | null) =>
  price == null ? 'Consultar' : priceFormatter.format(price)

// Los "agregados" son ítems propios de la carta (jarabes, leches vegetales)
// que también funcionan como extras para cualquier café.
function getAddOns(products: Product[]): Product[] {
  return products.filter(
    (p) => isAddOn(p.name) || p.name.toLowerCase().includes('leche vegetal')
  )
}

// Sin campo "ingredientes" en los datos: se deriva de la descripción si existe,
// o de las palabras del nombre (tras quitar el pan base y el peso) en su defecto.
function getIngredients(product: Product): string[] {
  if (product.description) {
    return product.description
      .split(/,| y /i)
      .map((s) => s.trim())
      .filter(Boolean)
  }
  const withoutWeight = product.name.replace(/\d+\s?(gr|g|ml|k)\b/gi, '').trim()
  const words = withoutWeight.split(/\s+|&/).map((w) => w.trim()).filter(Boolean)
  return words.slice(1)
}

// Sin campo "contenidos" en los datos: se deriva de la descripción si existe,
// o del nombre de la promo separando por "+", "más" o "y".
function getPromoContents(product: Product): string[] {
  const source = product.description ?? product.name.replace(/^promo(ci[oó]n)?\s*/i, '')
  return source
    .split(/\+| mas | más | y /i)
    .map((s) => s.trim())
    .filter(Boolean)
}

export default function Menu() {
  const [categories, setCategories] = useState<Category[]>([])
  const [activeTab, setActiveTab] = useState('CAFETERIA')
  const [selected, setSelected] = useState<Product | null>(null)
  const [selectedTab, setSelectedTab] = useState('')
  const gridRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Carga la carta desde public/
  useEffect(() => {
    fetch('/products.json')
      .then((r) => r.json() as Promise<MenuData>)
      .then((data) => setCategories(data.categories.filter((c) => c.products.length > 0)))
      .catch(() => {
        // ponytail: silencioso — la landing sigue funcional sin productos
      })
  }, [])

  const tabs = useMemo(
    () =>
      categories.map((c) => ({
        id: c.category,
        label: CATEGORY_META[c.category]?.label ?? c.category,
        emoji: CATEGORY_META[c.category]?.emoji ?? '🍽️',
      })),
    [categories]
  )

  const allProducts = useMemo(() => categories.flatMap((c) => c.products), [categories])
  const addOns = useMemo(() => getAddOns(allProducts), [allProducts])

  // Stagger animation al cambiar de tab — respeta prefers-reduced-motion
  useEffect(() => {
    if (!gridRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cards = gridRef.current.querySelectorAll('.product-card')
    if (cards.length === 0) return

    gsap.fromTo(
      cards,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.045, ease: 'power3.out' }
    )
  }, [activeTab, categories])

  useEffect(() => {
    if (selected) dialogRef.current?.showModal()
    else dialogRef.current?.close()
  }, [selected])

  const visible = (categories.find((c) => c.category === activeTab)?.products ?? []).filter(
    (p) => !isAddOn(p.name)
  )

  const selectedIsPromo = selected ? isPromo(selected.name) : false
  const selectedIsCafe = selected != null && CAFE_CATEGORIES.has(selectedTab)
  const selectedIsSandwich = selected != null && SANDWICH_CATEGORIES.has(selectedTab)

  const openProduct = (product: Product) => {
    setSelected(product)
    setSelectedTab(activeTab)
  }

  return (
    <section className="menu">
      <div className="container">
        <p className="section-kicker">Per te</p>
        <h2 className="section-title">Nuestra Carta</h2>
        <p className="menu__hint">Presiona un producto para ver más detalles</p>

        <div className="menu__tabs" role="tablist" aria-label="Categorías del menú">
          {tabs.map((tab) => (
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
          aria-label={tabs.find((t) => t.id === activeTab)?.label}
        >
          {visible.map((product, i) => (
            <button
              key={`${product.name}-${i}`}
              type="button"
              className="product-card"
              onClick={() => openProduct(product)}
            >
              <div className="product-card__row">
                <p className="product-card__name">{product.name.toLowerCase()}</p>
                <span className="product-card__dots" aria-hidden="true" />
                <p className="product-card__price">{formatPrice(product.price)}</p>
              </div>
              {product.description && (
                <p className="product-card__desc">{product.description.toLowerCase()}</p>
              )}
              {CAFE_CATEGORIES.has(activeTab) && !isPromo(product.name) && addOns.length > 0 && (
                <p className="product-card__addons-hint">+{addOns.length} agregados</p>
              )}
            </button>
          ))}

          {categories.length > 0 && visible.length === 0 && (
            <p className="menu__empty">Sin productos en esta categoría.</p>
          )}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="product-modal"
        onClose={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setSelected(null)
        }}
      >
        {selected && (
          <div className="product-modal__content">
            <button
              type="button"
              className="product-modal__close"
              aria-label="Cerrar"
              onClick={() => setSelected(null)}
            >
              ×
            </button>

            {selected.imagen && (
              <img
                className="product-modal__image"
                src={selected.imagen}
                alt={selected.name.toLowerCase()}
              />
            )}

            <h3 className="product-modal__name">{selected.name.toLowerCase()}</h3>
            <p className="product-modal__price">{formatPrice(selected.price)}</p>
            {selected.description && !selectedIsSandwich && !selectedIsPromo && (
              <p className="product-modal__desc">{selected.description.toLowerCase()}</p>
            )}

            {selectedIsPromo ? (
              <>
                <p className="product-modal__section-label">Incluye</p>
                <ul className="product-modal__promo-list">
                  {getPromoContents(selected).map((item) => (
                    <li key={item}>{item.toLowerCase()}</li>
                  ))}
                </ul>
              </>
            ) : selectedIsCafe && addOns.length > 0 ? (
              <>
                <p className="product-modal__section-label">Agregados posibles</p>
                <ul className="product-modal__addons">
                  {addOns.map((addon) => (
                    <li key={addon.name}>
                      <span>{addon.name.replace(/^agregado\s*/i, '').toLowerCase()}</span>
                      <span className="product-modal__addon-price">{formatPrice(addon.price)}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : selectedIsSandwich ? (
              <>
                <p className="product-modal__section-label">Ingredientes</p>
                <ul className="product-modal__ingredients">
                  {getIngredients(selected).map((ing) => (
                    <li key={ing}>{ing.toLowerCase()}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        )}
      </dialog>
    </section>
  )
}
