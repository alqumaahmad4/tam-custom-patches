export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="bg-background text-foreground focus-visible:ring-ring fixed top-3 left-3 z-[var(--z-tooltip)] -translate-y-16 rounded-md border px-4 py-2 text-sm font-semibold shadow-md transition-transform duration-150 ease-out focus-visible:translate-y-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      Skip to main content
    </a>
  );
}
