import EntryCard from "@/components/EntryCard";
import { prisma } from "@/lib/prisma";
import { Prisma, SessionType } from "@prisma/client";

type SearchParams = {
  car?: string;
  track?: string;
  session?: string;
  tag?: string;
  breakthrough?: string;
};

function toSessionType(value?: string): SessionType | undefined {
  if (!value) {
    return undefined;
  }
  return Object.values(SessionType).includes(value as SessionType)
    ? (value as SessionType)
    : undefined;
}

export default async function LogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters: Prisma.TrainingEntryWhereInput = {
    visibility: "PUBLIC",
  };

  if (searchParams.car) {
    filters.carId = searchParams.car;
  }
  if (searchParams.track) {
    filters.trackId = searchParams.track;
  }
  if (searchParams.session) {
    filters.sessionType = toSessionType(searchParams.session);
  }
  if (searchParams.breakthrough === "true") {
    filters.breakthrough = true;
  }
  if (searchParams.tag) {
    filters.entryTags = {
      some: {
        tagId: searchParams.tag,
      },
    };
  }

  const [entries, cars, tracks, tags] = await Promise.all([
    prisma.trainingEntry.findMany({
      where: filters,
      include: {
        car: true,
        track: true,
        entryTags: { include: { tag: true } },
      },
      orderBy: { date: "desc" },
    }),
    prisma.car.findMany({ orderBy: { name: "asc" } }),
    prisma.track.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
          Training Log
        </p>
        <h1 className="text-3xl font-semibold text-[color:var(--ink)]">
          Public feed of training entries
        </h1>
        <p className="text-sm text-[color:var(--ink-muted)]">
          Filter by car, track, session type, or tags. These are lab notes, not
          highlight reels.
        </p>
      </section>

      <form className="grid gap-4 rounded-3xl border border-black/10 bg-white/70 p-6 md:grid-cols-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
            Car
          </label>
          <select
            name="car"
            defaultValue={searchParams.car ?? ""}
            className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
          >
            <option value="">All cars</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
            Track
          </label>
          <select
            name="track"
            defaultValue={searchParams.track ?? ""}
            className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
          >
            <option value="">All tracks</option>
            {tracks.map((track) => (
              <option key={track.id} value={track.id}>
                {track.name} {track.config ? `(${track.config})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
            Session
          </label>
          <select
            name="session"
            defaultValue={searchParams.session ?? ""}
            className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
          >
            <option value="">All types</option>
            <option value="PRACTICE">Practice</option>
            <option value="QUALI">Quali</option>
            <option value="RACE">Race</option>
            <option value="AI">AI</option>
            <option value="TIME_TRIAL">Time Trial</option>
            <option value="TEST">Test</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
            Tag
          </label>
          <select
            name="tag"
            defaultValue={searchParams.tag ?? ""}
            className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
          >
            <option value="">Any tag</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
            Breakthrough
          </label>
          <select
            name="breakthrough"
            defaultValue={searchParams.breakthrough ?? ""}
            className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
          >
            <option value="">All entries</option>
            <option value="true">Breakthroughs</option>
          </select>
        </div>
        <div className="md:col-span-5 flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-[color:var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)]"
          >
            Apply filters
          </button>
          <a
            href="/log"
            className="rounded-full border border-black/15 px-5 py-2 text-sm font-semibold text-[color:var(--ink)] transition hover:border-black/30 hover:bg-white/70"
          >
            Reset
          </a>
          <a
            href="/entries/new"
            className="ml-auto rounded-full border border-black/15 px-5 py-2 text-sm font-semibold text-[color:var(--ink)] transition hover:border-black/30 hover:bg-white/70"
          >
            Quick add entry
          </a>
        </div>
      </form>

      <section className="grid gap-6 lg:grid-cols-2">
        {entries.length ? (
          entries.map((entry) => <EntryCard key={entry.id} entry={entry} />)
        ) : (
          <div className="rounded-2xl border border-dashed border-black/15 bg-white/60 p-6 text-sm text-[color:var(--ink-muted)]">
            No entries match those filters yet.
          </div>
        )}
      </section>
    </div>
  );
}
