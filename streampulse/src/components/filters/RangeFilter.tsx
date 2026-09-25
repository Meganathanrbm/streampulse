import { DATE_PRESETS, type DatePreset, type FilterOption } from "@/api/types";
import FilterSelect from "./FilterSelect";

const RANGE_OPTIONS: FilterOption[] = DATE_PRESETS.map(({ key, label }) => ({
  value: key,
  label,
}));

interface RangeFilterProps {
  value: DatePreset;
  onChange: (value: DatePreset) => void;
}

function RangeFilter({ value, onChange }: RangeFilterProps) {
  return (
    <FilterSelect
      label="Range"
      value={value}
      options={RANGE_OPTIONS}
      onChange={(next) => onChange(next as DatePreset)}
    />
  );
}

export default RangeFilter;
