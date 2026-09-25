import { COUNTRIES, type FilterOption } from "@/api/types";
import FilterSelect from "./FilterSelect";
import { ALL } from "./useDashboardFilters";

const COUNTRY_OPTIONS: FilterOption[] = [
  { value: ALL, label: "All" },
  ...COUNTRIES.map((country) => ({ value: country, label: country })),
];

interface CountryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

function CountryFilter({ value, onChange }: CountryFilterProps) {
  return (
    <FilterSelect
      label="Country"
      value={value}
      options={COUNTRY_OPTIONS}
      onChange={onChange}
    />
  );
}

export default CountryFilter;
