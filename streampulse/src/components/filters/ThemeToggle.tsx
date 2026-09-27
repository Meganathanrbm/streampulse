import { useColorScheme } from "@mui/material/styles";

function ThemeToggle() {
  const { mode, systemMode, setMode } = useColorScheme();
  const dark = (mode === "system" ? systemMode : mode) === "dark";

  return (
    <button
      type="button"
      aria-label="Dark mode"
      aria-pressed={dark}
      onClick={() => setMode(dark ? "light" : "dark")}
      className="grid cursor-pointer place-items-center rounded-card border border-line bg-surface px-3 py-2 text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
        <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 1.75a6.25 6.25 0 0 0 0 12.5z" fill="currentColor" />
      </svg>
    </button>
  );
}

export default ThemeToggle;
