const GREEN = '#00b7ff';

const sections = [
  {
    title: 'What is YouNeeK Time',
    body: 'YouNeeK Time is a modern, intuitive approach to timekeeping that reimagines the standard 24-hour day into a streamlined base-100 system, giving you a fresh perspective on the passage of time.',
  },
  {
    title: 'How to Read YouNeeK Time',
    body: 'The day is split into 100 equal hours from midnight to midnight, replacing the traditional 24-hour clock.',
    points: [
      '00 = midnight',
      '25 = 6:00 AM',
      '50 = noon',
      '75 = 6:00 PM',
    ],
  },
  {
    title: 'The Digital Display',
    body: 'The four-digit display shows where you are inside the 100-hour day. The first two digits are the YouNeeK hour and the last two are the YouNeeK minute.',
  },
  {
    title: 'The Analog Face',
    body: 'The sticky dial stays clean at the top with a yellow second hand that never leaves the face. Scroll and the scene fades in, then the astronaut unhooks from the hub and launches into the parallax landscape below.',
  },
];

export default function AboutSection() {
  return (
    <section className="w-full px-5 py-6 sm:px-6 flex flex-col items-center text-center">
      <div className="space-y-6 max-w-[32rem]">
        {sections.map((section, index) => (
          <div key={section.title} className={index === 0 ? '' : 'border-t border-white/8 pt-6'}>
            <h2 className="font-mono text-sm uppercase tracking-[0.35em] sm:text-[15px]"
              style={{ color: GREEN, textShadow: `0 0 8px ${GREEN}88` }}>
              {section.title}
            </h2>

            <p className="mt-4 max-w-[32rem] font-mono text-[13px] leading-8 tracking-[0.08em] text-white/45 sm:text-[14px]">
              {section.body}
            </p>

            {section.points && (
              <ul className="mt-4 space-y-3 font-mono text-[13px] tracking-[0.08em] text-white/70 sm:text-[14px] inline-block text-left">
                {section.points.map((point) => {
                  const [value, label] = point.split(' = ');
                  return (
                    <li key={point} className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                        style={{ background: GREEN, boxShadow: `0 0 10px ${GREEN}cc` }} />
                      <span className="min-w-[2.4rem] font-semibold" style={{ color: GREEN }}>{value}</span>
                      <span className="text-white/42">= {label}</span>
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