import { ArrowRight } from 'lucide-react'
import Button from '../components/Button'
import BranchHero from '../components/BranchHero'
import './Home.css'

export default function Home() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="hero-eyebrow">Interactive possibility lab</p>
        <h1>Change one thing. Discover another world.</h1>
        <p className="hero-text">
          Move a slider, watch a simplified world respond, and compare it with
          the one you started from. Every result is an illustrative model, not
          a prediction.
        </p>
        <Button to="/worlds" icon={ArrowRight}>Enter Alterra</Button>
      </div>
      <BranchHero />
    </section>
  )
}