export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, formatLapTime } from "@/lib/format";

export default async function CarsPage() {
  const [cars, stats] = await Promise.all([
    prisma.car.findMany({ orderBy: { name: "asc" } }),
    prisma.trainingEntry.groupBy({
      by: ["carId"],
      _min: { bestLap: true },
      _max: { date: true },
      _count: { id: true },
    }),
  ]);

  const statsMap = new Map(stats.map((stat) => [stat.carId, stat]));

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
          Cars
        </p>
        <h1 className="text-3xl font-semibold text-[color:var(--ink)]">
          Car baselines and common issues
        </h1>
        <p className="text-sm text-[color:var(--ink-muted)]">
          Track consistency and setup notes per chassis.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {cars.map((car) => {
          const carStats = statsMap.get(car.id);
          return (
            <Link
              key={car.id}
              href={`/cars/${car.slug}`}
              className="rounded-3xl border border-black/10 bg-white/70 p-6 transition hover:-translate-y-1 hover:shadow-[0_25px_50px_-40px_rgba(0,0,0,0.7)]"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[color:var(--ink)]">
                  {car.name}
                </h2>
                <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                  {car.series ?? "Series"}
                </span>
              </div>
              <div className="mt-4 grid gap-4 text-sm text-[color:var(--ink-muted)] md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">
                    Best lap logged
                  </p>
                  <p className="text-lg font-semibold text-[color:var(--ink)]">
                    {formatLapTime(carStats?._min.bestLap ?? null)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">
                    Last practiced
                  </p>
                  <p className="text-lg font-semibold text-[color:var(--ink)]">
                    {carStats?._max.date
                      ? formatDate(carStats._max.date)
                      : "--"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">
                    Sessions
                  </p>
                  <p className="text-lg font-semibold text-[color:var(--ink)]">
                    {carStats?._count.id ?? 0}
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
