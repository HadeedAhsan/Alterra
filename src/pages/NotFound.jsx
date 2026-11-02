import Button from '../components/Button'
import './NotFound.css'

export default function NotFound() {
  return (
    <section className="not-found">
      <h1>Page not found</h1>
      <p>That address does not lead anywhere in Alterra.</p>
      <Button to="/worlds">Choose a world</Button>
    </section>
  )
}