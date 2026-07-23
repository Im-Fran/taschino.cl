import { Link } from 'react-router-dom'
import CoffeeLogo from '../../components/coffee-logo'

const NotFoundPage = () => (
  <main className="not-found">
    <CoffeeLogo className="not-found__logo" animated />
    <p className="section-kicker">Error 404</p>
    <h1 className="section-title">Esta taza está vacía</h1>
    <p className="not-found__text">La página que buscas no existe o se movió.</p>
    <Link to="/" className="btn btn--primary">Volver al inicio</Link>
  </main>
)

export default NotFoundPage
