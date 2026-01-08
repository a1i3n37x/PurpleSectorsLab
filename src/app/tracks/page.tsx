import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, formatLapTime } from "@/lib/format";

export default async function TracksPage() {
  const [tracks, stats] = await Promise.all([
    prisma.track.findMany({ orderBy: { name: "asc" } }),
    prisma.trainingEntry.groupBy({
      by: ["trackId"],
      _min: { bestLap: true },
      _max: { date: true },
      _avg: { consistency: true },
      _count: { id: true },
    }),
  ]);

  const statsMap = new Map(stats.map((stat) => [stat.trackId, stat]));

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
          Tracks
        </p>
        <h1 className="text-3xl font-semibold text-[color:var(--ink)]">
          Track history and focus notes
        </h1>
        <p className="text-sm text-[color:var(--ink-muted)]">
          Each track page compiles best laps, recent pace, and recurring issues.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {tracks.map((track) => {
          const trackStats = statsMap.get(track.id);
          return (
            <Link
              key={track.id}
              href={`/tracks/${track.slug}`}
              className="rounded-3xl border border-black/10 bg-white/70 p-6 transition hover:-translate-y-1 hover:shadow-[0_25px_50px_-40px_rgba(0,0,0,0.7)]"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[color:var(--ink)]">
                  {track.name}
                </h2>
                <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                  {track.config ?? "Config"}
                </span>
              </div>
              <div className="mt-4 grid gap-4 text-sm text-[color:var(--ink-muted)] md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">PB</p>
                  <p className="text-lg font-semibold text-[color:var(--ink)]">
                    {formatLapTime(trackStats?._min.bestLap ?? null)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">
                    Last practiced
                  </p>
                  <p className="text-lg font-semibold text-[color:var(--ink)]">
                    {trackStats?._max.date
                      ? formatDate(trackStats._max.date)
                      : "--"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">
                    Sessions
                  </p>
                  <p className="text-lg font-semibold text-[color:var(--ink)]">
                    {trackStats?._count.id ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">
                    Consistency
                  </p>
                  <p className="text-lg font-semibold text-[color:var(--ink)]">
                    {trackStats?._avg.consistency
                      ? `${trackStats._avg.consistency.toFixed(2)}s`
                      : "--"}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
