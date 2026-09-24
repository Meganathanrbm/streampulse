import { useId } from "react";
import type { FilterOption } from "@/api/types";

interface FilterSelectProps {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

function FilterSelect({ label, value, options, onChange, disabled }: FilterSelectProps) {
  const id = useId();

  return (
    <div className="relative flex items-center gap-2 rounded-card border border-line bg-surface px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-accent has-disabled:opacity-60">
      <label htmlFor={id} className="text-muted">
        {label}
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="cursor-pointer appearance-none bg-transparent pr-4 font-medium text-ink outline-none disabled:cursor-not-allowed"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 10 6"
        className="pointer-events-none absolute right-3 h-1.5 w-2.5 fill-current text-muted"
      >
        <path d="M0 0h10L5 6z" />
      </svg>
    </div>
  );
}

export default FilterSelect;
