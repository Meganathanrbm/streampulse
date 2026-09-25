import { DEVICES, type FilterOption } from "@/api/types";
import FilterSelect from "./FilterSelect";
import { ALL } from "./useDashboardFilters";

const DEVICE_OPTIONS: FilterOption[] = [
  { value: ALL, label: "All" },
  ...DEVICES.map((device) => ({ value: device, label: device })),
];

interface DeviceFilterProps {
  value: string;
  onChange: (value: string) => void;
}

function DeviceFilter({ value, onChange }: DeviceFilterProps) {
  return (
    <FilterSelect
      label="Device"
      value={value}
      options={DEVICE_OPTIONS}
      onChange={onChange}
    />
  );
}

export default DeviceFilter;
