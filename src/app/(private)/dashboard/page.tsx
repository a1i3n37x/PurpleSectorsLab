import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, formatLapTime } from "@/lib/format";

export default async function DashboardPage() {
  const currentBlock = await prisma.weeklyBlock.findFirst({
    orderBy: { startDate: "desc" },
    include: { car: true, track: true },
  });

  const latestEntry = await prisma.trainingEntry.findFirst({
    orderBy: { date: "desc" },
    include: { car: true, track: true },
  });

  const sessionsThisWeek = currentBlock
    ? await prisma.trainingEntry.count({
        where: {
          date: {
            gte: currentBlock.startDate,
            lte: currentBlock.endDate,
          },
        },
      })
    : 0;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
          Dashboard
        </p>
        <h1 className="text-3xl font-semibold text-[color:var(--ink)]">
          Today&apos;s training focus
        </h1>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-black/10 bg-white/70 p-6">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">
            This week&apos;s block
          </h2>
          {currentBlock ? (
            <div className="mt-4 space-y-3 text-sm text-[color:var(--ink-muted)]">
              <p className="text-base font-semibold text-[color:var(--ink)]">
                {currentBlock.car?.name ?? "Open Focus"} ·{" "}
                {currentBlock.track?.name ?? "Open Track"}
              </p>
              <p>
                {formatDate(currentBlock.startDate)} —{" "}
                {formatDate(currentBlock.endDate)}
              </p>
              <p>
                <span className="font-semibold text-[color:var(--ink)]">
                  Goals:
                </span>{" "}
                {currentBlock.goals ?? "No goals set yet."}
              </p>
              <p>
                <span className="font-semibold text-[color:var(--ink)]">
                  Focus skills:
                </span>{" "}
                {currentBlock.focusSkills ?? "Set focus skills."}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-[color:var(--ink-muted)]">
              Set up a weekly block to anchor your training focus.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-[color:var(--paper-strong)] p-6">
          <h3 className="text-lg font-semibold text-[color:var(--ink)]">
            Quick actions
          </h3>
          <Link
            href="/entries/new"
            className="rounded-full bg-[color:var(--accent)] px-5 py-2 text-center text-sm font-semibold text-white"
          >
            Add training entry
          </Link>
          <Link
            href="/planner"
            className="rounded-full border border-black/15 px-5 py-2 text-center text-sm font-semibold text-[color:var(--ink)]"
          >
            Edit weekly plan
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-black/15 px-5 py-2 text-center text-sm font-semibold text-[color:var(--ink)]"
          >
            Manage drills & tags
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-black/10 bg-white/70 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
            Sessions this week
          </p>
          <p className="mt-3 text-2xl font-semibold text-[color:var(--ink)]">
            {sessionsThisWeek}
          </p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white/70 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
            Latest best lap
          </p>
          <p className="mt-3 text-2xl font-semibold text-[color:var(--ink)]">
            {formatLapTime(latestEntry?.bestLap ?? null)}
          </p>
          <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
            {latestEntry?.track?.name ?? "No session yet"}
          </p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white/70 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
            Last session
          </p>
          <p className="mt-3 text-2xl font-semibold text-[color:var(--ink)]">
            {latestEntry?.date ? formatDate(latestEntry.date) : "--"}
          </p>
          <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
            {latestEntry?.car?.name ?? "Log a session"}
          </p>
        </div>
      </section>
    </div>
  );
}
