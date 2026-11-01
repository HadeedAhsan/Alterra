import { worlds } from '../data/worlds'
import Card from '../components/Card'
import Button from '../components/Button'
import './Worlds.css'

export default function Worlds() {
  return (
    <section className="worlds">
      <h1>Choose a world</h1>
      <p className="worlds-intro">
        Each world is a small model with its own variables. Pick one to start
        experimenting.
      </p>

      <ul className="worlds-grid">
        {worlds.map(({ id, name, icon: Icon, description, available }) => (
          <li key={id}>
            <Card as="article" className="world-card">
              <Icon size={32} aria-hidden="true" className="world-icon" />
              <h2>{name}</h2>
              <p className="world-text">{description}</p>
              {available ? (
                <Button to={`/lab/${id}`}>Open {name}</Button>
              ) : (
                <Button variant="secondary" disabled>Coming soon</Button>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}