import { DIMENSIONS } from "@/api/types";
import type { NavbarProps } from "./Header";
import RangeFilter from "../filters/RangeFilter";
import ThemeToggle from "../filters/ThemeToggle";
import DimensionFilter from "../filters/DimensionFilter";

function FiltersWapper({
  preset,
  setPreset,
  setDimension,
  selections,
}: NavbarProps) {
  return (
    <div
      role="group"
      aria-label="Dashboard filters"
      className="flex flex-wrap gap-4 text-sm text-muted"
    >
      <RangeFilter value={preset} onChange={setPreset} />
      {DIMENSIONS.map((d) => (
        <DimensionFilter
          key={d}
          dimension={d}
          value={selections[d]}
          onChange={(value) => setDimension(d, value)}
        />
      ))}
      <ThemeToggle />
    </div>
  );
}

export default FiltersWapper;
