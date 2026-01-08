import { prisma } from "@/lib/prisma";

export default async function PlannerPage() {
  const [currentBlock, drills] = await Promise.all([
    prisma.weeklyBlock.findFirst({
      orderBy: { startDate: "desc" },
      include: { car: true, track: true },
    }),
    prisma.drill.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
          Planner
        </p>
        <h1 className="text-3xl font-semibold text-[color:var(--ink)]">
          Weekly training block
        </h1>
        <p className="text-sm text-[color:var(--ink-muted)]">
          Attach drills, define goals, and lock the focus for the week.
        </p>
      </header>

      <section className="rounded-3xl border border-black/10 bg-white/70 p-6">
        <h2 className="text-lg font-semibold text-[color:var(--ink)]">
          Current block
        </h2>
        {currentBlock ? (
          <div className="mt-4 space-y-2 text-sm text-[color:var(--ink-muted)]">
            <p className="text-base font-semibold text-[color:var(--ink)]">
              {currentBlock.car?.name ?? "Open Focus"} ·{" "}
              {currentBlock.track?.name ?? "Open Track"}
            </p>
            <p>Goals: {currentBlock.goals ?? "No goals set."}</p>
            <p>Focus skills: {currentBlock.focusSkills ?? "Unset"}</p>
            <p>Planned sessions: {currentBlock.plannedSessions ?? "—"}</p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[color:var(--ink-muted)]">
            No block yet. Add one in the admin panel or seed data.
          </p>
        )}
      </section>

      <section className="rounded-3xl border border-black/10 bg-[color:var(--paper-strong)] p-6">
        <h2 className="text-lg font-semibold text-[color:var(--ink)]">
          Drill library
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {drills.map((drill) => (
            <div
              key={drill.id}
              className="rounded-2xl border border-black/10 bg-white/70 p-4"
            >
              <h3 className="text-base font-semibold text-[color:var(--ink)]">
                {drill.name}
              </h3>
              <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
                {drill.purpose}
              </p>
              {drill.successMetric ? (
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                  Metric: {drill.successMetric}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
