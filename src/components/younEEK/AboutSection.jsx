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
    body: 'The analog face follows Apple Clock styling. Hands track YouNeeK time in-app only — this does not change the iOS system clock.',
  },
];

export default function AboutSection() {
  return (
    <section className="flex w-full flex-col items-center px-1 py-4 text-left">
      <div className="w-full max-w-[32rem] space-y-3">
        {sections.map((section) => (
          <div key={section.title} className="rounded-2xl bg-[#1c1c1e] p-4">
            <h2 className="text-[17px] font-semibold text-white">{section.title}</h2>
            <p className="mt-2 text-[15px] leading-6 text-white/55">{section.body}</p>
            {section.points && (
              <ul className="mt-3 space-y-1 text-[15px] text-white/70">
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
