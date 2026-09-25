import { CDNS, type FilterOption } from "@/api/types";
import FilterSelect from "./FilterSelect";
import { ALL } from "./useDashboardFilters";

const CDN_OPTIONS: FilterOption[] = [
  { value: ALL, label: "All" },
  ...CDNS.map((cdn) => ({ value: cdn, label: cdn })),
];

interface CdnFilterProps {
  value: string;
  onChange: (value: string) => void;
}

function CdnFilter({ value, onChange }: CdnFilterProps) {
  return (
    <FilterSelect
      label="CDN"
      value={value}
      options={CDN_OPTIONS}
      onChange={onChange}
    />
  );
}

export default CdnFilter;
