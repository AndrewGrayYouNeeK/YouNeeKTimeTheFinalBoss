// NEON colors
const GREEN = '#39ff14';
const RED   = '#ff2222';
const YELLOW = '#ffff00';

export default function ClockHands({ unitRotation, minuteRotation, secondRotation }) {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
      {/* ── Green hour hand ── 
          Tip ends just below the inner red tick ring (r≈160).
          Symmetrical: tail goes 12% past center, tip at 38% from center.
          So total length spans center ±, drawn as a line through center.
          Hand tip: top at r=118 from center (below red ring start ~162)
          Hand tail: r=30 past center opposite side */}
      <g transform={`rotate(${unitRotation}, 200, 200)`}>
        {/* tail (short counterweight below center) */}
        <line
          x1="200" y1="200"
          x2="200" y2="230"
          stroke={GREEN} strokeWidth="3.5" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${GREEN})` }}
        />
        {/* main hand pointing up — tip stops right below small green ticks */}
        <line
          x1="200" y1="200"
          x2="200" y2="18"
          stroke={GREEN} strokeWidth="3.5" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${GREEN})` }}
        />
      </g>

      {/* ── Red minute hand ── 
          Reaches into inner red tick area. Tip at r=148 (y=52).
          Tail at r=22 below center. Same thickness as hour hand. */}
      <g transform={`rotate(${minuteRotation}, 200, 200)`}>
        <line
          x1="200" y1="200"
          x2="200" y2="230"
          stroke={RED} strokeWidth="3.5" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${RED})` }}
        />
        <line
          x1="200" y1="200"
          x2="200" y2="52"
          stroke={RED} strokeWidth="3.5" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${RED})` }}
        />
      </g>

      {/* ── Second hand ── solid yellow */}
      <g transform={`rotate(${secondRotation}, 200, 200)`}>
        {/* tail */}
        <line
          x1="200" y1="200"
          x2="200" y2="218"
          stroke={YELLOW} strokeWidth="3" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${YELLOW})` }}
        />
        {/* main */}
        <line
          x1="200" y1="200"
          x2="200" y2="100"
          stroke={YELLOW} strokeWidth="3" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${YELLOW})` }}
        />
      </g>

      {/* ── Center dot — solid bright yellow ── */}
      <circle cx="200" cy="200" r="5" fill={YELLOW}
        style={{ filter: `drop-shadow(0 0 8px ${YELLOW}) drop-shadow(0 0 4px ${YELLOW})` }} />
    </svg>
  );
}