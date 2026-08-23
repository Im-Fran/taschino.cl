<div align="center">

# ☕ Taschino

**Sitio web de Taschino, cafetería italiana pet-friendly en Ñuñoa, Santiago.**

[![License: GPL v3](https://img.shields.io/github/license/Im-Fran/taschino.cl)](LICENSE)

</div>

---

## 📖 Overview

Este repositorio contiene el sitio web de **Taschino**, una cafetería italiana ubicada en Pedro
de Valdivia 5461, Ñuñoa. Es una single-page application construida con **React 19**,
**TypeScript** y **Vite**, pensada para presentar la marca, el ambiente del local y su carta de
productos.

La página de inicio (`/`) es una experiencia de scroll a pantalla completa armada con
[`@fullpage/react-fullpage`](https://github.com/alvarotrigo/fullpage.js), con secciones para
inicio, galería, Instagram y horarios. El hero incluye un video de un barista preparando café,
renderizado como una secuencia de 161 frames `.webp` que se sincroniza cuadro a cuadro con el
scroll del usuario (scroll-scrubbing) mediante GSAP. La página `/carta` renderiza el menú
completo de productos a partir de `public/products.json`.

El sitio se despliega como assets estáticos en **Cloudflare Workers** usando `wrangler`, con
soporte de routing SPA configurado directamente en `wrangler.jsonc`.

---

## ✨ Features

- **Scroll a pantalla completa** — Secciones Inicio, Galería, Instagram y Horarios navegables
  con `fullpage.js`, con anuncios de sección vía `aria-live` para lectores de pantalla.
- **Hero con scroll-scrubbing** — Video del barista renderizado como secuencia de frames `.webp`
  precargados, sincronizado al progreso del scroll con `requestAnimationFrame` y lerp para
  suavizar saltos bruscos.
- **Menú dinámico (`/carta`)** — Catálogo de productos por categoría cargado desde
  `public/products.json`, editable sin tocar código.
- **Animaciones de entrada** — Secciones "Sobre Nosotros", galería, Instagram y horarios animadas
  con `motion` (Framer Motion), respetando `prefers-reduced-motion`.
- **Navbar consciente del contexto** — Se comporta distinto en `/` (navegación entre slides vía
  `window.fullpage_api`) que en el resto de rutas (navegación normal con `react-router-dom`).
- **React Compiler** — Habilitado vía `babel-plugin-react-compiler` sobre `@rolldown/plugin-babel`
  para memoización automática sin `useMemo`/`useCallback` manuales.
- **Deploy nativo a Cloudflare Workers** — Configuración de assets, fallback SPA y compatibilidad
  Node.js en `wrangler.jsonc`, sin infraestructura adicional.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, React Router DOM 7 |
| Build tool | Vite 8 (`@vitejs/plugin-react`, `@cloudflare/vite-plugin`) |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Animación | GSAP, Motion (Framer Motion), `@fullpage/react-fullpage` |
| Linting | ESLint 10 + `typescript-eslint` |
| Package manager | pnpm (lockfile v9) |
| Hosting / Deploy | Cloudflare Workers (`wrangler`) |
| Licencia | GNU GPL v3 |

---

## 📋 Requirements

- **Node.js** ≥ 20 (tipados vía `@types/node` apuntan a Node 24)
- **pnpm** ≥ 9 (requerido por `lockfileVersion: 9.0` en `pnpm-lock.yaml`)
- **Git**
- Cuenta de **Cloudflare** con `wrangler` autenticado (`wrangler login`) para desplegar

---

## 🚀 Getting Started

### 1. Clonar el repositorio

```bash
git clone git@github.com:Im-Fran/taschino.cl.git
cd taschino.cl
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Levantar el entorno de desarrollo

```bash
pnpm dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador (puerto por defecto de Vite).

No se requiere configuración de variables de entorno: el proyecto no lee `process.env` en tiempo
de ejecución del cliente.

---

## 🏗 Building for Production

```bash
pnpm build
```

Esto corre `tsc -b` (chequeo de tipos) seguido de `vite build`. El resultado queda en `dist/`.

Para revisar el código con ESLint:

```bash
pnpm lint
```

---

## 🌐 Deployment

El sitio se publica en **Cloudflare Workers** usando `wrangler`, configurado en `wrangler.jsonc`
(nombre `taschino`, `assets.not_found_handling: single-page-application` para el fallback de
rutas de React Router, y `compatibility_flags: ["nodejs_compat"]`).

### Preview local contra el runtime de Workers

```bash
pnpm preview
```

Compila el proyecto (`pnpm build`) y luego levanta `wrangler dev`, sirviendo el build sobre el
runtime real de Cloudflare Workers en local.

### Deploy a producción

```bash
pnpm deploy
```

Compila el proyecto y publica el resultado con `wrangler deploy`. Requiere estar autenticado
(`wrangler login`) y tener permisos sobre el Worker `taschino` en la cuenta de Cloudflare.

---

## ⚙️ Configuration

| Archivo | Propósito |
|---------|-----------|
| `public/products.json` | Catálogo de productos y categorías que renderiza `/carta` |
| `wrangler.jsonc` | Configuración de despliegue en Cloudflare Workers (nombre, routing SPA, compatibilidad Node.js, observability) |
| `vite.config.ts` | Plugins de build: React, React Compiler (Babel), Tailwind, Cloudflare |

---

## 🤝 Contributing

Este es el sitio propio de Taschino, pero si detectas un bug o quieres proponer una mejora:

1. Haz fork del repositorio
2. Crea una rama: `git checkout -b feat/tu-mejora`
3. Commitea: `git commit -m "feat: agrega tu mejora"`
4. Abre un Pull Request

---

## 📄 License

Este proyecto está licenciado bajo **GNU General Public License v3.0** — ver el archivo
[LICENSE](LICENSE) para más detalles.

---

<div align="center">
Made with ☕ by <a href="https://fsolism.cl">Fran</a>
</div>
