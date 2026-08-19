import { GREEN, RED, YELLOW, WHITE, ARMY } from './clockConstants';

function TaperedHand({ rotation, tipY, tailY, color, width }) {
  const half = width / 2;
  return (
    <g transform={`rotate(${rotation}, 200, 200)`}>
      <polygon
        points={`${200 - half},${tailY} ${200 + half},${tailY} ${200 + half * 0.35},${tipY} ${200 - half * 0.35},${tipY}`}
        fill={color}
        style={{ filter: `drop-shadow(0 0 6px ${color}aa)` }}
      />
    </g>
  );
}

function ThinHand({ rotation, tipY, tailY, color, width }) {
  return (
    <g transform={`rotate(${rotation}, 200, 200)`}>
      <line
        x1="200"
        y1={tailY}
        x2="200"
        y2={tipY}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}99)` }}
      />
    </g>
  );
}

export default function ClockHands({ time, source = 'all' }) {
  const regular = source === 'all' || source === 'regular' || source === 'youneek12';
  const army = source === 'all' || source === 'army' || source === 'youneek12';
  const youneek = source === 'all' || source === 'youneek';

  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
      {regular && (
        <>
          <ThinHand rotation={time.regularHourRotation} tipY={92} tailY={214} color={WHITE} width="2.2" />
          <ThinHand rotation={time.regularMinuteRotation} tipY={72} tailY={216} color={WHITE} width="1.4" />
          <ThinHand rotation={time.regularSecondRotation} tipY={58} tailY={212} color={WHITE} width="0.8" />
        </>
      )}

      {army && (
        <>
          <ThinHand rotation={time.armyHourRotation} tipY={88} tailY={212} color={ARMY} width="2" />
          <ThinHand rotation={time.armyMinuteRotation} tipY={70} tailY={214} color={ARMY} width="1.3" />
          <ThinHand rotation={time.armySecondRotation} tipY={56} tailY={210} color={ARMY} width="0.8" />
        </>
      )}

      {youneek && (
        <>
          <TaperedHand rotation={time.unitRotation} tipY={24} tailY={228} color={GREEN} width="5.5" />
          <ThinHand rotation={time.minuteRotation} tipY={68} tailY={224} color={RED} width="2.4" />
          <ThinHand rotation={time.secondRotation} tipY={104} tailY={218} color={YELLOW} width="1.6" />
        </>
      )}

      <circle
        cx="200"
        cy="200"
        r="7"
        fill="none"
        stroke={GREEN}
        strokeWidth="3"
        style={{ filter: `drop-shadow(0 0 6px ${GREEN})` }}
      />
      <circle cx="200" cy="200" r="2.2" fill="#050505" />
    </svg>
  );
}
