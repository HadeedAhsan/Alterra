import './Logo.css'

export default function Logo({ size = 28 }) {
  return (
    <svg
      className="logo"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeWidth="5.5" strokeLinecap="round">
        <path d="M17 32C32 32 32 44 47 44" stroke="var(--violet)" />
        <path d="M17 32C32 32 32 20 47 20" stroke="var(--cyan)" />
      </g>
      <circle cx="17" cy="32" r="7" fill="var(--cyan)" />
      <circle cx="47" cy="20" r="5" fill="var(--cyan)" />
      <circle cx="47" cy="44" r="5" fill="var(--violet)" />
    </svg>
  )
}