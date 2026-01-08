import { prisma } from "@/lib/prisma";
import { createTrainingEntry } from "./actions";

type SearchParams = {
  saved?: string;
  error?: string;
};

export default async function NewEntryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [cars, tracks, tags, lastEntry] = await Promise.all([
    prisma.car.findMany({ orderBy: { name: "asc" } }),
    prisma.track.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.trainingEntry.findFirst({ orderBy: { date: "desc" } }),
  ]);

  const defaultDate = new Date().toISOString().slice(0, 16);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
          Quick Add
        </p>
        <h1 className="text-3xl font-semibold text-[color:var(--ink)]">
          Log a training session
        </h1>
        <p className="text-sm text-[color:var(--ink-muted)]">
          Keep it short: objective, what changed, and the next plan. Markdown is
          supported in notes.
        </p>
        {searchParams.saved ? (
          <p className="text-sm font-semibold text-[color:var(--accent-strong)]">
            Entry saved. Keep the momentum.
          </p>
        ) : null}
        {searchParams.error ? (
          <p className="text-sm font-semibold text-red-700">
            Missing required fields. Car and track are required.
          </p>
        ) : null}
      </header>

      <form action={createTrainingEntry} className="flex flex-col gap-8">
        <section className="grid gap-4 rounded-3xl border border-black/10 bg-white/70 p-6 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
              Date
            </label>
            <input
              type="datetime-local"
              name="date"
              defaultValue={defaultDate}
              className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
              Car
            </label>
            <select
              name="carId"
              defaultValue={lastEntry?.carId ?? cars[0]?.id}
              className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
              required
            >
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
              name="trackId"
              defaultValue={lastEntry?.trackId ?? tracks[0]?.id}
              className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
              required
            >
              {tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.name} {track.config ? `(${track.config})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
              Session type
            </label>
            <select
              name="sessionType"
              defaultValue="PRACTICE"
              className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
            >
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
              Conditions
            </label>
            <input
              name="conditions"
              placeholder="Dry, 18C"
              className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
              Setup
            </label>
            <select
              name="setupType"
              className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
            >
              <option value="">Select</option>
              <option value="FIXED">Fixed</option>
              <option value="OPEN">Open</option>
            </select>
          </div>
        </section>

        <section className="grid gap-4 rounded-3xl border border-black/10 bg-[color:var(--paper-strong)] p-6 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
              Best lap (s)
            </label>
            <input
              name="bestLap"
              inputMode="decimal"
              placeholder="108.982"
              className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
              Optimal lap (s)
            </label>
            <input
              name="optimalLap"
              inputMode="decimal"
              placeholder="108.650"
              className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
              Avg lap (s)
            </label>
            <input
              name="avgLap"
              inputMode="decimal"
              placeholder="109.800"
              className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
              Consistency (s)
            </label>
            <input
              name="consistency"
              inputMode="decimal"
              placeholder="0.55"
              className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
              Incidents
            </label>
            <input
              name="incidents"
              inputMode="numeric"
              placeholder="0"
              className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
              Fuel / tires
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                name="fuel"
                inputMode="decimal"
                placeholder="Fuel"
                className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
              />
              <input
                name="tires"
                placeholder="Tires"
                className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-4 rounded-3xl border border-black/10 bg-white/70 p-6 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
              Objective
            </label>
            <textarea
              name="objective"
              rows={2}
              placeholder="One sentence."
              className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
              What I worked on
            </label>
            <textarea
              name="workedOn"
              rows={3}
              placeholder="- Trail braking into Vale\n- Exit throttle roll"
              className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
              Telemetry notes
            </label>
            <textarea
              name="telemetryNotes"
              rows={3}
              placeholder="Key comparisons, segments, references."
              className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
              Telemetry links (one per line)
            </label>
            <textarea
              name="telemetryLinks"
              rows={3}
              placeholder="https://garage61.net/..."
              className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
              What changed
            </label>
            <textarea
              name="whatChanged"
              rows={3}
              placeholder="- Later brake release\n- Cleaner exit line"
              className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
              What didn&apos;t work
            </label>
            <textarea
              name="whatDidnt"
              rows={3}
              placeholder="- Over-rotated into Vale"
              className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2 lg:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
              Next session plan
            </label>
            <textarea
              name="nextPlan"
              rows={3}
              placeholder="- 10 reps trail brake drill\n- Focus on exit line"
              className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-[color:var(--paper-strong)] p-6">
          <h2 className="text-lg font-semibold text-[color:var(--ink)]">
            Tags & visibility
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <label
                  key={tag.id}
                  className="flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-sm text-[color:var(--ink-muted)]"
                >
                  <input type="checkbox" name="tags" value={tag.id} />
                  {tag.name}
                </label>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                Visibility
              </label>
              <select
                name="visibility"
                defaultValue="PRIVATE"
                className="rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm"
              >
                <option value="PRIVATE">Private</option>
                <option value="PUBLIC">Public</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-[color:var(--ink-muted)]">
                <input type="checkbox" name="breakthrough" />
                Mark as breakthrough
              </label>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            name="intent"
            value="save"
            className="rounded-full bg-[color:var(--accent)] px-6 py-2 text-sm font-semibold text-white"
          >
            Save entry
          </button>
          <button
            type="submit"
            name="intent"
            value="add-another"
            className="rounded-full border border-black/15 px-6 py-2 text-sm font-semibold text-[color:var(--ink)]"
          >
            Save + add another
          </button>
        </div>
      </form>
    </div>
  );
}
