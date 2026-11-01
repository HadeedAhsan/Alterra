import { RotateCcw, Save, GitCompare } from 'lucide-react'
import Button from './Button'
import './Toolbar.css'

export default function Toolbar({ onReset, onSave, onCompare }) {
  return (
    <div className="toolbar" role="group" aria-label="Experiment actions">
      <Button variant="secondary" icon={RotateCcw} onClick={onReset}>
        Reset
      </Button>
      <Button id="compare-baseline" variant="secondary" icon={GitCompare} onClick={onCompare}>
        Compare
      </Button>
      <Button id="save-experiment" icon={Save} onClick={onSave}>
        Save
      </Button>
    </div>
  )
}