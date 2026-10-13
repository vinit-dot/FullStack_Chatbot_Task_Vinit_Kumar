// Original drone illustration inside a radar ring. Pure SVG, so no image files are needed.
export default function DroneArt() {
  const rotor = (cx: number, cy: number) => (
    <g>
      <circle cx={cx} cy={cy} r="30" fill="#16293a" stroke="#3a5166" strokeWidth="2" />
      <g className="rotor">
        <ellipse cx={cx} cy={cy} rx="30" ry="4" fill="#ff5a1f" />
      </g>
      <circle cx={cx} cy={cy} r="4" fill="#f2f5f7" />
    </g>
  )
  return (
    <svg viewBox="0 0 400 400" role="img" aria-label="Illustration of a quadcopter drone over a radar display" width="420">
      <circle cx="200" cy="200" r="190" fill="#0f2233" stroke="#2c6e9b" strokeWidth="2" />
      <circle cx="200" cy="200" r="130" fill="none" stroke="#2c6e9b" strokeWidth="1.5" strokeDasharray="4 6" />
      <circle cx="200" cy="200" r="70" fill="none" stroke="#2c6e9b" strokeWidth="1.5" strokeDasharray="4 6" />
      <path d="M200 10v380M10 200h380" stroke="#2c6e9b" strokeWidth="1" opacity=".5" />
      <g className="sweep">
        <path d="M200 200L200 12A188 188 0 0 1 300 40Z" fill="#ff5a1f" opacity=".16" />
        <line x1="200" y1="200" x2="200" y2="12" stroke="#ff5a1f" strokeWidth="2" />
      </g>
      <path d="M150 150L250 250M250 150L150 250" stroke="#5b7388" strokeWidth="9" strokeLinecap="round" />
      {rotor(150, 150)}
      {rotor(250, 150)}
      {rotor(150, 250)}
      {rotor(250, 250)}
      <rect x="170" y="170" width="60" height="60" rx="14" fill="#f2f5f7" />
      <circle cx="200" cy="200" r="14" fill="#0c1a26" />
      <circle cx="200" cy="200" r="6" fill="#ff5a1f" />
    </svg>
  )
}
