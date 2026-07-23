import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'

export default function Layout() {
  // ponytail: en "/" el Footer vive dentro del último slide de fullpage.js
  // (ver pages/home) porque fullpage.js bloquea el scroll nativo del documento
  const isHome = useLocation().pathname === '/'

  return (
    <>
      <Navbar />
      <Outlet />
      {!isHome && <Footer />}
    </>
  )
}
