import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Menu from './components/Menu'
import Gallery from './components/Gallery'
import Instagram from './components/Instagram'
import Hours from './components/Hours'
import Footer from './components/Footer'
import './styles/app.css'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    const mm = gsap.matchMedia()

    // Fade-in genérico de secciones al scroll — cada componente maneja sus animaciones propias
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<Element>('.fade-section').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          }
        )
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Menu />
      <Gallery />
      <Instagram />
      <Hours />
      <Footer />
    </>
  )
}
