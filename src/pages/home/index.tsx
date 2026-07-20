import Hero from './components/hero'
import About from './components/about'
import Gallery from './components/gallery'
import Instagram from './components/instagram'
import Hours from './components/hours'
import SlideTrack from '../../slides/slide-track'
import Slide from '../../slides/slide'

const HomePage = () => <SlideTrack>
  <Slide id="inicio">
    <Hero />
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
</SlideTrack>

export default HomePage