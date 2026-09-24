import ThemeToggle from "../filters/ThemeToggle";

function Navbar() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-(--gap) px-4 py-3">
      <div className="flex items-center gap-2 font-semibold">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-accent text-xs text-white">
          SP
        </span>
        StreamPulse
      </div>
      <div className="app-filterbar flex gap-4 text-sm text-muted">
        <ThemeToggle />
      </div>
    </header>
  );
}

export default Navbar;
