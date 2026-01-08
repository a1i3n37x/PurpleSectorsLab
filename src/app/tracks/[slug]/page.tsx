import { notFound } from "next/navigation";
import EntryCard from "@/components/EntryCard";
import { prisma } from "@/lib/prisma";
import { formatDate, formatLapTime } from "@/lib/format";

export default async function TrackDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const track = await prisma.track.findUnique({
    where: { slug: params.slug },
    include: {
      trainingEntries: {
        include: {
          car: true,
          track: true,
          entryTags: { include: { tag: true } },
        },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!track) {
    notFound();
  }

  const entries = track.trainingEntries;
  const bestLap = entries
    .map((entry) => entry.bestLap)
    .filter((lap): lap is number => lap !== null && lap !== undefined);
  const pb = bestLap.length ? Math.min(...bestLap) : null;

  const tagCounts = entries.flatMap((entry) => entry.entryTags).reduce(
    (acc, entryTag) => {
      const key = entryTag.tag.name;
      acc.set(key, (acc.get(key) ?? 0) + 1);
      return acc;
    },
    new Map<string, number>()
  );

  const commonTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <header className="rounded-3xl border border-black/10 bg-white/70 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
          Track File
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[color:var(--ink)]">
          {track.name} {track.config ? `(${track.config})` : ""}
        </h1>
        <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
          {track.location ?? "Location TBD"}
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-black/10 bg-[color:var(--paper-strong)] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
            Personal best
          </p>
          <p className="mt-3 text-2xl font-semibold text-[color:var(--ink)]">
            {formatLapTime(pb)}
          </p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-[color:var(--paper-strong)] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
            Last practiced
          </p>
          <p className="mt-3 text-2xl font-semibold text-[color:var(--ink)]">
            {entries[0]?.date ? formatDate(entries[0].date) : "--"}
          </p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-[color:var(--paper-strong)] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
            Sessions logged
          </p>
          <p className="mt-3 text-2xl font-semibold text-[color:var(--ink)]">
            {entries.length}
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-black/10 bg-white/70 p-6">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">
            Recent sessions
          </h2>
          <div className="mt-4 grid gap-6">
            {entries.length ? (
              entries.slice(0, 4).map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))
            ) : (
              <p className="text-sm text-[color:var(--ink-muted)]">
                No sessions logged yet.
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-black/10 bg-white/70 p-6">
            <h3 className="text-lg font-semibold text-[color:var(--ink)]">
              Most common issues
            </h3>
            {commonTags.length ? (
              <ul className="mt-4 space-y-2 text-sm text-[color:var(--ink-muted)]">
                {commonTags.map(([tag, count]) => (
                  <li key={tag} className="flex items-center justify-between">
                    <span>{tag}</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink)]">
                      {count}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-[color:var(--ink-muted)]">
                No issue tags logged yet.
              </p>
            )}
          </div>
          <div className="rounded-3xl border border-black/10 bg-white/70 p-6">
            <h3 className="text-lg font-semibold text-[color:var(--ink)]">
              Key references
            </h3>
            <p className="mt-3 text-sm text-[color:var(--ink-muted)] whitespace-pre-line">
              {track.notes ??
                "Add brake markers, gears, and corner notes as you build familiarity."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
