import {
  DIMENSION_LABELS,
  DIMENSIONS,
  type BreakdownSortField,
  type Country,
  type MetricKey,
  type SortOrder,
} from "@/api/types";

export const DEFAULT_METRIC: MetricKey = "plays";

export const CHARTS_COLORS = [
  "#3b82f6",
  "#f59e0b",
  "#10b981",
  "#ec4899",
  "#8b5cf6",
  "#06b6d4",
];

export const DEBOUNCE_DURATION = 300;
export const PAGE_SIZE = 5;

export const ALL = "ALL";

export const COUNTRY_LABELS: Record<Country, string> = {
  US: "United States",
  IN: "India",
  GB: "United Kingdom",
  DE: "Germany",
  BR: "Brazil",
  JP: "Japan",
};

export const DEFAULT_ORDER: Record<BreakdownSortField, SortOrder> = {
  key: "asc",
  value: "desc",
  plays: "desc",
};

export const DIMENSION_OPTIONS = DIMENSIONS.map((d) => ({
  value: d,
  label: DIMENSION_LABELS[d],
}));

export const HEAD_CELL_SX = {
  fontSize: "0.8rem",
  fontWeight: 600,
  textTransform: "uppercase",
  color: "var(--text-muted)",
  borderColor: "var(--border)",
  whiteSpace: "nowrap",
  px: { xs: 1, sm: 2 },
} as const;

export const BODY_CELL_SX = {
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "var(--text)",
  borderColor: "var(--border)",
  px: { xs: 1, sm: 2 },
  overflow: "hidden",
  textOverflow: "ellipsis",
} as const;

export const NUMERIC_CELL_SX = {
  ...BODY_CELL_SX,
  fontVariantNumeric: "tabular-nums",
} as const;

export const SEARCH_SX = {
  mb: 1,
  "& .MuiOutlinedInput-root": {
    fontSize: "0.8125rem",
    backgroundColor: "var(--surface-muted)",
  },
} as const;
