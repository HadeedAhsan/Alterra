import './BranchHero.css'

export default function BranchHero() {
  return (
    <svg
      className="branch-svg"
      viewBox="0 0 360 400"
      aria-hidden="true"
      focusable="false"
    >
    <defs>
       <filter id="branch-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
        </feMerge>
       </filter>
    </defs>

      <g filter="url(#branch-glow)">
        <path className="branch-path branch-cyan" pathLength="1" style={{ '--d': '0.2s' }} d="M40 200 C100 200 120 140 180 140" />
        <path className="branch-path branch-violet" pathLength="1" style={{ '--d': '0.2s' }} d="M40 200 C100 200 120 260 180 260" />
        <path className="branch-path branch-cyan" pathLength="1" style={{ '--d': '1s' }} d="M180 140 C240 140 250 90 320 90" />
        <path className="branch-path branch-violet" pathLength="1" style={{ '--d': '1s' }} d="M180 140 C240 140 250 170 320 170" />
        <path className="branch-path branch-violet" pathLength="1" style={{ '--d': '1s' }} d="M180 260 C240 260 250 230 320 230" />
        <path className="branch-path branch-violet" pathLength="1" style={{ '--d': '1s' }} d="M180 260 C240 260 250 310 320 310" />

        <circle className="branch-node branch-fill-cyan" style={{ '--d': '0s' }} cx="40" cy="200" r="8" />
        <circle className="branch-node branch-fill-cyan" style={{ '--d': '1s' }} cx="180" cy="140" r="5" />
        <circle className="branch-node branch-fill-violet" style={{ '--d': '1s' }} cx="180" cy="260" r="5" />
        <circle className="branch-node branch-fill-cyan" style={{ '--d': '1.8s' }} cx="320" cy="90" r="9" />
        <circle className="branch-node branch-fill-violet" style={{ '--d': '1.8s' }} cx="320" cy="170" r="5" />
        <circle className="branch-node branch-fill-violet" style={{ '--d': '1.8s' }} cx="320" cy="230" r="5" />
        <circle className="branch-node branch-fill-violet" style={{ '--d': '1.8s' }} cx="320" cy="310" r="5" />
      </g>
    </svg>
  )
}