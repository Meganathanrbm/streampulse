import { useId } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { FilterOption } from "@/api/types";

interface FilterSelectProps {
  label: string;
  value: string | number;
  options: FilterOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

function FilterSelect({ label, value, options, onChange, disabled }: FilterSelectProps) {
  const labelId = useId();

  return (
    <div className="flex items-center gap-2 rounded-card border border-line bg-surface px-3 py-1.5 text-sm focus-within:ring-1 focus-within:ring-accent has-aria-disabled:opacity-60">
      <span id={labelId} className="text-muted">
        {label}
      </span>
      <Select
        variant="standard"
        disableUnderline
        labelId={labelId}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(String(event.target.value))}
        sx={{ fontSize: "inherit", fontWeight: 500, color: "var(--text)" }}
        MenuProps={{
          slotProps: {
            paper: {
              sx: {
                mt: 0.5,
                minWidth: 140,
                bgcolor: "var(--surface)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                backgroundImage: "none",
              },
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              fontSize: "0.875rem",
              "&.Mui-selected, &.Mui-selected:hover": {
                bgcolor: "var(--surface-muted)",
                color: "var(--accent)",
                fontWeight: 500,
              },
              "&:hover, &.Mui-focusVisible": { bgcolor: "var(--surface-muted)" },
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}

export default FilterSelect;
