import './LabEmblem.css'

const COMMON = {
  fill: 'none',
  strokeWidth: 3.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const shapes = {
  city: (
    <>
      <g {...COMMON} stroke="var(--cyan)">
        <rect x="9" y="28" width="11" height="22" rx="2" />
        <rect x="26" y="12" width="12" height="38" rx="2" />
        <rect x="44" y="22" width="11" height="28" rx="2" />
      </g>
      <path d="M5 56 H59" {...COMMON} stroke="var(--violet)" />
    </>
  ),
  time: (
    <>
      <g transform="rotate(-90 32 32)" {...COMMON}>
        <circle cx="32" cy="32" r="22" pathLength="100" stroke="var(--line)" />
        <circle
          cx="32" cy="32" r="22" pathLength="100"
          stroke="var(--cyan)" strokeDasharray="42 58"
        />
        <circle
          cx="32" cy="32" r="22" pathLength="100"
          stroke="var(--violet)" strokeDasharray="24 76" strokeDashoffset="-46"
        />
      </g>
      <path d="M32 32 V19" {...COMMON} stroke="var(--text)" />
      <circle cx="32" cy="32" r="3.5" fill="var(--cyan)" />
    </>
  ),
  nature: (
    <>
      <g {...COMMON}>
        <path d="M32 56 V32" stroke="var(--cyan)" />
        <path d="M32 44 C26 44 22 40 19 33" stroke="var(--violet)" />
        <path d="M32 36 C38 36 42 31 45 23" stroke="var(--cyan)" />
        <path d="M32 32 C32 26 32 20 32 12" stroke="var(--cyan)" />
        <path d="M6 56 H58" stroke="var(--line-strong)" />
      </g>
      <circle cx="19" cy="33" r="5" fill="var(--violet)" />
      <circle cx="45" cy="23" r="5" fill="var(--cyan)" />
      <circle cx="32" cy="12" r="6" fill="var(--cyan)" />
    </>
  ),
}

export default function LabEmblem({ id, size = 56 }) {
  return (
    <svg
      className="emblem"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      {shapes[id] ?? null}
    </svg>
  )
}