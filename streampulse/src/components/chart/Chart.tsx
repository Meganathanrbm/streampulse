import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DimensionKey, MetricMeta, TimeSeries } from "@/api/types";
import { CHARTS_COLORS } from "@/utils/constants";
import {
  formatCellValue,
  formatCompact,
  formatDimensionValue,
  formatTimeStamps,
} from "@/utils/formats";

export interface ChartProps {
  rows: Record<string, number>[];
  series: TimeSeries[];
  meta: MetricMeta;
  sec: number;
  groupBy: DimensionKey | null;
  stale: boolean;
}

const AXIS = { fill: "var(--text-muted)", fontSize: 12 };

export default function Chart({
  rows,
  series,
  meta,
  sec,
  groupBy,
  stale,
}: ChartProps) {
  const colorAt = (i: number) => CHARTS_COLORS[i % CHARTS_COLORS.length];
  const labelOf = (name: string) =>
    groupBy ? formatDimensionValue(groupBy, name) : name;

  return (
    <div className={stale ? "opacity-60 transition-opacity" : undefined}>
      {groupBy && (
        <ul className="m-0 mb-3 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-xs text-muted">
          {series.map((s, i) => (
            <li key={s.name} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-xs"
                style={{ background: colorAt(i) }}
              />
              {labelOf(s.name)}
            </li>
          ))}
        </ul>
      )}
      <div role="img" aria-label={`${meta.label} over time`} className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={rows}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="ts"
              tickFormatter={(ts) => formatTimeStamps(ts, sec)}
              minTickGap={28}
              tick={AXIS}
              stroke="var(--border)"
            />
            <YAxis
              width={52}
              domain={[0, "auto"]}
              tickFormatter={(v) =>
                meta.unit === "%"
                  ? `${Number(v).toFixed(1)}%`
                  : formatCompact(v)
              }
              tick={AXIS}
              stroke="var(--border)"
            />
            <Tooltip
              labelFormatter={(ts) => formatTimeStamps(Number(ts), sec, true)}
              formatter={(v) => formatCellValue(Number(v), meta)}
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
              }}
            />
            {series.map((s, i) => (
              <Line
                key={s.name}
                dataKey={s.name}
                name={labelOf(s.name)}
                stroke={colorAt(i)}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
