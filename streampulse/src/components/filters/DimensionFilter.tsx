import { useDimensionValues } from "@/api/hooks";
import {
  DIMENSION_LABELS,
  type DimensionKey,
  type FilterOption,
} from "@/api/types";
import { ALL } from "@/utils/constants";
import FilterSelect from "./FilterSelect";

interface DimensionFilterProps {
  dimension: DimensionKey;
  value: string;
  onChange: (value: string) => void;
}

function DimensionFilter({ dimension, value, onChange }: DimensionFilterProps) {
  const { data, isPending, isError, refetch } = useDimensionValues(dimension);
  const label = DIMENSION_LABELS[dimension];

  const fallback: FilterOption[] =
    value === ALL ? [] : [{ value, label: value }];

  const options: FilterOption[] = [
    { value: ALL, label: "All" },
    ...(data ?? fallback),
  ];

  return (
    <div className="flex items-center gap-1" aria-busy={isPending}>
      <FilterSelect
        label={label}
        value={value}
        options={options}
        disabled={isPending || isError}
        onChange={onChange}
      />
      {isError && (
        <button
          type="button"
          onClick={() => refetch()}
          aria-label={`Retry loading ${label} options`}
          className="text-xs text-accent underline"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default DimensionFilter;
