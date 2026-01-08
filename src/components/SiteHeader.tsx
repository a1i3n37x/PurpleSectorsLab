import Link from "next/link";

const navLinks = [
  { href: "/project", label: "Project" },
  { href: "/log", label: "Training Log" },
  { href: "/tracks", label: "Tracks" },
  { href: "/cars", label: "Cars" },
  { href: "/about", label: "About" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function SiteHeader() {
  return (
    <header className="border-b border-black/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/"
            className="text-2xl font-semibold tracking-tight text-[color:var(--ink)]"
          >
            Purple Sectors Training Lab
          </Link>
          <p className="text-sm text-[color:var(--ink-muted)]">
            Formula sim racing training system
          </p>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm font-medium text-[color:var(--ink-muted)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-transparent px-3 py-1 transition hover:border-black/10 hover:bg-black/5 hover:text-[color:var(--ink)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
