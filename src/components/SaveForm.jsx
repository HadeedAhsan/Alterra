import { useEffect, useRef, useState } from 'react'
import Button from './Button'
import './SaveForm.css'

export default function SaveForm({ defaultName, onSave, onCancel }) {
  const [name, setName] = useState(defaultName)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    onSave(name)
  }

  return (
    <form className="save-form" onSubmit={handleSubmit}>
      <label htmlFor="experiment-name" className="save-label">
        Experiment name
      </label>
      <input
        id="experiment-name"
        ref={inputRef}
        className="save-input"
        type="text"
        maxLength={60}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <div className="save-actions">
        <Button type="submit">Save</Button>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}