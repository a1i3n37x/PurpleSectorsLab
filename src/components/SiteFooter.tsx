export default function SiteFooter() {
  return (
    <footer className="border-t border-black/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-[color:var(--ink-muted)] md:flex-row md:items-center md:justify-between">
        <p>Built as a training lab first, public artifact second.</p>
        <p>Telemetry lives in Garage61. Interpretation lives here.</p>
      </div>
    </footer>
  );
}
