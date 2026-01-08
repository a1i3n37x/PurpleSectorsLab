export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-3xl border border-black/10 bg-white/70 p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
          About
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-[color:var(--ink)] md:text-4xl">
          Built for progress, not applause.
        </h1>
        <p className="mt-4 text-base text-[color:var(--ink-muted)] md:text-lg">
          I&apos;m using sim racing as a deliberate practice vehicle: simple
          inputs, measurable outcomes, repeatable routines. This site is the
          accountability layer that keeps the focus on the work.
        </p>
      </section>

      <section className="rounded-3xl border border-black/10 bg-[color:var(--paper-strong)] p-6">
        <h2 className="text-lg font-semibold text-[color:var(--ink)]">
          Why build it this way?
        </h2>
        <p className="mt-3 text-sm text-[color:var(--ink-muted)] md:text-base">
          I want the logs to be useful when nobody reads them. This is the place
          to capture the decisions, context, and honest takeaways that telemetry
          alone can&apos;t explain.
        </p>
      </section>
    </div>
  );
}
