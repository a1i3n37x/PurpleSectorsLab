import Link from "next/link";
import EntryCard from "@/components/EntryCard";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";

export default async function Home() {
  const [latestEntries, currentBlock] = await Promise.all([
    prisma.trainingEntry.findMany({
      where: { visibility: "PUBLIC" },
      include: {
        car: true,
        track: true,
        entryTags: { include: { tag: true } },
      },
      orderBy: { date: "desc" },
      take: 3,
    }),
    prisma.weeklyBlock.findFirst({
      orderBy: { startDate: "desc" },
      include: { car: true, track: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-12">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[color:var(--ink-muted)]">
            Training Lab
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-[color:var(--ink)] md:text-5xl">
            Turn seat time into measurable, repeatable progress.
          </h1>
          <p className="text-lg text-[color:var(--ink-muted)]">
            Purple Sectors is a lab notebook for deliberate practice. Every
            session answers what changed, what didn&apos;t, and the next move.
            It&apos;s 90% driving, 10% documenting.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/log"
              className="rounded-full bg-[color:var(--accent)] px-5 py-2 text-sm font-semibold text-white shadow-[0_18px_40px_-25px_rgba(0,0,0,0.7)] transition hover:bg-[color:var(--accent-strong)]"
            >
              View Training Log
            </Link>
            <Link
              href="/project"
              className="rounded-full border border-black/15 px-5 py-2 text-sm font-semibold text-[color:var(--ink)] transition hover:border-black/30 hover:bg-white/60"
            >
              Read the method
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                Doctrine
              </p>
              <p className="mt-2 text-sm text-[color:var(--ink)]">
                Telemetry is truth. Notes are interpretation. Consistency
                unlocks pace.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                Accountability
              </p>
              <p className="mt-2 text-sm text-[color:var(--ink)]">
                Every log is a plan for the next session, not a highlight reel.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-black/10 bg-[color:var(--paper-strong)] p-6 shadow-[0_25px_60px_-45px_rgba(0,0,0,0.7)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
            Current Focus
          </p>
          {currentBlock ? (
            <div className="mt-4 flex flex-col gap-4 text-[color:var(--ink)]">
              <div>
                <p className="text-lg font-semibold">
                  {currentBlock.car?.name ?? "Open Focus"} ·{" "}
                  {currentBlock.track?.name ?? "Open Track"}
                </p>
                <p className="text-sm text-[color:var(--ink-muted)]">
                  {formatDate(currentBlock.startDate)} —{" "}
                  {formatDate(currentBlock.endDate)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                  Goals
                </p>
                <p className="text-sm whitespace-pre-line">
                  {currentBlock.goals ?? "No goals set yet."}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                  Focus Skills
                </p>
                <p className="text-sm">
                  {currentBlock.focusSkills ?? "Set focus skills."}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                  Planned Sessions
                </p>
                <p className="text-sm">
                  {currentBlock.plannedSessions ?? "—"}
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-[color:var(--ink-muted)]">
              No weekly block yet. Set one in the planner to lock your focus.
            </p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
              Latest Lab Notes
            </p>
            <h2 className="text-2xl font-semibold text-[color:var(--ink)]">
              Recent training entries
            </h2>
          </div>
          <Link
            href="/log"
            className="text-sm font-semibold text-[color:var(--accent-strong)]"
          >
            View all entries
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {latestEntries.length ? (
            latestEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-black/15 bg-white/60 p-6 text-sm text-[color:var(--ink-muted)]">
              No public entries yet. Log your first session to populate this
              feed.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
