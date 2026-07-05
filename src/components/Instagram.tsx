const INSTAGRAM_URL = 'https://www.instagram.com/taschino_cafe'

// ponytail: embed sin API; si Instagram lo bloquea, migrar a Behold.so o Graph API
export default function Instagram() {
  return (
    <section id="instagram" className="instagram fade-section">
      <div className="container">
        <p className="section-kicker">@taschino_cafe</p>
        <h2 className="section-title">Síguenos en Instagram</h2>

        <div className="instagram__embed">
          <iframe
            src={`${INSTAGRAM_URL}/embed`}
            title="Últimas publicaciones de Taschino en Instagram"
            loading="lazy"
          />
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
      </div>
    </section>
  )
}
