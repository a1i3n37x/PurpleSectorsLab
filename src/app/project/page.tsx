const terms = [
  {
    title: "Alien",
    body: "The pace ceiling. Not the goal, but the benchmark for what is possible on a given car/track.",
  },
  {
    title: "Purple sector",
    body: "A personal best sector. Evidence that a change worked, not a guarantee of the full lap.",
  },
  {
    title: "Return protocol",
    body: "A short checklist to re-enter a track you have already learned without rebuilding from zero.",
  },
];

const tools = ["iRacing", "Garage61", "VRS notes (optional)", "OBS or replays"];

export default function ProjectPage() {
  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-3xl border border-black/10 bg-white/70 p-8 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.6)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
          The Project
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-[color:var(--ink)] md:text-4xl">
          Deliberate practice, tracked like lab notes.
        </h1>
        <p className="mt-4 text-base text-[color:var(--ink-muted)] md:text-lg">
          The methodology is simple: pick a focus, measure it, repeat until
          stable. Telemetry is the truth, but the log captures the decisions and
          adjustments that made the change possible.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-black/10 bg-[color:var(--paper-strong)] p-6">
          <h2 className="text-2xl font-semibold text-[color:var(--ink)]">
            Practice loop
          </h2>
          <ol className="mt-4 space-y-3 text-sm text-[color:var(--ink-muted)]">
            <li>1. Set a single-session objective.</li>
            <li>2. Run a focused stint and capture telemetry.</li>
            <li>3. Compare notes: what changed, what didn&apos;t.</li>
            <li>4. Write the next plan before leaving the rig.</li>
          </ol>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white/70 p-6">
          <h3 className="text-lg font-semibold text-[color:var(--ink)]">
            Tool stack
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-[color:var(--ink-muted)]">
            {tools.map((tool) => (
              <li key={tool} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {terms.map((term) => (
          <div
            key={term.title}
            className="rounded-2xl border border-black/10 bg-white/70 p-5"
          >
            <h3 className="text-lg font-semibold text-[color:var(--ink)]">
              {term.title}
            </h3>
            <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
              {term.body}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-black/10 bg-white/70 p-6">
        <h2 className="text-2xl font-semibold text-[color:var(--ink)]">
          Why telemetry matters
        </h2>
        <p className="mt-3 text-sm text-[color:var(--ink-muted)] md:text-base">
          Feel is unreliable at speed. Telemetry gives the actual delta: brake
          pressure, release timing, throttle ramps, and steering rate. The log
          is where those signals turn into decisions you can repeat.
        </p>
      </section>
    </div>
  );
}
