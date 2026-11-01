import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import './Panel.css'

export default function Panel({
  title,
  defaultOpen = true,
  children,
  className = '',
}) {
  const [open, setOpen] = useState(defaultOpen)
  const contentId = useId()

  return (
    <section className={`panel ${className}`.trim()}>
      <h2 className="panel-title">
        <button
          type="button"
          className="panel-toggle"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((value) => !value)}
        >
          <span>{title}</span>
          <ChevronDown
            size={18}
            aria-hidden="true"
            className={open ? 'panel-chevron open' : 'panel-chevron'}
          />
        </button>
      </h2>
      <div id={contentId} className="panel-body" hidden={!open}>
        {children}
      </div>
    </section>
  )
}