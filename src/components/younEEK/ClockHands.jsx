import { GREEN, RED, YELLOW, WHITE, ARMY } from './clockConstants';

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

export default function ClockHands({ time }) {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
      <Hand rotation={time.regularHourRotation} tipY={78} tailY={218} color={WHITE} width="4.5" />
      <Hand rotation={time.regularMinuteRotation} tipY={36} tailY={222} color={WHITE} width="2.6" />
      <Hand rotation={time.regularSecondRotation} tipY={22} tailY={214} color={WHITE} width="1.2" />

      <g transform={`rotate(${time.armyHourRotation}, 200, 200)`}>
        <polygon
          points="200,8 206,22 194,22"
          fill={ARMY}
          style={{ filter: `drop-shadow(0 0 4px ${ARMY})` }}
        />
      </g>
      <Hand rotation={time.armyMinuteRotation} tipY={48} tailY={210} color={ARMY} width="2" />
      <Hand rotation={time.armySecondRotation} tipY={28} tailY={208} color={ARMY} width="1" />

      <Hand rotation={time.unitRotation} tipY={18} tailY={230} color={GREEN} width="3.5" />
      <Hand rotation={time.minuteRotation} tipY={52} tailY={230} color={RED} width="3.5" />
      <Hand rotation={time.secondRotation} tipY={100} tailY={218} color={YELLOW} width="3" />

      <circle cx="200" cy="200" r="5" fill={YELLOW}
        style={{ filter: `drop-shadow(0 0 8px ${YELLOW}) drop-shadow(0 0 4px ${YELLOW})` }} />
    </svg>
  );
}
