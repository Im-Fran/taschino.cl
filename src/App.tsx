import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Menu from './components/Menu'
import Gallery from './components/Gallery'
import Instagram from './components/Instagram'
import Hours from './components/Hours'
import Footer from './components/Footer'
import SlideContainer from './slides/SlideContainer'
import Slide from './slides/Slide'
import SlideDots from './slides/SlideDots'
import './styles/app.css'

export default function App() {
  return (
    <>
      <SlideContainer>
        <Navbar />
        <Slide id="inicio">
          <Hero />
        </Slide>
        <Slide id="menu">
          <Menu />
        </Slide>
        <Slide id="nosotros">
          <About />
        </Slide>
        <Slide id="galeria">
          <Gallery />
        </Slide>
        <Slide id="instagram">
          <Instagram />
        </Slide>
        <Slide id="horarios">
          <Hours />
        </Slide>
        <SlideDots />
      </SlideContainer>
      <Footer />
    </>
  )
}
