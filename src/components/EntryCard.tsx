import Link from "next/link";
import { formatDate, formatLapTime, formatSessionType } from "@/lib/format";

type EntryCardProps = {
  entry: {
    id: string;
    date: Date;
    sessionType: string;
    bestLap: number | null;
    avgLap: number | null;
    incidents: number | null;
    objective: string | null;
    breakthrough: boolean;
    car: { name: string };
    track: { name: string; config: string | null };
    entryTags: { tag: { name: string } }[];
  };
};

export default function EntryCard({ entry }: EntryCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-[color:var(--paper-strong)] p-5 shadow-[0_18px_45px_-40px_rgba(0,0,0,0.6)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
          {formatDate(entry.date)} · {formatSessionType(entry.sessionType)}
        </p>
        {entry.breakthrough ? (
          <span className="rounded-full bg-[color:var(--accent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            Breakthrough
          </span>
        ) : null}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[color:var(--ink)]">
          {entry.car.name} @ {entry.track.name}
          {entry.track.config ? ` (${entry.track.config})` : ""}
        </h3>
        {entry.objective ? (
          <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
            {entry.objective}
          </p>
        ) : null}
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
            Best
          </p>
          <p className="text-lg font-semibold text-[color:var(--ink)]">
            {formatLapTime(entry.bestLap)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
            Avg
          </p>
          <p className="text-lg font-semibold text-[color:var(--ink)]">
            {formatLapTime(entry.avgLap)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
            Incidents
          </p>
          <p className="text-lg font-semibold text-[color:var(--ink)]">
            {entry.incidents ?? "--"}
          </p>
        </div>
      </div>
      {entry.entryTags.length ? (
        <div className="flex flex-wrap gap-2">
          {entry.entryTags.map((entryTag) => (
            <span
              key={entryTag.tag.name}
              className="rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs font-medium text-[color:var(--ink-muted)]"
            >
              {entryTag.tag.name}
            </span>
          ))}
        </div>
      ) : null}
      <Link
        href={`/log/${entry.id}`}
        className="text-sm font-semibold text-[color:var(--accent-strong)]"
      >
        View report
      </Link>
    </article>
  );
}
