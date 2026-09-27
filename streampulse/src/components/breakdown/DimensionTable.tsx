import { memo } from "react";
import clsx from "clsx";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import {
  DIMENSION_LABELS,
  METRIC_META,
  type BreakdownRow,
  type BreakdownSortField,
  type DimensionKey,
  type MetricKey,
  type MetricMeta,
  type SortOrder,
} from "@/api/types";
import {
  formatCellValue,
  formatCompact,
  formatDimensionValue,
  formatShare,
} from "@/utils/formats";
import {
  BODY_CELL_SX,
  HEAD_CELL_SX,
  NUMERIC_CELL_SX,
  PAGE_SIZE,
} from "@/utils/constants";

interface DimensionTableProps {
  dimension: DimensionKey;
  metric: MetricKey;
  rows?: BreakdownRow[];
  isRefreshing: boolean;
  sortBy: BreakdownSortField;
  sortOrder: SortOrder;
  selectedKey?: string;
  onSort: (field: BreakdownSortField) => void;
  onRowClick: (key: string) => void;
}

function DimensionTable({
  dimension,
  metric,
  rows,
  isRefreshing,
  sortBy,
  sortOrder,
  selectedKey,
  onSort,
  onRowClick,
}: DimensionTableProps) {
  const meta = METRIC_META[metric];

  const sortableHead = (
    field: BreakdownSortField,
    label: string,
    align: "left" | "right",
    width?: string,
  ) => (
    <TableCell
      align={align}
      sortDirection={sortBy === field ? sortOrder : false}
      sx={{ ...HEAD_CELL_SX, width }}
    >
      <TableSortLabel
        active={sortBy === field}
        direction={sortBy === field ? sortOrder : "desc"}
        onClick={() => onSort(field)}
        sx={{ "&, &:hover, &.Mui-active": { color: "inherit" } }}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  return (
    <TableContainer
      className={clsx(isRefreshing && "opacity-60 transition-opacity")}
      aria-busy={isRefreshing || rows === undefined}
    >
      <Table
        size="small"
        aria-label={`${meta.label} by ${dimension}`}
        sx={{ tableLayout: "fixed", width: "100%" }}
      >
        <TableHead>
          <TableRow>
            {sortableHead("key", DIMENSION_LABELS[dimension], "left")}
            {sortableHead("value", meta.label, "right", "32%")}
            {sortableHead("plays", "Plays", "right", "18%")}
            <TableCell
              align="right"
              sx={{ ...HEAD_CELL_SX, width: { xs: "20%", sm: "25%" } }}
            >
              Share of plays
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!rows
            ? Array.from({ length: PAGE_SIZE }, (_, i) => (
                <SkeletonRow key={i} />
              ))
            : rows.map((row) => (
                <DataRow
                  key={row.key}
                  row={row}
                  label={formatDimensionValue(dimension, row.key)}
                  meta={meta}
                  selected={row.key === selectedKey}
                  onClick={() => onRowClick(row.key)}
                />
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

interface DataRowProps {
  row: BreakdownRow;
  label: string;
  meta: MetricMeta;
  selected: boolean;
  onClick: () => void;
}

function DataRow({ row, label, meta, selected, onClick }: DataRowProps) {
  return (
    <TableRow
      hover
      selected={selected}
      onClick={onClick}
      sx={{
        cursor: "pointer",
        "&:last-child td, &:last-child th": { borderBottom: 0 },
      }}
    >
      <TableCell component="th" scope="row" sx={BODY_CELL_SX}>
        <button
          type="button"
          aria-pressed={selected}
          title={selected ? "Click to clear this filter" : "Click to filter"}
          className="block max-w-full cursor-pointer truncate border-0 bg-transparent py-2 text-left font-medium text-ink"
        >
          {label}
        </button>
      </TableCell>
      <TableCell align="right" sx={NUMERIC_CELL_SX}>
        {formatCellValue(row.value, meta)}
      </TableCell>
      <TableCell align="right" sx={NUMERIC_CELL_SX}>
        {formatCompact(row.plays)}
      </TableCell>
      <TableCell align="right" sx={BODY_CELL_SX}>
        <ShareBar share={row.share} />
      </TableCell>
    </TableRow>
  );
}

function ShareBar({ share }: { share: number }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <div
        aria-hidden="true"
        className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-line sm:block"
      >
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${Math.min(100, share * 100)}%` }}
        />
      </div>
      <span className="w-12 text-right tabular-nums text-muted">
        {formatShare(share)}
      </span>
    </div>
  );
}

function SkeletonRow() {
  return (
    <TableRow>
      {[0, 1, 2, 3].map((i) => (
        <TableCell key={i} sx={BODY_CELL_SX}>
          <div
            aria-hidden="true"
            className={clsx(
              "h-4 animate-pulse rounded my-3 bg-line motion-reduce:animate-none",
              i === 0 ? "w-16" : "ml-auto w-10",
            )}
          />
        </TableCell>
      ))}
    </TableRow>
  );
}

export default memo(DimensionTable);
