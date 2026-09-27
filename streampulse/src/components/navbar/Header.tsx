import { memo } from "react";
import type { DashboardFilters } from "../filters/useDashboardFilters";
import FiltersWapper from "./FiltersWapper";

export type NavbarProps = Pick<
  DashboardFilters,
  "preset" | "selections" | "setPreset" | "setDimension"
>;

const header = (
  <div className="flex items-center gap-2 font-semibold">
    <span className="grid h-6 w-6 place-items-center rounded-md bg-accent text-xs text-white">
      SP
    </span>
    StreamPulse
  </div>
);

function Navbar(props: NavbarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-(--gap) px-4 py-3">
      {header}
      <FiltersWapper {...props} />
    </header>
  );
}

export default memo(Navbar);
