import Hero from '../components/Hero'
import About from '../components/About'
import Gallery from '../components/Gallery'
import Instagram from '../components/Instagram'
import Hours from '../components/Hours'
import SlideTrack from '../slides/SlideTrack'
import Slide from '../slides/Slide'

export default function HomePage() {
  return (
    <SlideTrack>
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
  )
}
