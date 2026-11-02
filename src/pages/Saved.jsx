import { useEffect, useRef, useState } from 'react'
import { Download, Pencil, Trash2 } from 'lucide-react'
import { worlds } from '../data/worlds'
import {
  loadExperiments,
  deleteExperiment,
  renameExperiment,
} from '../storage/experiments'

import { buildExport, downloadJson } from '../storage/exportData'
import Card from '../components/Card'
import Button from '../components/Button'
import './Saved.css'

export default function Saved() {
  const [list, setList] = useState(loadExperiments)
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const headingRef = useRef(null)
  const returnFocusTo = useRef(null)

  // After editing ends, put focus back on that card's Rename button.
  useEffect(() => {
    if (editingId === null && returnFocusTo.current) {
      document.getElementById(`rename-${returnFocusTo.current}`)?.focus()
      returnFocusTo.current = null
    }
  }, [editingId])

  function startEditing(experiment) {
    setError('')
    setDraft(experiment.name)
    setEditingId(experiment.id)
  }

  function stopEditing(id) {
    returnFocusTo.current = id
    setEditingId(null)
  }

  function handleRename(event, id) {
    event.preventDefault()
    if (!renameExperiment(id, draft)) {
      setError('Could not rename. Browser storage may be full or blocked.')
      return
    }
    setList(loadExperiments())
    stopEditing(id)
  }

    function handleExport() {
    setError('')
    try {
      const date = new Date().toISOString().slice(0, 10)
      downloadJson(`alterra-experiments-${date}.json`, buildExport(list))
      setNotice(`Exported ${list.length} experiment${list.length === 1 ? '' : 's'}.`)
    } catch {
      setError('Could not export. Try again or use a different browser.')
    }
  }

  function handleDelete(experiment) {
    if (!window.confirm(`Delete "${experiment.name}"? This cannot be undone.`)) return
    setError('')
    setNotice('')
    if (!deleteExperiment(experiment.id)) {
      setError('Could not delete. Browser storage may be blocked.')
      return
    }
    setList(loadExperiments())
    headingRef.current?.focus()
  }

  return (
    <section className="saved">
      <div className="saved-header">
  <h1 ref={headingRef} tabIndex={-1}>Saved experiments</h1>
  <Button
    variant="secondary"
    icon={Download}
    onClick={handleExport}
    disabled={list.length === 0}
  >
    Export JSON
  </Button>
</div>
<p className="saved-notice" role="status">{notice}</p>

      {error && <p className="saved-error" role="alert">{error}</p>}

      {list.length === 0 ? (
        <div className="saved-empty">
          <p>Nothing saved yet. Open a world, change something, and press Save.</p>
          <Button to="/worlds">Choose a world</Button>
        </div>
      ) : (
        <ul className="saved-list">
          {list.map((experiment) => {
            const world = worlds.find((w) => w.id === experiment.worldId)
            const isEditing = editingId === experiment.id
            return (
              <li key={experiment.id}>
                <Card as="article" className="saved-card">
                  <div className="saved-info">
                    {isEditing ? (
                      <form
                        className="saved-rename"
                        onSubmit={(event) => handleRename(event, experiment.id)}
                      >
                        <input
                          className="saved-input"
                          type="text"
                          maxLength={60}
                          value={draft}
                          autoFocus
                          aria-label={`New name for ${experiment.name}`}
                          onChange={(event) => setDraft(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Escape') stopEditing(experiment.id)
                          }}
                        />
                        <Button type="submit">Save</Button>
                        <Button
                          variant="secondary"
                          onClick={() => stopEditing(experiment.id)}
                        >
                          Cancel
                        </Button>
                      </form>
                    ) : (
                      <h2 className="saved-name">{experiment.name}</h2>
                    )}
                    <p className="saved-meta">
                      {world ? world.name : 'Unknown world'} ·{' '}
                      {new Date(experiment.savedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="saved-actions">
                    <Button
                      to={`/lab/${experiment.worldId}`}
                      state={{ values: experiment.values }}
                      aria-label={`Open ${experiment.name}`}
                    >
                      Open
                    </Button>
                    <Button
                      id={`rename-${experiment.id}`}
                      variant="secondary"
                      icon={Pencil}
                      onClick={() => startEditing(experiment)}
                      aria-label={`Rename ${experiment.name}`}
                    >
                      Rename
                    </Button>
                    <Button
                      variant="secondary"
                      icon={Trash2}
                      onClick={() => handleDelete(experiment)}
                      aria-label={`Delete ${experiment.name}`}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}