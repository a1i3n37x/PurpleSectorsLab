import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate, formatLapTime, formatSessionType } from "@/lib/format";

function toBullets(value?: string | null) {
  if (!value) {
    return [];
  }
  return value
    .split("\n")
    .map((line) => line.trim().replace(/^-/, "").trim())
    .filter(Boolean);
}

export default async function EntryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const entry = await prisma.trainingEntry.findUnique({
    where: { id: params.id },
    include: {
      car: true,
      track: true,
      entryTags: { include: { tag: true } },
      mediaLinks: true,
    },
  });

  if (!entry || entry.visibility !== "PUBLIC") {
    notFound();
  }

  const sections = [
    { title: "Objective", items: toBullets(entry.objective) },
    { title: "What I worked on", items: toBullets(entry.workedOn) },
    { title: "What changed", items: toBullets(entry.whatChanged) },
    { title: "What didn't work", items: toBullets(entry.whatDidnt) },
    { title: "Next session plan", items: toBullets(entry.nextPlan) },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="rounded-3xl border border-black/10 bg-white/70 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
          Training Entry
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[color:var(--ink)]">
          {entry.car.name} @ {entry.track.name}{" "}
          {entry.track.config ? `(${entry.track.config})` : ""} —{" "}
          {formatSessionType(entry.sessionType)}
        </h1>
        <p className="mt-2 text-sm text-[color:var(--ink-muted)]">
          {formatDate(entry.date)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {entry.entryTags.map((tag) => (
            <span
              key={tag.tag.id}
              className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-medium text-[color:var(--ink-muted)]"
            >
              {tag.tag.name}
            </span>
          ))}
        </div>
      </header>

      <section className="grid gap-6 rounded-3xl border border-black/10 bg-[color:var(--paper-strong)] p-6 md:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
            Best lap
          </p>
          <p className="mt-2 text-xl font-semibold text-[color:var(--ink)]">
            {formatLapTime(entry.bestLap)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
            Optimal lap
          </p>
          <p className="mt-2 text-xl font-semibold text-[color:var(--ink)]">
            {formatLapTime(entry.optimalLap)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
            Avg lap
          </p>
          <p className="mt-2 text-xl font-semibold text-[color:var(--ink)]">
            {formatLapTime(entry.avgLap)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
            Incidents
          </p>
          <p className="mt-2 text-xl font-semibold text-[color:var(--ink)]">
            {entry.incidents ?? "--"}
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-3xl border border-black/10 bg-white/70 p-6"
          >
            <h2 className="text-lg font-semibold text-[color:var(--ink)]">
              {section.title}
            </h2>
            {section.items.length ? (
              <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-[color:var(--ink-muted)]">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-[color:var(--ink-muted)]">
                Not captured in this session.
              </p>
            )}
          </section>
        ))}
      </div>

      <section className="rounded-3xl border border-black/10 bg-white/70 p-6">
        <h2 className="text-lg font-semibold text-[color:var(--ink)]">
          Telemetry links
        </h2>
        {entry.mediaLinks.length ? (
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--ink-muted)]">
            {entry.mediaLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.url}
                  className="font-semibold text-[color:var(--accent-strong)]"
                >
                  {link.type}
                </a>{" "}
                — {link.url}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-[color:var(--ink-muted)]">
            No telemetry links saved.
          </p>
        )}
      </section>
    </div>
  );
}
