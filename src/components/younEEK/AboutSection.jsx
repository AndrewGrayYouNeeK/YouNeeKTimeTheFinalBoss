const PURPLE = '#d24dff';
const BLUE = '#3ecbff';

const sections = [
  {
    title: 'What is YouNeeK Time',
    body: 'YouNeeK Time splits one real day into 100 hours, 100 minutes, and 100 seconds. That is 1,000,000 ticks from midnight to midnight. It is not a 10-hour clock and it is not 24:60:60.',
  },
  {
    title: 'How to Read YouNeeK Time',
    body: 'Read it like hours : minutes : seconds, but each place counts to 100. Midnight is 00:00:00. The last tick before the next midnight is 99:99:99.',
    points: [
      '00 = midnight',
      '25 = 6:00 AM',
      '50 = noon',
      '75 = 6:00 PM',
    ],
  },
  {
    title: 'The Digital Display',
    body: 'The big digits are YouNeeK hour and YouNeeK minute (00•99). Under the dial, the legend also shows regular 12:60:60 so you can check the conversion. Switch the dropdown to Regular Time if you want the hands on a normal clock.',
  },
  {
    title: 'The Analog Face',
    body: 'The hour hand goes around once per real day, same sweep as a 24-hour clock. 00 is at the top, 25 at the right, 50 at the bottom, 75 at the left. The minute hand laps once every YouNeeK hour (14.4 real minutes). The second hand laps once every YouNeeK minute (8.64 real seconds). It does not go around twice a day like a 12-hour watch.',
  },
  {
    title: 'Time Scope',
    body: 'TIME mode is one YouNeeK hour per sweep (100 YouNeeK minutes). 369 mode is a three-phase day cycle. The beam is now. Blips appear when the beam hits them.',
  },
];

export default function AboutSection() {
  return (
    <section className="w-full px-5 py-6 sm:px-6 flex flex-col items-center text-center">
      <div className="space-y-6 max-w-[32rem]">
        {sections.map((section, index) => (
          <div key={section.title} className={index === 0 ? '' : 'border-t border-[#d24dff]/20 pt-6'}>
            <h2 className="font-mono text-sm uppercase tracking-[0.35em] sm:text-[15px]"
              style={{ color: PURPLE, textShadow: `0 0 8px ${PURPLE}88` }}>
              {section.title}
            </h2>

            <p className="mt-4 max-w-[32rem] font-mono text-[13px] leading-8 tracking-[0.06em] text-white/70 sm:text-[14px]">
              {section.body}
            </p>

            {section.points && (
              <ul className="mt-4 space-y-3 font-mono text-[13px] tracking-[0.08em] text-white/80 sm:text-[14px] inline-block text-left">
                {section.points.map((point) => {
                  const [value, label] = point.split(' = ');
                  return (
                    <li key={point} className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                        style={{ background: BLUE, boxShadow: `0 0 10px ${BLUE}cc` }} />
                      <span className="min-w-[2.4rem] font-semibold" style={{ color: BLUE }}>{value}</span>
                      <span className="text-white/55">= {label}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
