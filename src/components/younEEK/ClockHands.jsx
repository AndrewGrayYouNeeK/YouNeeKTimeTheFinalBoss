import { GREEN, HAND_RED, HAND_BLUE, HAND_PURPLE } from './clockConstants';

function Hand({ rotation, tipY, tailY, color, width }) {
  return (
    <g transform={`rotate(${rotation}, 200, 200)`}>
      <line
        x1="200" y1={tailY}
        x2="200" y2={tipY}
        stroke={color} strokeWidth={width} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 5px ${color})` }}
      />
    </g>
  );
}

function TaperedHand({ rotation, tipY, tailY, color, width }) {
  const half = width / 2;
  return (
    <g transform={`rotate(${rotation}, 200, 200)`}>
      <polygon
        points={`${200 - half},${tailY} ${200 + half},${tailY} ${200 + half * 0.28},${tipY} ${200 - half * 0.28},${tipY}`}
        fill={color}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </g>
  );
}

export default function ClockHands({ time, source = 'all' }) {
  const regular = source === 'all' || source === 'regular' || source === 'youneek12';
  const army = source === 'all' || source === 'army' || source === 'youneek12';
  const youneek = source === 'all' || source === 'youneek';
  const hourShared = youneek && army;
  const armyShared = army && (youneek || source === 'youneek12' || source === 'all');

  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
      {regular && (
        <>
          <Hand rotation={time.regularMinuteRotation} tipY={48} tailY={220} color={HAND_RED} width="2.2" />
          <Hand rotation={time.regularSecondRotation} tipY={28} tailY={214} color={HAND_RED} width="1.1" />
        </>
      )}

      {(youneek || army) && (
        <TaperedHand rotation={time.unitRotation} tipY={22} tailY={226} color={hourShared ? HAND_PURPLE : youneek ? HAND_BLUE : HAND_RED} width="5" />
      )}

      {youneek && (
        <>
          <Hand rotation={time.minuteRotation} tipY={70} tailY={222} color={HAND_BLUE} width="2.4" />
          <Hand rotation={time.secondRotation} tipY={108} tailY={216} color={HAND_BLUE} width="1.8" />
        </>
      )}

      {army && (
        <>
          <Hand rotation={time.armyMinuteRotation} tipY={56} tailY={214} color={armyShared ? HAND_PURPLE : HAND_BLUE} width="2" />
          <Hand rotation={time.armySecondRotation} tipY={36} tailY={210} color={armyShared ? HAND_PURPLE : HAND_BLUE} width="1" />
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
      <circle cx="200" cy="200" r="2.4" fill="#050505" />
    </svg>
  );
}
