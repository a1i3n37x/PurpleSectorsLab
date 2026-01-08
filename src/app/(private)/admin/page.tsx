import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [cars, tracks, tags, drills] = await Promise.all([
    prisma.car.findMany({ orderBy: { name: "asc" } }),
    prisma.track.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.drill.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
          Admin
        </p>
        <h1 className="text-3xl font-semibold text-[color:var(--ink)]">
          Manage knowledge base
        </h1>
        <p className="text-sm text-[color:var(--ink-muted)]">
          This is a lightweight view for now. CRUD screens can come next.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-3xl border border-black/10 bg-white/70 p-6">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">
            Cars
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-[color:var(--ink-muted)]">
            {cars.map((car) => (
              <li key={car.id}>{car.name}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-3xl border border-black/10 bg-white/70 p-6">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">
            Tracks
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-[color:var(--ink-muted)]">
            {tracks.map((track) => (
              <li key={track.id}>
                {track.name} {track.config ? `(${track.config})` : ""}
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-3xl border border-black/10 bg-white/70 p-6">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">
            Tags
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-[color:var(--ink-muted)]">
            {tags.map((tag) => (
              <li key={tag.id}>{tag.name}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-3xl border border-black/10 bg-white/70 p-6">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">
            Drills
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-[color:var(--ink-muted)]">
            {drills.map((drill) => (
              <li key={drill.id}>{drill.name}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
