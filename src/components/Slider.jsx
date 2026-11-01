import { useId } from 'react'
import './Slider.css'

export default function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  className = '',
}) {
  const id = useId()
  const percent = ((value - min) / (max - min)) * 100

  return (
    <div className={`slider ${className}`.trim()}>
      <div className="slider-head">
        <label htmlFor={id} className="slider-label">{label}</label>
        <output htmlFor={id} className="slider-value">
          {value}
          {unit && <span className="slider-unit"> {unit}</span>}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={`${value} ${unit}`.trim()}
        style={{ '--fill': `${percent}%` }}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  )
}