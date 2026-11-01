import { useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { worlds } from '../data/worlds'
import { simulations } from '../simulations/registry'
import { saveExperiment } from '../storage/experiments'
import Panel from '../components/Panel'
import Button from '../components/Button'
import Slider from '../components/Slider'
import Outcome from '../components/Outcome'
import Toolbar from '../components/Toolbar'
import Comparison from '../components/Comparison'
import SaveForm from '../components/SaveForm'
import CityView from '../components/CityView'
import TimeView from '../components/TimeView'
import NatureView from '../components/NatureView'
import './Workspace.css'

const views = {
  city: CityView,
  time: TimeView,
  nature: NatureView,
}

export default function Workspace() {
  const { worldId } = useParams()
  const world = worlds.find((w) => w.id === worldId && w.available)
  const sim = simulations[worldId]
  const View = views[worldId]

  if (!world || !sim || !View) {
    return (
      <section className="workspace-missing">
        <h1>World not found</h1>
        <p>That world does not exist yet.</p>
        <Button to="/worlds">Back to worlds</Button>
      </section>
    )
  }

  return <Lab key={worldId} world={world} sim={sim} View={View} />
}

function Lab({ world, sim, View }) {
  const location = useLocation()
  const [values, setValues] = useState(() => ({
    ...sim.defaults,
    ...(location.state?.values ?? {}),
  }))
  const result = useMemo(() => sim.simulate(values), [sim, values])
  const [baseline, setBaseline] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function focusButton(id) {
  document.getElementById(id)?.focus()
}

  function closeSaveForm() {
  setSaving(false)
  focusButton('save-experiment')
}

  function updateValue(id, newValue) {
    setValues((current) => ({ ...current, [id]: newValue }))
  }

  function handleSave(name) {
  try {
    const saved = saveExperiment({ name, worldId: world.id, values })
    if (saved) {
      setMessage(`Saved "${saved.name}".`)
      closeSaveForm()
    } else {
      setMessage('Could not save. Browser storage may be full or blocked.')
    }
  } catch {
    setMessage('Could not save. Something went wrong, please try again.')
  }
}

  return (
    <section className="workspace" aria-label={world.name}>
      <div className="stage">
        <h1 className="stage-title">{world.name}</h1>
        <View
          values={values}
          result={result}
          baselineValues={baseline ? baseline.values : null}
        />
      </div>

      <Toolbar
        onReset={() => setValues(sim.defaults)}
        onCompare={() => setBaseline({ values, result })}
        onSave={() => {
          setMessage('')
          setSaving(true)
        }}
      />

      <div className="workspace-controls">
        <Panel title="Variables">
          <div className="workspace-sliders">
            {sim.variables.map((v) => (
              <Slider
                key={v.id}
                label={v.label}
                value={values[v.id]}
                onChange={(newValue) => updateValue(v.id, newValue)}
                min={v.min}
                max={v.max}
                step={v.step}
                unit={v.unit}
              />
            ))}
          </div>
        </Panel>
      </div>

      <div className="workspace-outcome">
        <Panel title="Outcome">
          <Outcome {...result} />
        </Panel>
        {baseline && (
          <Panel title="Comparison">
            <Comparison
              baseline={baseline}
              current={{ values, result }}
              variables={sim.variables}
              onClear={() => {
                setBaseline(null)
                focusButton('compare-baseline')
              }}
            />
          </Panel>
        )}
        {saving && (
          <Panel title="Save experiment">
            <SaveForm
              defaultName={`${world.name} experiment`}
              onSave={handleSave}
              onCancel={closeSaveForm}
            />
          </Panel>
        )}
        <p className="workspace-status" role="status">{message}</p>
      </div>
    </section>
  )
}