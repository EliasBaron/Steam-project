import Slider from '../components/Slider'
import SliderTags from '../components/SliderTags'

import '../styles/styles.css'
import GamesPages from './GamesPages'

export default function Home() {
  return (
    <div className='main-container'>
      <Slider />
      <SliderTags />
      <GamesPages />
    </div>
  )
}
