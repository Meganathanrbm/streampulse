import CdnFilter from "../filters/CdnFilter";
import CountryFilter from "../filters/CountryFilter";
import DeviceFilter from "../filters/DeviceFilter";
import RangeFilter from "../filters/RangeFilter";
import ThemeToggle from "../filters/ThemeToggle";
import type { DashboardFilters } from "../filters/useDashboardFilters";

type NavbarProps = Pick<
  DashboardFilters,
  "preset" | "selections" | "setPreset" | "setDimension"
>;

function Navbar({ preset, selections, setPreset, setDimension }: NavbarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-(--gap) px-4 py-3">
      <div className="flex items-center gap-2 font-semibold">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-accent text-xs text-white">
          SP
        </span>
        StreamPulse
      </div>
      <div
        role="group"
        aria-label="Dashboard filters"
        className="app-filterbar flex flex-wrap gap-4 text-sm text-muted"
      >
        <RangeFilter value={preset} onChange={setPreset} />
        <DeviceFilter
          value={selections.device}
          onChange={(value) => setDimension("device", value)}
        />
        <CountryFilter
          value={selections.country}
          onChange={(value) => setDimension("country", value)}
        />
        <CdnFilter
          value={selections.cdn}
          onChange={(value) => setDimension("cdn", value)}
        />
        <ThemeToggle />
      </div>
    </header>
  );
}

export default Navbar;
